# BLOCKERS.md — DrawPath AI — Blockers

> **Ngày:** 2026-11-24
> Blocker = thứ đang chặn tiến độ hoặc chặn việc kết luận sản phẩm "sẵn sàng".
> Mỗi blocker ghi owner, impact, và điều kiện để gỡ.
> Không xóa blocker khi chưa có bằng chứng đã gỡ.

## Bảng blockers

| ID | Blocker | Owner | Impact | Điều kiện gỡ | Status |
|---|---|---|---|---|---|
| BLK-001 | **No backend/frontend code yet (theo kiểm tra 22:56)** — repo được ghi nhận là trống: không có `backend/`, `frontend/`, không có code, test, Dockerfile | Parallel agents (backend/frontend) | **Nothing runnable** — không chạy được app, không test được flow nào, không demo được cho user | Backend + frontend slice đầu tiên chạy được local (xem `RELEASE_ACCEPTANCE.md`), có bằng chứng chạy trong `TEST_RESULTS.md` | **RESOLVED 2026-11-24 ~23:15 +07** — code đã có và chạy được: pytest 27 passed, build 14/14, server `/health` 200, login + `/auth/me` 200 (xem `TEST_RESULTS.md` §5) |
| BLK-002 | **Live multimodal AI chưa gọi live qua backend** — abstraction ĐÃ có (`app/ai_providers.py`: local-cv → Pollinations → HuggingFace → OpenRouter free) nhưng chưa gọi live qua backend; provider key-gated cần key | Backend agent + user (phê duyệt key nếu cần) | Tutor/feedback qua LLM chưa được chứng minh chạy qua backend; chỉ local CV đã có code | Gọi `/tutor/chat` + `/assess` live qua backend, ghi kết quả; provider key-gated chỉ khi có key + phê duyệt bằng văn bản | OPEN |
| BLK-003 | **Pollinations image flakiness (503 observed once)** — HTTP 503 lần đầu (3,03s), HTTP 200 khi retry (5,78s) ngày 2026-11-24 | Backend agent (retry/fallback) | Chấm/tạo ảnh qua Pollinations có thể lỗi ngẫu nhiên trước mặt user nếu không có retry/fallback | Retry có giới hạn + backoff + fallback local CV đã triển khai và test PASS (TC-E2E-G-01) | OPEN |
| BLK-004 | **No expert curriculum review** — giáo trình, rubric, golden set chưa được chuyên gia duyệt | User / chuyên gia mỹ thuật-sư phạm | Không thể tuyên bố nội dung lesson hay điểm AI "chính xác"; golden set không có chuẩn đáng tin | Có văn bản duyệt của chuyên gia; sửa theo góp ý; ghi vào CHANGELOG | OPEN |
| BLK-005 | **No stylus device** — không có thiết bị stylus trong môi trường kiểm tra | User / tester | Pressure/tilt/palm rejection chưa test được; canvas chỉ test bằng chuột/touch | Có thiết bị stylus + chạy TC-CANVAS-05, ghi kết quả | OPEN |
| BLK-006 | **Docker not installed in this VM (compose untested locally)** — `which docker` không trả về gì; psql cũng không cài | DevOps / người chạy VM | Không chạy được Docker Compose local; không kiểm chứng được DB/Redis/MinIO chạy cùng lúc trong VM này | Cài Docker (hoặc chạy compose ở máy/CI có Docker) + `docker compose up` chạy được, ghi kết quả | OPEN |
| BLK-007 | **No production infra / approval** — không có hạ tầng production, không có phê duyệt deploy | User (phê duyệt) | Không deploy production được; không có user thật | Có hạ tầng + checklist release đạt + phê duyệt bằng văn bản của user (xem `RELEASE_ACCEPTANCE.md`, `DECISIONS.md` D-06) | OPEN |

## Ghi chú về BLK-001 (quan trọng nhất)

- BLK-001 được ghi theo **cuộc kiểm tra lúc ~22:56 +07 ngày 2026-11-24**,
  khi repo được ghi nhận là trống.
- Sau thời điểm đó, các agent song song **đã tạo file** trong `backend/` và
  `frontend/` (quan sát lúc ~23:01 +07). Người viết file này **không chạm vào,
  không chạy, không review sâu** các file đó, nên **không đổi status BLK-001**
  trong file này.
