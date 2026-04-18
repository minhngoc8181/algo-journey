# Hướng dẫn hỗ trợ `Scanner(System.in)` và truyền dữ liệu vào `stdin` trong demo TeaVM

## 1. Mục tiêu

Tài liệu này mô tả cách để code Java chạy bằng TeaVM trong trình duyệt vẫn dùng được:

```java
Scanner sc = new Scanner(System.in);
```

và cho phép phía JavaScript chủ động truyền dữ liệu vào `stdin`.

Ngữ cảnh của workspace hiện tại:

- Demo chạy trong trình duyệt qua [teavm-javac-demo.html](teavm-javac-demo.html)
- Java source được biên dịch ngay trong browser bằng `teavm-javac`
- Chương trình Java sau đó được chạy trong `Worker`
- Demo hiện tại chỉ bắt `stdout/stderr`, chưa có cơ chế cấp dữ liệu cho `System.in`

## 2. Vấn đề gốc

Trong browser, không có `stdin` thật như khi chạy JVM trên terminal.

Hiện tại demo chỉ làm các việc sau:

1. Nạp Java source từ editor.
2. Sinh thêm `RunnerMain.java`.
3. Compile sang WebAssembly.
4. Chạy WebAssembly trong `Worker`.
5. Thu kết quả bằng cách chặn `console.log` và `console.error`.

Điểm còn thiếu là:

- `System.in` chưa được gắn vào một nguồn dữ liệu nào do UI cung cấp.
- Vì vậy `Scanner(System.in)` không có stream đầu vào đáng tin cậy để đọc.

## 3. Kết luận kỹ thuật

### Giải pháp phù hợp nhất cho demo này

Với kiến trúc hiện tại, cách ổn định và đơn giản nhất là:

1. Để JavaScript nhận chuỗi input từ UI.
2. Khi sinh `RunnerMain.java`, nhúng chuỗi input đó vào Java source.
3. Trong `RunnerMain.main(...)`, tạo `ByteArrayInputStream` từ chuỗi input.
4. Gọi `System.setIn(...)` trước khi gọi code người dùng.

Khi đó, mọi đoạn code như sau sẽ hoạt động bình thường:

```java
Scanner sc = new Scanner(System.in);
int n = sc.nextInt();
String s = sc.next();
```

### Vì sao đây là phương án nên dùng

- Không cần sửa TeaVM runtime.
- Không cần monkey patch WebAssembly internals.
- Không phụ thuộc vào API `stdin` riêng của TeaVM vì runtime hiện có trong repo chỉ thể hiện rõ hook cho `stdout/stderr`.
- Tương thích với `Scanner`, `BufferedReader`, `InputStreamReader`, `System.in.read()`.
- Dễ kiểm soát test case theo kiểu online judge.

## 4. Khi nào cách này đủ dùng

Giải pháp `ByteArrayInputStream + System.setIn(...)` phù hợp khi input có thể chuẩn bị sẵn trước lúc chạy chương trình, ví dụ:

- Bài algorithm đọc toàn bộ input rồi in output.
- Demo compile-run với một ô nhập `stdin`.
- Hidden test hoặc visible test có dữ liệu cố định.

Nó không phù hợp cho các kịch bản cần nhập tương tác từng bước như:

- Chương trình in prompt, chờ người dùng nhập tiếp.
- Muốn stream dữ liệu dần dần sau khi chương trình đã bắt đầu chạy.

Với các trường hợp đó cần một `InputStream` tùy biến có hàng đợi dữ liệu từ JS. Phần này được mô tả ở mục 10.

## 5. Thiết kế đề xuất cho workspace hiện tại

### Phương án A: giữ demo hiện tại, chỉ thêm `stdin`

Phù hợp nếu bạn vẫn muốn giữ cơ chế sinh `RunnerMain.java` và harness tự gọi code người dùng.

Luồng xử lý:

1. Thêm một `textarea` để nhập `stdin`.
2. Lấy giá trị `stdin` từ UI trước khi compile.
3. Escape chuỗi này thành Java string literal an toàn.
4. Truyền vào `createRunnerMainSource(stdinText)`.
5. Trong `RunnerMain.main`, gọi `System.setIn(...)` trước khi gọi `Solution`.

### Phương án B: chuyển sang mô hình chạy `main`

Phù hợp hơn cho các bài toán chuẩn dùng `Scanner(System.in)`.

