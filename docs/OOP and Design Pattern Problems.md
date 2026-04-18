# OOP and Design Pattern Problems (CSE202)

> Tài liệu thiết kế bài tập thực hành OOP/Design Pattern trên nền tảng Algo Journey.

---

## Implementation Rules

### File Structure

Mỗi bài tập gồm **3 files** trong `src/content/problems/design/`:

| File | Mục đích |
|------|----------|
| `{slug}.exercise.ts` | Định nghĩa bài: statement, starter code, requiredStructure, javaGenerator |
| `{slug}.gen.ts` | Test cases (visible + hidden) dạng operations |
| `{slug}.solution.java` | Lời giải tham chiếu (reference solution) |

### Tags & Metadata

- **Tag**: `cse202` (thuộc khóa OOP and Design Pattern, KHÔNG phải `cse201`)
- **Topic**: `design`
- **Mode**: `class_implementation` (harness dùng operations-based testing)

### Starter Code — Nguyên tắc tối giản

> **Mục tiêu**: Starter code chỉ cung cấp đủ skeleton để sinh viên hiểu cấu trúc, KHÔNG cho sẵn code thực thi.

1. **Interface**: Khai báo đầy đủ method signature (đây là hợp đồng — sinh viên cần thấy).
2. **Concrete classes**: Chỉ khai báo `class ClassName { }` — **KHÔNG** thêm `implements`, **KHÔNG** thêm methods. Sinh viên phải đọc đề và tự bổ sung.
3. **Context class** (class chính bị test): Giữ constructor + method signatures với body rỗng. Đây là class mà harness gọi trực tiếp.
4. **Tất cả classes** nằm trong 1 file duy nhất, **không dùng `public`** modifier (Java cho phép nhiều top-level class trong cùng file nếu không class nào là `public`).

**Ví dụ starter code tốt:**
```java
interface PaymentStrategy {
    String pay(int amount);
}

class CashPayment {
}

class CreditCardPayment {
}

class Order {
    public Order(int amount) { }
    public void setPaymentStrategy(PaymentStrategy strategy) { }
    public String checkout() { return ""; }
}
```

### Testing — Cách kiểm thử

#### `requiredStructure`
- `className`: Tên class chính (context class) — harness dùng để tạo object.
- `requiredMethods`: Danh sách method signatures (bao gồm constructor). Harness parse signatures này để map operations → Java code.

#### Operations-based Tests (`.gen.ts`)
Mỗi test case là một mảng `operations` + `expected`:
```typescript
operations: [
  ['Order', 100],                              // constructor
  ['setPaymentStrategy', 'new CashPayment()'], // void method
  ['checkout'],                                // return String
],
expected: [null, null, 'Paid 100 using Cash']
```

**⚠️ Trick quan trọng**: Khi method nhận tham số kiểu interface/class (ví dụ `PaymentStrategy`), harness dùng `toJavaLiteral(value, type)`. Với type không phải primitive, nó fallback về `String(value)` — nghĩa là value `'new CashPayment()'` sẽ trở thành raw Java code `new CashPayment()` trong harness. Tận dụng điều này để truyền object expressions.

#### `javaGenerator` (Hidden stress tests)
- Viết Java code trực tiếp trong `genMethodBody`.
- Có quyền tạo các object bất kỳ (không giới hạn bởi `toJavaLiteral`).
- Pattern chuẩn: tạo reference model song song với student object, random operations, so sánh kết quả.
- In kết quả theo format: `System.out.println("AJ|test-" + i + "|" + pass + "|" + actual + "|" + expected);`

### Thiết kế bài — Checklist

- [ ] **Statement rõ ràng**: Liệt kê interface + mỗi concrete class + context class + method behavior.
- [ ] **Return String cho verification**: Tránh void methods khó test. Nếu method cần trả output, trả `String` mô tả hành vi (ví dụ `"Paid 100 using Cash"`).
- [ ] **Edge case**: Xử lý khi chưa set strategy / null state → trả message mặc định.
- [ ] **Multiple examples**: Ít nhất 2 ví dụ — 1 happy path, 1 edge case.
- [ ] **Hints progressive**: Từ gợi ý chung → cụ thể, không spoil solution.

---

## 1. Payment Method - Strategy Pattern

Mô tả: Một hệ thống thanh toán cho phép người dùng chọn nhiều cách thanh toán khác nhau như tiền mặt, thẻ ngân hàng, ví điện tử.

OOP/Pattern:
- Abstraction
- Polymorphism
- Strategy Pattern

Interface:
- PaymentStrategy
  - pay(amount)

Classes:
- CashPayment implements PaymentStrategy
- CreditCardPayment implements PaymentStrategy
- EWalletPayment implements PaymentStrategy
- Order
  - setPaymentStrategy(strategy)
  - checkout()

Yêu cầu chính:
- Order không cần biết chi tiết từng cách thanh toán.
- Có thể thêm phương thức thanh toán mới mà không sửa Order.

## 2. Shape Drawing - Polymorphism

Mô tả: Quản lý các hình học cơ bản như hình tròn, hình chữ nhật, hình tam giác. Mỗi hình có cách tính diện tích và chu vi riêng.

OOP/Pattern:
- Inheritance
- Polymorphism
- Abstraction

Interface:
- Shape
  - area()
  - perimeter()
  - draw()

Classes:
- Circle implements Shape
- Rectangle implements Shape
- Triangle implements Shape
- DrawingBoard
  - addShape(shape)
  - showAllShapes()
  - totalArea()

Yêu cầu chính:
- DrawingBoard xử lý danh sách Shape mà không cần biết cụ thể đó là Circle hay Rectangle.



## 3. Notification System - Observer Pattern

