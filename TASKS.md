# TASKS.md — DrawPath AI — Task List (Phases 1–10)

> **Ngày:** 2026-11-24
> **Quy ước status:** `NOT_STARTED` | `IN_PROGRESS` | `IMPLEMENTED` |
> `VERIFIED` | `FAILED` | `BLOCKED` | `INCOMPLETE`
> - `IMPLEMENTED` = đã làm xong nhưng **chưa kiểm chứng chạy được**.
> - `VERIFIED` = đã chạy test thật và PASS, có bằng chứng trong `TEST_RESULTS.md`.
> - Không task nào trong file này được ghi `VERIFIED` nếu chưa có bằng chứng chạy.
>
> **Lưu ý:** Phase 1 docs tasks được ghi IMPLEMENTED vì tài liệu đã viết xong
> ngày 2026-11-24, nhưng **chưa được review** (unreviewed). Mọi task khác là
> NOT_STARTED theo cuộc kiểm tra lúc ~22:56 +07. Các agent song song đã tạo
> file `backend/` / `frontend/` sau thời điểm đó — các task đó **không** được
> đổi status trong file này cho tới khi có người kiểm chứng code đó chạy được
> và ghi kết quả vào `TEST_RESULTS.md`.

## Phase 1 — Docs & Governance (docs trước, code sau)

| ID | Task | Priority | Acceptance criteria | Dependencies | Status |
|---|---|---|---|---|---|
| T-P1-01 | Viết `SECURITY.md` (threat model, auth, upload, privacy, AI data) | P0 | File đầy đủ các mục, trạng thái NOT_STARTED ghi rõ | — | IMPLEMENTED (docs written 2026-11-24, unreviewed) |
| T-P1-02 | Viết `SECURITY_REVIEW.md` (checklist, không PASS giả) | P0 | Mọi mục NOT_STARTED/NOT TESTED, có test cụ thể để chạy sau | T-P1-01 | IMPLEMENTED (docs written 2026-11-24, unreviewed) |
| T-P1-03 | Viết `TEST_PLAN.md` (pyramid, flows A–H, entry/exit) | P0 | Đủ các tầng test, ghi rõ cái gì NOT RUN | — | IMPLEMENTED (docs written 2026-11-24, unreviewed) |
| T-P1-04 | Viết `TEST_CASES.md` (numbered cases, steps/expected) | P0 | ≥ 80 case, mỗi case có steps + expected + priority + NOT RUN | T-P1-03 | IMPLEMENTED (docs written 2026-11-24, unreviewed) |
| T-P1-05 | Viết `TEST_RESULTS.md` (chỉ kết quả thật) | P0 | Chỉ có số đo thật (môi trường + API ngoài), 0 PASS giả | — | IMPLEMENTED (docs written 2026-11-24, unreviewed) |
| T-P1-06 | Viết `PERFORMANCE_REPORT.md` (chỉ số đo thật) | P1 | Số API ngoài đúng, còn lại NOT MEASURED | T-P1-05 | IMPLEMENTED (docs written 2026-11-24, unreviewed) |
| T-P1-07 | Viết `BUG_REPORT.md` (BUG-001/002 + rủi ro spec) | P1 | BUG-001/002 có bước tái hiện + bằng chứng; không bịa bug code | T-P1-05 | IMPLEMENTED (docs written 2026-11-24, unreviewed) |
| T-P1-08 | Viết `KNOWN_LIMITATIONS.md` | P0 | Liệt kê đủ giới hạn (no code, no expert review, AI free, stylus…) | — | IMPLEMENTED (docs written 2026-11-24, unreviewed) |
| T-P1-09 | Viết `TASKS.md` (file này, phases 1–10) | P0 | Đủ task các phase, status trung thực | — | IMPLEMENTED (docs written 2026-11-24, unreviewed) |
| T-P1-10 | Viết `IMPLEMENTATION_STATUS.md` | P0 | Bảng trạng thái đủ 20 scope groups + curriculum/engine/AI/admin/DevOps | — | IMPLEMENTED (docs written 2026-11-24, unreviewed) |
| T-P1-11 | Viết `DECISIONS.md` | P1 | Ghi quyết định + rationale + ngày | — | IMPLEMENTED (docs written 2026-11-24, unreviewed) |
| T-P1-12 | Viết `CHANGELOG.md` (v0.1.0 + Unreleased) | P1 | Entry v0.1.0 ngày 2026-11-24 | — | IMPLEMENTED (docs written 2026-11-24, unreviewed) |
| T-P1-13 | Viết `BLOCKERS.md` (BLK-001…007) | P0 | Đủ 7 blocker + tóm tắt API check | T-P1-05 | IMPLEMENTED (docs written 2026-11-24, unreviewed) |
| T-P1-14 | Viết `RELEASE_ACCEPTANCE.md` (P0 matrix, verdict NOT_READY) | P0 | Matrix P0 đầy đủ, verdict NOT_READY có lý do + điều kiện lên READY | T-P1-03, T-P1-04 | IMPLEMENTED (docs written 2026-11-24, unreviewed) |
| T-P1-15 | Kiểm tra API miễn phí (Pollinations, Openverse, Wikipedia, HF, OpenRouter, DDG) | P0 | Ghi HTTP + latency thật vào TEST_RESULTS.md | — | IMPLEMENTED (checked 2026-11-24 22:56 UTC, unreviewed) |
| T-P1-16 | Review chéo bộ docs Phase 1 (người khác đọc lại) | P1 | Mọi số liệu nhất quán giữa các file; sửa lệch nếu có | T-P1-01…14 | NOT_STARTED |

