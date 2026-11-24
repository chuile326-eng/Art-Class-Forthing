# DrawPath AI — Nền tảng học vẽ bằng AI

> **AI-Powered Drawing Learning Platform — Vietnamese-first.**
> Học vẽ theo vòng lặp: **Learn → Observe → Practice → Analyze → Correct → Improve → Master**
> *(Học → Quan sát → Luyện tập → Phân tích → Sửa lỗi → Cải thiện → Thành thạo)*

---

## ⚠️ Trạng thái xác minh — đọc trước (cập nhật 2026-11-24 ~23:01, Asia/Saigon)

Tài liệu này được viết với một điểm cần nói rõ ràng:

- **Brief gốc của đợt viết tài liệu này (xác minh ~22:56 ngày 2026-11-24) cho rằng thư mục repo đang TRỐNG** — không có `backend/`, không có `frontend/`, không có code.
- **Khi kiểm tra lại để viết tài liệu (~23:01 cùng ngày), repo đã KHÔNG còn trống.** `backend/` và `frontend/` đã xuất hiện với code thật (xem bảng dưới). Có khả năng các agent khác đã giao code trong khoảng thời gian giữa hai lần kiểm tra.
- **Những gì TÔI đã tự kiểm chứng bằng cách đọc file (không chạy):**
  - `backend/app/main.py` tồn tại (35 dòng), FastAPI, mount 6 router, có endpoint `GET /health` và `GET /`.
  - `backend/app/models.py` có 26 model SQLAlchemy; `backend/app/seed.py` seed 2 tài khoản và curriculum; `backend/tests/test_backend.py` có 172 dòng.
  - `frontend/` là Next.js 14.2.5 / React 18.3.1, có 24 file trong `src/` (login, register, onboarding, dashboard, roadmap, lessons, workspace, submissions, feedback, portfolio, settings, admin…).
  - Màu brand trong `frontend/tailwind.config.ts` khớp đúng spec: `#F7F3EA`, `#FFFCF7`, `#242424`, `#41403E`, `#D56B46`, `#EF8B73`, `#8C9B85`, `#A59ACB`.
  - **Docker KHÔNG được cài trong VM này** (`docker: command not found`) — chưa thể chạy `docker compose up` hay build image để kiểm chứng.
  - **Re-audit 2026-11-24 ~23:15 +07 ĐÃ chạy:** `pytest` backend **27 passed / 11,63 giây**; `npm run build` frontend **compiled successfully, 14/14 trang**; server thật `GET /health` → 200 (0,04s), login + `/auth/me` → 200. Chi tiết đầy đủ trong [TEST_RESULTS.md](./TEST_RESULTS.md) §2. Các kiểm thử E2E trên trình duyệt, Docker Compose, Alembic migration và đánh giá AI vẫn CHƯA chạy — xem [BLOCKERS.md](./BLOCKERS.md).
  - **Chưa có git repo** tại thư mục này (`fatal: not a git repository`) — chưa push gì lên GitHub, theo đúng yêu cầu làm việc local-only.
  - **Chưa có file gốc nào** trước khi viết đợt này: không có `README.md`, `docker-compose.yml`, `.env.example`, `.gitignore`, `backend/Dockerfile`, `frontend/Dockerfile` ở repo root; `.github/workflows/` và `docs/` đang trống.
