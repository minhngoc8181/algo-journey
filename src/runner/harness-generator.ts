/* ═══════════════════════════════════════════════════════════
   Harness Generator
   Generates RunnerMain.java using two approaches:

   1. Small/static tests (visible + inline hidden):
      Each test is its own static method with embedded literals.
      Limits: array literals must be < ~3000 elements to stay
      under Java's 64KB bytecode-per-method limit.

   2. Large tests via javaGenerator (exercise.evaluation.javaGenerator):
      Java code using java.util.Random generates large arrays
      PROGRAMMATICALLY inside the Wasm module — no literals,
      no Scanner, no ByteArrayInputStream needed.
      Supports 100K+ elements with zero bytecode size issues.

   TeaVM browser classlib constraints:
   - NO java.util.Scanner  (not in minimal classlib)
   - NO java.io.*          (not in minimal classlib)
   - NO System.setIn()     (not supported)
   - YES java.util.Random  (available)
   - YES java.util.Arrays  (available)
   - YES System.out.println (works via console.log hook)
   ═══════════════════════════════════════════════════════════ */

import type { Exercise, TestCase } from '../shared/types';
import type { JavaGenerator } from '../shared/types';

// ── Public API ────────────────────────────────────────────

export interface HarnessFiles extends Record<string, string> {
  'Solution.java': string;
  'RunnerMain.java': string;
}

export function buildHarnessFiles(
  exercise: Exercise,
  studentCode: string,
  tests: TestCase[],
): HarnessFiles {
  let result: HarnessFiles;

  if (exercise.mode === 'class_implementation') {
    const harness = generateClassRunnerMain(exercise, tests, exercise.evaluation.javaGenerator);
    result = { 'Solution.java': studentCode, 'RunnerMain.java': harness };
  } else {
    const sig = parseSignature(
      exercise.requiredStructure?.signature ?? inferSignatureFromStarter(exercise),
    );
    const harness = generateRunnerMain(
      sig,
      tests,
      exercise.evaluation.javaGenerator,
    );
    result = { 'Solution.java': studentCode, 'RunnerMain.java': harness };
  }

  // Inject platform helper classes (ListNode.java, TreeNode.java, etc.)
  for (const helper of exercise.helperClasses ?? []) {
    result[helper.fileName] = helper.code;
  }

  return result;
}

// ── Signature Parsing ─────────────────────────────────────

interface Param { type: string; name: string }
interface Signature { returnType: string; methodName: string; params: Param[] }

function parseSignature(sig: string): Signature {
  // Return type may be generic: List<Integer>, List<List<Integer>>, Integer (nullable), int[], etc.
  // Strategy: capture everything up to the first whitespace-before-methodName.
  // We read tokens carefully to handle nested <> in generics.
  const trimmed = sig.trim();

  // Find the method name: last word before '(' that is preceded by whitespace
  // but NOT inside angle brackets.
  let depth = 0;
  let parenOpen = -1;
  for (let i = 0; i < trimmed.length; i++) {
    const c = trimmed[i];
    if (c === '<') depth++;
    else if (c === '>') depth--;
    else if (c === '(' && depth === 0) { parenOpen = i; break; }
  }
  if (parenOpen < 0) throw new Error(`Cannot parse signature (no open paren): "${sig}"`);

  // methodName is the last word before '('
  const beforeParen = trimmed.slice(0, parenOpen).trim();
  const lastSpace = beforeParen.lastIndexOf(' ');
  const returnType = lastSpace < 0 ? '' : beforeParen.slice(0, lastSpace).trim();
  const methodName = lastSpace < 0 ? beforeParen : beforeParen.slice(lastSpace + 1).trim();

  // Params: everything inside the outermost parens
  const parenClose = trimmed.lastIndexOf(')');
  const paramsRaw = trimmed.slice(parenOpen + 1, parenClose).trim();

  // Split params by ',' at depth 0 (not inside generics)
  const params: Param[] = [];
  if (paramsRaw !== '') {
    let token = '';
    let d = 0;
    for (const c of paramsRaw + ',') {
      if (c === '<') d++;
      else if (c === '>') d--;
      else if (c === ',' && d === 0) {
        const p = token.trim();
        const lastSp = p.lastIndexOf(' ');
        params.push(lastSp >= 0
          ? { type: p.slice(0, lastSp).trim(), name: p.slice(lastSp + 1).trim() }
          : { type: p, name: `arg${params.length}` }
        );
        token = '';
        continue;
      }
      token += c;
    }
  }

  return { returnType, methodName, params };
}

