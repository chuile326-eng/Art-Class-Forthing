# IMPLEMENTATION_STATUS.md — DrawPath AI — Trạng thái triển khai

> **Ngày:** 2026-11-24
> **Verdict tổng thể: NOT_READY — docs Phase 1 only; no runnable product.**
> (Theo cuộc kiểm tra lúc ~22:56 +07, Asia/Saigon.)
>
> **Lưu ý khi bàn giao:** các agent song song đã tạo file trong `backend/` và
> `frontend/` sau thời điểm kiểm tra đó. Bảng dưới đây phản ánh đúng cuộc kiểm
> tra lúc 22:56 và **chưa bao gồm** việc kiểm chứng code mới đó. Người viết
> không chạm vào, không chạy, không review sâu code mới đó. Trước khi dùng
> bảng này làm căn cứ, phải kiểm tra lại repo hiện tại và cập nhật evidence.

## Quy ước status

| Status | Ý nghĩa |
|---|---|
| NOT_STARTED | Chưa có code / chưa bắt đầu |
| IN_PROGRESS | Đang làm |
| IMPLEMENTED | Đã viết code nhưng chưa kiểm chứng chạy được |
| VERIFIED | Đã chạy test thật và PASS, có bằng chứng |
| BLOCKED | Bị chặn bởi blocker (xem `BLOCKERS.md`) |
| INCOMPLETE | Làm dở, thiếu phần quan trọng |

**Trong bảng này, không có mục nào là VERIFIED** (vì chưa có test sản phẩm nào chạy).

---

## 1. Core scope — 20 nhóm tính năng

| # | Nhóm tính năng | Status | Evidence |
|---|---|---|---|
| 1 | Auth: register / login / forgot / reset password | NOT_STARTED | No code, 2026-11-24 audit |
| 2 | Onboarding: chọn trình độ / mục tiêu | NOT_STARTED | No code, 2026-11-24 audit |
| 3 | Dashboard / tiến độ học | NOT_STARTED | No code, 2026-11-24 audit |
| 4 | Roadmap / lộ trình học | NOT_STARTED | No code, 2026-11-24 audit |
| 5 | Lessons: xem danh sách / chi tiết lesson | NOT_STARTED | No code, 2026-11-24 audit |
| 6 | Lesson content: hướng dẫn + ảnh tham chiếu + rubric | NOT_STARTED | No code, 2026-11-24 audit |
| 7 | Workspace / Canvas: vẽ, cọ, màu, undo/redo | NOT_STARTED | No code, 2026-11-24 audit |
| 8 | Canvas persistence: autosave, reload khôi phục | NOT_STARTED | No code, 2026-11-24 audit |
| 9 | Paper upload: upload ảnh bài vẽ trên giấy | NOT_STARTED | No code, 2026-11-24 audit |
| 10 | Submissions: nộp bài, trạng thái job | NOT_STARTED | No code, 2026-11-24 audit |
| 11 | Feedback: điểm rubric + gợi ý | NOT_STARTED | No code, 2026-11-24 audit |
| 12 | Revision history: nộp lại, xem/so sánh các lần | NOT_STARTED | No code, 2026-11-24 audit |
| 13 | Portfolio: bài vẽ công khai / riêng tư | NOT_STARTED | No code, 2026-11-24 audit |
| 14 | Settings: hồ sơ, đổi mật khẩu, xóa tài khoản | NOT_STARTED | No code, 2026-11-24 audit |
| 15 | Admin: quản lý user | NOT_STARTED | No code, 2026-11-24 audit |
| 16 | Admin: quản lý lesson (tạo/sửa/publish/unpublish) | NOT_STARTED | No code, 2026-11-24 audit |
| 17 | Admin: quản lý rubric | NOT_STARTED | No code, 2026-11-24 audit |
| 18 | Admin: audit log | NOT_STARTED | No code, 2026-11-24 audit |
| 19 | Mastery / recommendation: tính mastery, gợi ý bài tiếp theo | NOT_STARTED | No code, 2026-11-24 audit |
| 20 | Notifications / nhắc học (nếu có trong spec) | NOT_STARTED | No code, 2026-11-24 audit |

## 2. Curriculum

| Hạng mục | Status | Evidence |
|---|---|---|
| Seed curriculum (lessons, rubric, prerequisite) | NOT_STARTED | No code, 2026-11-24 audit |
| Expert review giáo trình / rubric | NOT_STARTED | No expert review; no code, 2026-11-24 audit |
| Ảnh tham chiếu + licence/attribution | NOT_STARTED | No code, 2026-11-24 audit |
| Golden set chấm AI (bài mẫu + điểm chuẩn) | NOT_STARTED | No golden set; no code, 2026-11-24 audit |

