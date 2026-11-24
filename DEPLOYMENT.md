# DEPLOYMENT.md — Triển khai DrawPath AI

> **Trạng thái:** hướng dẫn mục tiêu, viết ngày 2026-11-24.
> **Chưa có môi trường nào được deploy.** Chưa chạy `docker compose up`, chưa chạy `pytest`, chưa chạy `npm run build` trong đợt viết tài liệu này — Docker **không được cài** trong VM này (`docker: command not found`). Mọi bước dưới đây là **hướng dẫn cần kiểm chứng**, không phải biên bản chạy thành công.
> **Không dùng infra trả phí** ở giai đoạn này (NFR-COST-01): Postgres/Redis/MinIO tự host qua Docker Compose; AI provider ưu tiên free/keyless.

---

## 1. Tổng quan môi trường

| Môi trường | Mục đích | DB | Chạy bằng |
|---|---|---|---|
| Local dev (không Docker) | Dev backend/frontend riêng lẻ | SQLite mặc định (`drawpath.db`) | `uvicorn` + `npm run dev` |
| Local dev (Docker Compose) | Chạy đủ stack giống production thu nhỏ | PostgreSQL 16 (service `db`) | `docker compose up --build` |
| CI (GitHub Actions) | Lint + typecheck + test + validate compose | SQLite (test) | `.github/workflows/ci.yml` — chưa có lần chạy nào |
| Production | **Chưa có** | PostgreSQL (chưa provision) | Chưa quyết định nền tảng |

---

## 2. Chạy local không Docker

### 2.1 Backend

```bash
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # sửa SECRET_KEY thành chuỗi ngẫu nhiên dài
uvicorn app.main:app --reload --port 8000
```

- Swagger UI: http://localhost:8000/docs
- Health: http://localhost:8000/health → `{"status": "ok", "service": "drawpath-ai", "version": "0.1.0"}`
- DB mặc định: SQLite `drawpath.db` (tự tạo + seed khi startup).
- Muốn dùng Postgres local: đặt `DATABASE_URL=<redacted>` trong `backend/.env` (xem §3.2).

> Trích từ `backend/README.md`. **Chưa chạy kiểm chứng trong đợt này** — nếu chạy lỗi, ghi lại lỗi và sửa, không ghi đè thành "đã chạy được".

### 2.2 Frontend

```bash
cd frontend
npm install
npm run dev
# Mở http://localhost:3000
```

Biến `NEXT_PUBLIC_API_URL` đặt trong `frontend/.env.local` (ví dụ `http://localhost:8000` — mặc định trong code, khớp backend, không có `/api/v1`; đã gọi thật ngày 2026-11-24).

### 2.3 Kiểm thử (chưa chạy)

```bash
cd backend
pytest -q                 # backend/tests/test_backend.py (172 dòng)

cd frontend
npm run lint              # next lint
npm run build             # next build — kiểm chứng production build
npx tsc --noEmit          # typecheck
```

**Chưa có kết quả test nào.** Lần chạy đầu tiên phải ghi lại: lệnh, thời gian, số test pass/fail, log lỗi (nếu có).

---

## 3. Biến môi trường

### 3.1 Bảng đầy đủ

Xem [.env.example](./.env.example) (file mẫu ở repo root — giá trị placeholder an toàn, không có secret thật).

| Biến | Bắt buộc | Dùng cho | Ví dụ local |
|---|---|---|---|
| `DATABASE_URL` | Có (compose) | Backend → DB | `postgresql+psycopg2://drawpath:drawpath@db:5432/drawpath` |
| `REDIS_URL` | Có (khi có worker) | Backend/worker → Redis | `redis://redis:6379/0` |
| `SECRET_KEY` | **Có** | Ký JWT | Chuỗi ngẫu nhiên ≥ 32 ký tự — **không dùng giá trị mẫu** |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Không | Hạn JWT | `10080` (7 ngày) |
| `CORS_ORIGINS` | Có (production) | Giới hạn CORS | `http://localhost:3000` (local); domain thật (prod) |
| `NEXT_PUBLIC_API_URL` | Có | Frontend → Backend | `http://localhost:8000` (mặc định trong code) |
| `NEXT_PUBLIC_APP_NAME` | Không | Tên hiển thị | `DrawPath AI` |
| `UPLOAD_DIR` | Không | Thư mục upload local | `./uploads` |
| `MAX_UPLOAD_MB` | Không | Giới hạn upload | `10` |
| `S3_ENDPOINT` / `S3_BUCKET` / `S3_ACCESS_KEY` / `S3_SECRET_KEY` | Khi dùng MinIO | Storage | Xem `.env.example` |
| `OPENROUTER_API_KEY` | Không (optional) | AI provider | Để trống → bỏ qua provider này |
| `HF_TOKEN` | Không (optional) | AI provider | Để trống → bỏ qua provider này |
| `OPENAI_API_KEY` / `OPENAI_BASE_URL` | Không (optional) | AI provider | Để trống → bỏ qua provider này |
| `SEED_DEMO_USERS` | Không | Bật/tắt seed user demo | `true` (local) / `false` (production — đề xuất, chưa có trong code) |
| `POSTGRES_USER` / `POSTGRES_PASSWORD` / `POSTGRES_DB` | Có (compose) | Service `db` | Xem `docker-compose.yml` + `.env.example` |

