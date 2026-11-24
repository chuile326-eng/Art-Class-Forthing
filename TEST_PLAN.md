# TEST_PLAN.md — DrawPath AI — Kế hoạch kiểm thử

> **Ngày:** 2026-11-24
> **Sản phẩm:** DrawPath AI — Nền tảng học vẽ bằng AI, tiếng Việt là ngôn ngữ chính.
> **Stack:** Next.js / React / TypeScript / Tailwind (frontend), Python FastAPI /
> Pydantic / SQLAlchemy / Alembic (backend), PostgreSQL, Redis/Celery, S3/MinIO,
> OpenCV, Docker Compose.
> **Trạng thái tổng thể: NOT_READY — docs Phase 1 only, chưa có sản phẩm chạy được.**
>
> **Lưu ý khi bàn giao:** các agent song song đã tạo file trong `backend/` và
> `frontend/` sau thời điểm kiểm tra 22:56 +07 ngày 2026-11-24. Kế hoạch này được
> viết theo đúng cuộc kiểm tra đó và **chưa chạy trên code mới đó**. Trước khi
> thực thi kế hoạch, phải kiểm tra lại repo hiện tại và cập nhật
> `TEST_RESULTS.md` bằng kết quả chạy thật.

---

## 1. Mục tiêu

1. Chứng minh các flow cốt lõi (Flows A–H, xem §5) chạy đúng từ đầu tới cuối.
2. Ngăn lỗi hồi quy khi thêm tính năng: mỗi lần sửa code đều có test chạy lại.
3. Đo được chất lượng AI chấm bài (không chỉ "chạy được", mà "chấm có lý").
4. Bảo vệ dữ liệu người dùng: quyền riêng tư, phân quyền, upload an toàn.
5. Biết rõ giới hạn: cái gì chưa đo được thì ghi NOT MEASURED / NOT RUN,
   không tuyên bố PASS.

## 2. Kim tự tháp kiểm thử (Testing pyramid)

```
        /\  E2E / Manual exploratory (ít, đắt, giá trị cao)
       /  \  — Playwright: Flows A–H trên trình duyệt thật
      /----\
     / API  \  — FastAPI TestClient: auth, lesson, submit, feedback, admin
    /--------\
   / Integration \ — DB + Redis + S3/MinIO + Celery worker thật (testcontainers / compose)
  /--------------\
 /  Unit (nhiều)  \ — geometry, transform, stroke, rubric, mastery, recommendation
/------------------\
| Static: lint, typecheck, format, secret scan |
```

Tỉ lệ mục tiêu (khi có code): ~70% unit, ~20% integration/API, ~10% E2E/manual.
Hiện tại: **0% ở mọi tầng — chưa có code để test.**

### 2.1. Static (tĩnh) — chưa chạy được

| Kiểm tra | Công cụ đề xuất | Trạng thái |
|---|---|---|
| Python lint/format | `ruff`, `black --check` | NOT RUN — chưa có code |
| Python typecheck | `mypy` | NOT RUN |
| Python compile | `python -m py_compile` | NOT RUN — không có file `.py` nào tại thời điểm kiểm tra |
| Frontend typecheck | `tsc --noEmit` | NOT RUN — chưa có `package.json` tại thời điểm kiểm tra |
| Frontend lint/build | `eslint`, `npm run build` | NOT RUN |
| Secret scan | `gitleaks` / `trufflehog` | NOT RUN |
| Dependency audit | `pip-audit`, `npm audit` | NOT RUN |

### 2.2. Unit tests — chưa chạy được

Phạm vi (chi tiết case ở `TEST_CASES.md`):
- **Geometry:** khoảng cách điểm–đoạn, độ dài polyline, bounding box, góc, độ cong.
- **Coordinate transform:** canvas ↔ ảnh gốc ↔ tọa độ chuẩn hóa; scale/offset/rotation.
- **Stroke ops:** thêm/xóa/undo/redo stroke, simplify (Douglas–Peucker),
  resample, serialize/deserialize JSON không mất dữ liệu.