## Phase 2 — Backend foundation

| ID | Task | Priority | Acceptance criteria | Dependencies | Status |
|---|---|---|---|---|---|
| T-P2-01 | Khởi tạo FastAPI app + cấu trúc project + config bằng env | P0 | `uvicorn` chạy được, `/health` trả 200 | T-P1-01 | NOT_STARTED |
| T-P2-02 | PostgreSQL + SQLAlchemy models + Alembic migrations | P0 | Migration up/down chạy được, không mất dữ liệu mẫu | T-P2-01 | NOT_STARTED |
| T-P2-03 | Auth: register/login, argon2/bcrypt, JWT access+refresh | P0 | TC-AUTH-01…08 PASS | T-P2-02 | NOT_STARTED |
| T-P2-04 | Phân quyền object-level (owner/admin) cho mọi resource | P0 | TC-SEC-01…03 PASS | T-P2-03 | NOT_STARTED |
| T-P2-05 | Redis + Celery worker + hàng đợi chấm bài | P0 | Job chạy nền, không kẹt, retry giới hạn | T-P2-01 | NOT_STARTED |
| T-P2-06 | S3/MinIO upload: MIME sniffing, size limit, strip EXIF, presigned URL | P0 | TC-SEC-06/07, TC-E2E-C-01…05 PASS | T-P2-02 | NOT_STARTED |
| T-P2-07 | Rate limiting (auth, upload, AI) | P1 | TC-SEC-10 PASS | T-P2-03 | NOT_STARTED |
| T-P2-08 | Audit log + security headers + CORS chặt | P1 | SR-AUD-01, SR-SEC-05 PASS | T-P2-01 | NOT_STARTED |
| T-P2-09 | Unit + API tests backend, coverage ≥ 80% module mới | P0 | `pytest` PASS, ghi vào TEST_RESULTS.md | T-P2-01…08 | NOT_STARTED |

## Phase 3 — Curriculum & content

| ID | Task | Priority | Acceptance criteria | Dependencies | Status |
|---|---|---|---|---|---|
| T-P3-01 | Seed curriculum: lessons, rubric, prerequisite | P0 | Seed chạy được, lesson hiển thị đúng | T-P2-02 | NOT_STARTED |
| T-P3-02 | API lessons: list/detail, trạng thái khóa/mở | P0 | TC-E2E-B-01/02/05 PASS | T-P3-01 | NOT_STARTED |
| T-P3-03 | Expert review giáo trình + rubric (chuyên gia duyệt) | P0 | Có văn bản duyệt; sửa theo góp ý | T-P3-01 | NOT_STARTED |
| T-P3-04 | Ảnh tham chiếu: kiểm tra licence + attribution | P1 | Mọi ảnh có licence rõ, attribution đầy đủ | T-P3-01 | NOT_STARTED |

## Phase 4 — Canvas / Workspace (frontend)

