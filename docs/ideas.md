# ideas.md

Tài liệu này đóng vai trò là Lộ trình phát triển (Roadmap) và Nhật ký tính năng (Feature Tracker) cho nền tảng Algo Journey kể từ phiên bản V2.
Nó không chỉ dành để brainstorm các tính năng mới mà còn ghi nhận chi tiết về thiết kế, mục tiêu tích hợp chương trình học (Curriculum), và các chuẩn mực kỹ thuật (Engineering Standards) như tính nhất quán của hệ thống PC Judge.

---

## Trạng thái thực hiện

| # | Tính năng | Trạng thái | Ghi chú |
|---|-----------|------------|---------|
| 1 | `_starter.java` cho OfflineJudge | ✅ **Hoàn thành** | Đã tích hợp CLI test & template chuẩn |
| 2 | Thêm bài Graph và Tree cho CSE202 | 🔄 **Đang làm** | Binary Tree (8 bài) đã xong toàn diện; Graph chờ thực hiện |
| 3 | Hỗ trợ đa ngôn ngữ: JS và Python | ⬜ Chưa làm | — |
| 4 | Hỗ trợ bài SQL / Database | ⬜ Chưa làm | Cần query runner riêng |
| 5 | Hỗ trợ bài về Testing | ⬜ Chưa làm | — |
| 6 | Cải thiện Loader / Runner | ✅ **Hoàn thành** | Đảm bảo tính nhất quán (Consistency) và tạo thư viện Helper dùng chung |
| 7 | Tách biệt content và code | ⬜ Chưa làm | — |
| 8 | Cho xem solution sau đủ cố gắng | ✅ **Hoàn thành** | Nút 🔒 Solution; cấu hình `config.ts → solutionAccess` |
| 9 | Download toàn bộ submissions | ✅ **Hoàn thành** | Nút 📥 Export → ZIP `.java` theo topic/problem/timestamp |
| 10 | Sinh prompt để AI hỗ trợ | ✅ **Hoàn thành** | 🤖 Ask AI (problem page) + 🧠 AI Progress (catalog stats-bar) |
| 11 | Nâng số bài lên 400+ | ⬜ Chưa làm | Xem chi tiết bên dưới — cần ~310 bài mới |
| 12 | Báo lỗi Runtime chi tiết hơn | ⬜ Chưa làm | — |

---

## 1. `_starter.java` cho OfflineJudge ✅

- Khi sinh OfflineJudge, nên có sẵn `_starter.java` để sinh viên load lên và bắt đầu code.
- File này đóng vai trò skeleton ban đầu, giúp workflow offline gần với bản web hơn.

**Đã thực hiện:** Mỗi folder `out/pc-judge/<id>/` giờ có thêm `_starter.java` — file sạch chứa
starter code kèm hướng dẫn ngắn gọn (copy → đổi tên → code → chạy grade.bat).
README.txt cũng được cập nhật để liệt kê file này.

---

## 2. Thêm bài `Graph` và `Tree` cho CSE202 🔄

- CSE202 là môn học trong chương trình và có cấu trúc dữ liệu cơ bản về graph và tree.
- Nên bổ sung nhóm bài này để nội dung bám sát chương trình giảng dạy hơn.