- **Mâu thuẫn tài khoản seed cần xử lý (quan trọng):** brief yêu cầu ghi tài khoản demo `admin@drawpath.local / Admin123!` và `demo@drawpath.local / Demo123!`. Nhưng code thật trong `backend/app/seed.py` (dòng 73–74) ghi **khác**: `admin@drawpath.app / admin123` (admin) và `learner@drawpath.app / learner123` (learner). **Re-audit 2026-11-24 ~23:15 +07 đã đăng nhập thật bằng `learner@drawpath.app / learner123` (JSON POST `/auth/login` → 200, token JWT 141 ký tự, `GET /auth/me` → 200) — cặp `.app` này là cặp đúng.** Bộ tài liệu này ghi theo **code thật**, và ghi rõ cặp tài khoản trong brief là **đề xuất chưa khớp code** — backend agent cần xác nhận và thống nhất một bộ duy nhất, rồi cập nhật cả seed lẫn tài liệu. **Không dùng mật khẩu seed yếu ngoài môi trường local.**
- **ĐÃ SỬA (re-audit 2026-11-24 ~23:15 +07): tiền tố API KHÔNG còn lệch.** `frontend/src/lib/api.ts` dòng 1 hiện mặc định `http://localhost:8000` (không `/api/v1`), khớp với backend mount router ở gốc (`/auth`, `/tracks`, `/drawing`…). Đã gọi thật: `POST /auth/login` → 200, `GET /auth/me` → 200, `GET /modules` → 200, `GET /tracks` → 5 track, `GET /lessons` → 75 lesson. Ghi chú lệch `/api/v1` trong bản nháp trước là do đọc nhầm bản cũ của `api.ts` — đã đính chính ở [API.md](./API.md) §3.1.

> Quy tắc của dự án: **không tuyên bố tính năng/test nào là "passed" khi chưa chạy.** Mọi khẳng định "đã chạy được" trong tương lai phải kèm lệnh đã chạy, output và thời gian.

---

## 1. DrawPath AI là gì?

DrawPath AI là nền tảng học vẽ trực tuyến ưu tiên tiếng Việt, giúp người học đi từ "chưa biết gì" tới "vẽ thành thạo" bằng một vòng lặp học tập khép kín có AI hỗ trợ:

1. **Learn (Học)** — học lý thuyết ngắn gọn theo bài học (lesson) có mục tiêu rõ ràng.
2. **Observe (Quan sát)** — xem mẫu, phân tích tác phẩm tham chiếu, quan sát từng bước vẽ.
3. **Practice (Luyện tập)** — vẽ trực tiếp trong workspace (canvas) trên trình duyệt hoặc upload bài vẽ tay.
4. **Analyze (Phân tích)** — AI phân tích hình học / bố cục / tỷ lệ bài vẽ bằng thị giác máy tính (OpenCV/NumPy) và rubric.
5. **Correct (Sửa lỗi)** — nhận annotation trực tiếp trên bài vẽ: khoanh vùng lỗi, gợi ý sửa cụ thể từng điểm.
6. **Improve (Cải thiện)** — làm lại bài tập (revision), so sánh các phiên bản, nhận gợi ý bài tập tiếp theo.
7. **Master (Thành thạo)** — theo dõi mastery theo từng kỹ năng (skill), mở khóa bài học nâng cao khi đủ điều kiện.

**Tên sản phẩm "DrawPath AI" là tên tạm thời, dùng tập trung trong toàn bộ tài liệu và code.** Nếu đổi tên, đổi ở một chỗ duy nhất: biến `APP_NAME` / `NEXT_PUBLIC_APP_NAME` và tiêu đề tài liệu.

**Ngôn ngữ:** giao diện mặc định **tiếng Việt**, kiến trúc sẵn sàng i18n (chuẩn bị cho đa ngôn ngữ sau này, không hard-code chuỗi tiếng Việt vào logic nghiệp vụ).

**Đối tượng:** người mới học vẽ, người tự học muốn có lộ trình, giảng viên/admin quản trị nội dung.

---

## 2. Triết lý sản phẩm