| ID | Task | Priority | Acceptance criteria | Dependencies | Status |
|---|---|---|---|---|---|
| T-P4-01 | Khởi tạo Next.js/React/TS/Tailwind + cấu trúc project | P0 | `npm run build` PASS, `tsc --noEmit` PASS | T-P1-01 | NOT_STARTED |
| T-P4-02 | Auth pages: register/login/forgot + onboarding | P0 | TC-E2E-A-01…07 PASS | T-P4-01, T-P2-03 | NOT_STARTED |
| T-P4-03 | Canvas: vẽ, undo/redo, đổi màu/cọ, serialize | P0 | TC-CANVAS-01…03, TC-E2E-D-01…04 PASS | T-P4-01 | NOT_STARTED |
| T-P4-04 | Canvas persistence: autosave + reload khôi phục | P0 | TC-E2E-D-01 PASS (reload còn đủ nét) | T-P4-03, T-P2-02 | NOT_STARTED |
| T-P4-05 | Paper upload UI + xem lại ảnh | P0 | TC-E2E-C-01…05 PASS | T-P4-01, T-P2-06 | NOT_STARTED |
| T-P4-06 | Dashboard / roadmap / portfolio / settings pages | P1 | Các trang hiển thị đúng dữ liệu của user | T-P4-01, T-P2-03 | NOT_STARTED |
| T-P4-07 | Accessibility: keyboard, labels, axe không lỗi critical | P1 | Axe 0 critical/serious trang chính | T-P4-02…06 | NOT_STARTED |
| T-P4-08 | Visual regression baseline cho trang chính | P2 | Baseline được duyệt bằng mắt, test so sánh chạy được | T-P4-06 | NOT_STARTED |

## Phase 5 — Assessment engine (local CV)

| ID | Task | Priority | Acceptance criteria | Dependencies | Status |
|---|---|---|---|---|---|
| T-P5-01 | Geometry utils: khoảng cách, polyline, bbox, góc | P0 | TC-UNIT-01…04 PASS | T-P2-01 | NOT_STARTED |
| T-P5-02 | Coordinate transform + stroke ops (simplify, resample, serialize) | P0 | TC-UNIT-05…07 PASS | T-P5-01 | NOT_STARTED |
| T-P5-03 | Rubric calc + mastery calc + recommendation | P0 | TC-UNIT-08…13 PASS | T-P3-01 | NOT_STARTED |
| T-P5-04 | Local CV assessment (OpenCV): chấm bài tại chỗ, trả đủ rubric | P0 | TC-AI-01/03 PASS; không cần mạng/provider ngoài | T-P5-01…03 | NOT_STARTED |
| T-P5-05 | Assessment schema validation (Pydantic) | P0 | TC-UNIT-16, TC-E2E-G-03 PASS | T-P5-04 | NOT_STARTED |
| T-P5-06 | Golden set + đo MAE vs điểm chuẩn | P1 | TC-AI-04 có số đo thật; ngưỡng do chuyên gia quyết | T-P5-04, T-P3-03 | NOT_STARTED |

## Phase 6 — AI providers (live, free-first, fallback)

| ID | Task | Priority | Acceptance criteria | Dependencies | Status |
|---|---|---|---|---|---|
| T-P6-01 | Provider abstraction (interface chung, đổi provider không sửa caller) | P0 | Thêm provider mới không sửa code chấm bài | T-P5-04 | NOT_STARTED |
| T-P6-02 | Tích hợp Pollinations text/image (free, không key) + retry/timeout | P0 | TC-AI-02 PASS khi provider chạy; lỗi → fallback | T-P6-01 | BLOCKED — needs backend + provider abstraction; free providers only, no keys without approval (xem BLOCKERS.md BLK-002) |
| T-P6-03 | Fallback local CV khi provider ngoài lỗi + báo rõ nguồn cho user | P0 | TC-E2E-G-01/02 PASS | T-P6-02, T-P5-04 | NOT_STARTED |
| T-P6-04 | Tích hợp Openverse (ảnh tham chiếu) + cache | P1 | Tìm ảnh trả về trong thời gian chấp nhận được hoặc báo rõ khi chậm | T-P6-01 | NOT_STARTED |
| T-P6-05 | Tích hợp Wikipedia REST (nội dung tham khảo) | P2 | Trả nội dung đúng, có nguồn | T-P6-01 | NOT_STARTED |
| T-P6-06 | Đánh giá provider key-gated (HF/OpenRouter) — chỉ khi có key + phê duyệt | P2 | Có key + phê duyệt bằng văn bản mới triển khai | — | BLOCKED — no keys, needs user approval |
| T-P6-07 | Chống prompt injection + không gửi PII ra provider ngoài | P0 | TC-SEC-12, SR-AI-01 PASS | T-P6-01 | NOT_STARTED |

## Phase 7 — Submissions, feedback, revision history

