#!/usr/bin/env tsx
/**
 * ════════════════════════════════════════════════════════════════
 * PC Judge Generator — generate-pc-judge.ts
 *
 * Converts Algo Journey exercise definitions into standalone Java
 * "judge packages" that lecturers run as:
 *
 *   javac *.java && java Runner
 *
 * Each output folder (out/pc-judge/<exercise-id>/) contains:
 *   Runner.java        — harness with main(), static tests, and javaGenerator
 *   <StarterFile>.java — student submission placeholder
 *   ListNode.java      — (if needed) helper class
 *   _solution_ref.java — reference solution for grader
 *   README.txt         — grading instructions
 *
 * Usage:
 *   npx tsx scripts/generate-pc-judge.ts lru-cache
 *   npx tsx scripts/generate-pc-judge.ts lru-cache notification-observer
 *   npx tsx scripts/generate-pc-judge.ts --all
 * ════════════════════════════════════════════════════════════════
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── Paths ────────────────────────────────────────────────────────

const ROOT        = path.resolve(__dirname, '..');
const PROBLEMS    = path.join(ROOT, 'src', 'content', 'problems');
const OUTPUT_DIR  = path.join(ROOT, 'out', 'pc-judge');

// ─── Minimal type interfaces (no Vite deps) ───────────────────────

interface TestCase {
  name: string;
  args?: unknown[];
  expected?: unknown;
  operations?: unknown[][];
}

interface JavaGenerator {
  count: number;
  seed: number;
  namePrefix: string;
  visibility?: string;
  genMethodBody: string;
}

interface RequiredStructure {
  className?: string;
  methodName?: string;
  signature?: string;
  requiredMethods?: string[];
}

interface HelperClass { fileName: string; code: string }

interface Exercise {
  id: string;
  title: string;
  statement: string;
  constraints: string[];
  examples: { input: string; output: string; explanation?: string }[];
  mode: 'function_implementation' | 'class_implementation';
  starter: { file: string; code: string };
  requiredStructure?: RequiredStructure;
  helperClasses?: HelperClass[];
  evaluation: { javaGenerator?: JavaGenerator };
}

interface TestSuite { visible: TestCase[]; hidden: TestCase[] }

// ─── File discovery ───────────────────────────────────────────────

function walkFind(dir: string, name: string): string | null {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      const r = walkFind(full, name);
      if (r) return r;
    } else if (e.name === name) return full;
  }
  return null;
}

function discoverAll(): string[] {
  const ids: string[] = [];
  function walk(dir: string) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (e.isDirectory()) walk(path.join(dir, e.name));
      else if (e.name.endsWith('.exercise.ts')) ids.push(e.name.replace('.exercise.ts', ''));
    }
  }
  walk(PROBLEMS);
  return ids.sort();
}

// ─── Source loader (using tsx module resolution + mocks) ──────────
// We use a DIFFERENT approach than eval: we read the source text,
// transform it into CJS-compatible code with mocks injected, then
// run it with the Function constructor in a safe sandbox.
// This works because exercise files are simple object literals
// with light TypeScript syntax (no classes, decorators, etc.).

const LIST_NODE_CODE = `public class ListNode {
    public int val;
    public ListNode next;
    public ListNode() {}
    public ListNode(int val) { this.val = val; }
    public ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}
`;

const TREE_NODE_CODE = `public class TreeNode {
    public int val;
    public TreeNode left;
    public TreeNode right;
    public TreeNode() {}
    public TreeNode(int val) { this.val = val; }
    public TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}
`;

/**
 * Load an .exercise.ts file without Vite by stripping imports/exports and
 * injecting mock stubs for defineExercise, LIST_NODE_HELPER, etc.
 */
async function loadExerciseDef(id: string): Promise<Exercise | null> {
  const file = walkFind(PROBLEMS, `${id}.exercise.ts`);
  if (!file) { console.error(`  ✗ No .exercise.ts for: ${id}`); return null; }

  let src = fs.readFileSync(file, 'utf8');

  // 1) Replace "export default defineExercise({...});" with just the call
  //    by removing  all export / import statements safely
  src = src.replace(/^import\b[^\n]*\n/gm, '');
  src = src.replace(/^export\s+default\s+/m, '__RESULT__ = ');
  src = src.replace(/^export\s+\{[^}]*\}\s*;?\s*$/gm, '');

  // Build mock environment
  const mocks = `
const defineExercise = (d) => d;
const LIST_NODE_HELPER = {
  fileName: 'ListNode.java',
  code: \`${LIST_NODE_CODE}\`
};
const LIST_NODE_COMMENT = \`/**
 * Definition for singly-linked list.
 * public class ListNode { int val; ListNode next; ... }
 */\`;
const TREE_NODE_HELPER = {
  fileName: 'TreeNode.java',
  code: \`${TREE_NODE_CODE}\`
};
const TREE_NODE_COMMENT = \`/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode() {}
 *     TreeNode(int val) { this.val = val; }
 *     TreeNode(int val, TreeNode left, TreeNode right) {
 *         this.val = val; this.left = left; this.right = right;
 *     }
 * }
 */\`;
const listToArray = (a) => a;
const mergeSortedArrays = (a, b) => [];
const reverseArray = (a) => [...a].reverse();
const getMiddleValue = (a) => a[Math.floor(a.length/2)] ?? -1;
`;


  try {
    const fn = new Function(`
      ${mocks}
      let __RESULT__;
      ${src}
      return __RESULT__;
    `);
    const result = fn() as Exercise;
    if (!result?.id) throw new Error('No id in result');
    return result;
  } catch (err) {
    console.error(`  ✗ Failed to parse ${id}.exercise.ts:`, (err as Error).message);
    return null;
  }
}