- **Học bằng làm, không học bằng đọc.** Mỗi bài học kết thúc bằng một bài tập vẽ cụ thể, không có bài học "chỉ đọc".
- **Phản hồi cụ thể hơn lời khen chung chung.** AI phải chỉ ra *ở đâu* sai, *sai bao nhiêu*, *sửa thế nào* — bằng annotation trên hình và điểm theo rubric.
- **Tiến bộ đo được.** Mỗi kỹ năng có mastery score; mỗi bài nộp có lịch sử phiên bản; người học nhìn thấy đường tiến bộ của chính mình.
- **Không khóa người học vào một AI duy nhất.** AI provider là lớp trừu tượng có fallback chain (xem [ARCHITECTURE.md](./ARCHITECTURE.md) và `backend/app/ai_providers.py`): local CV → Pollinations → HuggingFace → OpenRouter free → OpenAI-compatible. Provider nào cũng phải ghi lại trong kết quả đánh giá; kết quả local-CV **không được** ghi nhận là output của LLM.
- **Miễn phí trước, trả phí sau (nếu có).** Mọi API bên ngoài trong dự án ưu tiên nguồn free; mỗi chức năng có nhiều API dự phòng để không bị ngắt quãng khi một API chết (quy tắc đứng của dự án Art-Class-Forthing, đặt 2026-11-24).

---

## 3. Stack công nghệ