function inferSignatureFromStarter(exercise: Exercise): string {
  const code = exercise.editableFiles[0]?.starter ?? '';
  // Match return types including generics: e.g. List<Integer> methodName(
  const m = code.match(/\b([\w<>,\s\[\]]+?)\s+(\w+)\s*\(([^)]*)\)\s*\{/);
  if (m?.[1] && m[2]) return `${m[1].trim()} ${m[2]}(${m[3] ?? ''})`;
  return 'void solve()';
}

// ── Java Literal Conversion ───────────────────────────────

function toJavaLiteral(value: unknown, javaType: string): string {
  if (value === null || value === undefined) return 'null';

  // ListNode — convert JS array to buildList() call
  if (javaType === 'ListNode') {
    if (Array.isArray(value)) {
      if (value.length === 0) return 'null';
      const elems = value.map(e => String(Math.trunc(e as number))).join(', ');
      return `buildList(new int[]{${elems}})`;
    }
    return 'null';
  }

  // TreeNode — convert level-order JS array (with nulls) to buildTree() call
  if (javaType === 'TreeNode') {
    if (!Array.isArray(value) || (value as unknown[]).length === 0) return 'null';
    const elems = (value as (number | null)[]).map(e =>
      e === null || e === undefined ? 'null' : String(Math.trunc(e as number))
    ).join(', ');
    return `buildTree(new Integer[]{${elems}})`;
  }

  // primitive arrays: int[], long[], etc.
  if (javaType.endsWith('[]')) {
    const arr = value as unknown[];
    const elemType = javaType.slice(0, -2).trim();
    const elems = arr.map(e => toJavaLiteral(e, elemType)).join(', ');
    return `new ${javaType}{${elems}}`;
  }

  // List<...> — convert JS array to java.util.Arrays.asList(...)
  if (javaType.startsWith('List<') || javaType.startsWith('java.util.List<')) {
    const arr = value as unknown[];
    const inner = javaType.replace(/^(java\.util\.)?List</, '').replace(/>$/, '');
    const elems = arr.map(e => toJavaLiteral(e, inner)).join(', ');
    return arr.length === 0
      ? 'new java.util.ArrayList<>()'
      : `java.util.Arrays.asList(${elems})`;
  }

  switch (javaType) {
    case 'int':
    case 'long':     return String(Math.trunc(value as number));
    case 'double':
    case 'float':    return String(value as number);
    case 'boolean':  return String(value as boolean);
    case 'char':     return `'${String(value as string).replace("'", "\\'")}'`;
    case 'String':   return `"${String(value as string).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
    // Boxed types (Integer, Long, Boolean, etc.) — same as primitives
    case 'Integer':  return value === null ? 'null' : String(Math.trunc(value as number));
    case 'Long':     return value === null ? 'null' : `${Math.trunc(value as number)}L`;
    case 'Double':   return value === null ? 'null' : String(value as number);
    case 'Boolean':  return value === null ? 'null' : String(value as boolean);
    default:         return String(value);
  }
}

// ── Comparison & Print Helpers ────────────────────────────

function isListType(ret: string): boolean {
  return ret.startsWith('List<') || ret.startsWith('java.util.List<');
}

function isListNodeType(t: string): boolean {
  return t === 'ListNode';
}

function isTreeNodeType(t: string): boolean {
  return t === 'TreeNode';
}

function equalExpr(ret: string, a: string, b: string): string {
  if (isListNodeType(ret)) return `java.util.Objects.equals(listToString(${a}), listToString(${b}))`;
  if (isTreeNodeType(ret)) return `java.util.Objects.equals(treeToString(${a}), treeToString(${b}))`;
  if (ret.endsWith('[]'))   return `java.util.Arrays.equals(${a}, ${b})`;
  if (ret === 'String')     return `java.util.Objects.equals(${a}, ${b})`;
  if (isListType(ret))      return `java.util.Objects.equals(${a}, ${b})`;
  // Nullable boxed types (Integer, Long, etc.) - use .equals
  if (/^[A-Z]/.test(ret))  return `java.util.Objects.equals(${a}, ${b})`;
  return `(${a} == ${b})`;
}

function toStringExpr(ret: string, v: string): string {
  if (isListNodeType(ret)) return `listToString(${v})`;
  if (isTreeNodeType(ret)) return `treeToString(${v})`;
  if (ret.endsWith('[]'))  return `java.util.Arrays.toString(${v})`;
  if (ret === 'String')    return `(${v} == null ? "null" : ${v})`;
  if (ret === 'double' || ret === 'Double') return `(String.valueOf(${v}).endsWith(".0") ? String.valueOf(${v}).substring(0, String.valueOf(${v}).length() - 2) : String.valueOf(${v}))`;
  return `String.valueOf(${v})`;
}

// ── Generate RunnerMain.java ──────────────────────────────

function generateRunnerMain(
  sig: Signature,
  tests: TestCase[],
  javaGen?: JavaGenerator,
): string {
  const { methodName, params, returnType } = sig;

  const eqExpr = equalExpr(returnType, 'actual', 'expected');
  const actStr = toStringExpr(returnType, 'actual');
  const expStr = toStringExpr(returnType, 'expected');

  // Per-test static methods (each test is isolated → no 64KB issue per method)
  let methods = '';
  let mainBody = '';

  for (let i = 0; i < tests.length; i++) {
    const test = tests[i]!;
    const args = test.args ?? [];
    const argLiterals = params.map((p, idx) => toJavaLiteral(args[idx], p.type)).join(', ');
    const expectedLiteral = toJavaLiteral(test.expected, returnType);

    methods += `
    private static void run_test_${i}(Solution s) {
        try {
            ${returnType} actual = s.${methodName}(${argLiterals});
            ${returnType} expected = ${expectedLiteral};
            boolean pass = ${eqExpr};
            System.out.println("AJ|${test.name}|" + pass + "|" + ${actStr} + "|" + ${expStr});
        } catch (Exception e) {
            System.out.println("AJ_ERROR|${test.name}: " + e);
        }
    }`;

    mainBody += `        run_test_${i}(s);\n`;
  }

  // Java generator method for large programmatic tests
  const genMethod = javaGen ? `
    private static void runGeneratedTests(Solution s, java.util.Random rng) {
${javaGen.genMethodBody}
    }` : '';

  const genCall = javaGen
    ? `        runGeneratedTests(s, new java.util.Random(${javaGen.seed}L));\n`
    : '';

  const allTypes = [returnType, ...params.map(p => p.type)].join(' ');
  const needsArrays   = allTypes.includes('[]');
  const needsList     = allTypes.includes('List');
  const needsMap      = allTypes.includes('Map');
  const needsSet      = allTypes.includes('Set');
  const needsListNode = allTypes.includes('ListNode');
  const needsTreeNode = allTypes.includes('TreeNode');

  const imports = [
    needsArrays ? 'import java.util.Arrays;'    : '',
    needsList   ? 'import java.util.List;'       : '',
    needsList   ? 'import java.util.ArrayList;'  : '',
    needsMap    ? 'import java.util.Map;'        : '',
    needsMap    ? 'import java.util.HashMap;'    : '',
    needsSet    ? 'import java.util.Set;'        : '',
    needsSet    ? 'import java.util.HashSet;'    : '',
  ].filter(Boolean).join('\n') + (needsArrays || needsList || needsMap || needsSet ? '\n' : '');

  // ListNode helper methods (buildList, listToString)
  const listNodeHelpers = needsListNode ? `
    static ListNode buildList(int[] arr) {
        ListNode dummy = new ListNode(0);
        ListNode curr = dummy;
        for (int v : arr) { curr.next = new ListNode(v); curr = curr.next; }
        return dummy.next;
    }

    static String listToString(ListNode head) {
        StringBuilder sb = new StringBuilder("[");
        while (head != null) {
            sb.append(head.val);
            if (head.next != null) sb.append(", ");
            head = head.next;
        }
        return sb.append("]").toString();
    }
` : '';

  // TreeNode helper methods (buildTree from level-order Integer[], treeToString inorder)
  const treeNodeHelpers = needsTreeNode ? `
    static TreeNode buildTree(Integer[] level) {
        if (level == null || level.length == 0 || level[0] == null) return null;
        TreeNode root = new TreeNode(level[0]);
        java.util.Queue<TreeNode> q = new java.util.LinkedList<>();
        q.offer(root);
        int i = 1;
        while (!q.isEmpty() && i < level.length) {
            TreeNode cur = q.poll();
            if (i < level.length && level[i] != null) {
                cur.left = new TreeNode(level[i]); q.offer(cur.left);
            }
            i++;
            if (i < level.length && level[i] != null) {
                cur.right = new TreeNode(level[i]); q.offer(cur.right);
            }
            i++;
        }
        return root;
    }

    static String treeToString(TreeNode root) {
        // Inorder traversal as string for comparison
        StringBuilder sb = new StringBuilder("[");
        java.util.Deque<TreeNode> st = new java.util.ArrayDeque<>();
        TreeNode cur = root;
        boolean first = true;
        while (cur != null || !st.isEmpty()) {
            while (cur != null) { st.push(cur); cur = cur.left; }
            cur = st.pop();
            if (!first) sb.append(", ");
            sb.append(cur.val); first = false;
            cur = cur.right;
        }
        return sb.append("]").toString();
    }
` : '';

  return `${imports}public class RunnerMain {
    public static void main(String[] args) {
        Solution s = new Solution();
${mainBody}${genCall}        System.out.println("__AJ_DONE__");
    }
${methods}
${genMethod}
${listNodeHelpers}${treeNodeHelpers}
}
`;
}

// ── Generate RunnerMain.java (Class Mode) ─────────────────

function generateClassRunnerMain(
  exercise: Exercise,
  tests: TestCase[],
  javaGen?: JavaGenerator,
): string {
  const className = exercise.requiredStructure?.className ?? 'Solution';
  const reqMethods = exercise.requiredStructure?.requiredMethods ?? [];
  const sigMap = new Map<string, Signature>();
  
  for (const m of reqMethods) {
    const s = parseSignature(m);
    sigMap.set(s.methodName, s);
  }

  let methods = '';
  let mainBody = '';

  for (let i = 0; i < tests.length; i++) {
    const test = tests[i]!;
    const ops = test.operations ?? [];
    const expectedArr = Array.isArray(test.expected) ? test.expected : [test.expected];

    let testBody = `
        java.util.ArrayList<String> actual = new java.util.ArrayList<>();
        java.util.ArrayList<String> expected = new java.util.ArrayList<>();
        ${className} obj = null;
`;

    // Process each operation
    for (let opIdx = 0; opIdx < ops.length; opIdx++) {
      const opArgs = ops[opIdx] as unknown[];
      const opName = String(opArgs[0]);
      const argsVal = opArgs.slice(1);
      
      // Expected value for this op
      const expVal = expectedArr[opIdx];
      const javaStringify = (v: any): string => {
        if (v === null || v === undefined) return 'null';
        if (Array.isArray(v)) return '[' + v.map(javaStringify).join(', ') + ']';
        return String(v);
      };
      const safeExp = javaStringify(expVal);
      testBody += `        expected.add(${toJavaLiteral(safeExp, 'String')});\n`;

      const sig = sigMap.get(opName);
      if (!sig) {
        testBody += `        // Unknown op: ${opName}\n        actual.add("null");\n`;
        continue;
      }

      const argLiterals = sig.params.map((p, pIdx) => toJavaLiteral(argsVal[pIdx], p.type)).join(', ');

      if (sig.returnType === '') {
         // constructor
         testBody += `        obj = new ${className}(${argLiterals});\n        actual.add("null");\n`;
      } else if (sig.returnType === 'void') {
         testBody += `        if (obj != null) obj.${opName}(${argLiterals});\n        actual.add("null");\n`;
      } else {
         testBody += `        if (obj != null) {
            ${sig.returnType} ret${opIdx} = obj.${opName}(${argLiterals});
            actual.add(${toStringExpr(sig.returnType, `ret${opIdx}`)});
        } else {
            actual.add("null");
        }\n`;
      }
    }

    methods += `
    private static void run_test_${i}() {
        try {
${testBody}
            boolean pass = actual.equals(expected);
            System.out.println("AJ|" + ${toJavaLiteral(test.name, 'String')} + "|" + pass + "|" + actual.toString() + "|" + expected.toString());
        } catch (Exception e) {
            System.out.println("AJ_ERROR|" + ${toJavaLiteral(test.name, 'String')} + ": " + e);
        }
    }`;

    mainBody += `        run_test_${i}();\n`;
  }

  // OOP Java Generator
  const genMethod = javaGen ? `
    private static void runGeneratedTests(java.util.Random rng) {
${javaGen.genMethodBody}
    }` : '';

  const genCall = javaGen
    ? `        runGeneratedTests(new java.util.Random(${javaGen.seed}L));\n`
    : '';

  return `import java.util.Arrays;
import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.HashMap;
import java.util.Set;
import java.util.HashSet;

public class RunnerMain {
    public static void main(String[] args) {
${mainBody}${genCall}        System.out.println("__AJ_DONE__");
    }
${methods}
${genMethod}
}
`;
}