Mô tả: Khi có thông báo mới, hệ thống gửi thông báo đến nhiều kênh khác nhau như email, SMS, app notification.

OOP/Pattern:
- Interface
- Loose coupling
- Observer Pattern

Interface:
- Observer
  - update(message)

Classes:
- EmailNotifier implements Observer
- SmsNotifier implements Observer
- AppNotifier implements Observer
- NotificationService
  - addObserver(observer)
  - removeObserver(observer)
  - notifyAll(message)

Yêu cầu chính:
- Có thể thêm kênh thông báo mới mà không sửa NotificationService.



## 4. Undo/Redo Text Editor - Command Pattern

Mô tả: Một trình soạn thảo đơn giản hỗ trợ các thao tác thêm chữ, xóa chữ, undo và redo.

OOP/Pattern:
- Encapsulation
- Command Pattern
- Stack usage

Interface:
- Command
  - execute()
  - undo()

Classes:
- AddTextCommand implements Command
- DeleteTextCommand implements Command
- TextEditor
  - addText(text)
  - deleteText(length)
  - getContent()
- CommandManager
  - executeCommand(command)
  - undo()
  - redo()

Yêu cầu chính:
- Mỗi hành động được đóng gói thành một object.
- Undo/redo không nằm trực tiếp trong TextEditor.



## 5. Vehicle Factory - Factory Method Pattern

Mô tả: Hệ thống tạo các loại phương tiện như xe máy, ô tô, xe đạp dựa trên loại người dùng nhập vào.

OOP/Pattern:
- Abstraction
- Polymorphism
- Factory Method Pattern

Interface:
- Vehicle
  - start()
  - stop()
  - getInfo()

Classes:
- Bike implements Vehicle
- Motorbike implements Vehicle
- Car implements Vehicle
- VehicleFactory
  - createVehicle(type)

Yêu cầu chính:
- Code bên ngoài không gọi trực tiếp new Car(), new Bike().
- Việc tạo object được gom vào Factory.



## 6. Coffee Order - Decorator Pattern

Mô tả: Một ly cà phê có thể được thêm sữa, đường, kem, chocolate. Mỗi topping làm thay đổi giá và mô tả sản phẩm.

OOP/Pattern:
- Composition
- Open/Closed Principle
- Decorator Pattern

Interface:
- Coffee
  - getDescription()
  - getCost()

Classes:
- BasicCoffee implements Coffee
- MilkDecorator implements Coffee
- SugarDecorator implements Coffee
- CreamDecorator implements Coffee
- ChocolateDecorator implements Coffee

Yêu cầu chính:
- Có thể kết hợp nhiều topping linh hoạt.
- Không cần tạo quá nhiều class như MilkSugarCoffee, MilkCreamCoffee.


## 7. Simple Game Character - State Pattern

Mô tả: Nhân vật trong game có nhiều trạng thái như Normal, Poisoned, Stunned, SpeedBoost. Mỗi trạng thái ảnh hưởng khác nhau đến hành động move() và attack().

OOP/Pattern:
- Encapsulation
- Polymorphism
- State Pattern

Interface:
- CharacterState
  - move(character)
  - attack(character)

Classes:
- NormalState implements CharacterState
- PoisonedState implements CharacterState
- StunnedState implements CharacterState
- SpeedBoostState implements CharacterState
- GameCharacter
  - setState(state)
  - move()
  - attack()

Yêu cầu chính:
- Không dùng nhiều if-else trong GameCharacter.
- Hành vi thay đổi theo object trạng thái.


## 8. Report Exporter - Template Method Pattern

Mô tả: Hệ thống xuất báo cáo ra nhiều định dạng như PDF, Excel, HTML. Các bước chung giống nhau: lấy dữ liệu, xử lý dữ liệu, định dạng, xuất file.

OOP/Pattern:
- Inheritance
- Code reuse
- Template Method Pattern

Abstract Class:
- ReportExporter
  - export()
  - loadData()
  - processData()
  - formatData()
  - saveFile()

Classes:
- PdfReportExporter extends ReportExporter
- ExcelReportExporter extends ReportExporter
- HtmlReportExporter extends ReportExporter

Yêu cầu chính:
- export() định nghĩa khung xử lý chung.
- Các subclass chỉ thay đổi những bước cụ thể.


## 9. Student Grading System - Interface + Polymorphism

Mô tả: Một hệ thống chấm điểm có nhiều cách tính điểm khác nhau: điểm trung bình, điểm có trọng số, điểm pass/fail.

OOP/Pattern:
- Interface
- Polymorphism
- Strategy Pattern

Interface:
- GradingPolicy
  - calculateGrade(scores)

Classes:
- AverageGradingPolicy implements GradingPolicy
- WeightedGradingPolicy implements GradingPolicy
- PassFailGradingPolicy implements GradingPolicy
- Course
  - setGradingPolicy(policy)
  - calculateStudentGrade(student)

Yêu cầu chính:
- Course không phụ thuộc vào một công thức chấm điểm cố định.


## 10. File Reader Adapter - Adapter Pattern

Mô tả: Hệ thống cần đọc dữ liệu từ nhiều nguồn khác nhau như TXT, CSV, JSON nhưng muốn dùng chung một interface.

OOP/Pattern:
- Interface
- Adapter Pattern
- Loose coupling

Interface:
- DataReader
  - readData()

Classes:
- TxtReader implements DataReader
- CsvReader implements DataReader
- JsonLibraryReader
  - loadJson()
- JsonReaderAdapter implements DataReader
- DataImportService
  - importData(reader)

Yêu cầu chính:
- JsonLibraryReader có sẵn method khác tên, nên cần Adapter để dùng chung với DataReader.