Luồng xử lý:

1. Người dùng viết `class Main` hoặc `class Solution` có `public static void main(String[] args)`.
2. JS truyền `stdin` vào `RunnerMain`.
3. `RunnerMain` chỉ có nhiệm vụ set `System.in`, sau đó gọi `Main.main(new String[0])` hoặc `Solution.main(new String[0])`.
4. So sánh `stdout` với expected output.

Nếu mục tiêu là hỗ trợ bài toán nhập/xuất chuẩn, đây là hướng nên dùng thay vì harness kiểu `firstIndexOf(...)` hiện tại.

## 6. Cách làm chi tiết với file hiện tại

File cần chỉnh là [teavm-javac-demo.html](teavm-javac-demo.html).

### Bước 1: thêm ô nhập `stdin`

Thêm một textarea trong phần UI, ví dụ:

```html
<h2>Standard Input</h2>
<textarea id="stdinInput" spellcheck="false" aria-label="Standard input"></textarea>
```

Nếu muốn dễ dùng hơn, có thể đặt cạnh editor code hoặc bên panel phải.

### Bước 2: lấy tham chiếu DOM

Thêm đoạn:

```javascript
const stdinInput = document.getElementById('stdinInput');
```

### Bước 3: tạo hàm escape chuỗi sang Java string literal

Không được nhúng raw text trực tiếp vào Java source vì sẽ vỡ khi có:

- dấu `\`
- dấu `"`
- xuống dòng
- ký tự `\r`
- tab

Hàm đề xuất:

```javascript
function toJavaStringLiteral(value) {
  return '"' + String(value)
    .replaceAll('\\', '\\\\')
    .replaceAll('"', '\\"')
    .replaceAll('\r', '\\r')
    .replaceAll('\n', '\\n')
    .replaceAll('\t', '\\t') + '"';
}
```

Nếu cần Unicode tuyệt đối an toàn, có thể escape thêm các ký tự ngoài ASCII. Tuy nhiên với tiếng Việt và input thông thường, cách trên là đủ trong đa số trường hợp.

### Bước 4: sửa `createRunnerMainSource` để nhận `stdin`

Hiện tại hàm đang là:

```javascript
function createRunnerMainSource() {
  return `public class RunnerMain {
    ...
  }`;
}
```

Hãy đổi thành:

```javascript
function createRunnerMainSource(stdinText) {
  const stdinLiteral = toJavaStringLiteral(stdinText);
  return `
import java.io.ByteArrayInputStream;
import java.nio.charset.StandardCharsets;

public class RunnerMain {
    public static void main(String[] args) {
        String input = ${stdinLiteral};
        System.setIn(new ByteArrayInputStream(input.getBytes(StandardCharsets.UTF_8)));

        Solution s = new Solution();
        runCase("case1", s.firstIndexOf(new int[]{1, 2, 3}, 2), 1);
        runCase("case2", s.firstIndexOf(new int[]{5, 5, 5}, 7), -1);
        System.out.println("__AJ_DONE__");
    }

    static void runCase(String id, int actual, int expected) {
        boolean pass = actual == expected;
        System.out.println("AJ_CASE|" + id + "|" + pass + "|" + actual + "|" + expected);
    }
}`;
}
```

### Bước 5: truyền `stdin` vào lúc compile

Đổi hàm compile từ:

```javascript
function compileJava(solutionSource) {
```

thành:

```javascript
function compileJava(solutionSource, stdinText) {
```

và đổi chỗ add file:

```javascript
compilerInstance.addSourceFile('RunnerMain.java', createRunnerMainSource(stdinText));
```

### Bước 6: đọc `stdin` trong `onRun()`

Trong `onRun`, thêm:

```javascript
const stdinText = stdinInput.value || '';
```

và gọi compile bằng:

```javascript
const compileResult = compileJava(solutionSource, stdinText);
```

### Bước 7: thêm sample cho `Scanner`

Nếu muốn kiểm chứng nhanh, thêm một sample như sau:

```java
import java.util.Scanner;

class Solution {
    public int firstIndexOf(int[] numbers, int target) {
        Scanner sc = new Scanner(System.in);
        int bonus = sc.nextInt();
        for (int i = 0; i < numbers.length; i++) {
            if (numbers[i] + bonus == target) {
                return i;
            }
        }
        return -1;
    }
}
```