/**
 * Load a .gen.ts file dynamically using ES modules (managed by tsx).
 * This ensures TypeScript features and dependencies are natively supported.
 */
async function loadGenTests(id: string): Promise<TestSuite> {
  const file = walkFind(PROBLEMS, `${id}.gen.ts`);
  if (!file) return { visible: [], hidden: [] };

  try {
    const { pathToFileURL } = await import('url');
    // Using default export which contains the TestSuite object generated by defineTests
    const module = await import(pathToFileURL(file).href);
    return module.default ?? { visible: [], hidden: [] };
  } catch (err) {
    console.warn(`  ⚠ Could not load tests for ${id}:`, (err as Error).message);
    return { visible: [], hidden: [] };
  }
}

// ─── Java code generation helpers ────────────────────────────────

interface Param { type: string; name: string }
interface Sig   { returnType: string; methodName: string; params: Param[] }

function parseSig(raw: string): Sig {
  const s = raw.trim();
  let depth = 0, paren = -1;
  for (let i = 0; i < s.length; i++) {
    if      (s[i] === '<') depth++;
    else if (s[i] === '>') depth--;
    else if (s[i] === '(' && depth === 0) { paren = i; break; }
  }
  if (paren < 0) throw new Error(`Bad signature: "${raw}"`);

  const before = s.slice(0, paren).trim();
  const sp = before.lastIndexOf(' ');
  const returnType = sp < 0 ? '' : before.slice(0, sp).trim();
  const methodName = sp < 0 ? before  : before.slice(sp + 1).trim();

  const pClose = s.lastIndexOf(')');
  const paramsRaw = s.slice(paren + 1, pClose).trim();
  const params: Param[] = [];
  if (paramsRaw) {
    let tok = '', d = 0;
    for (const c of paramsRaw + ',') {
      if (c === '<') d++;
      else if (c === '>') d--;
      else if (c === ',' && d === 0) {
        const p = tok.trim();
        const last = p.lastIndexOf(' ');
        params.push(last >= 0
          ? { type: p.slice(0, last).trim(), name: p.slice(last + 1).trim() }
          : { type: p, name: `a${params.length}` });
        tok = ''; continue;
      }
      tok += c;
    }
  }
  return { returnType, methodName, params };
}

function javaLit(v: unknown, t: string): string {
  if (v === null || v === undefined) return 'null';
  if (t === 'ListNode') {
    if (!Array.isArray(v) || v.length === 0) return 'null';
    return `Runner.buildList(new int[]{${(v as number[]).map(n => Math.trunc(n)).join(', ')}})`;
  }
  if (t === 'TreeNode') {
    if (!Array.isArray(v) || v.length === 0) return 'null';
    const elems = (v as (number | null)[]).map(e => e === null ? 'null' : String(Math.trunc(e as number)));
    return `Runner.buildTree(new Integer[]{${elems.join(', ')}})`;
  }
  if (t.endsWith('[]')) {
    const et = t.slice(0, -2).trim();
    return `new ${t}{${(v as unknown[]).map(e => javaLit(e, et)).join(', ')}}`;
  }
  if (t.startsWith('List<') || t.startsWith('java.util.List<')) {
    const inner = t.replace(/^(java\.util\.)?List</, '').replace(/>$/, '');
    const arr = v as unknown[];
    if (!arr.length) return 'new java.util.ArrayList<>()';
    return `java.util.Arrays.asList(${arr.map(e => javaLit(e, inner)).join(', ')})`;
  }
  switch (t) {
    case 'int': case 'long':    return String(Math.trunc(v as number));
    case 'double': case 'float': return Number.isInteger(v as number) ? `${v}.0` : String(v as number);
    case 'boolean': return String(v as boolean);
    case 'char':    return `'${String(v).replace("'", "\\'")}'`;
    case 'String':  return `"${String(v).replace(/\\/g,'\\\\').replace(/"/g,'\\"')}"`;
    case 'Integer': return v === null ? 'null' : String(Math.trunc(v as number));
    case 'Long':    return v === null ? 'null' : `${Math.trunc(v as number)}L`;
    case 'Double':  return v === null ? 'null' : (Number.isInteger(v as number) ? `${v}.0` : String(v as number));
    case 'Boolean': return v === null ? 'null' : String(v as boolean);
    default:        return String(v);
  }
}

function stringify(v: unknown): string {
  if (v === null || v === undefined) return 'null';
  if (Array.isArray(v)) return '[' + v.map(stringify).join(', ') + ']';
  return String(v);
}

function eqExpr(ret: string, a: string, b: string): string {
  if (ret === 'ListNode')      return `java.util.Objects.equals(Runner.listToString(${a}), Runner.listToString(${b}))`;
  if (ret.endsWith('[]'))      return `java.util.Arrays.equals(${a}, ${b})`;
  if (ret === 'String')        return `java.util.Objects.equals(${a}, ${b})`;
  if (ret.startsWith('List<')) return `java.util.Objects.equals(${a}, ${b})`;
  if (/^[A-Z]/.test(ret))     return `java.util.Objects.equals(${a}, ${b})`;
  return `(${a} == ${b})`;
}

function strExpr(ret: string, v: string): string {
  if (ret === 'ListNode')  return `Runner.listToString(${v})`;
  if (ret.endsWith('[]'))  return `java.util.Arrays.toString(${v})`;
  if (ret === 'String')    return `(${v} == null ? "null" : ${v})`;
  if (ret === 'double' || ret === 'Double')
    return `(String.valueOf(${v}).endsWith(".0") ? String.valueOf(${v}).substring(0, String.valueOf(${v}).length()-2) : String.valueOf(${v}))`;
  return `String.valueOf(${v})`;
}

