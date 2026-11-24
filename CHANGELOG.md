# CHANGELOG.md — DrawPath AI

> Định dạng theo [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
> (Added / Changed / Fixed / Removed / Security).
> Mọi entry ghi ngày thật. Không ghi tính năng chưa chạy được như "đã hoàn thành".

## [Unreleased]

### Added
- (Trống — thêm vào đây khi có thay đổi chưa release.)

### Changed
- (Trống.)

### Fixed
- (Trống.)

### Security
- (Trống.)

> **Lưu ý:** các file trong `backend/` / `frontend/` do các agent song song tạo
> sau 22:56 ngày 2026-11-24 chưa được ghi vào changelog này, vì chưa được kiểm
> chứng chạy được trong đợt viết tài liệu này. Khi kiểm chứng xong, ghi entry
> tương ứng vào đây với ngày + commit thật.

## [0.1.0] — 2026-11-24

### Added
- Repo GitHub `chuile326-eng/Art-Class-Forthing` được tạo (private, nhánh `main`,
  có README) — ngày 2026-11-24 (theo MEMORY).
- Bộ tài liệu governance/QA Phase 1 (docs-before-code), viết ngày 2026-11-24,
  trạng thái IMPLEMENTED nhưng **unreviewed**:
  - `SECURITY.md` — threat model, auth, upload, privacy, AI data handling.
  - `SECURITY_REVIEW.md` — checklist bảo mật, toàn bộ NOT_STARTED / NOT TESTED.
  - `TEST_PLAN.md` — testing pyramid, Flows A–H, entry/exit criteria.
  - `TEST_CASES.md` — ~90 test cases (E2E, auth, security, canvas,
    submission/AI, admin, unit), tất cả NOT RUN.
  - `TEST_RESULTS.md` — chỉ kết quả thật: môi trường (Python 3.12.3,
    Node v24.22.1, npm 10.9.4, Docker không cài), pytest/build/py_compile
    NOT RUN, 0 product test PASS; kiểm tra API ngoài 2026-11-24 22:56 UTC.
  - `PERFORMANCE_REPORT.md` — chỉ số đo thật (API ngoài); còn lại NOT MEASURED.
  - `BUG_REPORT.md` — BUG-001 (Pollinations image 503 flaky), BUG-002
    (Openverse 16,6s) + bảng rủi ro spec.
  - `KNOWN_LIMITATIONS.md` — giới hạn đã biết (no code, no expert review,
    AI free, stylus, no production, no user testing…).
  - `TASKS.md` — task list Phases 1–10.
  - `IMPLEMENTATION_STATUS.md` — trạng thái 20 scope groups + curriculum +
    engine + AI + admin + DevOps; verdict NOT_READY.
  - `DECISIONS.md` — 12 quyết định kiến trúc/sản phẩm (stack, tên DrawPath AI,
    free-API-first, local CV fallback, no paid keys, no production deploy
    without approval, Vietnamese-first, private-by-default…).
  - `BLOCKERS.md` — BLK-001…007.
  - `RELEASE_ACCEPTANCE.md` — P0 acceptance matrix, verdict NOT_READY.
  - `CHANGELOG.md` — file này.
- Kiểm tra API miễn phí bên ngoài ngày 2026-11-24 22:56 UTC (kết quả trong
  `TEST_RESULTS.md` §3):
  - Pollinations text HTTP 200, 4,35s (6,22s ở lần đo trước).
  - Pollinations image HTTP 503 lần đầu rồi HTTP 200 khi retry (5,78s).
  - Openverse HTTP 200, 16,6s.
  - Wikipedia REST HTTP 200, 0,59s.
  - HuggingFace Inference không token: timeout 30s (NOT VERIFIED, key-gated).
  - OpenRouter `/v1/models` HTTP 200 không key (chỉ list model; chat cần key).
  - DuckDuckGo Instant Answer HTTP 202, abstract rỗng (không phù hợp).

### Known issues (đã biết trong v0.1.0)
- Chưa có code backend/frontend nào được xác minh chạy được tại thời điểm
  kiểm tra (repo được ghi nhận là trống lúc ~22:56 +07). Xem `BLOCKERS.md`.
- 0 product test đã PASS. Verdict: **NOT_READY**.
- Pollinations image flaky (BUG-001), Openverse chậm (BUG-002).

## [0.1.1] — 2026-11-24 — Re-audit: code song song + chạy thật lần đầu

### Added
- 29 file tài liệu tại repo root (2.688 + 2.321 + 2.001 dòng từ 3 nhóm viết docs).
- `docker-compose.yml`, `backend/Dockerfile`, `frontend/Dockerfile`, `.env.example`, `.gitignore`, `.github/workflows/ci.yml`.

### Verified (chạy thật, xem `TEST_RESULTS.md` §5)
- Backend pytest: **27 passed, 11,63s**; `py_compile` PASS.
- Frontend `npm run build`: **compiled successfully, 14/14 trang**.
- Server thật: `/health` 200 (0,04s), `/modules` 200, `/tracks` 5, `/lessons` 75, login seed JSON + `/auth/me` 200.
- Seed curriculum: 15 module, 75 lesson, 14 skill, 5 track.

### Fixed (tài liệu)
- Đính chính seed domain: `.app` (code thật), không phải `.local`.
- Đính chính tiền tố API: frontend và backend đều dùng gốc `http://localhost:8000`, không lệch `/api/v1`.
- Đính chính tổng endpoint: **48** (46 router + 2 hệ thống), không phải 42.

### Known issues mới
- BLK-008: compose cần `psycopg2` (chưa có trong requirements). BLK-009: CORS `*` + `SECRET_KEY` mặc định. BLK-010: seed `.app` ≠ brief `.local`. BLK-011: 74 warning `utcnow()` deprecated.

## 2026-11-24 — Final integration fixes (parent verification)
- Added `psycopg2-binary` to backend requirements so docker-compose Postgres actually works (BLK-008 fixed).
- CORS no longer `*`: defaults to `http://localhost:3000` (+127.0.0.1), override via `CORS_ORIGINS` env (BLK-009 partial).
- `SECRET_KEY` now required in production (`ENV=production` raises without it); dev fallback kept only for local dev.
- Parent re-verified: pytest 27 passed; live uvicorn `/health` ok, 15 modules, 75 lessons, 5 tracks, learner login token 141 chars, `/auth/me` ok.