| ID | Task | Priority | Acceptance criteria | Dependencies | Status |
|---|---|---|---|---|---|
| T-P7-01 | Submission API: tạo, xem, trạng thái job | P0 | TC-SUB-01…04 PASS | T-P2-05, T-P5-04 | NOT_STARTED |
| T-P7-02 | Feedback page: điểm rubric + gợi ý cụ thể | P0 | TC-E2E-B-04 PASS | T-P7-01 | NOT_STARTED |
| T-P7-03 | Revision history: nộp lại, xem/so sánh các lần | P0 | TC-E2E-H-01…03 PASS | T-P7-01 | NOT_STARTED |
| T-P7-04 | Idempotency: gửi trùng không chấm 2 lần | P0 | TC-SEC-13 / TC-UNIT-19 PASS | T-P7-01 | NOT_STARTED |

## Phase 8 — Admin

| ID | Task | Priority | Acceptance criteria | Dependencies | Status |
|---|---|---|---|---|---|
| T-P8-01 | Admin: quản lý user, xem audit log | P0 | TC-ADMIN-01/03 PASS | T-P2-03, T-P2-08 | NOT_STARTED |
| T-P8-02 | Admin: tạo/sửa/publish/unpublish lesson + rubric | P0 | TC-E2E-E-01…04 PASS | T-P3-01 | NOT_STARTED |
| T-P8-03 | Admin không sửa điểm lặng lẽ (audit log bắt buộc) | P1 | TC-ADMIN-04 PASS | T-P8-01 | NOT_STARTED |

## Phase 9 — DevOps, performance, security hardening

| ID | Task | Priority | Acceptance criteria | Dependencies | Status |
|---|---|---|---|---|---|
| T-P9-01 | Docker Compose: app + DB + Redis + MinIO chạy cùng lúc | P0 | `docker compose up` chạy được, E2E chạy trên compose | T-P2-01, T-P4-01 | NOT_STARTED |
| T-P9-02 | CI: static + unit + API mỗi PR | P0 | Workflow chạy xanh trên PR mẫu | T-P2-09 | NOT_STARTED |
| T-P9-03 | Đo hiệu năng: Lighthouse ≥ 90 trang public, canvas stress | P1 | Số đo thật trong PERFORMANCE_REPORT.md | T-P4-01 | NOT_STARTED |
| T-P9-04 | Security review đầy đủ (chạy lại SECURITY_REVIEW.md) | P0 | Không còn mục NOT TESTED cho P0; bug P0/P1 đóng | T-P2-01…08 | NOT_STARTED |
| T-P9-05 | Backup/restore DB + storage đã kiểm chứng | P1 | Restore thử thành công trên môi trường test | T-P9-01 | NOT_STARTED |

## Phase 10 — Release readiness & user testing

| ID | Task | Priority | Acceptance criteria | Dependencies | Status |
|---|---|---|---|---|---|
| T-P10-01 | Đạt RELEASE_ACCEPTANCE P0 (verdict READY_FOR_LOCAL_TESTING) | P0 | Mọi mục P0 PASS có bằng chứng | T-P2…P9 | NOT_STARTED |
| T-P10-02 | Real user testing (nhóm nhỏ học viên thật) | P0 | Có báo cáo usability, sửa lỗi P0/P1 phát hiện | T-P10-01 | NOT_STARTED |
| T-P10-03 | Privacy policy + ToS tiếng Việt, cơ chế xóa tài khoản/dữ liệu | P0 | Văn bản có, tính năng xóa chạy được | T-P2-03 | NOT_STARTED |
| T-P10-04 | Quyết định độ tuổi / trẻ em + đồng ý phụ huynh (nếu hướng tới < 18) | P0 | Quyết định bằng văn bản (xem SECURITY.md §11) | — | NOT_STARTED |
| T-P10-05 | Phê duyệt deploy production (người dùng phê duyệt) | P0 | Có phê duyệt bằng văn bản; không tự deploy | T-P10-01…04 | NOT_STARTED |

---

## Ghi chú

- Task nào do agent song song đã bắt đầu (ví dụ file `backend/`/`frontend/`
  đã xuất hiện sau 22:56) **không tự động đổi status ở đây**. Người kiểm chứng
  phải chạy được code đó (build/test/E2E) rồi mới đổi status kèm bằng chứng
  trong `TEST_RESULTS.md`.
- Khi đổi status một task sang VERIFIED, ghi kèm: ngày, lệnh chạy, commit.