// ─── Shared: patch javaGenerator body ───────────────────────────
// Replaces RunnerMain→Runner and converts println("AJ|...") to report().

function patchGenBody(body: string): string {
  return body
    .replace(/RunnerMain\./g, 'Runner.')
    // println("AJ|PREFIX" + IDX + "|" + PASS + "|" + ACT + "|" + EXP)  →  report(...)
    // PASS can be a simple variable OR a parenthesised expression like (x == y)
    .replace(
      /System\.out\.println\("AJ\|([^"]+)"\s*\+\s*(\w+)\s*\+\s*"\|"\s*\+\s*(\([^)]+\)|\w+)\s*\+\s*"\|"\s*\+\s*(\w+)\s*\+\s*"\|"\s*\+\s*(\w+)\s*\)/gm,
      (_full, prefix, idx, pass, act, exp) =>
        `Runner.report("${prefix}" + ${idx}, ${pass}, String.valueOf(${act}), String.valueOf(${exp}))`
    )
    // println("AJ_ERROR|PREFIX" + IDX + ": " + ERR)  →  reportError(...)
    .replace(
      /System\.out\.println\("AJ_ERROR\|([^"]+)"\s*\+\s*(\w+)\s*\+\s*"[^"]*"\s*\+\s*(\w+)\s*\)/gm,
      (_full, prefix, idx, err) =>
        `Runner.reportError("${prefix}" + ${idx}, ${err})`
    );
}

// ─── Shared: reporting infrastructure Java code ──────────────────
// We use String.raw to embed Java source that contains backslashes and
// quotes without additional JS escape processing. In String.raw, \n is
// two characters (\+n), not a newline — perfect for embedding Java strings.

function getInfra(title: string) {
  // Java js() escape helper. In String.raw, \\ = two chars (backslash+backslash)
  // which is exactly what Java needs for a literal backslash in a string arg.
  const jsFn = String.raw`    /** Escape a string for safe embedding in JSON */
    static String js(String s) {
        return "\"" + s
            .replace("\\", "\\\\")
            .replace("\"", "\\\"")
            .replace("\n", "\\n")
            .replace("\r", "")
            + "\"";
    }
`;

  // Java saveResults() method with TLE support
  const saveFn = String.raw`    /**
     * Write collected results to results.json.
     * Called at the end of main() after all tests have run.
     */
    static void saveResults(String exercise) {
        long passed = results.stream().filter(r -> "PASS".equals(r.get("status"))).count();
        long tle    = results.stream().filter(r -> "TLE" .equals(r.get("status"))).count();
        long failed = results.size() - passed - tle;

        StringBuilder sb = new StringBuilder();
        sb.append("{\n");
        sb.append("  \"exercise\": ").append(js(exercise)).append(",\n");
        sb.append("  \"time\": \"").append(new java.util.Date()).append("\",\n");
        sb.append("  \"summary\": {\n");
        sb.append("    \"total\":   ").append(results.size()).append(",\n");
        sb.append("    \"passed\": ").append(passed).append(",\n");
        sb.append("    \"tle\":    ").append(tle).append(",\n");
        sb.append("    \"failed\": ").append(failed).append("\n");
        sb.append("  },\n");
        sb.append("  \"results\": [\n");
        for (int i = 0; i < results.size(); i++) {
            Map<String, String> r = results.get(i);
            sb.append("    {\n");
            sb.append("      \"name\":       ").append(js(r.get("name"))).append(",\n");
            sb.append("      \"status\":     ").append(js(r.get("status"))).append(",\n");
            if (r.get("elapsed_ms") != null)
                sb.append("      \"elapsed_ms\": ").append(r.get("elapsed_ms")).append(",\n");
            if ("ERROR".equals(r.get("status"))) {
                sb.append("      \"message\": ").append(js(r.get("message"))).append("\n");
            } else if ("TLE".equals(r.get("status"))) {
                sb.append("      \"message\": ").append(js("Time Limit Exceeded (>" + TIME_LIMIT_MS + "ms)")).append("\n");
            } else {
                sb.append("      \"actual\":   ").append(js(r.get("actual"))).append(",\n");
                sb.append("      \"expected\": ").append(js(r.get("expected"))).append("\n");
            }
            sb.append("    }").append(i < results.size() - 1 ? "," : "").append("\n");
        }
        sb.append("  ]\n");
        sb.append("}\n");

        try (java.io.PrintWriter pw = new java.io.PrintWriter(
                new java.io.FileWriter("results.json"))) {
            pw.write(sb.toString());
            System.out.println("Results saved \u2192 results.json  (" + passed + "/" + results.size() + " passed, TLE: " + tle + ")");
        } catch (java.io.IOException ex) {
            System.err.println("Could not write results.json: " + ex);
        }
    }
`;

  const escapedTitle = title.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  const saveCall = `        saveResults("${escapedTitle}");\n`;

  return { jsFn, saveFn, saveCall };
}


// ─── Runner.java — function_implementation ────────────────────────
// Uses a lambda-based `runTest(name, fn, expected)` as the single evaluation
// entry point for ALL tests — both static and generated.

