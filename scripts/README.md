# Algo-Journey Scripts

This directory contains standalone utility scripts for managing and bulk-updating the algorithm exercises catalog.

## How to run

The easiest way to execute these scripts in a modern Node.js environment (ES Modules) is using `npx tsx`. Alternatively, you can use `npx ts-node --esm`.

From the root directory (`d:\EIU\algo-journey`), run:

```bash
npx tsx scripts/export_catalog.ts
```

## Scripts overview

- **`export_catalog.ts`**: Quét toàn bộ các file bài tập (`.exercise.ts`) trong source code và xuất thông tin (ID, Title, Order, Tags) ra một file `docs/problems_catalog.csv` để dễ dàng thống kê và review bên ngoài.
- **`import_catalog.ts`**: Đọc dữ liệu từ file `docs/problems_catalog.csv` nói trên và cập nhật ngược lại các trường `order` và `tags` vào từng file `.exercise.ts` tương ứng. Thường dùng sau khi bạn đã chỉnh sửa hàng loạt tags/order trên file Excel.
- **`update_order.ts`**: Tự động đánh lại số thứ tự (`order`) cho một danh sách các bài tập cố định (như mảng Arrays) dựa trên mảng config có sẵn trong code (bắt đầu từ số 401).