### 3.2 Quy tắc

- **Không commit file `.env` thật** (đã có trong `.gitignore`).
- `.env.example` chỉ chứa placeholder; ai clone repo thì `cp .env.example .env` rồi sửa.
- `SECRET_KEY` production: sinh bằng `python3 -c "import secrets; print(secrets.token_urlsafe(32))"`, không dùng lại key của local.
- API key AI provider: chỉ qua biến môi trường, không hard-code, không log.

---

## 4. Docker Compose

### 4.1 Chạy

```bash
cp .env.example .env   # sửa SECRET_KEY, POSTGRES_PASSWORD
docker compose up --build
docker compose ps
docker compose logs -f backend
docker compose down        # dừng
docker compose down -v     # dừng + xóa volume (MẤT DỮ LIỆU local — cẩn thận)
```

- Frontend: http://localhost:3000
- Backend: http://localhost:8000/docs · http://localhost:8000/health
- MinIO console: http://localhost:9001 (chỉ khi chạy với `--profile minio`)

### 4.2 Services (xem `docker-compose.yml`)

| Service | Image / Build | Port | Healthcheck | Volume |
|---|---|---|---|---|
| `db` | `postgres:16-alpine` | 5432 | `pg_isready` | `pgdata` |
| `redis` | `redis:7-alpine` | 6379 | `redis-cli ping` | `redisdata` |
| `backend` | build `./backend` | 8000 | `curl /health` | `uploads` (./uploads) |
| `frontend` | build `./frontend` | 3000 | — (Next.js tự có `/`) | — |
| `minio` (profile `minio`) | `minio/minio` | 9000 / 9001 | `curl /minio/health/live` | `miniadata` |

### 4.3 ⚠️ Chưa chạy thử — đọc kỹ trước khi tin

- File `docker-compose.yml` được tạo trong đợt viết tài liệu này và **chưa từng chạy** (không có Docker trong VM).
- `backend/Dockerfile` và `frontend/Dockerfile` là **scaffolding tối thiểu**, chưa từng build thử.
- Backend container chạy `uvicorn app.main:app` — cần `requirements.txt` cài được trong image `python:3.12-slim` (cần `curl` cho healthcheck — đã thêm vào Dockerfile).
- Lần chạy đầu tiên cần kiểm chứng và ghi lại: build có qua không, `backend` có kết nối được `db` không, `/health` có trả `ok` không, seed có chạy không, frontend có gọi được backend không.

---

## 5. Migrations + seed

### 5.1 Migration (mục tiêu — chưa có migration thật)

```bash
cd backend
alembic upgrade head      # áp migration mới nhất
alembic current           # xem revision hiện tại
alembic revision --autogenerate -m "mo ta thay doi"   # tạo revision mới
```