function buildFunctionRunner(ex: Exercise, tests: TestCase[]): string {
  const sig = parseSig(ex.requiredStructure?.signature ?? 'void solve()');
  const { methodName, params, returnType } = sig;
  const className = ex.requiredStructure?.className ?? 'Solution';
  const needsLN = [returnType, ...params.map(p => p.type)].includes('ListNode');
  const needsTN = [returnType, ...params.map(p => p.type)].includes('TreeNode');
  const infra = getInfra(ex.title);


  // Build one runTest() call per static test — no repeated testN() methods
  let testCalls = '';
  for (const tc of tests) {
    const args   = tc.args ?? [];
    const argLit = params.map((p, j) => javaLit(args[j], p.type)).join(', ');
    const expLit = javaLit(tc.expected, returnType);
    // ListNode/TreeNode: compare via string representation (may not implement equals)
    if (returnType === 'ListNode') {
      testCalls += `        runTest("${tc.name}", () -> Runner.listToString(s.${methodName}(${argLit})), Runner.listToString(${expLit}));\n`;
    } else if (returnType === 'TreeNode') {
      testCalls += `        runTest("${tc.name}", () -> Runner.treeToString(s.${methodName}(${argLit})), Runner.treeToString(${expLit}));\n`;
    } else {
      testCalls += `        runTest("${tc.name}", () -> s.${methodName}(${argLit}), ${expLit});\n`;
    }
  }

  const gen     = ex.evaluation.javaGenerator;
  // Generated tests keep their own generation + comparison logic (efficient early-break),
  // but report results through the same report() method as static tests.
  const genBody = gen ? patchGenBody(gen.genMethodBody) : '';
  const genMethod = gen ? `
    // ════════════════════════════════════════════════════════════════
    // IV. Generated / stress tests
    //     Generates random inputs, computes expected via reference logic,
    //     runs student solution, and reports via the same report() method.
    // ════════════════════════════════════════════════════════════════
    private static void runGeneratedTests(${className} s, Random rng) {
${genBody}
    }` : '';
  const genCall = gen
    ? `        runGeneratedTests(s, new Random(${gen.seed}L));\n`
    : '';

  const lnHelpers = needsLN ? `
    // ── ListNode helpers ─────────────────────────────────────────────
    public static ListNode buildList(int[] arr) {
        ListNode dummy = new ListNode(0), cur = dummy;
        for (int v : arr) { cur.next = new ListNode(v); cur = cur.next; }
        return dummy.next;
    }
    public static String listToString(ListNode h) {
        StringBuilder sb = new StringBuilder("[");
        while (h != null) { sb.append(h.val); if (h.next != null) sb.append(", "); h = h.next; }
        return sb.append("]").toString();
    }
` : '';

  const tnHelpers = needsTN ? `
    // ── TreeNode helpers ─────────────────────────────────────────────
    /** Build a TreeNode tree from a level-order Integer[] array (null = absent node). */
    public static TreeNode buildTree(Integer[] arr) {
        if (arr == null || arr.length == 0 || arr[0] == null) return null;
        TreeNode root = new TreeNode(arr[0]);
        java.util.Queue<TreeNode> q = new java.util.LinkedList<>();
        q.add(root);
        int i = 1;
        while (!q.isEmpty() && i < arr.length) {
            TreeNode cur = q.poll();
            if (i < arr.length && arr[i] != null) { cur.left  = new TreeNode(arr[i]); q.add(cur.left);  } i++;
            if (i < arr.length && arr[i] != null) { cur.right = new TreeNode(arr[i]); q.add(cur.right); } i++;
        }
        return root;
    }
    /** Serialize a tree to level-order string for comparison. */
    public static String treeToString(TreeNode root) {
        if (root == null) return "[]";
        StringBuilder sb = new StringBuilder("[");
        java.util.Queue<TreeNode> q = new java.util.LinkedList<>();
        q.add(root);
        boolean first = true;
        while (!q.isEmpty()) {
            TreeNode cur = q.poll();
            if (!first) sb.append(", "); first = false;
            if (cur == null) { sb.append("null"); continue; }
            sb.append(cur.val);
            if (cur.left != null || cur.right != null || !q.isEmpty()) {
                q.add(cur.left); q.add(cur.right);
            }
        }
        // Trim trailing nulls
        String s = sb.append("]").toString();
        while (s.endsWith(", null]")) s = s.substring(0, s.length() - 7) + "]";
        return s;
    }
` : '';

  const compileFiles = ['Runner.java', ex.starter.file, ...(ex.helperClasses ?? []).map(h => h.fileName)].join(' ');

  return `import java.util.*;

/**
 * Runner — PC Judge for: ${ex.title}
 * ─────────────────────────────────────────────────────────────────
 * Cách dùng:
 *   1. Chép file bài của sinh viên vào folder (tên: ${ex.starter.file})
 *   2. javac ${compileFiles}
 *   3. java Runner
 *
 * Định dạng output:
 *   TEST|<tên>|<true/false>|<actual>|<expected>
 *   ERROR|<tên>|<exception message>
 */
public class Runner {

    // ════════════════════════════════════════════════════════════════
    // I. Reporting infrastructure — single source of truth for output
    // ════════════════════════════════════════════════════════════════

    /** Time limit per test in milliseconds */
    static final long TIME_LIMIT_MS = 2000L;

    // Accumulated results — populated by report(), reportError(), reportTle()
    static final List<Map<String, String>> results = new ArrayList<>();

    /** Uniform test result: print to stdout AND collect for JSON */
    public static void report(String name, boolean pass, String actual, String expected) {
        report(name, pass, actual, expected, -1);
    }
    public static void report(String name, boolean pass, String actual, String expected, long elapsedMs) {
        String status = pass ? "PASS" : "FAIL";
        System.out.println("TEST|" + name + "|" + status + "|" + actual + "|" + expected + (elapsedMs >= 0 ? "|" + elapsedMs + "ms" : ""));
        Map<String, String> r = new LinkedHashMap<>();
        r.put("name",       name);
        r.put("status",     status);
        r.put("actual",     actual);
        r.put("expected",   expected);
        if (elapsedMs >= 0) r.put("elapsed_ms", String.valueOf(elapsedMs));
        results.add(r);
    }

    /** Uniform error output: print to stdout AND collect for JSON */
    public static void reportError(String name, Exception e) {
        System.out.println("ERROR|" + name + "|" + e);
        Map<String, String> r = new LinkedHashMap<>();
        r.put("name",    name);
        r.put("status",  "ERROR");
        r.put("message", String.valueOf(e));
        results.add(r);
    }

    /** TLE output: time limit exceeded */
    public static void reportTle(String name, long elapsedMs) {
        System.out.println("TLE|" + name + "|" + elapsedMs + "ms (limit: " + TIME_LIMIT_MS + "ms)");
        Map<String, String> r = new LinkedHashMap<>();
        r.put("name",       name);
        r.put("status",     "TLE");
        r.put("elapsed_ms", String.valueOf(elapsedMs));
        results.add(r);
    }
${infra.jsFn}
${infra.saveFn}    /** Format any value for display (handles primitive arrays) */
    static String fmt(Object v) {
        if (v == null)               return "null";
        if (v instanceof int[])      return Arrays.toString((int[])      v);
        if (v instanceof long[])     return Arrays.toString((long[])     v);
        if (v instanceof boolean[])  return Arrays.toString((boolean[])  v);
        if (v instanceof double[])   return Arrays.toString((double[])   v);
        if (v instanceof Object[])   return Arrays.deepToString((Object[]) v);
        return String.valueOf(v);
    }

    /** Structural equality (handles primitive arrays and boxed types) */
    static boolean eq(Object a, Object b) {
        if (a instanceof int[]     && b instanceof int[])     return Arrays.equals((int[])     a, (int[])     b);
        if (a instanceof long[]    && b instanceof long[])    return Arrays.equals((long[])    a, (long[])    b);
        if (a instanceof boolean[] && b instanceof boolean[]) return Arrays.equals((boolean[]) a, (boolean[]) b);
        if (a instanceof Object[]  && b instanceof Object[])  return Arrays.deepEquals((Object[]) a, (Object[]) b);
        return Objects.equals(a, b);
    }

    // ════════════════════════════════════════════════════════════════
    // II. Test runner — single evaluation entry point
    // ════════════════════════════════════════════════════════════════

    @FunctionalInterface
    interface Fn { Object run() throws Exception; }

    // Shared executor — single thread, daemonized so it doesn't block JVM exit
    static final java.util.concurrent.ExecutorService __exec =
        java.util.concurrent.Executors.newSingleThreadExecutor(r -> {
            Thread t = new Thread(r);
            t.setDaemon(true);
            return t;
        });

    /**
     * Executes fn() with a hard TIME_LIMIT_MS timeout.
     * Reports PASS/FAIL/TLE/ERROR and writes to results list.
     */
    static void runTest(String name, Fn fn, Object expected) {
        long start = System.currentTimeMillis();
        java.util.concurrent.Future<Object> future = __exec.submit(() -> fn.run());
        try {
            Object actual = future.get(TIME_LIMIT_MS, java.util.concurrent.TimeUnit.MILLISECONDS);
            long elapsed = System.currentTimeMillis() - start;
            report(name, eq(actual, expected), fmt(actual), fmt(expected), elapsed);
        } catch (java.util.concurrent.TimeoutException e) {
            future.cancel(true);
            long elapsed = System.currentTimeMillis() - start;
            reportTle(name, elapsed);
        } catch (java.util.concurrent.ExecutionException e) {
            Throwable cause = e.getCause();
            reportError(name, cause instanceof Exception ? (Exception) cause : new RuntimeException(cause));
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            reportError(name, e);
        }
    }

    // ════════════════════════════════════════════════════════════════
    // III. Static tests (visible + hidden) — data-driven, no repetition
    // ════════════════════════════════════════════════════════════════

    static void runStaticTests(${className} s) {
${testCalls}    }
${genMethod}
${lnHelpers}${tnHelpers}
    // ════════════════════════════════════════════════════════════════
    // V. Entry point
    // ════════════════════════════════════════════════════════════════

    public static void main(String[] args) {
        ${className} s = new ${className}();
        runStaticTests(s);
${genCall}${infra.saveCall}        __exec.shutdownNow();
        System.out.println("=== DONE ===");
        System.exit(0);
    }
}
`;
}