| Lớp | Công nghệ (theo spec) | Trạng thái code đã đọc (2026-11-24 ~23:01) |
|---|---|---|
| Frontend | Next.js 14 / React 18 / TypeScript / Tailwind CSS | ✅ Có code: Next.js 14.2.5, React 18.3.1, Tailwind 3.4.10, TypeScript 5.5.4 (`frontend/package.json`); 24 file `src/` |
| Backend | Python 3.12 / FastAPI / Pydantic / SQLAlchemy / Alembic | ✅ Có code: FastAPI 0.115.6, SQLAlchemy 2.0.36, Pydantic 2.10.4, Alembic 1.14.0 trong `backend/requirements.txt`; `app/main.py` tồn tại |
| Database (mục tiêu) | PostgreSQL 16 | ⚠️ **Code hiện tại mặc định SQLite** (`drawpath.db`, `DATABASE_URL=<redacted>` trong `backend/.env.example`); Postgres chỉ có trong `docker-compose.yml` (chưa chạy thử). Xem [DATABASE.md](./DATABASE.md) |
| Queue / Cache | Redis 7 + Celery (worker) | 🟡 Spec có; **chưa thấy code Celery** trong `backend/app/` đã đọc — Celery worker là hạng mục cần bổ sung, xem [ARCHITECTURE.md](./ARCHITECTURE.md#7-những-gì-chưa-có-trong-code-đã-đọc) |
| Object storage | S3-compatible / MinIO | 🟡 Spec có; code hiện tại lưu upload local (`UPLOAD_DIR=./uploads`, `MAX_UPLOAD_MB=10`) — MinIO chỉ có trong `docker-compose.yml` (profile `minio`, chưa chạy thử) |
| Computer vision | OpenCV / NumPy / Pillow | ✅ Có code: `backend/app/assessment/geometry.py` (222 dòng) + `engine.py` (176 dòng), NumPy/Pillow; **OpenCV là optional** — code fallback sang NumPy/PIL nếu thiếu (xem `backend/README.md`) |
| Auth | JWT (python-jose) + bcrypt | ✅ Có code: `backend/app/auth.py`, `app/routers/auth_router.py` |
| Container | Docker Compose | 🟡 **Mới được tạo trong đợt viết tài liệu này** (`docker-compose.yml` ở root); **chưa build/chạy được vì Docker không có trong VM** |
| CI | GitHub Actions | 🟡 **Mới được tạo trong đợt này** (`.github/workflows/ci.yml`); chưa có lần chạy CI nào |

> Bảng trên phân biệt rõ **spec** (mục tiêu) và **code đã đọc**. "✅ Có code" nghĩa là file tồn tại và đã đọc sơ — **không** nghĩa là đã chạy thử và đúng.

---

## 4. Cấu trúc repo

```
art-class-forthing/                  # repo root (GitHub: chuile326-eng/Art-Class-Forthing, private)
├── README.md                        # ← file này
├── REQUIREMENTS.md                  # yêu cầu chức năng / phi chức năng (FR-xxx, P0/P1/P2)
├── ARCHITECTURE.md                  # kiến trúc C4, data flow, mô hình bảo mật
├── DATABASE.md                      # thiết kế ER, migration, seed, retention
├── API.md                           # đặc tả REST API (đối chiếu code router thật)
├── DEPLOYMENT.md                    # chạy local, Docker Compose, CI, checklist
├── docker-compose.yml               # db + redis + backend + frontend (+ minio optional)
├── .env.example                     # biến môi trường mẫu (không chứa secret thật)
├── .gitignore
├── .github/workflows/ci.yml         # lint + typecheck + pytest + compose config check
├── docs/                            # thư mục docs phụ (đang trống)
├── backend/                         # FastAPI backend — THUỘC AGENT BACKEND, không sửa ở đây
│   ├── app/main.py                  # entrypoint, mount 6 router, GET /health
│   ├── app/models.py                # 26 model SQLAlchemy
│   ├── app/routers/                 # auth, curriculum, drawing, submission, learning, admin
│   ├── app/assessment/              # geometry.py + engine.py (đánh giá rubric)
│   ├── app/ai_providers.py          # fallback chain local-cv → Pollinations → HF → OpenRouter → OpenAI-compat
│   ├── app/seed.py + app/data/curriculum.json   # seed: 15 module, 75 lesson, 14 skill (theo backend/README)
│   ├── alembic/                     # ⚠️ STUB — xem DATABASE.md (hiện dùng create_all khi startup)
│   ├── requirements.txt
│   ├── .env.example
│   ├── tests/test_backend.py        # 172 dòng — CHƯA CHẠY trong đợt này
│   └── Dockerfile                   # scaffolding, tạo trong đợt viết tài liệu này
└── frontend/                        # Next.js frontend — THUỘC AGENT FRONTEND, không sửa ở đây
    ├── src/app/                     # login, register, onboarding, dashboard, roadmap,
    │                                # lessons/[id], workspace, submissions, feedback, portfolio, admin…
    ├── src/components/              # Header, Footer, Workspace, FeedbackView, ui
    ├── src/lib/                     # api.ts (mặc định http://localhost:8000, khớp backend), curriculum.ts, canvas.ts
    ├── package.json                 # Next 14.2.5, React 18.3.1, Tailwind 3.4.10
    ├── tailwind.config.ts           # brand colours (khớp spec)
    └── Dockerfile                   # scaffolding, tạo trong đợt viết tài liệu này
```

**Ranh giới làm việc:** đợt viết tài liệu này chỉ tạo/sửa file ở **repo root** (docs, compose, env mẫu, gitignore, CI, Dockerfiles scaffolding). **Không sửa bất kỳ file nào trong `backend/` và `frontend/`** ngoại trừ việc tạo mới `backend/Dockerfile` và `frontend/Dockerfile` (hai file này chưa tồn tại; chúng chỉ là scaffolding chờ code thật).

---

## 5. Chạy local (không Docker)

### 5.1 Backend

```bash
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # sửa SECRET_KEY thành chuỗi ngẫu nhiên dài
uvicorn app.main:app --reload --port 8000
# Swagger UI: http://localhost:8000/docs
# Health:    http://localhost:8000/health
```

Mặc định backend dùng SQLite (`drawpath.db`, tự tạo khi startup + seed dữ liệu mẫu). Để dùng PostgreSQL, đặt `DATABASE_URL=<redacted>` trong `.env` (xem [DATABASE.md](./DATABASE.md#7-postgresql-vs-sqlite-thực-trạng) và [DEPLOYMENT.md](./DEPLOYMENT.md)).

> ⚠️ Các lệnh trên **chưa được chạy kiểm chứng trong đợt viết tài liệu này** (chỉ trích từ `backend/README.md`). Nếu chạy lỗi, đó là việc cần ghi lại và sửa, không được ghi đè thành "đã chạy được".

### 5.2 Frontend

```bash
cd frontend
npm install
cp ../.env.example .env.local   # hoặc tạo .env.local với NEXT_PUBLIC_API_URL
npm run dev
# Mở http://localhost:3000
```

Biến quan trọng: `NEXT_PUBLIC_API_URL` — mặc định trong code là `http://localhost:8000` (khớp backend, không có `/api/v1`).

---

## 6. Chạy bằng Docker Compose

```bash
cp .env.example .env   # sửa SECRET_KEY, POSTGRES_PASSWORD
docker compose up --build
# Frontend: http://localhost:3000
# Backend:  http://localhost:8000/docs  |  http://localhost:8000/health
# MinIO:    http://localhost:9001 (chỉ khi bật profile minio)
```

**Thành thật mà nói:**

- File `docker-compose.yml` được viết trong đợt này và **chưa từng được chạy** — Docker không được cài trong VM viết tài liệu.
- `backend/Dockerfile` và `frontend/Dockerfile` là **scaffolding tối thiểu**, chờ code thật (code thật đã có, nhưng Dockerfile chưa từng build thử).
- Backend trong compose trỏ `DATABASE_URL` sang Postgres, trong khi code backend mặc định SQLite — cần kiểm chứng rằng `app/database.py` đọc `DATABASE_URL` đúng và Alembic/create_all hoạt động trên Postgres trước khi coi compose là "chạy được". Xem chi tiết trong [DEPLOYMENT.md](./DEPLOYMENT.md).

---

## 7. Biến môi trường

Bảng đầy đủ trong [.env.example](./.env.example) và [DEPLOYMENT.md](./DEPLOYMENT.md#3-biến-môi-trường). Các biến chính:

| Biến | Dùng cho | Giá trị mẫu local |
|---|---|---|
| `DATABASE_URL` | Backend → Postgres | `postgresql+psycopg2://drawpath:drawpath@localhost:5432/drawpath` (compose dùng service `db`) |
| `REDIS_URL` | Backend → Redis/Celery | `redis://localhost:6379/0` |
| `SECRET_KEY` | Ký JWT | Chuỗi ngẫu nhiên dài — **bắt buộc đổi, không dùng giá trị mẫu** |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Hạn token JWT | `10080` (7 ngày, theo `backend/.env.example`) |
| `NEXT_PUBLIC_API_URL` | Frontend → Backend | `http://localhost:8000` (mặc định trong code, khớp backend) |
| `UPLOAD_DIR` / `MAX_UPLOAD_MB` | Upload bài vẽ | `./uploads` / `10` |
| `OPENROUTER_API_KEY`, `HF_TOKEN`, `OPENAI_API_KEY` | AI provider (đều optional) | Để trống → dùng local-CV + Pollinations (keyless) |

**Không bao giờ commit file `.env` thật. Không đưa secret thật vào `.env.example`.**

---

## 8. Tài khoản seed / demo

Tài khoản seed được tạo bởi backend seed script (`backend/app/seed.py`, chạy khi backend startup). **Theo code thật đã đọc:**

| Vai trò | Email | Mật khẩu (seed) | Ghi chú |
|---|---|---|---|
| Admin | `admin@drawpath.app` | `admin123` | role `admin` — đổi ngay khi lên môi trường chia sẻ (đã đăng nhập thật 2026-11-24) |
| Learner | `learner@drawpath.app` | `learner123` | role `learner` (đã đăng nhập thật 2026-11-24: `POST /auth/login` JSON → 200) |

⚠️ **Mâu thuẫn chưa giải quyết:** brief đợt này yêu cầu cặp `admin@drawpath.local / Admin123!` và `demo@drawpath.local / Demo123!`. Cặp đó **không có trong code** — code dùng `admin@drawpath.app / admin123` và `learner@drawpath.app / learner123`, không có user `demo@`. Cần thống nhất một bộ duy nhất trước khi demo cho người khác; tới lúc đó, **chỉ dùng cặp trong bảng trên** vì đó là cặp code thật sự tạo ra và đã đăng nhập thật.

Tài khoản seed chỉ dùng cho **local demo**, không dùng ở production. Xem chi tiết seed data trong [DATABASE.md](./DATABASE.md#6-seed-data).

---

## 9. Brand & giao diện

| Token | Màu | Hex |
|---|---|---|
| Warm Paper (nền chính) | giấy ấm | `#F7F3EA` |
| Natural Ivory (nền thẻ) | trắng ngà | `#FFFCF7` |
| Graphite (chữ chính) | chì đậm | `#242424` |
| Charcoal (chữ phụ) | than | `#41403E` |
| Terracotta (accent chính) | đất nung | `#D56B46` |
| Coral (accent phụ) | san hô | `#EF8B73` |
| Sage (thành công / tiến bộ) | xô thơm | `#8C9B85` |
| Lavender (thông tin) | oải hương | `#A59ACB` |

Font: display `"Playfair Display"` (serif) cho tiêu đề, sans `"Be Vietnam Pro"` cho nội dung — đã cấu hình trong `frontend/tailwind.config.ts`. Ngôn ngữ mặc định: **tiếng Việt**.

---

## 10. Tài liệu khác trong bộ này

| File | Nội dung |
|---|---|
| [REQUIREMENTS.md](./REQUIREMENTS.md) | Yêu cầu chức năng FR-xxx theo 20 nhóm scope, yêu cầu phi chức năng, out-of-scope, độ ưu tiên P0/P1/P2 |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Kiến trúc C4, module boundaries, luồng submit → assess → feedback, AI fallback chain, bảo mật |
| [DATABASE.md](./DATABASE.md) | Thiết kế ER (26 model đã có + 5 entity quy hoạch), migration Alembic, seed, retention |
| [API.md](./API.md) | Đặc tả REST API đối chiếu router thật, conventions, error envelope, rate limit |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Chạy local, Docker Compose, env theo môi trường, migrations, health, CI, checklist |
| [docker-compose.yml](./docker-compose.yml) | db (Postgres 16) + redis + backend + frontend (+ minio optional) |
| [.env.example](./.env.example) | Biến môi trường mẫu, giá trị placeholder an toàn |
| [backend/README.md](./backend/README.md) | Tài liệu riêng của backend agent (đọc để biết cách chạy backend) |
| `frontend/` (không có README riêng) | Xem `frontend/package.json` + `src/lib/api.ts` |

---

## 11. Trạng thái dự án (tóm tắt trung thực)

| Hạng mục | Trạng thái (2026-11-24 ~23:01) |
|---|---|
| Tài liệu đặc tả (đợt này) | ✅ Đã viết: README, REQUIREMENTS, ARCHITECTURE, DATABASE, API, DEPLOYMENT, docker-compose, .env.example, .gitignore, CI, 2 Dockerfile scaffolding |
| Backend code | 🟡 Code tồn tại (đã đọc sơ, ~1.886 dòng `app/` không tính test), **chưa chạy thử, chưa test** |
| Frontend code | 🟡 Code tồn tại (24 file `src/`), **chưa chạy thử, chưa build** |
| Database migrations | 🔴 Alembic chỉ là stub (`backend/alembic/README.md` tự nhận); hiện dùng `create_all()` khi startup |
| Docker Compose | 🔴 File mới tạo, **chưa chạy** (không có Docker trong VM) |
| CI | 🔴 Workflow mới tạo, **chưa có lần chạy nào** |
| Production deploy | 🔴 **Chưa có gì được deploy**; không có infra trả phí |
| GitHub | 🔴 Chưa có git repo local; **không push** trong đợt này |

**Việc cần làm tiếp theo (để parent agent phân công):** (1) thống nhất tài khoản seed (code dùng `.app`, brief dùng `.local` + `demo@` — chưa khớp); (2) ✅ `pytest` (27 passed) và `npm run build` (14/14 trang) đã chạy trong re-audit 2026-11-24; (3) cài Docker (môi trường khác) và chạy `docker compose up --build` để kiểm chứng compose — lưu ý compose trỏ Postgres nhưng `requirements.txt` chưa có `psycopg2`; (4) viết migration Alembic thật thay cho `create_all()`; (5) bổ sung Celery worker + MinIO integration nếu giữ đúng spec; (6) sửa `SECRET_KEY` mặc định + CORS `allow_origins=["*"]` trước mọi deploy chia sẻ.