- **Rubric calc:** tính điểm từng tiêu chí, trọng số, làm tròn, điểm tổng.
- **Mastery calc:** cập nhật mastery sau mỗi bài, ngưỡng lên level, không vượt 100%.
- **Recommendation:** gợi ý bài tiếp theo theo điểm yếu, không gợi ý bài đã khóa
  sai điều kiện, không lặp lại bài vừa làm ngay.
- **Upload validation:** MIME sniffing, size, pixel limit, tên file.
- **Assessment schema:** phản hồi AI sai schema bị từ chối, không lưu điểm.
- **Job transitions:** `pending → running → done/failed`, retry giới hạn,
  idempotency key.

### 2.3. Integration tests — chưa chạy được

- API + PostgreSQL thật (không mock DB ở tầng này).
- Upload → S3/MinIO thật (hoặc MinIO local trong compose).
- Celery worker xử lý job chấm bài với local CV (không gọi provider ngoài).
- Alembic migration lên/xuống (upgrade/downgrade) không mất dữ liệu mẫu.
- Redis cache / rate limit hoạt động qua các request liên tiếp.

### 2.4. API tests — chưa chạy được

- Mọi endpoint trong spec: auth, onboarding, lessons, workspace/canvas,
  submissions, feedback, portfolio, admin.
- Contract: status code, schema response (Pydantic), lỗi 400/401/403/404/429
  đúng trường hợp.
- Phân quyền: xem `SECURITY_REVIEW.md` SR-AUTHZ-*.

### 2.5. E2E tests (Playwright) — chưa chạy được

- Chạy trên trình duyệt thật (Chromium), frontend + backend + DB chạy cùng lúc.
- Bao phủ Flows A–H (§5). Mỗi flow có dữ liệu seed riêng, dọn dẹp sau khi chạy.
- Chụp screenshot khi fail; video khi cần debug.

### 2.6. Visual regression — chưa chạy được

- So sánh screenshot các trang chính (landing, lesson, workspace, feedback)
  với baseline đã duyệt. Ngưỡng khác biệt phải ghi rõ (ví dụ < 0,1% pixel).
- Canvas: so sánh render của cùng một stroke JSON trên các lần chạy.
- Chưa có baseline nào — baseline đầu tiên phải được duyệt bằng mắt người.

### 2.7. AI evaluation (đánh giá AI chấm bài) — chưa chạy được

- Bộ **golden set**: 20–50 bài vẽ mẫu (nhiều mức độ: tốt/khá/yếu/sai yêu cầu),
  có điểm rubric do người (hoặc chuyên gia) chấm trước làm chuẩn.
- Đo: độ lệch điểm AI vs chuẩn (MAE), tỉ lệ điểm nằm trong ±1 mức, tỉ lệ
  feedback có nội dung cụ thể (không chung chung).
- Đo fallback: khi provider ngoài lỗi, local CV vẫn trả kết quả và ghi rõ nguồn.
- Đo prompt injection: bài chứa text thao túng không làm lệch điểm (TC-SEC-12).
- **AI scores are assistive, not authoritative** — ngưỡng chấp nhận phải do
  người có chuyên môn quyết, không tự đặt.

### 2.8. Security tests — chưa chạy được

Xem `SECURITY_REVIEW.md` §8 và `TEST_CASES.md` TC-SEC-*. Bao gồm IDOR,
broken access control, XSS, injection, oversized upload, path traversal,
session misuse, CSRF, rate limit, secret exposure, prompt injection,
duplicate processing.

### 2.9. Accessibility (a11y) — chưa chạy được

- Kiểm tra bằng bàn phím hoàn toàn (tab/enter/esc) cho flow đăng ký → làm bài.
- Screen reader: label cho canvas, nút, thông báo lỗi.
- Tương phản màu, cỡ chữ, `axe-core` (Playwright axe) trên các trang chính.
- Mục tiêu: không có lỗi `critical`/`serious` của axe trên trang public.