- BLK-001 chỉ được đổi thành gỡ bỏ khi có người kiểm chứng: code chạy được
  (backend khởi động, frontend build, flow đầu tiên chạy), và ghi bằng chứng
  (lệnh + output) vào `TEST_RESULTS.md`.

## Tóm tắt kết quả kiểm tra API miễn phí (2026-11-24 22:56 UTC)

Đây là phần duy nhất đã chạy thật trong đợt kiểm tra; liên quan trực tiếp tới
BLK-002 và BLK-003.

| Provider / Endpoint | Kết quả | Latency | Kết luận |
|---|---|---|---|
| Pollinations text — `https://text.pollinations.ai/` | HTTP 200 | 4,35s (6,22s ở lần đo prompt ngắn trước đó) | Chạy được, chậm |
| Pollinations image | HTTP 503 lần đầu (3,03s) → HTTP 200 khi retry (5,78s, JPEG 8.666 byte) | 3,03s / 5,78s | **FLAKY** (BUG-001) |
| Openverse | HTTP 200 | 16,6s | Chạy được, rất chậm (BUG-002) |
| Wikipedia REST | HTTP 200 | 0,59s | Nhanh |
| HuggingFace Inference (không token) | HTTP 000 — timeout sau 30s | > 30s | NOT VERIFIED, key-gated |
| OpenRouter `/v1/models` (không key) | HTTP 200 | — | Chỉ list model; chat cần key (key-gated) |
| DuckDuckGo Instant Answer | HTTP 202, abstract rỗng | — | Đã kiểm tra, không phù hợp |

Chi tiết đầy đủ: `TEST_RESULTS.md` §3. Bug: `BUG_REPORT.md` BUG-001/BUG-002.

## Các blocker đã gỡ (lịch sử)

| ID | Ngày gỡ | Bằng chứng |
|---|---|---|
| (chưa có) | — | — |

## Blocker mới phát hiện trong re-audit 2026-11-24 ~23:15 +07

| ID | Blocker | Owner | Impact | Điều kiện gỡ | Status |
|---|---|---|---|---|---|
| BLK-008 | **Docker Compose chưa chạy được: `requirements.txt` thiếu `psycopg2`** — compose đặt `DATABASE_URL=postgresql+psycopg2://…@db:5432/drawpath` nhưng backend mặc định SQLite và requirements không có `psycopg2`/`redis`/`celery`; Docker cũng chưa cài trong VM này | Backend/DevOps | `docker compose up` sẽ lỗi ngay ở backend (không import được driver Postgres) | Thêm `psycopg2-binary` (và `redis`/`celery` nếu giữ worker) vào requirements + chạy `docker compose up --build` thành công ở môi trường có Docker | OPEN |
| BLK-009 | **CORS `allow_origins=["*"]` + `SECRET_KEY` mặc định trong code** (`app/main.py`, `app/auth.py:12` — fallback `"dev-secret-change-me-drawpath"`) | Backend agent | Không được deploy chia sẻ/công khai khi chưa sửa: mọi origin đều gọi được API, JWT ký bằng key ai cũng đoán được | CORS giới hạn đúng origin frontend; `SECRET_KEY` bắt buộc qua env, không fallback | OPEN |
| BLK-010 | **Seed domain `.app` ≠ brief `.local`** — code seed `admin@drawpath.app / admin123`, `learner@drawpath.app / learner123`; brief yêu cầu `admin@drawpath.local / Admin123!` + `demo@drawpath.local / Demo123!` (không có user `demo@`) | Parent agent / backend agent | Demo theo brief sẽ đăng nhập thất bại; tài liệu cũ ghi nhầm `.local` đã đính chính | Thống nhất một bộ duy nhất (khuyến nghị giữ `.app` đã chạy thật, hoặc đổi seed + tài liệu cùng lúc) | OPEN |
| BLK-011 | **`datetime.utcnow()` deprecated (74 warnings trong pytest)** — dùng ở `app/auth.py`, `app/models.py`, `submission_router.py` | Backend agent | Chưa chặn chạy, nhưng sẽ lỗi ở Python tương lai; nợ kỹ thuật | Đổi sang `datetime.now(timezone.utc)` + pytest 0 warning | OPEN (Minor) |