## 3. Assessment engine (local CV)

| Hạng mục | Status | Evidence |
|---|---|---|
| Geometry utils (khoảng cách, polyline, bbox, góc) | NOT_STARTED | No code, 2026-11-24 audit |
| Coordinate transform | NOT_STARTED | No code, 2026-11-24 audit |
| Stroke ops (simplify, resample, serialize) | NOT_STARTED | No code, 2026-11-24 audit |
| Rubric calc | NOT_STARTED | No code, 2026-11-24 audit |
| Mastery calc | NOT_STARTED | No code, 2026-11-24 audit |
| Recommendation | NOT_STARTED | No code, 2026-11-24 audit |
| Local CV assessment (OpenCV, xử lý tại chỗ) | NOT_STARTED | No code, 2026-11-24 audit |
| Assessment schema validation (Pydantic) | NOT_STARTED | No code, 2026-11-24 audit |
| Job transitions + idempotency + retry | NOT_STARTED | No code, 2026-11-24 audit |

## 4. AI (live providers)

| Hạng mục | Status | Evidence |
|---|---|---|
| Provider abstraction | NOT_STARTED | No code, 2026-11-24 audit |
| Pollinations text (free, không key) | NOT_STARTED (tích hợp) — **nhưng đã kiểm tra ngoài**: HTTP 200, 4,35s / 6,22s ngày 2026-11-24 | API check only, no integration code, 2026-11-24 audit |
| Pollinations image (free, không key) | NOT_STARTED (tích hợp) — **đã kiểm tra ngoài**: 503 lần đầu rồi 200 khi retry (5,78s) — FLAKY | API check only, BUG-001, 2026-11-24 audit |
| Openverse (ảnh tham chiếu) | NOT_STARTED (tích hợp) — **đã kiểm tra ngoài**: HTTP 200, 16,6s | API check only, BUG-002, 2026-11-24 audit |
| Wikipedia REST | NOT_STARTED (tích hợp) — **đã kiểm tra ngoài**: HTTP 200, 0,59s | API check only, 2026-11-24 audit |
| HuggingFace Inference | BLOCKED — key-gated, timeout 30s không token, NOT VERIFIED | API check 2026-11-24: HTTP 000 timeout |
| OpenRouter | BLOCKED (chat) — key-gated; chỉ list model không key (HTTP 200) | API check 2026-11-24 |
| DuckDuckGo Instant Answer | NOT_STARTED — **đã kiểm tra, không phù hợp** (HTTP 202, abstract rỗng) | API check 2026-11-24 |
| Fallback local CV khi provider lỗi | NOT_STARTED | No code, 2026-11-24 audit |
| Prompt injection defence | NOT_STARTED | No code, 2026-11-24 audit |

## 5. Admin

| Hạng mục | Status | Evidence |
|---|---|---|
| Admin UI + API | NOT_STARTED | No code, 2026-11-24 audit |
| Publish / unpublish lesson | NOT_STARTED | No code, 2026-11-24 audit |
| Quản lý user / vai trò | NOT_STARTED | No code, 2026-11-24 audit |
| Audit log | NOT_STARTED | No code, 2026-11-24 audit |

## 6. DevOps / Hạ tầng

| Hạng mục | Status | Evidence |
|---|---|---|
| Docker Compose (app + DB + Redis + MinIO) | NOT_STARTED | No code; Docker not installed in this VM, 2026-11-24 audit |
| CI (GitHub Actions) | NOT_STARTED | No workflow verified, 2026-11-24 audit |
| Database migrations (Alembic) | NOT_STARTED | No code, 2026-11-24 audit |
| Redis / Celery worker | NOT_STARTED | No code, 2026-11-24 audit |
| S3 / MinIO storage | NOT_STARTED | No code, 2026-11-24 audit |
| Backup / restore | NOT_STARTED | No infra, 2026-11-24 audit |
| Production deployment | NOT_STARTED | No infra; no approval to deploy, 2026-11-24 audit |
| Monitoring / logging tập trung | NOT_STARTED | No code, 2026-11-24 audit |

## 7. Docs (Phase 1) — phần duy nhất đã làm