// ─── Runner.java — class_implementation ──────────────────────────
// Uses a `Steps` recorder to separate data, execution, and verification.
// Each test step is recorded with add(actual, expected) or addVoid(),
// then verified in one call — no repeated testN() methods, no inline println.

function buildClassRunner(ex: Exercise, tests: TestCase[]): string {
  const className = ex.requiredStructure?.className ?? 'Solution';
  const methods   = ex.requiredStructure?.requiredMethods ?? [];
  const infra     = getInfra(ex.title);

  const sigMap = new Map<string, Sig>();
  for (const m of methods) {
    try { const s = parseSig(m); sigMap.set(s.methodName, s); }
    catch { /* constructor — handled per opName */ }
  }

  const ctorRaw = methods.find(m => m.startsWith(className + '('));

  // Build Steps-based test bodies — one try block per test, no testN() methods
  let staticTestCode = '';

  for (const tc of tests) {
    const ops         = tc.operations ?? [];
    const expectedArr = Array.isArray(tc.expected) ? tc.expected : [tc.expected];

    let steps = `            Steps t = new Steps("${tc.name}");\n`;
    steps    += `            ${className} obj = null;\n`;

    for (let k = 0; k < ops.length; k++) {
      const op      = ops[k] as unknown[];
      const opName  = String(op[0]);
      const opArgs  = op.slice(1);
      const expVal  = expectedArr[k];

      if (opName === className) {
        // Constructor: creates the object; expected is always null
        const argLit = ctorRaw
          ? parseSig(ctorRaw).params.map((p, j) => javaLit(opArgs[j], p.type)).join(', ')
          : '';
        steps += `            obj = new ${className}(${argLit}); t.addVoid();\n`;
        continue;
      }

      const sig = sigMap.get(opName);
      if (!sig) {
        steps += `            t.addVoid(); // unknown op: ${opName}\n`;
        continue;
      }

      const argLit = sig.params.map((p, j) => javaLit(opArgs[j], p.type)).join(', ');

      if (sig.returnType === '' || !sig.returnType || sig.returnType === 'void') {
        // Void or constructor-like: execute + record null/null
        steps += `            if (obj != null) obj.${opName}(${argLit}); t.addVoid();\n`;
      } else {
        // Return-value method: t.add(actual, expected) — execution and verification in one line
        const expLit = javaLit(expVal, sig.returnType);
        steps += `            if (obj != null) t.add(obj.${opName}(${argLit}), ${expLit});\n`;
        steps += `            else t.addVoid();\n`;
      }
    }
    steps += `            t.verify();\n`;

    staticTestCode +=
      `        // ── ${tc.name} ──\n` +
      `        try {\n${steps}\n        } catch (Exception e) { reportError("${tc.name}", e); }\n`;
  }

  const gen     = ex.evaluation.javaGenerator;
  const genBody = gen ? patchGenBody(gen.genMethodBody) : '';
  const genMethod = gen ? `
    // ════════════════════════════════════════════════════════════════
    // IV. Generated / stress tests
    //     Generates random inputs, computes expected via reference logic,
    //     runs student solution, and reports via the same report() method.
    // ════════════════════════════════════════════════════════════════
    private static void runGeneratedTests(Random rng) {
${genBody}
    }` : '';
  const genCall = gen
    ? `        runGeneratedTests(new Random(${gen.seed}L));\n`
    : '';

  const compileFiles = ['Runner.java', ex.starter.file, ...(ex.helperClasses ?? []).map(h => h.fileName)].join(' ');

  return `import java.util.*;

/**
 * Runner — PC Judge for: ${ex.title}
 * ─────────────────────────────────────────────────────────────────
 * Cách dùng:
 *   1. Chép file bài của sinh viên vào folder (tên: ${ex.starter.file})
 *   2. javac ${compileFiles}
 *   3. java Runner
 *
 * Định dạng output:
 *   TEST|<tên>|<true/false>|<actual>|<expected>
 *   ERROR|<tên>|<exception message>
 */
public class Runner {

    // ════════════════════════════════════════════════════════════════
    // I. Reporting infrastructure — single source of truth for output
    // ════════════════════════════════════════════════════════════════

    // Accumulated results — populated by report() and reportError()
    static final List<Map<String, String>> results = new ArrayList<>();

    /** Uniform test result: print to stdout AND collect for JSON */
    public static void report(String name, boolean pass, String actual, String expected) {
        System.out.println("TEST|" + name + "|" + pass + "|" + actual + "|" + expected);
        Map<String, String> r = new LinkedHashMap<>();
        r.put("name",     name);
        r.put("status",   pass ? "PASS" : "FAIL");
        r.put("actual",   actual);
        r.put("expected", expected);
        results.add(r);
    }

    /** Uniform error output: print to stdout AND collect for JSON */
    public static void reportError(String name, Exception e) {
        System.out.println("ERROR|" + name + "|" + e);
        Map<String, String> r = new LinkedHashMap<>();
        r.put("name",    name);
        r.put("status",  "ERROR");
        r.put("message", String.valueOf(e));
        results.add(r);
    }

${infra.jsFn}
${infra.saveFn}
    /** Format any value for display */
    static String fmt(Object v) {
        if (v == null)               return "null";
        if (v instanceof int[])      return Arrays.toString((int[])      v);
        if (v instanceof long[])     return Arrays.toString((long[])     v);
        if (v instanceof boolean[])  return Arrays.toString((boolean[])  v);
        if (v instanceof double[])   return Arrays.toString((double[])   v);
        if (v instanceof Object[])   return Arrays.deepToString((Object[]) v); // Use deepToString for generic nested arrays
        return String.valueOf(v);
    }

    // ════════════════════════════════════════════════════════════════
    // II. Steps — operation recorder for class-based tests
    // ════════════════════════════════════════════════════════════════

    /**
     * Records the actual and expected result of each operation step by step,
     * then compares the full sequence and reports a single pass/fail result.
     *
     * Separates three concerns:
     *   - Data:        the expected values are captured at code-gen time (literals)
     *   - Execution:   obj.method() is called inside add()
     *   - Verification: verify() compares and calls report() once
     *
     * Usage:
     *   Steps t = new Steps("my-test");
     *   MyClass obj = new MyClass(args);  t.addVoid();     // constructor
     *   obj.mutate(args);                 t.addVoid();     // void method
     *   t.add(obj.query(args), expected); // return-value method
     *   t.verify();
     */
    static class Steps {
        private final String       name;
        private final List<String> actual   = new ArrayList<>();
        private final List<String> expected = new ArrayList<>();

        Steps(String name) { this.name = name; }

        /** Record a step with its actual return value and expected value */
        Steps add(Object actualVal, Object expectedVal) {
            actual.add(fmt(actualVal));
            expected.add(fmt(expectedVal));
            return this;
        }

        /** Record a void step (constructor or void method) — expected is always null */
        Steps addVoid() { return add(null, null); }

        /** Compare the recorded sequence and report result via report() */
        void verify() {
            report(name, actual.equals(expected), actual.toString(), expected.toString());
        }
    }

    // ════════════════════════════════════════════════════════════════
    // III. Static tests (visible + hidden) — data-driven, no repetition
    // ════════════════════════════════════════════════════════════════

    static void runStaticTests() {
${staticTestCode}    }
${genMethod}
    // ════════════════════════════════════════════════════════════════
    // V. Entry point
    // ════════════════════════════════════════════════════════════════

    public static void main(String[] args) {
        runStaticTests();
${genCall}
${infra.saveCall}        System.out.println("=== DONE ===");
    }
}
`;
}

