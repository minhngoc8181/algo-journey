# ideas.md

Ghi chú này dùng để làm rõ các hướng mở rộng sau V1.
Mục tiêu là brainstorm và định hướng ưu tiên, chưa đi vào thiết kế chi tiết.

## 1. `_starter.java` cho OfflineJudge

- Khi sinh OfflineJudge, nên có sẵn `_starter.java` để sinh viên load lên và bắt đầu code.
- File này đóng vai trò skeleton ban đầu, giúp workflow offline gần với bản web hơn.

## 2. Thêm bài `Graph` và `Tree` cho CSE202

- CSE202 là môn học trong chương trình và có các giải thuật về graph và tree.
- Nên bổ sung nhóm bài này để nội dung bám sát chương trình hơn.

## 3. Hỗ trợ đa ngôn ngữ: JavaScript và Python

- Có thể mở rộng hỗ trợ thêm JavaScript và Python.
- Mục tiêu là tái sử dụng catalog, workflow và engine hiện có cho nhiều ngôn ngữ.

## 4. Hỗ trợ bài SQL / Database

- Có thể bổ sung dạng bài SQL / Database như LeetCode.
- Sinh viên viết truy vấn, hệ thống chạy trên dữ liệu mẫu và so kết quả.

## 5. Hỗ trợ bài về Testing

- Có thể thêm dạng bài về testing.
- Ví dụ: sinh viên viết test đủ coverage, hoặc nghĩ ra testcase để làm lộ lỗi của code có sẵn.

## 6. Cải thiện Loader / Runner cho Web và PC Judge

- Nên cải thiện Loader / Runner cho cả Web và PC Judge.
- Hướng chính là tách riêng phần sinh input, chạy chương trình và kiểm tra output.