| Hạng mục | Status | Evidence |
|---|---|---|
| SECURITY.md | IMPLEMENTED (docs written 2026-11-24, unreviewed) | File tại repo root |
| SECURITY_REVIEW.md | IMPLEMENTED (docs written 2026-11-24, unreviewed) | File tại repo root |
| TEST_PLAN.md | IMPLEMENTED (docs written 2026-11-24, unreviewed) | File tại repo root |
| TEST_CASES.md | IMPLEMENTED (docs written 2026-11-24, unreviewed) | File tại repo root |
| TEST_RESULTS.md | IMPLEMENTED (docs written 2026-11-24, unreviewed) | File tại repo root |
| PERFORMANCE_REPORT.md | IMPLEMENTED (docs written 2026-11-24, unreviewed) | File tại repo root |
| BUG_REPORT.md | IMPLEMENTED (docs written 2026-11-24, unreviewed) | File tại repo root |
| KNOWN_LIMITATIONS.md | IMPLEMENTED (docs written 2026-11-24, unreviewed) | File tại repo root |
| TASKS.md | IMPLEMENTED (docs written 2026-11-24, unreviewed) | File tại repo root |
| IMPLEMENTATION_STATUS.md (file này) | IMPLEMENTED (docs written 2026-11-24, unreviewed) | File tại repo root |
| DECISIONS.md | IMPLEMENTED (docs written 2026-11-24, unreviewed) | File tại repo root |
| CHANGELOG.md | IMPLEMENTED (docs written 2026-11-24, unreviewed) | File tại repo root |
| BLOCKERS.md | IMPLEMENTED (docs written 2026-11-24, unreviewed) | File tại repo root |
| RELEASE_ACCEPTANCE.md | IMPLEMENTED (docs written 2026-11-24, unreviewed) | File tại repo root |
| Free-API live checks | IMPLEMENTED (checked 2026-11-24 22:56 UTC) | Kết quả trong TEST_RESULTS.md §3 |

## 8. Tổng kết

- **Docs Phase 1: done** (14 file, viết 2026-11-24, chưa review chéo).
- **Product: NOT_STARTED** (theo kiểm tra 22:56; code do agent song song tạo
  sau đó chưa được kiểm chứng trong đợt này).
- **Product tests passed: 0.**
- **Readiness verdict: NOT_READY.**
- Bước tiếp theo để đổi verdict: backend + frontend slice đầu tiên chạy được
  (auth + lesson + canvas + submit + local assessment), test P0 PASS, xem
  `RELEASE_ACCEPTANCE.md`.

---

## 9. RE-AUDIT 2026-11-24 ~23:15 +07 — cập nhật trạng thái theo code thật

> Bảng §1–§8 trên được viết theo kiểm tra 22:56 (repo trống) và nay đã LỖI THỜI
> ở nhiều dòng. Phần này thay thế chúng làm căn cứ hiện tại. Trạng thái dưới đây
> dựa trên code đã đọc + chạy thật (pytest 27 passed, build 14/14, server thật).

