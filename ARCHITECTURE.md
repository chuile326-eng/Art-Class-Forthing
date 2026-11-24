# ARCHITECTURE.md — Kiến trúc hệ thống DrawPath AI

> **Trạng thái:** tài liệu kiến trúc mục tiêu, đối chiếu với code đã đọc ngày 2026-11-24 ~23:01.
> Code backend/frontend đã tồn tại trong repo (xem [README.md](./README.md#️-trạng-thái-xác-minh--đọc-trước-cập-nhật-2026-11-24-2301-asiasaigon)), nhưng **chưa chạy thử** — kiến trúc dưới đây mô tả (a) những gì code đã thể hiện và (b) những gì spec yêu cầu nhưng code chưa có, và ghi rõ hai loại này khác nhau ở đâu.

---

## 1. Tổng quan hệ thống (C4 — System Context)

```
                    ┌─────────────────────┐
                    │   Người học         │  Learner (web, tiếng Việt)
                    │   (trình duyệt)     │
                    └──────────┬──────────┘
                               │ HTTPS
                               ▼
                    ┌─────────────────────┐
                    │   DrawPath AI       │  ← hệ thống này
                    │   (Next.js +        │
                    │    FastAPI)         │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              ▼                ▼                ▼
   ┌─────────────────┐ ┌──────────────┐ ┌──────────────────┐
   │ AI Providers    │ │ Object       │ │ (tương lai)      │
   │ (free chain)    │ │ Storage      │ │ Email service    │
   │ Pollinations /  │ │ S3-compat /  │ │ (forgot-password │
   │ HuggingFace /   │ │ MinIO        │ │  hiện NOT_CONFIG)│
   │ OpenRouter /    │ │              │ │                  │
   │ OpenAI-compat   │ │              │ │                  │
   └─────────────────┘ └──────────────┘ └──────────────────┘
              ▲
              │ quản trị nội dung & user
   ┌─────────────────────┐
   │   Admin / Instructor│
   │   (trình duyệt)     │
   └─────────────────────┘
```

**Người dùng chính:** learner (học vẽ), admin (quản trị nội dung + user), instructor (vai trò đã có trong `users.role`, luồng chấm tay chưa có — out of scope, xem REQUIREMENTS.md §4).

**Hệ thống ngoài:**
- **AI providers (free chain):** Pollinations (keyless), HuggingFace (`HF_TOKEN`), OpenRouter free (`OPENROUTER_API_KEY`), OpenAI-compatible (`OPENAI_API_KEY` + `OPENAI_BASE_URL`). Tất cả optional — khi không có key, hệ thống vẫn chạy bằng local-CV + Pollinations.
- **Object storage:** S3-compatible / MinIO (mục tiêu). Hiện tại code lưu upload local (`UPLOAD_DIR=./uploads`).
- **Email service:** chưa có — `/auth/forgot-password` trả `not_configured`.

---

## 2. Containers (C4 — Container Diagram)

```
┌──────────────────────────────────────────────────────────────────┐
│  Docker Compose (mục tiêu — file mới tạo, CHƯA chạy thử)         │
│                                                                  │
│  ┌──────────────┐   HTTP/REST    ┌──────────────────────────┐   │
│  │  Frontend    │ ─────────────► │  Backend API (FastAPI)   │   │
│  │  Next.js 14  │  JSON + JWT    │  Python 3.12, port 8000  │   │
│  │  port 3000   │                │  app/main.py             │   │
│  └──────────────┘                └──────┬───────┬───────────┘   │
│                                         │ SQL   │ HTTP          │
│                              ┌──────────▼──┐  ┌─▼─────────────┐ │
│                              │ PostgreSQL  │  │ AI Providers  │ │
│                              │ 16-alpine   │  │ (ngoài)       │ │
│                              │ port 5432   │  └───────────────┘ │
│                              └─────────────┘                    │
│  ┌──────────────┐   enqueue    ┌──────────────────────────┐     │
│  │  Redis 7     │ ◄──────────► │  Worker (Celery) — MỤC   │     │
│  │  port 6379   │   (mục tiêu) │  TIÊU, chưa có trong code│     │
│  └──────────────┘              └──────────────────────────┘     │
│  ┌──────────────┐                                                │
│  │  MinIO       │  S3-compatible, port 9000/9001 (profile       │
│  │  (optional)  │  minio — chưa tích hợp code)                  │
│  └──────────────┘                                                │
└──────────────────────────────────────────────────────────────────┘
```

| Container | Công nghệ | Trạng thái (2026-11-24 ~23:01) |
|---|---|---|
| Frontend | Next.js 14.2.5 / React 18 / TS / Tailwind | ✅ Code có (24 file `src/`); chưa build/chạy thử |
| Backend API | FastAPI 0.115.6 / SQLAlchemy 2.0 / Pydantic 2.10 | ✅ Code có (`app/main.py` + 6 router); chưa chạy thử |
| Worker / Celery | Celery + Redis (mục tiêu) | 🔴 **Chưa có code Celery** trong `backend/app/` đã đọc; assessment hiện chạy đồng bộ trong request |
| PostgreSQL 16 | `postgres:16-alpine` | 🟡 Có trong `docker-compose.yml` (mới tạo, chưa chạy); **code backend mặc định SQLite** (`drawpath.db`) |
| Redis 7 | `redis:7-alpine` | 🟡 Có trong compose; chưa thấy code nào dùng Redis |
| Object storage | MinIO / S3-compatible | 🟡 Có trong compose (profile `minio`); code hiện lưu local `./uploads` |
| Reverse proxy / TLS | (chưa có — chỉ local dev) | 🔴 Không có; production cần thêm (xem DEPLOYMENT.md) |

**Lưu ý thực trạng DB:** `backend/.env.example` ghi `DATABASE_URL=<redacted>` và `backend/app/database.py` (18 dòng) + `app/main.py` gọi `Base.metadata.create_all(bind=engine)` khi startup. Muốn chạy Postgres thật, phải kiểm chứng `database.py` đọc `DATABASE_URL` và driver `psycopg2` đã có trong `requirements.txt` hay chưa — **hiện `requirements.txt` không liệt kê `psycopg2`/`redis`/`celery`** (đã đọc toàn bộ file). Đây là gap cần backend agent bổ sung trước khi compose chạy được. Xem [DEPLOYMENT.md](./DEPLOYMENT.md#6-gap-đã-biết-cần-xử-lý-trước-khi-chạy-compose).

---

## 3. Module boundaries (bên trong Backend API)

```
app/
├── main.py                  # composition root: FastAPI app, CORS, mount router, startup seed
├── database.py              # engine/session (Base, engine, SessionLocal)
├── models.py                # 26 model SQLAlchemy (xem DATABASE.md)
├── schemas.py               # Pydantic schemas in/out
├── auth.py                  # JWT tạo/verify, get_current_user, role + ownership checks
├── seed.py                  # seed user + curriculum từ data/curriculum.json
├── ai_providers.py          # AI provider abstraction + fallback chain
├── assessment/
│   ├── engine.py            # rubric engine: validate_rubric, validate_assessment_schema,
│   │                        # _score_from_strokes, assess_submission
│   └── geometry.py          # đo hình học bằng NumPy/PIL (OpenCV optional)
├── data/
│   ├── curriculum.json      # 15 module, 75 lesson, 14 skill (theo backend/README)
│   └── generate_curriculum.py
└── routers/                 # presentation layer — mỗi router một nhóm tài nguyên
    ├── auth_router.py       # /auth/*
    ├── curriculum_router.py # /tracks, /modules, /lessons, /exercises, /skills
    ├── drawing_router.py    # /drawing/projects + layers + strokes + export
    ├── submission_router.py # /uploads, /submissions, /assessments, /corrections
    ├── learning_router.py   # /tutor/chat, /progress, /mastery, /recommendations,
    │                        # /portfolio, /users/me/profile
    └── admin_router.py      # /admin/*
```

### Ranh giới module (quy tắc)

| Module | Trách nhiệm | Không được làm |
|---|---|---|
| Presentation (routers) | Parse request, auth, gọi service/engine, trả response + error envelope | Không chứa logic chấm điểm hay gọi trực tiếp AI provider |
| Auth | JWT, hash mật khẩu, role, ownership check | Không chứa logic nghiệp vụ học tập |
| Curriculum | Track/Module/Lesson/Exercise/Skill, prerequisite | Không biết gì về bài nộp |
| Learning | Progress, Mastery, Recommendation, Portfolio, Profile, Tutor chat | Không tự chấm bài (gọi assessment engine) |
| Drawing engine | Project/Layer/Stroke CRUD, export ảnh | Không chấm điểm |
| Submission | Upload, Submission + Version, trạng thái | Không gọi AI trực tiếp (đi qua assessment orchestration) |
| Assessment orchestration | Nhận submission → chạy geometry + rubric → tạo Assessment + Annotation + cập nhật Mastery → ghi AIJob | Không hard-code provider cụ thể |
| CV (geometry) | Đo hình học thuần túy từ stroke/ảnh, trả số đo + confidence | Không sinh câu chữ phản hồi (đó là việc của AI provider / template) |
| AI provider abstraction | `generate_text()` + fallback chain, timeout 15 s, 1 retry/provider, sanitize input | Không biết rubric là gì; không quyết định điểm số |
| Personalization | Mastery update, recommendation | Không sửa rubric |
| Portfolio | Tuyển tập bài vẽ | Không lộ dữ liệu riêng tư |
| Admin | Overview, user, nội dung, AI jobs, audit log | Không bypass ownership check (mọi truy cập admin đều ghi AuditLog) |
| Jobs (mục tiêu) | Celery task: assess_async, tutor_async | — (chưa có code) |
| Storage | Upload local (hiện tại) → S3/MinIO (mục tiêu) qua một interface | Không để đường dẫn local lọt ra API response |
| Observability | `/health`, log có request-id, AuditLog | Không log secret/token |

**Quy tắc phụ thuộc:** Router → Engine/Service → Model/Provider. Không có import ngược (engine không import router; provider không import model học tập).

---

## 4. Data flow — Submit → Assess → Feedback

```
Learner
  │ 1. Vẽ trong Workspace (stroke → DrawingProject)
  │    hoặc upload ảnh bài vẽ tay (POST /uploads)
  ▼
POST /submissions { exercise_id, image/project_ref }
  │ 2. Tạo Submission (status=pending) + SubmissionVersion v1
  │    Kiểm tra: exercise tồn tại? user có quyền nộp? file hợp lệ?
  ▼
POST /submissions/{sid}/assess
  │ 3. status=assessing, tạo AIJob (mục tiêu: enqueue Celery;
  │    hiện tại: chạy đồng bộ trong request — xem §7)
  ▼
Assessment Engine (assessment/engine.py)
  ├── 4a. Geometry: _score_from_strokes() — đo độ thẳng, tỷ lệ…
  │        (geometry.py: NumPy/PIL; OpenCV nếu có, bỏ qua nếu không)
  ├── 4b. Rubric: validate_rubric() → chấm từng RubricCriterion
  │        (trọng số × mức đạt) → điểm tổng
  └── 4c. AI text (optional): ai_providers.generate_text()
           → làm giàu nhận xét; provider nào cũng ghi lại;
           lỗi → fallback provider tiếp theo; hết chain → nhận xét
           từ template + cờ "AI text unavailable" (không bịa)
  ▼
  │ 5. Ghi Assessment + AssessmentCriterionResult (từng tiêu chí)
  │    + AssessmentAnnotation (vùng lỗi, tọa độ chuẩn hóa)
  │    + cập nhật SkillMastery + LearningProgress
  │    + Recommendation (bài tập khắc phục)
  │    status=assessed (hoặc failed + lý do, nếu lỗi)
  ▼
Learner xem Feedback: GET /submissions/{sid} → GET /assessments/{aid}
                   → GET /submissions/{sid}/corrections
  │ 6. Frontend vẽ annotation lên ảnh (tọa độ %),
  │    hiển thị điểm từng tiêu chí + gợi ý sửa + bài tập tiếp theo
  ▼
Learner làm lại → POST /submissions (version mới) → lặp lại vòng lặp
```

**Tính nhất quán dữ liệu:** Assessment, CriterionResult, Annotation, Mastery update của cùng một lần chấm phải thành công hoặc thất bại cùng nhau (một transaction). Nếu assessment failed thì không được ghi điểm giả hay cập nhật mastery.

---

## 5. Frontend architecture (đã đọc)

- **Framework:** Next.js 14 (App Router) — các route đã có trong `frontend/src/app/`: `/` (landing), `/auth/login`, `/auth/register`, `/auth/forgot`, `/onboarding`, `/dashboard`, `/roadmap`, `/lessons/[id]`, `/workspace/[lessonId]`, `/workspace`, `/submissions/[id]`, `/feedback/[submissionId]`, `/portfolio`, `/settings`, `/admin`.
- **State/API:** `src/lib/api.ts` — `API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'` (khớp backend, không `/api/v1` — đã kiểm chứng bằng gọi thật ngày 2026-11-24).
- **Canvas:** `src/components/Workspace.tsx` + `src/lib/canvas.ts` (đã đọc tên file, chưa đọc sâu logic).
- **UI:** `src/components/ui.tsx`, `Header.tsx`, `Footer.tsx`; theme Tailwind với brand colours + font Playfair Display / Be Vietnam Pro.
- **Đã xác minh (re-audit 2026-11-24):** `npm run build` thành công (14/14 trang); gọi API thật bằng curl: login/me/health/modules/tracks/lessons → 200. **Chưa xác minh:** `npm run dev` + gọi API từ trình duyệt, error envelope từng route.

---

## 6. AI provider abstraction + fallback chain (tóm tắt)

Chi tiết đầy đủ nằm trong `backend/app/ai_providers.py` (103 dòng, đã đọc). Tóm tắt:

| Thứ tự | Provider | Điều kiện | Ghi chú |
|---|---|---|---|
| 0 | **local-cv** | Luôn có | Geometry + rubric, không phải LLM; kết quả ghi `local-cv`, không claim là LLM |
| 1 | **Pollinations** | Keyless (không cần key) | `pollinations_text()` — text enrichment / tutor |
| 2 | **HuggingFace** | Cần `HF_TOKEN` | Model mặc định `HuggingFaceH4/zephyr-7b-beta` |
| 3 | **OpenRouter free** | Cần `OPENROUTER_API_KEY` | Model `meta-llama/llama-3.1-8b-instruct:free` |
| 4 | **OpenAI-compatible** | Cần `OPENAI_API_KEY` (+ `OPENAI_BASE_URL`) | Model mặc định `gpt-4o-mini` |

- **Timeout:** 15 s/provider, tối đa 1 retry/provider (`TIMEOUT` trong `ai_providers.py`).
- **Hàm chính:** `generate_text(prompt, system) -> dict` (trả kèm provider đã dùng), `available_providers() -> list`, `sanitize_user_text(text)`.
- **Nguyên tắc trung thực:** provider nào trả lời thì ghi provider đó; nếu tất cả đều lỗi, tutor/nhận xét trả về thông báo "không khả dụng" — **không bịa câu trả lời, không ghi điểm giả**.
- **Bảo mật:** API key chỉ đọc từ biến môi trường, không hard-code, không log key.

> ⚠️ Chain này phục vụ **text enrichment + tutor chat**. Điểm số assessment đến từ **geometry + rubric engine chạy local**, không phải từ LLM — đây là quyết định kiến trúc quan trọng: điểm số phải tái lập được (deterministic), không phụ thuộc vào LLM trả về khác nhau mỗi lần.

---

## 7. Những gì chưa có trong code đã đọc (gap so với spec)

| Gap | Ảnh hưởng | Việc cần làm |
|---|---|---|
| Không có Celery worker / Redis client | Assessment chạy đồng bộ trong request → request assess có thể chậm/timeout khi bài nặng | Thêm worker + enqueue trong `submission_router.assess`, hoặc ghi rõ "MVP đồng bộ" và đặt timeout rõ ràng |
| `requirements.txt` thiếu `psycopg2`, `redis`, `celery`, `opencv-python-headless` | Compose với Postgres/Redis sẽ lỗi import/thiếu driver | Backend agent bổ sung dependency + pin version |
| Alembic chỉ là stub | Không có migration thật; `create_all()` khi startup sẽ không xử lý thay đổi schema an toàn | Viết migration Alembic thật (xem DATABASE.md §5) |
| MinIO/S3 chưa tích hợp | Upload vẫn local `./uploads` — mất file khi container restart nếu không mount volume | Thêm storage abstraction + mount volume `uploads` trong compose (đã làm) |
| CORS `allow_origins=["*"]` | Rủi ro bảo mật khi deploy công khai | Giới hạn origin theo env `CORS_ORIGINS` |
| (Đã đính chính) Tiền tố `/api/v1` | Bản nháp tài liệu ghi nhầm frontend gọi `/api/v1`; code thật hai bên đều dùng gốc `http://localhost:8000`, đã gọi thật → 200 | Không còn việc này |
| Không có rate limit | Auth/assess/tutor có thể bị lạm dụng | Thêm middleware rate limit (xem API.md §5) |
| Không có `/health/ready` | Không kiểm tra được DB/Redis/storage | Thêm readiness probe |
| Không có test nào chạy qua | Chưa biết code có chạy không | Chạy `pytest -q` + `npm run build`, ghi kết quả thật |

---

## 8. Mô hình bảo mật (tóm tắt)

- **Xác thực:** JWT Bearer (python-jose), hạn 7 ngày mặc định; mật khẩu bcrypt (`passlib[bcrypt]` + `bcrypt==4.0.1`).
- **Phân quyền:** role string trên `users.role` (`guest`/`learner`/`instructor`/`admin`); admin-only route kiểm tra role; mọi tài nguyên user-owned kiểm tra `owner_id == current_user.id` (trừ admin).
- **Audit:** mọi hành động admin ghi `AuditLog` (ai, hành động, đối tượng, thời gian); admin xem log qua `GET /admin/audit-logs`.
- **Dữ liệu nhạy cảm:** không log mật khẩu/token/API key; upload strip EXIF vị trí (FR-UPL-04); portfolio public không lộ email.
- **Secret:** chỉ qua biến môi trường; `.env` không commit; `.env.example` chỉ có placeholder.
- **Cần sửa trước khi public:** CORS `*` → origin cụ thể; `SECRET_KEY` mẫu `change-me-...` → chuỗi ngẫu nhiên; tài khoản seed yếu chỉ dùng local.

---

## 9. Quyết định kiến trúc đã chốt / còn treo

**Đã chốt (theo code + spec):**
- Monolith backend FastAPI (không microservice) ở giai đoạn này; tách worker sau khi có Celery.
- Điểm assessment từ geometry + rubric local (deterministic); LLM chỉ làm giàu câu chữ.
- SQLite mặc định cho dev local; Postgres là mục tiêu deploy.
- Tiếng Việt mặc định, i18n-ready.

**Còn treo:**
- Đồng bộ vs bất đồng bộ cho assessment (xem REQUIREMENTS.md §6).
- (Đã đính chính 2026-11-24) Không có lệch prefix `/api/v1` — frontend và backend đều dùng gốc (xem §7).
- Storage: local volume vs MinIO ngay từ MVP.
- Công thức cập nhật mastery (chưa có tài liệu).