với `stdin`:

```text
0
```

Lưu ý: demo hiện tại đang dùng harness hàm `firstIndexOf(...)`, nên ví dụ `Scanner` ở đây chỉ nhằm chứng minh `System.in` đã hoạt động. Nó chưa phải mô hình chấm stdin/stdout chuẩn.

## 7. Phương án tốt hơn cho bài toán chuẩn dùng `Scanner`

Nếu mục tiêu là hỗ trợ các bài lập trình kiểu:

```java
import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        System.out.println(a + b);
    }
}
```

thì nên bỏ harness `firstIndexOf(...)` và dùng runner gọi `main(...)`.

Ví dụ `RunnerMain`:

```java
import java.io.ByteArrayInputStream;
import java.nio.charset.StandardCharsets;

public class RunnerMain {
    public static void main(String[] args) {
        String input = "2 3\n";
        System.setIn(new ByteArrayInputStream(input.getBytes(StandardCharsets.UTF_8)));
        Main.main(new String[0]);
    }
}
```

Lúc này luồng làm việc rất rõ ràng:

1. Người dùng nhập source.
2. Người dùng nhập `stdin`.
3. Demo set `System.in`.
4. Demo gọi `main(...)`.
5. JS thu `stdout`.
6. So sánh với expected output nếu cần.

Đây là mô hình phù hợp nhất nếu bạn muốn hỗ trợ `Scanner` một cách tự nhiên.

## 8. Vì sao không nên cố “hook stdin” trực tiếp trong runtime hiện tại

Bạn có thể nghĩ đến việc sửa TeaVM runtime hoặc patch WebAssembly import để hỗ trợ `stdin` như native runtime. Về kỹ thuật điều đó có thể làm được, nhưng không nên là bước đầu tiên vì:

- Khó bảo trì.
- Phụ thuộc internals của TeaVM runtime.
- Dễ gãy khi nâng version asset trong [assets/teavm/compiler.wasm-runtime.js](assets/teavm/compiler.wasm-runtime.js).
- Không mang lại lợi ích thực tế tương xứng cho bài toán nhập liệu chuẩn.

Với demo compile-run trong browser, `System.setIn(new ByteArrayInputStream(...))` là điểm can thiệp hợp lý nhất.

## 9. Lưu ý quan trọng khi triển khai

### 9.1 Escape input đúng cách

Nếu không escape chuẩn, input chứa newline hoặc dấu `\` sẽ làm `RunnerMain.java` lỗi compile.

### 9.2 Chốt encoding

Nên luôn dùng:

```java
StandardCharsets.UTF_8
```

để tránh lệch ký tự khi input có tiếng Việt hoặc ký tự đặc biệt.

### 9.3 Reset `System.in` cho mỗi lần run

Mỗi lần bấm Run phải sinh lại `RunnerMain.java` hoặc ít nhất phải set lại `System.in` bằng input mới.

### 9.4 Không dùng prompt() cho bài toán chấm tự động

`prompt()` chỉ hợp cho demo tương tác đơn giản. Nó không phù hợp nếu bạn cần:

- chạy hidden tests
- chạy nhiều test liên tiếp
- timeout rõ ràng
- replay input nhiều lần

### 9.5 Timeout vẫn cần giữ nguyên

Việc hỗ trợ `stdin` không thay thế cơ chế chống treo. Vẫn nên giữ chạy trong `Worker` và terminate khi quá thời gian.

## 10. Nếu cần truyền `stdin` động sau khi chương trình đã bắt đầu chạy

Đây là nhu cầu nâng cao: chương trình Java chạy trước, sau đó JS mới bơm thêm dữ liệu từng phần.

Lúc này cần xây một `InputStream` tùy biến, ví dụ `InteractiveInputStream`, có hàng đợi byte nội bộ.

Ý tưởng:

1. Java tạo một `InputStream` custom.
2. Stream này đọc byte từ queue.
3. JS có API gọi vào Java để append dữ liệu mới vào queue.
4. `Scanner(System.in)` đọc từ stream này.

### Khung Java minh họa

```java
import java.io.InputStream;
import java.util.ArrayDeque;
import java.util.Queue;

public class InteractiveInputStream extends InputStream {
    private final Queue<Integer> queue = new ArrayDeque<>();
    private boolean closed;

    public synchronized void append(byte[] data) {
        for (byte b : data) {
            queue.add(b & 0xFF);
        }
        notifyAll();
    }