**Đã thực hiện (Giai đoạn 1 - Binary Tree):**
- Xây dựng hoàn chỉnh 8 bài luyện tập từ Traverse (Duyệt cây) đến thao tác trên BST (Binary Search Tree).
- Tích hợp chuẩn thẻ phân loại (tags filter) hiển thị theo thứ bậc (bst > binary-tree > tree) để sinh viên dễ dàng lọc bài trên UI hoặc CLI thông qua lệnh \`npm run pc-judge:coverage -- "--tags=cse202"\`.
- Tree Helper đã được module hoá và tiêm vào Test runner để đa dạng hóa hình thái test (ví dụ cây cực lớn với 65k Nodes chống tràn RAM/TLE).

---

## 3. Hỗ trợ đa ngôn ngữ: JavaScript và Python

- Có thể mở rộng hỗ trợ thêm JavaScript và Python.
- Mục tiêu là tái sử dụng catalog, workflow và engine hiện có cho nhiều ngôn ngữ.

---

## 4. Hỗ trợ bài SQL / Database

- Có thể bổ sung dạng bài SQL / Database như LeetCode.
- Sinh viên viết truy vấn, hệ thống chạy trên dữ liệu mẫu và so kết quả.

---

## 5. Hỗ trợ bài về Testing

- Có thể thêm dạng bài về testing.
- Ví dụ: sinh viên viết test đủ coverage, hoặc nghĩ ra testcase để làm lộ lỗi của code có sẵn.

---

## 6. Nhất quán (Consistency) giữa Web và PC Judge

- **Mục tiêu**: Tạo ra PC Judge minh bạch, đảm bảo tính nhất quán cao nhất giữa trải nghiệm biên dịch/chấm điểm trên Web (TeaVM) và PC Local (JDK).
- **Sự độc lập**: Các bài tập được sinh ra dưới dạng thư mục Java độc lập, cấu trúc rõ ràng. PC Judge không bị lệ thuộc vào mã nguồn nội bộ của công cụ sinh (\`harness-generator\`), bất kỳ ai cũng có thể giải phẫu hoặc thay đổi ruột file chấm test một cách tường minh.

### 6.1. Chuẩn hóa Thư viện Java Helper (Tree, Node)

- **Mục tiêu**: Tránh việc lặp lại định nghĩa class ở mọi nơi cho các cấu trúc dữ liệu cơ bản (\`TreeNode\`, \`ListNode\`...).
- **Chiến lược**: Xây dựng một module Java helper dùng chung chuẩn mực được tiêm (inject) vào PC Judge khi sinh bài tập.
- **Hỗ trợ sinh Test Đa dạng**: Cung cấp sẵn các thuật toán Helper để generate cấu trúc cây (Tree) nhiều hình thái phục vụ Stress Test hoặc Large-scale Test:
  - Cây hoàn hảo (Perfect / Complete Binary Tree).
  - Cây lệch cấu trúc (Trái hoàn toàn, Phải hoàn toàn, dạng danh sách liên kết thẳng).
  - Cây Random với các biến thể giá trị khó, số lượng Node cực lớn phục vụ triệt để đoạt Performance (Time Limit / TLE).

---

## 7. Tách biệt content và code

- Nên tách riêng content khỏi code ứng dụng.
- Hiện tại content đang được build cùng code, nên về lâu dài sẽ khó mở rộng và bảo trì.

---

## 8. Cho xem solution sau đủ cố gắng ✅

- Có thể cho sinh viên xem solution sau một số lần thử và một khoảng thời gian đủ dài.
- Mục tiêu là vẫn buộc sinh viên suy nghĩ trước khi xem đáp án.

**Đã thực hiện:**
- Nút **🔒 Solution** trong run-controls bar của problem page
- Unlock khi đủ điều kiện (mặc định: ≥5 lần thử hoặc đã AC)
- Thời gian tối thiểu: 60 phút kể từ lần thử đầu tiên (cấu hình trong `config.ts → solutionAccess`)
- Modal read-only hiển thị `.solution.java`; trạng thái unlock lưu vào IndexedDB

---

## 9. Cho phép download toàn bộ submissions ✅

- Nên cho phép export hoặc download toàn bộ submissions của sinh viên.
- Tính năng này hữu ích cho việc lưu trữ, chấm offline, hoặc phân tích quá trình học.

**Đã thực hiện:**
- Mỗi lần Run/Submit → snapshot code + kết quả lưu vào IndexedDB (max 50/bài)
- Nút **📥 Export** trong stats-bar → tải về `.zip` chứa file `.java` theo `{topic}/{problem}/{timestamp}_{run|submit}_{AC|WA|...}.java`
- Kèm `summary.md` tổng hợp progress theo topic

---

## 10. Sinh prompt để AI hỗ trợ ✅

- Có thể cho hệ thống sinh sẵn prompt để hỗ trợ sinh viên bằng AI.
- Prompt nên bám theo bài hiện tại, code hiện tại, và mức hỗ trợ mong muốn.

**Đã thực hiện:**
- **Nút 🤖 Ask AI** (problem page): 4 mức hỗ trợ — Hint / Explain / Debug / Review.
  Prompt bao gồm đề bài + code hiện tại + kết quả run gần nhất.
- **Nút 🧠 AI Progress** (catalog stats-bar): Tổng hợp toàn bộ progress (theo topic,
  difficulty, tags, learningGoals, danh sách bài chưa làm) thành 1 prompt để AI
  đánh giá trình độ, điểm yếu và gợi ý lộ trình học tiếp.

---

## 11. Nâng số bài tập lên 400+ ⬜

### Bối cảnh

Hiện tại platform có **92 bài** (tính đến tháng 4/2026). Mục tiêu là đạt **400+ bài** phủ đầy đủ kỹ năng lập trình trong chương trình CS/SWE — từ nền tảng cơ bản đến thuật toán nâng cao.

### Nguyên tắc thiết kế bài tập

- **Progressive difficulty**: Easy → Medium → Hard trong từng topic
- **Curriculum mapping**: Mỗi bài gắn tag môn học (`cse101`, `cse201`, `cse202`, `cse301`, `cse401`...)
- **Coverage balance**: Không có topic nào quá thưa (<5 bài) hoặc quá dày (>60 bài)
- **Real-world context**: Ưu tiên bài có ứng dụng thực tế, không chỉ là lý thuyết thuần túy
- **Independence**: Bài nào cũng có thể làm độc lập (prerequisites chỉ là gợi ý, không bắt buộc)

---

### Kế hoạch bổ sung theo Topic

#### Tóm tắt số lượng

| Topic / Module | Hiện có | Mục tiêu | Cần thêm | Môn học chính |
|---|---|---|---|---|
| **arrays** | 33 | 50 | 17 | CSE101, CSE201 |
| **strings** | 3 | 25 | 22 | CSE101, CSE201 |
| **loops & conditionals** | 3 | 20 | 17 | CSE101 |
| **math** | 3 | 20 | 17 | CSE101, CSE301 |
| **recursion** | 2 | 20 | 18 | CSE201 |
| **searching** | 1 | 15 | 14 | CSE201 |
| **sorting** | 2 | 20 | 18 | CSE201 |
| **linked-list** | 6 | 20 | 14 | CSE201 |
| **binary-tree** | 8 | 30 | 22 | CSE202 |
| **graph** | 0 | 30 | 30 | CSE202, CSE301 |
| **collections** | 0¹ | 25 | 25 | CSE201 |
| **heap / priority-queue** | 0 | 15 | 15 | CSE202 |
| **dynamic-programming** | 0 | 35 | 35 | CSE301 |
| **bit-manipulation** | 0 | 10 | 10 | CSE201, CSE301 |
| **two-pointers** | 0 | 15 | 15 | CSE201 |
| **sliding-window** | 0 | 15 | 15 | CSE201 |
| **mono-stack** | 6 | 12 | 6 | CSE202 |
| **design (OOP/Patterns)** | 25 | 40 | 15 | CSE302 |
| **TỔNG** | **92** | **407** | **~315** | |

> ¹ Hiện tại các bài `collections` nằm rải rác trong `arrays` và `design`.

---

### Chi tiết từng Topic

#### 🟢 arrays (thêm 17 bài)
Bổ sung các kỹ thuật còn thiếu:
- Prefix sum ứng dụng (range XOR, range product)
- Kadane's algorithm (max subarray sum)
- Two-pointer trên mảng không sắp xếp
- Matrix / 2D array (spiral order, rotate 90°, set zeroes)
- Interval problems (merge intervals, insert interval, meeting rooms)
- Dutch national flag (3-way partition)

#### 🟡 strings (thêm 22 bài)
Hiện chỉ có 3 bài rất cơ bản. Cần bổ sung:
- **Basic** (easy): anagram check, Roman→Integer, valid parentheses, longest common prefix, count words, capitalize words, compress string
- **Pattern** (medium): KMP / Rabin-Karp search, group anagrams, longest substring without repeat, minimum window substring
- **Advanced** (medium-hard): decode string, wildcard matching, edit distance

#### 🟢 loops & conditionals (thêm 17 bài)
Bổ sung bài nhập môn cho CSE101:
- Pattern in/out (tam giác, kim cương, số nguyên tố trong range)
- Number base conversion (decimal ↔ binary ↔ hex)
- Calendar / date logic
- Grade calculator, GPA, fee computation (real-world context)
- Leap year, day of week

#### 🟢 math (thêm 17 bài)
- Number theory: LCM, Euler's totient phi(n), prime factorization, sieve
- Combinatorics: nCr mod p, Pascal's triangle
- Matrix multiplication, exponentiation by squaring
- Geometry basics: point-in-circle, line intersection, convex hull area (cross product)
- Random / probability simulations

#### 🔵 recursion (thêm 18 bài)
- Permutations, combinations (backtracking)
- Tower of Hanoi
- N-Queens, Sudoku solver (backtracking)
- Generate all subsets / power set
- Flood fill, maze solving
- Merge sort (recursive)

#### 🟢 searching (thêm 14 bài)
- Binary search variants: search in rotated sorted array, find peak element, first/last occurrence, sqrt(x), find minimum in rotated array
- Ternary search
- Binary search on answer (koko eating bananas, capacity to ship packages, split array largest sum)

#### 🔵 sorting (thêm 18 bài)
- Merge sort, Quick sort, Heap sort (implementation)
- Counting sort, Radix sort, Bucket sort
- Sort by custom comparator (tasks by deadline + profit)
- Sort colors (Dutch flag), wiggle sort
- Meeting rooms II (sort + heap)

#### 🔵 linked-list (thêm 14 bài)
- Remove N-th node from end
- Add two numbers (LL representation)
- LRU / LFU cache (class_implementation)
- Flatten a multilevel doubly linked list
- Skip list insert/search (basic)
- Intersection of two linked lists

#### 🌳 binary-tree (thêm 22 bài)
- Level order / BFS traversal
- Zigzag level order
- Right side view
- Lowest Common Ancestor (LCA) của BST và general tree
- Diameter of binary tree
- Path sum I, II (root-to-leaf)
- Serialize / Deserialize binary tree
- BST: search, delete, validate (is valid BST)
- Count complete tree nodes
- Symmetric tree, same tree, mirror tree
- Binary tree to DLL

#### 🕸️ graph (thêm 30 bài) — **Topic mới**
Cần thêm `graph` vào `Topic` type:
- **Representation**: adjacency list, adjacency matrix, edge list
- **BFS / DFS**: connected components, bipartite check, word ladder
- **Shortest path**: Dijkstra, Bellman-Ford, Floyd-Warshall
- **Spanning tree**: Kruskal, Prim, Union-Find
- **Topological sort**: DFS-based, Kahn's algorithm (course schedule)
- **Cycle detection**: directed & undirected
- **Other**: number of islands (BFS on grid), clone graph, critical connections (bridges)

#### 📦 collections (thêm 25 bài) — **Topic mới**
Bài thực hành Java Collections Framework:
- `ArrayList`: add/remove/sort/search
- `LinkedList` as deque / queue
- `HashMap / TreeMap`: word frequency, group by key, LRU cache
- `HashSet / TreeSet`: unique values, intersection/union
- `PriorityQueue`: top-K elements, task scheduling
- `Deque / Stack`: bracket matching, sliding window max
- Iterator pattern, custom Comparator

#### 🏔️ heap / priority-queue (thêm 15 bài) — **Topic mới**
- K largest / K smallest elements
- Merge K sorted arrays/lists
- Top K frequent words/elements
- Median from data stream (design)
- Task scheduler
- Smallest range covering K lists
- Huffman encoding (concept + implementation)

#### 🧮 dynamic-programming (thêm 35 bài) — **Topic mới**
Đây là topic quan trọng nhất trong CSE301 / interview prep:
- **1D DP** (easy): Fibonacci, climbing stairs, house robber, coin change I, min cost climbing
- **2D DP** (medium): unique paths, edit distance, longest common subsequence (LCS), knapsack 0/1
- **String DP** (medium): palindromic substring, longest palindromic subsequence, wildcard/regex matching
- **Interval DP** (medium-hard): burst balloons, matrix chain multiplication
- **Tree DP**: max path sum, house robber III
- **DP on graphs**: longest path in DAG
- **Advanced** (hard): word break II, distinct subsequences, regular expression

#### 🔡 bit-manipulation (thêm 10 bài) — **Topic mới**
- Count set bits (Brian Kernighan), parity
- Single number I, II, III (XOR trick)
- Missing number / duplicate (XOR)
- Reverse bits, swap nibbles
- Power of 2, power of 4
- Bitmasking for subsets

#### 👆 two-pointers (thêm 15 bài) — **Topic mới**
- Two sum sorted, 3-sum, 4-sum
- Container with most water
- Trapping rain water
- Remove duplicates / specific value from sorted array
- Squares of sorted array
- Palindrome check (char-level two pointer)
- Valid palindrome II (allow one deletion)
- Dutch flag 3-way partition

#### 🪟 sliding-window (thêm 15 bài) — **Topic mới**
- Fixed size: max sum subarray of K, average of subarray of K
- Variable size: longest substring with K distinct characters, longest substring without repeat
- Minimum window substring
- Longest subarray with ones after replacement
- Fruits into baskets
- Find all anagrams in string

#### 🏗️ design / OOP / Patterns (thêm 15 bài)
Bổ sung thêm các design pattern quan trọng còn thiếu:
- **Creational**: Singleton, Builder, Abstract Factory
- **Structural**: Composite, Bridge, Flyweight, Proxy
- **Behavioral**: Visitor, Chain of Responsibility, Memento, Mediator, Iterator (custom)
- **System design light**: Rate Limiter, Parking Lot System, Elevator System

---

### Lộ trình ưu tiên

| Giai đoạn | Topic | Lý do ưu tiên |
|-----------|-------|---------------|
| **Phase 1** | two-pointers, sliding-window, strings | Nền tảng interview, thiếu nhiều nhất |
| **Phase 2** | searching, sorting, recursion | Bổ sung CSE201 đầy đủ |
| **Phase 3** | binary-tree (còn lại), graph | CSE202 — trọng tâm môn thuật toán |
| **Phase 4** | dynamic-programming | CSE301 — topic khó nhất, cần nhiều bài nhất |
| **Phase 5** | heap, collections, bit-manipulation | Hoàn thiện coverage |
| **Phase 6** | design (thêm patterns), loops, math | Polishing |

### Tiêu chuẩn chất lượng cho mỗi bài mới

- [ ] Có ít nhất 3 visible test + 20 hidden test (hoặc javaGenerator)
- [ ] `learningGoals` rõ ràng (1–3 mục)
- [ ] `prerequisites` liên kết đúng với bài dễ hơn
- [ ] `tags` include môn học (`cse201`, …) và kỹ thuật chính
- [ ] `hints` có 3–5 gợi ý theo bước
- [ ] `summary` 1 câu, dễ đọc trên catalog
- [ ] PC Judge package được generate (Runner.java + TreeNode/ListNode nếu cần)
- [ ] Solution `.solution.java` có sẵn để test reference

---

## 12. Báo lỗi Runtime chi tiết hơn ⬜

Hiện tại khi sinh viên mắc lỗi runtime — `NullPointerException`, `ArrayIndexOutOfBoundsException`, `StackOverflowError`... — giao diện chỉ hiển thị một thông báo chung chung hoặc một dòng lỗi kỹ thuật nội bộ không có ý nghĩa với sinh viên.

**Mục tiêu**: Bất kỳ lỗi runtime nào cũng phải được báo cáo **chi tiết và có ích** nhất có thể, bao gồm:

- **Loại exception** rõ ràng (`NullPointerException`, `ArrayIndexOutOfBoundsException`, v.v.)
- **Message** mô tả nguyên nhân (ví dụ: `Cannot invoke "String.length()" because "str" is null`)
- **Dòng code** xảy ra lỗi trong `Solution.java` (nếu lấy được)

Sinh viên nhìn vào kết quả phải biết ngay **lỗi gì**, **ở đâu**, thay vì phải đoán từ thông báo mơ hồ.

> **Lưu ý kỹ thuật**: Môi trường Web dùng TeaVM biên dịch Java → WASM, việc lấy stack trace đầy đủ như JDK thật là thách thức lớn. Cần nghiên cứu khả năng thực tế của TeaVM classlib trước khi implement.