// ─── README.txt ───────────────────────────────────────────────────

function buildReadme(ex: Exercise, testCount: number, hasGen: boolean): string {
  const sf = ex.starter.file;
  const helpers = (ex.helperClasses ?? []).map(h => h.fileName);
  const compileFiles = ['Runner.java', sf, ...helpers].join(' ');
  return `═══════════════════════════════════════════════════════════════
PC Judge Package — ${ex.title}
═══════════════════════════════════════════════════════════════

NỘI DUNG FOLDER
───────────────
  Runner.java         — Harness chấm bài (KHÔNG sửa)
${helpers.map(h => `  ${h.padEnd(20)}— Helper class (KHÔNG sửa)`).join('\n')}
  ${sf.padEnd(20)}— File nộp của sinh viên (THAY THẾ nội dung này)
  _starter.java       — Code khởi đầu (copy → đổi tên thành ${sf} để bắt đầu)
  _solution_ref.java  — Đáp án mẫu (để kiểm tra)
  grade.bat           — Script chấm bài (Windows)
  grade.sh            — Script chấm bài (Unix/Mac)

CÁCH CHẤM BÀI — NHANH
──────────────────────
  Windows: grade.bat
  Unix:    bash grade.sh

CÁCH CHẤM BÀI — THỦ CÔNG
──────────────────────────
1. Chép code bài của sinh viên vào: ${sf}
   (Ghi đè toàn bộ nội dung file)

2. Biên dịch:
   javac ${compileFiles}

3. Chạy:
   java Runner

KIỂM TRA ĐÁP ÁN MẪU
────────────────────
  Windows: grade-ref.bat
  Manual:  copy _solution_ref.java ${sf} && javac ${compileFiles} && java Runner

ĐỊNH DẠNG KẾT QUẢ
──────────────────
TEST|<tên test>|<true/false>|<giá trị thực tế>|<giá trị kỳ vọng>
ERROR|<tên test>|<exception>
AJ|<tên stress test>|<true/false>|<actual>|<expected>
=== DONE ===

THỐNG KÊ TEST
─────────────
- Test tĩnh (visible + hidden): ${testCount}
${hasGen ? '- Stress test tự sinh (javaGenerator): CÓ\n' : ''}

ĐỀ BÀI
───────
${ex.statement}

RÀNG BUỘC
─────────
${ex.constraints.map(c => '• ' + c).join('\n')}

VÍ DỤ
──────
${ex.examples.map((e, i) => `[Ví dụ ${i+1}]
Input:  ${e.input}
Output: ${e.output}${e.explanation ? '\nGiải: ' + e.explanation : ''}`).join('\n\n')}
`;
}