### 2.10. Performance tests — chưa chạy được

- Mục tiêu: Lighthouse ≥ 90 cho trang public (xem `PERFORMANCE_REPORT.md`).
- Canvas: độ trễ vẽ (pointer → render) mục tiêu < 16 ms trung bình trên máy
  dev; stress 100 / 1.000 / 5.000 strokes (hiện NOT MEASURED).
- API: p95 latency cho các endpoint đọc chính; thời gian chấm bài local CV.
- API ngoài (đã đo duy nhất phần này — xem `TEST_RESULTS.md`):
  Pollinations text 4,35s, image 5,78s (retry), Openverse 16,6s,
  Wikipedia 0,59s. Các số này là **độ trễ provider ngoài**, không phải hiệu
  năng sản phẩm.

### 2.11. Failure / Recovery tests — chưa chạy được

- Provider AI lỗi / timeout → fallback local CV, job không kẹt ở `running`.
- DB mất kết nối rồi có lại → app phục hồi, không mất submission đã nhận.
- Redis/Celery worker chết → job được retry / báo rõ, không mất.
- S3/MinIO lỗi → upload báo lỗi rõ, không báo thành công giả.
- Restart container → dữ liệu đã commit vẫn còn (volume đúng).

### 2.12. Manual exploratory — chưa chạy được

- Người test tự do dùng sản phẩm như học viên thật, ghi lại điểm khó hiểu,
  lỗi UI, flow gãy. Mỗi phiên có checklist + ghi chú, không thay thế test tự động.

## 3. Môi trường kiểm thử

| Môi trường | Mục đích | Trạng thái |
|---|---|---|
| Local dev (VM này) | Chạy unit + API nhanh | Chưa có code; Docker **không cài** trong VM này nên compose chưa test được local |
| CI (GitHub Actions, nếu có) | Chạy static + unit + API mỗi PR | Chưa có workflow nào được xác minh |
| Staging (compose) | E2E + integration với DB/Redis/MinIO thật | Chưa có hạ tầng |
| Production | Không test trực tiếp; chỉ smoke test sau deploy | Chưa có, chưa được phê duyệt deploy |

- Dữ liệu test **không dùng dữ liệu người dùng thật**.
- Secret test dùng giá trị giả trong `.env.example` / CI secrets.
- Mỗi lần chạy E2E dùng DB seed riêng, xóa sau khi chạy.

## 4. Chiến lược dữ liệu test (Test data strategy)

- **Seed curriculum:** bộ lesson/rubric mẫu nhỏ, versioned trong repo
  (khi có, kiểm tra `backend/app/data/curriculum.json` — chưa xác minh).
- **Golden set AI:** bài vẽ mẫu + điểm chuẩn, lưu riêng, không commit ảnh
  có mặt người / thông tin cá nhân.
- **Tài khoản test:** `learner@test.local`, `admin@test.local` (mật khẩu giả,
  chỉ dùng local/CI). Không dùng email thật.
- **File upload test:** ảnh PNG/JPEG nhỏ hợp lệ, file HTML đổi đuôi, file 20 MB,
  ảnh có EXIF GPS — tạo bằng script, không lấy ảnh người dùng thật.
- **Dọn dẹp:** test tự dọn dữ liệu mình tạo; E2E chạy xong xóa user/file test.

## 5. Flows E2E A–H (từ spec — chưa chạy được flow nào)