**Thực trạng:** Alembic chỉ là stub (`backend/alembic/README.md`); hiện tại schema được tạo bằng `Base.metadata.create_all()` khi startup. **Không chạy `alembic upgrade head` được cho tới khi có revision thật.** Xem [DATABASE.md](./DATABASE.md#5-migration-strategy-alembic).

**Quy tắc:**
- Không sửa revision đã merge.
- Production chỉ chạy `upgrade head`, không `downgrade` tay khi chưa backup.
- Seed tách khỏi migration (seed chạy bằng `app/seed.py`).

### 5.2 Seed

Seed chạy tự động khi backend startup (`app/main.py` gọi `seed(db)`):

- Tài khoản (theo code thật `backend/app/seed.py` dòng 73–74; đã đăng nhập thật `learner@drawpath.app` ngày 2026-11-24): `admin@drawpath.app` / `admin123` (admin), `learner@drawpath.app` / `learner123` (learner).
- Curriculum: 15 module, 75 lesson, 14 skill từ `app/data/curriculum.json`.
- Seed phải idempotent (chạy lại không trùng lặp).
- ⚠️ Mâu thuẫn tài khoản seed với brief (xem [README.md](./README.md#8-tài-khoản-seed--demo)) — thống nhất trước khi demo.
- Production: tắt seed user demo hoặc đổi mật khẩu ngay sau khi tạo.

### 5.3 Health endpoints

| Endpoint | Mục đích | Trạng thái |
|---|---|---|
| `GET /health` | Backend sống? → `{"status": "ok", ...}` | ✅ Đã có trong `app/main.py` |
| `GET /health/ready` | DB + Redis + storage sẵn sàng? | 🟡 Quy hoạch — chưa có trong code |
| `GET /` | Thông tin service + link docs | ✅ Đã có |

---

## 6. Gap đã biết — cần xử lý trước khi chạy compose

| # | Gap | Cách xử lý |
|---|---|---|
| 1 | `requirements.txt` thiếu `psycopg2` (driver Postgres) | Backend agent thêm `psycopg2-binary` (hoặc `psycopg[binary]`) + pin version |
| 2 | `requirements.txt` thiếu `redis`, `celery` (nếu giữ worker) | Thêm khi viết worker; nếu chưa có worker thì bỏ service worker khỏi compose hoặc ghi rõ "chưa dùng" |
| 3 | Không có `Dockerfile` thật (chỉ scaffolding mới tạo) | Build thử `docker build ./backend` và `./frontend`, sửa lỗi, ghi kết quả |
| 4 | Backend mặc định SQLite, compose trỏ Postgres | Kiểm chứng `app/database.py` đọc `DATABASE_URL` đúng; chạy thử với Postgres |
| 5 | (Đã đính chính 2026-11-24) Lệch tiền tố `/api/v1` | Không còn — hai bên đều dùng gốc, đã gọi thật → 200 |
| 6 | CORS `allow_origins=["*"]` | Thêm biến `CORS_ORIGINS`, giới hạn theo môi trường |
| 7 | `create_all()` thay cho migration | Viết migration Alembic thật (DATABASE.md §5) |
| 8 | Upload local, chưa có MinIO integration | Hoặc mount volume `uploads` (đã làm trong compose) hoặc tích hợp S3 abstraction |
| 9 | Chưa có rate limit | Thêm middleware (API.md §4.4) |
| 10 | Chưa có lần chạy CI nào | Push workflow lên GitHub rồi xem lần chạy đầu tiên |

---

## 7. CI (GitHub Actions)

Workflow: `.github/workflows/ci.yml` (tạo trong đợt này).

| Job | Nội dung |
|---|---|
| `backend` | Setup Python 3.12 → cài `requirements.txt` → `pytest -q` (chỉ chạy khi `backend/` tồn tại) |
| `frontend` | Setup Node 20 → `npm ci` → `npx tsc --noEmit` → `npm run lint` → `npm run build` (chỉ chạy khi `frontend/package.json` tồn tại) |
| `compose` | Validate `docker compose config` (smoke test — không build image, không cần Docker daemon đầy đủ) |

- Chạy trên mọi push/PR vào `main`.
- Không cần secret nào (không dùng API key thật trong CI).
- **Chưa có lần chạy CI nào** — lần chạy đầu tiên sau khi push sẽ cho biết workflow có đúng không; sửa workflow theo log thật.

---

## 8. Deployment checklist (khi có production — hiện chưa có)

### Trước khi deploy lần đầu

- [ ] `SECRET_KEY` production là chuỗi ngẫu nhiên, khác local; không có trong git.
- [ ] `CORS_ORIGINS` chỉ chứa domain frontend thật (không `*`).
- [ ] Tài khoản seed demo đã tắt hoặc đổi mật khẩu mạnh.
- [ ] `DATABASE_URL` trỏ Postgres production; volume `pgdata` có backup.
- [ ] Migration Alembic thật đã chạy (`alembic upgrade head`) — không dùng `create_all()`.
- [ ] `pytest` và `npm run build` pass trên CI.
- [ ] `docker compose up --build` chạy được ở môi trường giống prod; `/health` trả `ok`.
- [ ] Upload dùng storage persistent (volume hoặc MinIO/S3), không mất file khi restart.
- [ ] Rate limit đã bật; log không chứa secret/token.
- [ ] AI provider key (nếu dùng) đặt qua secret của nền tảng deploy, không commit.
- [ ] Kiểm tra WCAG 2.2 AA cơ bản + responsive 375/768/1280/1440 (NFR-A11Y-01, NFR-RESP-01).

### Sau khi deploy

- [ ] Gọi thử: register → login → xem lesson → nộp bài → assess → xem feedback (luồng chính end-to-end).
- [ ] Kiểm tra `/health` và log lỗi 5xx trong 24h đầu.
- [ ] Backup DB lần đầu và kiểm tra khôi phục được.

---

## 9. Rollback

- **Code:** deploy lại image/tag trước đó (giữ lại ít nhất 2 tag gần nhất). Chưa có registry/tagging chuẩn — cần chốt khi chọn nền tảng deploy.
- **Database:** chỉ rollback migration khi đã backup và đã đọc kỹ revision `downgrade()`; không downgrade mù trên dữ liệu thật.
- **Compose local:** `docker compose down` rồi `up` lại; `down -v` sẽ **xóa toàn bộ dữ liệu local** (chỉ dùng khi chắc chắn muốn reset).

---

## 10. Những gì KHÔNG được deploy

- **Không có production nào đang chạy** (tính tới 2026-11-24).
- Không có domain, TLS, reverse proxy, CDN.
- Không có infra trả phí (không AWS S3 thật, không DB managed trả phí).
- Không push code lên GitHub trong đợt viết tài liệu này (local-only theo yêu cầu); repo GitHub `chuile326-eng/Art-Class-Forthing` đã tồn tại (tạo 2026-11-24) nhưng **chưa có git repo local** tại thư mục này để push từ đó — cần `git init` + remote + push do parent agent quyết định, không tự ý làm trong đợt này.
