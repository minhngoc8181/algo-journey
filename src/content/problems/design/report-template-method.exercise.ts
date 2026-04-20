import { defineExercise } from '../../_loader';

export default defineExercise({
  id: 'report-template-method',
  version: 1,
  title: 'Report Exporter - Template Method',
  summary: 'Define the skeleton of an algorithm in an operation, deferring some steps to subclasses using the Template Method Pattern.',
  topic: 'design',
  difficulty: 'easy',
  tags: ['design', 'template-method', 'inheritance', 'cse202'],
  estimatedMinutes: 20,
  order: 458,
  mode: 'class_implementation',
  hints: [
    'The `export()` method in `ReportExporter` should be `final` so it cannot be overridden. It calls the 4 steps completely defining the algorithm flow.',
    '`loadData()` and `processData()` should provide default return strings in the abstract class.',
    '`formatData()` and `saveFile()` must be declared as `abstract` (often `protected`) so child classes are forced to implement them.',
    '`ReportSystem` is a context helper to test your exporters polymorphically.'
  ],

  learningGoals: [
    'Understand and implement the Template Method Pattern',
    'Differentiate between invariant algorithm steps and variant subclass implementations',
    'Use `final` and `abstract` modifiers correctly in an abstract base class'
  ],
  statement: `You are tasked with building a report generation system that exports data into various formats (PDF, Excel, HTML). The overall process is always the same: load data, process data, format data, and save the file. However, the formatting and saving steps differ depending on the specific file type.

Use the **Template Method Pattern** to define this algorithm's skeleton within an abstract base class.

**Abstract Class:**
- \`ReportExporter\`
  - \`final String export()\` — Defines the template. It must call the four methods below in order, joined by \`" -> "\`. (Example return: \`"Load DB -> Process Data -> Format PDF -> Save .pdf"\`).
  - \`String loadData()\` — returns \`"Load DB"\` (default implementation for all reports).
  - \`String processData()\` — returns \`"Process Data"\` (default implementation).
  - \`abstract String formatData()\` — to be implemented by subclasses.
  - \`abstract String saveFile()\` — to be implemented by subclasses.

**Concrete Exporters (each extends \`ReportExporter\`):**
Implement the abstract methods to return the exact strings specified below:
- \`PdfReportExporter\`
  - formatData: \`"Format PDF"\`
  - saveFile: \`"Save .pdf"\`
- \`ExcelReportExporter\`
  - formatData: \`"Format Excel"\`
  - saveFile: \`"Save .xlsx"\`
- \`HtmlReportExporter\`
  - formatData: \`"Format HTML"\`
  - saveFile: \`"Save .html"\`

**Context class:**
- \`ReportSystem()\`
  - \`String generateReport(ReportExporter exporter)\` — simply calls \`export()\` on the provided exporter and returns the result string. Returns \`"No exporter provided"\` if null.`,
  constraints: [
    'The 4 steps must be joined exactly with \`" -> "\` (space, dash, greater-than, space).',
    'At most \`1000\` calls will be made in total.'
  ],
  examples: [
    {
      input: `ReportSystem system = new ReportSystem();
system.generateReport(new PdfReportExporter()); 
// return "Load DB -> Process Data -> Format PDF -> Save .pdf"

system.generateReport(new HtmlReportExporter());
// return "Load DB -> Process Data -> Format HTML -> Save .html"`,
      output: '[null, "Load DB -> Process Data -> Format PDF -> Save .pdf", "Load DB -> Process Data -> Format HTML -> Save .html"]'
    }
  ],

  starter: {
    file: 'ReportSystem.java',
    code: `abstract class ReportExporter {

    public final String export() {
        return ""; // TODO: Implement template logic by calling other methods
    }
    
    public String loadData() {
        return "Load DB";
    }
    
    public String processData() {
        return "Process Data";
    }
    
    // TODO: Declare abstract methods
}

class PdfReportExporter {
}

class ExcelReportExporter {
}

class HtmlReportExporter {
}

class ReportSystem {

    public ReportSystem() {
        
    }
    
    public String generateReport(ReportExporter exporter) {
        return "";
    }
}`,
  },

  requiredStructure: {
    className: 'ReportSystem',
    requiredMethods: [
      'ReportSystem()',
      'String generateReport(ReportExporter exporter)'
    ],
  },

  evaluation: {
    comparator: 'exact_json',
    javaGenerator: {
      count: 20,
      seed: 81928374,
      namePrefix: 'test-',
      visibility: 'hidden',
      genMethodBody: `
        for (int i = 0; i < 20; i++) {
            int opsCount = (i < 5) ? 10 : 50;
            ReportSystem obj = new ReportSystem();

            java.util.List<Object> expTrace = new java.util.ArrayList<>();
            java.util.List<Object> actTrace = new java.util.ArrayList<>();
            expTrace.add(null);
            actTrace.add(null);

            for (int k = 0; k < opsCount; k++) {
                int traceSizeBefore = expTrace.size();
                int type = rng.nextInt(3);
                ReportExporter exporter;
                String expectedAns;
                
                if (type == 0) {
                    exporter = new PdfReportExporter();
                    expectedAns = "Load DB -> Process Data -> Format PDF -> Save .pdf";
                } else if (type == 1) {
                    exporter = new ExcelReportExporter();
                    expectedAns = "Load DB -> Process Data -> Format Excel -> Save .xlsx";
                } else {
                    exporter = new HtmlReportExporter();
                    expectedAns = "Load DB -> Process Data -> Format HTML -> Save .html";
                }

                String actualAns = obj.generateReport(exporter);

                expTrace.add(expectedAns);
                    actTrace.add(actualAns);
                if (expTrace.size() == traceSizeBefore) {
                    expTrace.add(null);
                    actTrace.add(null);
                }
            }
            boolean pass = actTrace.equals(expTrace);
            String actStr = actTrace.toString();
            String expStr = expTrace.toString();
            if (!pass) {
                int mismatchIdx = -1;
                for (int m = 0; m < actTrace.size(); m++) {
                    if (actTrace.get(m) == null && expTrace.get(m) == null) continue;
                    if (actTrace.get(m) == null || !actTrace.get(m).equals(expTrace.get(m))) { mismatchIdx = m; break; }
                }
                if (actStr.length() > 2000) actStr = actStr.substring(0, 2000) + "...";
                if (expStr.length() > 2000) expStr = expStr.substring(0, 2000) + "...";
                if (mismatchIdx != -1) {
                    actStr = "[Mismatch at idx " + mismatchIdx + "] " + actStr;
                    expStr = "[Mismatch at idx " + mismatchIdx + "] " + expStr;
                }
            }
            System.out.println("AJ|test-" + i + "|" + pass + "|" + actStr + "|" + expStr);
        }`
    }
  }
});
