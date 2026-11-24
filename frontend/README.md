# DrawPath AI — Frontend

Nền tảng học vẽ tích hợp gia sư AI (AI-Powered Drawing Learning Platform).
Stack: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS.

## Chạy local

```bash
cp .env.example .env.local   # sửa NEXT_PUBLIC_API_URL nếu backend ở địa chỉ khác
npm install
npm run dev                  # http://localhost:3000
npm run build && npm start
```

Backend mặc định: `http://localhost:8000` (FastAPI, xem `../backend/`).
Các router của backend gắn ở root — không có tiền tố `/api/v1`:
`/auth`, `/modules`, `/lessons`, `/drawing/projects`, `/submissions`,
`/tutor/chat`, `/progress`, `/recommendations`, `/mastery`, `/portfolio`,
`/admin/*`. Tài khoản seed: admin `admin@drawpath.app` / `admin123`.
Frontend không tự tạo dữ liệu giả làm dữ liệu thật: khi API chưa chạy, các
trang hiển thị trạng thái lỗi/trống trung thực; chương trình học mẫu tích hợp
sẵn (11 module, 55 bài nền tảng) được ghi nhãn "Nội dung mẫu offline".

## Trang

- `/` — Landing (hero SVG vẽ tay, quy trình 7 bước, module, chuyên ngành, FAQ)
- `/auth/login`, `/auth/register`, `/auth/forgot`
- `/onboarding` — mục tiêu, trình độ, hình thức vẽ, bài kiểm tra đầu vào 5 câu
- `/dashboard`, `/roadmap`, `/lessons/[id]`, `/workspace`, `/workspace/[lessonId]`
- `/submissions/[id]`, `/feedback/[submissionId]`, `/portfolio`, `/settings`, `/admin`

## Bảng vẽ

`src/components/Workspace.tsx` + `src/lib/canvas.ts`: bút chì/cọ/tẩy, undo/redo,
màu/cỡ/độ mờ, zoom/pan, lớp vẽ, ảnh tham khảo, lưới hướng dẫn, autosave
(debounce 2s, backend nếu đã đăng nhập, localStorage nếu chưa), xuất PNG,
phát lại nét vẽ, nộp bài chấm AI, gia sư AI. Nét lưu theo tọa độ logic
1200×800, độc lập với zoom.

## API client

`src/lib/api.ts` — fetch wrapper có token (localStorage `drawpath_token`),
xử lý lỗi rõ ràng. `src/lib/curriculum.ts` — nội dung chương trình mẫu.

## Thương hiệu

Modern Creative Atelier — giấy ấm #F7F3EA, ivory #FFFCF7, graphite #242424,
terracotta #D56B46, coral #EF8B73, sage #8C9B85, lavender #A59ACB.
Font: Be Vietnam Pro (body) + Playfair Display (display), hỗ trợ tiếng Việt.