    public synchronized void finish() {
        closed = true;
        notifyAll();
    }

    @Override
    public synchronized int read() {
        while (queue.isEmpty()) {
            if (closed) {
                return -1;
            }
            try {
                wait();
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                return -1;
            }
        }
        return queue.remove();
    }
}
```

### Nhưng có một giới hạn thực tế

Trong môi trường browser + TeaVM, `wait()/notify()` và blocking I/O cần được kiểm tra rất kỹ với backend đang dùng. Nếu runtime hoặc backend không hỗ trợ blocking semantics như JVM thường, cách này sẽ phức tạp hơn đáng kể.

Vì vậy:

- Nếu bạn chỉ cần bài toán stdin/stdout chuẩn: dùng `ByteArrayInputStream`.
- Nếu bạn thực sự cần interactive stdin: mới đầu tư stream tùy biến + JS interop.

## 11. Kiến trúc khuyến nghị

### Mức 1: nhanh, ổn định, đủ cho judge

- UI có ô nhập source
- UI có ô nhập `stdin`
- JS sinh `RunnerMain.java`
- `RunnerMain` dùng `System.setIn(new ByteArrayInputStream(...))`
- Thu `stdout`
- So sánh output

Đây là phương án nên triển khai trước.

### Mức 2: chuẩn online judge hơn

- Chạy `main(...)` thay vì harness gọi method cụ thể
- Cho phép nhập expected output
- Có nhiều test case
- Mỗi test case có một `stdin` riêng

### Mức 3: interactive stdin

- Dùng `InputStream` tùy biến
- Có queue dữ liệu
- Có API JS để append dữ liệu sau khi start
- Xử lý đóng luồng và timeout cẩn thận

## 12. Mẫu thay đổi tối thiểu nên áp dụng

Nếu chỉ cần đạt mục tiêu “`Scanner(System.in)` đọc được input do UI cung cấp”, bộ thay đổi tối thiểu là:

1. Thêm `textarea` cho stdin trong [teavm-javac-demo.html](teavm-javac-demo.html).
2. Thêm `toJavaStringLiteral(...)` trong [teavm-javac-demo.html](teavm-javac-demo.html).
3. Đổi `createRunnerMainSource()` thành `createRunnerMainSource(stdinText)` trong [teavm-javac-demo.html](teavm-javac-demo.html).
4. Bên trong `RunnerMain.main(...)`, gọi `System.setIn(new ByteArrayInputStream(...))`.
5. Truyền `stdinText` từ `onRun()` vào `compileJava(...)`.

Chỉ vậy là `Scanner(System.in)` đã dùng được.

## 13. Ví dụ hoàn chỉnh tối giản

### Java người dùng

```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        System.out.println(a + b);
    }
}
```

### Input từ UI

```text
10 32
```

### Runner sinh động

```java
import java.io.ByteArrayInputStream;
import java.nio.charset.StandardCharsets;

public class RunnerMain {
    public static void main(String[] args) {
        String input = "10 32\n";
        System.setIn(new ByteArrayInputStream(input.getBytes(StandardCharsets.UTF_8)));
        Main.main(new String[0]);
    }
}
```

### Kết quả mong đợi

```text
42
```

## 14. Khuyến nghị cuối cùng

Nếu mục tiêu của bạn là hỗ trợ `Scanner` trong demo TeaVM này, hãy triển khai theo thứ tự sau:

1. Áp dụng `System.setIn(new ByteArrayInputStream(...))` trong `RunnerMain`.
2. Thêm ô nhập `stdin` trong UI.
3. Nếu muốn chấm bài stdin/stdout chuẩn, chuyển từ harness gọi method sang harness gọi `main(...)`.
4. Chỉ xây stdin tương tác động khi có yêu cầu thật sự.

## 15. Tóm tắt ngắn

- Browser không có `stdin` JVM thật.
- TeaVM demo hiện tại mới bắt `stdout/stderr`.
- Cách đúng cho use case này là tự cấp `System.in` bằng `ByteArrayInputStream`.
- JS truyền chuỗi input, Java set lại `System.in`, `Scanner(System.in)` sẽ hoạt động.
- Nếu cần tương tác từng bước sau khi chương trình đã chạy, phải dùng `InputStream` tùy biến và mức độ phức tạp cao hơn.