// ─── Main process ─────────────────────────────────────────────────


/** Build a grade.bat for Windows to compile and run easily */
function buildGradeBat(ex: Exercise): string {
  const sf = ex.starter.file;
  const helpers = (ex.helperClasses ?? []).map(h => h.fileName).join(' ');
  const compileFiles = `Runner.java ${sf}${helpers ? ' ' + helpers : ''}`;
  const hasTree = (ex.helperClasses ?? []).some(h => h.fileName === 'TreeNode.java');
  const javaRun = hasTree ? 'java -Xss64m Runner' : 'java Runner';
  return `@echo off
echo === PC Judge: ${ex.title} ===
echo.

REM Compile
javac ${compileFiles}
if %errorlevel% neq 0 (
  echo COMPILE ERROR
  exit /b 1
)

REM Run
${javaRun}
`;
}


/** Build a grade.sh for Unix/Mac */
function buildGradeSh(ex: Exercise): string {
  const sf = ex.starter.file;
  const helpers = (ex.helperClasses ?? []).map(h => h.fileName).join(' ');
  const compileFiles = `Runner.java ${sf}${helpers ? ' ' + helpers : ''}`;
  const hasTree = (ex.helperClasses ?? []).some(h => h.fileName === 'TreeNode.java');
  const javaRun = hasTree ? 'java -Xss64m Runner' : 'java Runner';
  return `#!/bin/bash
echo "=== PC Judge: ${ex.title} ==="
echo

# Compile
javac ${compileFiles}
if [ $? -ne 0 ]; then
  echo "COMPILE ERROR"
  exit 1
fi

# Run
${javaRun}
`;
}

