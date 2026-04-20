import { defineExercise } from '../../_loader';

export default defineExercise({
  id: 'shape-drawing',
  version: 1,
  title: 'Shape Drawing - Polymorphism',
  summary: 'Manage basic shapes using an interface to calculate area, perimeter, and maintain polymorphism.',
  topic: 'design',
  difficulty: 'easy',
  tags: ['design', 'polymorphism', 'inheritance', 'cse202'],
  estimatedMinutes: 20,
  order: 452,
  mode: 'class_implementation',
  hints: [
    'Define an interface `Shape` with three abstract methods: `area()`, `perimeter()`, and `draw()`.',
    'Each concrete shape implements the `Shape` interface and provides its own Math-based calculation for area and perimeter.',
    'Wait, use `Math.PI` for Circle, `a * b` for Rectangle, and Heron\'s formula for Triangle area.',
    '`DrawingBoard` should store shapes in a `List<Shape>` and use a loop to accumulate areas or build a string representation of shapes.'
  ],

  learningGoals: [
    'Apply Polymorphism to treat different shape objects identically',
    'Practice working with Interfaces and lists of Interface objects',
    'Use built-in Java Math functions for standard calculations'
  ],
  statement: `Manage basic geometric shapes using an interface. Create a \`DrawingBoard\` that can hold any shape, such as a circle, rectangle, or triangle, and compute the total area of all shapes without needing to know their specific types.

**Interface:**
- \`Shape\` — must declare three methods:
  - \`double area()\`
  - \`double perimeter()\`
  - \`String draw()\`

**Concrete Classes (each implements \`Shape\`):**
- \`Circle(double radius)\` — \`draw()\` returns \`"Circle"\`. Area: $\\pi \\cdot r^2$. Perimeter: $2\\pi \\cdot r$.
- \`Rectangle(double width, double height)\` — \`draw()\` returns \`"Rectangle"\`. Area: $w \\cdot h$. Perimeter: $2(w+h)$.
- \`Triangle(double a, double b, double c)\` — \`draw()\` returns \`"Triangle"\`. Area: use Heron's formula $S = \\sqrt{p(p-a)(p-b)(p-c)}$ where $p$ is the semi-perimeter. Perimeter: $a+b+c$.

**Context class:**
- \`DrawingBoard()\` — Initializes an empty drawing board.
- \`void addShape(Shape shape)\` — Adds a shape to the board.
- \`String showAllShapes()\` — Returns a formatted string array of the names of the shapes drawn, in the order they were added. E.g., \`"[Circle, Rectangle]"\`.
- \`double totalArea()\` — Returns the sum of the areas of all shapes currently on the board.`,
  constraints: [
    'Shape dimensions (radius, width, a, b, c) are positive floating-point values.',
    'For the Triangle, expect the inputs $a, b, c$ to always form a valid triangle.',
    'At most \`1000\` calls will be made to \`DrawingBoard\` methods.'
  ],
  examples: [
    {
      input: `DrawingBoard board = new DrawingBoard();
board.addShape(new Rectangle(2, 3));
board.addShape(new Circle(5));
board.showAllShapes();       // return "[Rectangle, Circle]"
board.totalArea();           // return 84.53981633974483`,
      output: '[null, null, null, "[Rectangle, Circle]", 84.53981633974483]'
    },
    {
      input: `DrawingBoard board = new DrawingBoard();
board.addShape(new Triangle(3, 4, 5));
board.addShape(new Rectangle(10, 10));
board.showAllShapes();       // return "[Triangle, Rectangle]"
board.totalArea();           // return 106.0`,
      output: '[null, null, null, "[Triangle, Rectangle]", 106.0]'
    },
  ],

  starter: {
    file: 'DrawingBoard.java',
    code: `import java.util.ArrayList;
import java.util.List;

interface Shape {
    double area();
    double perimeter();
    String draw();
}

class Circle {
}

class Rectangle {
}

class Triangle {
}

class DrawingBoard {

    public DrawingBoard() {
        
    }
    
    public void addShape(Shape shape) {
        
    }
    
    public String showAllShapes() {
        return "";
    }
    
    public double totalArea() {
        return 0.0;
    }
}`,
  },

  requiredStructure: {
    className: 'DrawingBoard',
    requiredMethods: [
      'DrawingBoard()',
      'void addShape(Shape shape)',
      'String showAllShapes()',
      'double totalArea()'
    ],
  },

  evaluation: {
    comparator: 'exact_json',
    javaGenerator: {
      count: 20,
      seed: 88776655,
      namePrefix: 'test-',
      visibility: 'hidden',
      genMethodBody: `
        for (int i = 0; i < 20; i++) {
            int opsCount = (i < 5) ? 20 : 200;
            DrawingBoard obj = new DrawingBoard();

            // Reference state
            double currentTotalArea = 0.0;
            java.util.List<String> names = new java.util.ArrayList<>();

            java.util.List<Object> expTrace = new java.util.ArrayList<>();
            java.util.List<Object> actTrace = new java.util.ArrayList<>();
            expTrace.add(null);
            actTrace.add(null);

            for (int k = 0; k < opsCount; k++) {
                int traceSizeBefore = expTrace.size();
                int type = rng.nextInt(3);

                if (type == 0) { // addShape
                    int shapeType = rng.nextInt(3);
                    Shape s;
                    if (shapeType == 0) { // Circle
                        double r = rng.nextInt(20) + 1;
                        s = new Circle(r);
                        currentTotalArea += Math.PI * r * r;
                        names.add("Circle");
                    } else if (shapeType == 1) { // Rectangle
                        double w = rng.nextInt(20) + 1;
                        double h = rng.nextInt(20) + 1;
                        s = new Rectangle(w, h);
                        currentTotalArea += w * h;
                        names.add("Rectangle");
                    } else { // Triangle
                        // 3,4,5 scaling
                        double m = rng.nextInt(10) + 1;
                        double a = 3 * m;
                        double b = 4 * m;
                        double c = 5 * m;
                        s = new Triangle(a, b, c);
                        double p = (a + b + c) / 2.0;
                        currentTotalArea += Math.sqrt(p * (p - a) * (p - b) * (p - c));
                        names.add("Triangle");
                    }
                    obj.addShape(s);
                } else if (type == 1) { // showAllShapes
                    String expectedAns = "[" + String.join(", ", names) + "]";
                    String actualAns = obj.showAllShapes();

                    expTrace.add(expectedAns);
                    actTrace.add(actualAns);
                } else { // totalArea
                    double expectedAns = currentTotalArea;
                    double actualAns = obj.totalArea();

                    // Compare with small epsilon for floating point representation differences
                    expTrace.add(expectedAns);
                    actTrace.add(actualAns);
                }
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