| Flow | Mô tả | Case |
|---|---|---|
| A | New learner: đăng ký → onboarding → vào dashboard | TC-E2E-A-01… |
| B | Free learning: chọn lesson → học → làm bài trên canvas | TC-E2E-B-01… |
| C | Paper upload: chụp/upload bài vẽ trên giấy → chấm | TC-E2E-C-01… |
| D | Canvas persistence: vẽ, reload, stroke còn nguyên; undo/redo | TC-E2E-D-01… |
| E | Admin publishing: admin tạo/sửa lesson → publish → learner thấy | TC-E2E-E-01… |
| F | Authorization: A không xem/sửa được bài của B; learner không vào admin | TC-E2E-F-01… (= TC-SEC-01…03) |
| G | AI failure: provider lỗi → fallback local CV, báo rõ | TC-E2E-G-01… |
| H | Revision history: nộp lại bài, lịch sử các lần nộp còn đủ | TC-E2E-H-01… |

Chi tiết từng case ở `TEST_CASES.md`.

## 6. Entry / Exit criteria

### Entry criteria (được bắt đầu test một tính năng)
- [ ] Code của tính năng đã merge / có mặt local, chạy được (không crash khi khởi động).
- [ ] Có hướng dẫn chạy local (README) và seed data tối thiểu.
- [ ] Test case cho tính năng đã viết xong trong `TEST_CASES.md`.

**Hiện tại: chưa đạt entry cho bất kỳ tính năng nào** (không có code chạy được
tại thời điểm kiểm tra).

### Exit criteria (được coi là xong một vòng test)
- [ ] Tất cả test P0 PASS, không có bug P0/P1 mở.
- [ ] Coverage unit cho module mới ≥ 80% (ghi rõ nếu module là glue code).
- [ ] Security checklist liên quan đã chạy (không còn NOT TESTED).
- [ ] Kết quả ghi vào `TEST_RESULTS.md` với lệnh + output thật.
- [ ] Performance mục tiêu đạt hoặc ghi rõ NOT MEASURED + lý do.

## 7. Cái gì CHƯA chạy được (tóm tắt trung thực)

- `pytest`: **NOT RUN** — 0 test được thu thập tại thời điểm kiểm tra.
- `npm run build` / `tsc`: **NOT RUN** — không có `package.json` tại thời điểm kiểm tra.
- `py_compile`: **NOT RUN** — không có file `.py` nào tại thời điểm kiểm tra.
- Docker Compose: **NOT RUN** — Docker không cài trong VM này.
- Mọi test E2E/API/integration/security/a11y/performance của sản phẩm: **NOT RUN**.
- Thứ duy nhất đã chạy: kiểm tra HTTP trực tiếp tới các API miễn phí bên ngoài
  (Pollinations, Openverse, Wikipedia, HuggingFace, OpenRouter, DuckDuckGo)
  ngày 2026-11-24 22:56 UTC — xem `TEST_RESULTS.md` §3.
- **0 product test đã PASS.** Không được suy ra "sản phẩm ổn" từ các con số API ngoài.

## 8. Rủi ro của kế hoạch

| Rủi ro | Ảnh hưởng | Giảm thiểu |
|---|---|---|
| Provider AI miễn phí flaky / chậm (Pollinations 503, Openverse 16,6s) | Chấm bài chậm / lỗi, test E2E flaky | Mock provider trong test; fallback local CV; retry + timeout rõ ràng |
| Chưa có chuyên gia duyệt giáo trình | Golden set AI không có chuẩn đáng tin | Ghi rõ giới hạn; không tuyên bố điểm AI "chính xác" |
| Không có thiết bị stylus | Không test được pressure/tilt | Ghi vào `KNOWN_LIMITATIONS.md`; test chuột/touch trước |
| Docker không có trong VM này | Không chạy được compose local | Test compose ở máy/CI có Docker; ghi rõ |

## 9. Tài liệu liên quan

- `TEST_CASES.md` — case cụ thể.
- `TEST_RESULTS.md` — kết quả thật duy nhất + template cho lần chạy sau.
- `SECURITY_REVIEW.md` — checklist bảo mật.
- `PERFORMANCE_REPORT.md` — số đo thật + mục tiêu.
- `BUG_REPORT.md` — bug log.