| # | Tính năng | Trạng thái mới | Bằng chứng |
|---|---|---|---|
| 1 | Auth: register / login / forgot / reset password | **IMPLEMENTED** (chưa VERIFIED end-to-end trên trình duyệt) | `auth_router.py` 4 endpoint; login JSON + `/auth/me` gọi thật → 200; pytest `test_register_login_flow` PASS; forgot trả `not_configured` trung thực (chưa có email) |
| 2 | Onboarding | **IMPLEMENTED** (chưa VERIFIED) | Trang `frontend/src/app/onboarding`, chưa chạy trên trình duyệt |
| 3 | Dashboard / tiến độ học | **IMPLEMENTED** (chưa VERIFIED) | Trang dashboard + `GET /progress`, `/mastery`, `/recommendations` tồn tại; chưa chạy E2E |
| 4 | Roadmap / lộ trình học | **IMPLEMENTED** (chưa VERIFIED) | Trang roadmap + `GET /tracks` → 5 track, `/lessons` → 75 lesson (gọi thật → 200) |
| 5 | Lessons: xem danh sách / chi tiết lesson | **IMPLEMENTED** (chưa VERIFIED) | `GET /lessons`, `/lessons/{id}`, `/modules` gọi thật → 200 |
| 6 | Lesson content: hướng dẫn + ảnh tham chiếu + rubric | **INCOMPLETE** | Lesson có title/description/theory + rubric (seed), nhưng ảnh tham chiếu/rubric chi tiết từng bài chưa đủ; **chưa có expert review** |
| 7 | Workspace / Canvas: vẽ, cọ, màu, undo/redo | **IMPLEMENTED** (chưa VERIFIED) | Trang workspace + `drawing_router.py` 11 endpoint (projects/layers/strokes/export); chưa test trên trình duyệt, chưa test stylus |
| 8 | Canvas persistence: autosave, reload khôi phục | **IMPLEMENTED** (chưa VERIFIED) | API projects/strokes + pytest E2E có bước save/reload; chưa test trên trình duyệt |
| 9 | Paper upload: upload ảnh bài vẽ trên giấy | **IMPLEMENTED** (chưa VERIFIED) | `POST /uploads` + pytest (từ chối file txt, ảnh 10×10); chưa test trình duyệt |
| 10 | Submissions: nộp bài, trạng thái job | **IMPLEMENTED** (chưa VERIFIED) | `POST /submissions`, `GET /submissions/{sid}`; pytest `test_e2e_submit_assess` PASS |
| 11 | Feedback: điểm rubric + gợi ý | **IMPLEMENTED** (chưa VERIFIED) | `POST /submissions/{sid}/assess` + `GET /assessments/{aid}`; pytest E2E PASS; **chưa benchmark AI trên golden set** |
| 12 | Revision history: nộp lại, xem/so sánh các lần | **IMPLEMENTED** (chưa VERIFIED) | Model `SubmissionVersion` tồn tại; chưa test so sánh trên UI |
| 13 | Portfolio | **IMPLEMENTED** (chưa VERIFIED) | `POST/GET /portfolio`; chưa test trên trình duyệt |
| 14 | Settings: hồ sơ, đổi mật khẩu, xóa tài khoản | **INCOMPLETE** | Có trang settings + `PUT /users/me/profile`; đổi mật khẩu/xóa tài khoản chưa thấy endpoint |
| 15 | Admin: quản lý user | **IMPLEMENTED** (chưa VERIFIED) | `GET /admin/users`, `PUT /admin/users/{uid}/role`; chưa test phân quyền trên trình duyệt |
| 16 | Admin: quản lý lesson (tạo/sửa/publish) | **IMPLEMENTED** (chưa VERIFIED) | `POST /admin/lessons`, `PUT /admin/lessons/{id}/status`; pytest `test_admin_publish_workflow` PASS |
| 17 | Admin: quản lý rubric | **INCOMPLETE** | Rubric model + seed có; chưa thấy editor rubric riêng trong admin router |
| 18 | Admin: audit log | **IMPLEMENTED** (chưa VERIFIED) | Model `AuditLog` + `GET /admin/ai-jobs`, `/admin/audit-logs` |
| 19 | Mastery / recommendation | **IMPLEMENTED** (chưa VERIFIED) | `GET /mastery`, `/recommendations`; công thức mastery chưa được kiểm chứng độc lập |
| 20 | Notifications / nhắc học | **NOT_STARTED** | Không thấy trong code (đúng như spec: ngoài phạm vi ưu tiên) |
| — | Seed curriculum | **IMPLEMENTED** | `curriculum.json`: 15 module, 75 lesson, 14 skill, 5 track; `/lessons` → 75 (gọi thật) |
| — | Expert review giáo trình / rubric | **NOT_STARTED** | Không có bằng chứng duyệt của chuyên gia |
| — | Ảnh tham chiếu + licence/attribution | **INCOMPLETE** | Chưa thấy attribution đầy đủ cho ảnh tham chiếu |
| — | Golden set chấm AI | **NOT_STARTED** | Chưa có golden set |
| — | Geometry utils / stroke ops / rubric calc | **IMPLEMENTED** (chưa VERIFIED độc lập) | `app/assessment/geometry.py` (222 dòng), `engine.py` (176 dòng); pytest PASS nhưng chưa benchmark |
| — | AI provider abstraction + fallback | **IMPLEMENTED** (chưa VERIFIED live) | `app/ai_providers.py`: local-cv → Pollinations (keyless) → HuggingFace (cần HF_TOKEN) → OpenRouter free (cần key); **chưa gọi live qua backend** |
| — | Docker Compose | **INCOMPLETE** | `docker-compose.yml` có đủ service nhưng **chưa chạy được**: Docker chưa cài; compose trỏ Postgres nhưng `requirements.txt` thiếu `psycopg2`; backend mặc định SQLite |
| — | Alembic migrations | **INCOMPLETE** | Chỉ là stub (`alembic/README.md`); schema tạo bằng `create_all()` |

**Tổng kết mới: product tests passed: 27 (pytest) + frontend build 14/14 trang.**
**Readiness verdict vẫn: NOT_READY** — E2E trình duyệt, bảo mật, Docker, expert
review và benchmark AI vẫn chưa có (xem `RELEASE_ACCEPTANCE.md` §2 cập nhật).