async function generate(id: string): Promise<boolean> {
  console.log(`\n► ${id}`);

  const ex = await loadExerciseDef(id);
  if (!ex) return false;

  const ts = await loadGenTests(id);
  const allTests = [...ts.visible, ...ts.hidden];

  console.log(`  title   : ${ex.title}`);
  console.log(`  mode    : ${ex.mode}`);
  console.log(`  tests   : ${allTests.length} static${ex.evaluation.javaGenerator ? ' + javaGenerator' : ''}`);

  const outDir = path.join(OUTPUT_DIR, id);
  fs.mkdirSync(outDir, { recursive: true });

  // 1. Runner.java — the main harness (do NOT modify)
  const runner = ex.mode === 'class_implementation'
    ? buildClassRunner(ex, allTests)
    : buildFunctionRunner(ex, allTests);
  fs.writeFileSync(path.join(outDir, 'Runner.java'), runner, 'utf8');
  console.log(`  ✓ Runner.java`);

  // 2. Helper classes (ListNode.java etc.) — platform-provided, do NOT modify
  for (const h of ex.helperClasses ?? []) {
    fs.writeFileSync(path.join(outDir, h.fileName), h.code, 'utf8');
    console.log(`  ✓ ${h.fileName}  (helper)`);
  }

  // 3. Student file placeholder — REPLACE with student's submission
  const starterPlaceholder = `// ════════════════════════════════════════════════════════════
// PC Judge — Bài: ${ex.title}
// ────────────────────────────────────────────────────────────
// HƯỚNG DẪN:
//   Xóa hết nội dung file này và chép code của sinh viên vào.
//   Sau đó chạy: grade.bat  (Windows) hoặc  bash grade.sh  (Unix)
// ════════════════════════════════════════════════════════════

// [STARTER CODE — chỉ dùng để tham khảo, thay bằng code sinh viên]
${ex.starter.code}
`;
  fs.writeFileSync(path.join(outDir, ex.starter.file), starterPlaceholder, 'utf8');
  console.log(`  ✓ ${ex.starter.file}  (student submission slot)`);

  // 3b. _starter.java — clean file for students to start coding offline
  //     Mirrors the web editor: student opens this, renames to ${ex.starter.file},
  //     writes their solution, then runs grade.bat to check.
  const cleanStarterHeader = [
    `// ════════════════════════════════════════════════════════════`,
    `// Bài: ${ex.title}`,
    `// ────────────────────────────────────────────────────────────`,
    `// Đây là file khởi đầu. Cách dùng:`,
    `//   1. Copy file này → đổi tên thành: ${ex.starter.file}`,
    `//   2. Viết code vào trong class`,
    `//   3. Chạy: grade.bat (Windows) hoặc  bash grade.sh (Unix)`,
    `// ════════════════════════════════════════════════════════════`,
    ``,
  ].join('\n');
  fs.writeFileSync(path.join(outDir, '_starter.java'), cleanStarterHeader + ex.starter.code + '\n', 'utf8');
  console.log(`  ✓ _starter.java  (clean starter for students)`);

  // 4. Reference solution — use for validation / grader self-test
  const solFile = walkFind(PROBLEMS, `${id}.solution.java`);

  if (solFile) {
    fs.copyFileSync(solFile, path.join(outDir, '_solution_ref.java'));
    console.log(`  ✓ _solution_ref.java  (reference — test with grade-ref.bat)`);
    // Also emit a grade-ref.bat that uses the ref solution
    const sf = ex.starter.file;
    const helpers = (ex.helperClasses ?? []).map(h => h.fileName).join(' ');
    const hasTree = (ex.helperClasses ?? []).some(h => h.fileName === 'TreeNode.java');
    const javaRun = hasTree ? 'java -Xss64m Runner' : 'java Runner';
    const gradeRef = `@echo off\necho === Testing Reference Solution: ${ex.title} ===\necho.\ncopy _solution_ref.java ${sf} >nul\njavac Runner.java ${sf}${helpers ? ' ' + helpers : ''}\nif %errorlevel% neq 0 ( echo COMPILE ERROR & exit /b 1 )\n${javaRun}\n`;
    fs.writeFileSync(path.join(outDir, 'grade-ref.bat'), gradeRef, 'utf8');
  }

  // 5. Grade scripts
  fs.writeFileSync(path.join(outDir, 'grade.bat'), buildGradeBat(ex), 'utf8');
  fs.writeFileSync(path.join(outDir, 'grade.sh'),  buildGradeSh(ex),  'utf8');
  console.log(`  ✓ grade.bat / grade.sh`);

  // 6. README
  const readme = buildReadme(ex, allTests.length, !!ex.evaluation.javaGenerator);
  fs.writeFileSync(path.join(outDir, 'README.txt'), readme, 'utf8');
  console.log(`  ✓ README.txt`);

  const rel = path.relative(ROOT, outDir).replace(/\\/g, '/');
  console.log(`  ✅ → ${rel}/`);
  return true;
}

async function main() {
  const argv = process.argv.slice(2);
  const allFlag = argv.includes('--all');

  const ids = allFlag ? discoverAll() : argv.filter(a => !a.startsWith('-'));

  if (ids.length === 0) {
    console.log(`
PC Judge Generator
══════════════════
Usage:
  npx tsx scripts/generate-pc-judge.ts <id> [<id2> ...]
  npx tsx scripts/generate-pc-judge.ts --all

Examples:
  npx tsx scripts/generate-pc-judge.ts lru-cache
  npx tsx scripts/generate-pc-judge.ts lru-cache notification-observer
  npx tsx scripts/generate-pc-judge.ts --all
`);
    return;
  }

  if (allFlag) console.log(`Generating all ${ids.length} exercises...\n`);

  let ok = 0, fail = 0;
  for (const id of ids) {
    const res = await generate(id);
    res ? ok++ : fail++;
  }

  console.log(`\n${'═'.repeat(50)}`);
  console.log(`Done — ✅ ${ok} generated, ✗ ${fail} failed`);
  console.log(`Output: ${OUTPUT_DIR}`);
}

main().catch(err => { console.error(err); process.exit(1); });
