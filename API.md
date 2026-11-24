# API.md — Đặc tả REST API DrawPath AI

> **Trạng thái:** đặc tả đối chiếu code thật.
> Bảng route ở §2 được lập bằng cách **đọc trực tiếp** `backend/app/main.py` và 6 file trong `backend/app/routers/` ngày 2026-11-24 ~23:01 (decorator `@router.<method>("<path>")`).
> **Chưa có route nào được xác minh bằng cách gọi thật** — chưa chạy server, chưa gọi thử endpoint nào. OpenAPI tại `/docs` chỉ có khi server chạy.

---

## 1. Thông tin chung

| Mục | Giá trị |
|---|---|
| Base URL (local) | `http://localhost:8000` |
| OpenAPI / Swagger UI | `http://localhost:8000/docs` (tự sinh từ FastAPI, khi server chạy) |
| OpenAPI JSON | `http://localhost:8000/openapi.json` |
| Health | `GET http://localhost:8000/health` → `{"status": "ok", "service": "drawpath-ai", "version": "0.1.0"}` |
| Định dạng | JSON (`application/json`), trừ upload dùng `multipart/form-data` |
| Auth | `Authorization: Bearer <JWT>` (trừ các endpoint public ở §2) |
| Version | **Hiện tại không có version prefix trong backend.** Xem §3. |

---

## 2. Bảng route (đối chiếu code thật)

### 2.1 Hệ thống

| Method | Path | Mục đích | Auth |
|---|---|---|---|
| GET | `/` | Thông tin service + link `/docs`, `/health` | Không |
| GET | `/health` | Health check cơ bản | Không |

### 2.2 Auth — `backend/app/routers/auth_router.py` (prefix `/auth`)

| Method | Path | Mục đích | Auth |
|---|---|---|---|
| POST | `/auth/register` | Đăng ký user mới (email + username + password) → 201, trả `UserOut` | Không |
| POST | `/auth/login` | Đăng nhập → trả `Token` (JWT) | Không |
| GET | `/auth/me` | Lấy thông tin user từ token | Bearer |
| POST | `/auth/forgot-password` | Quên mật khẩu — **hiện trả `not_configured`** (chưa có email service) | Không |

### 2.3 Curriculum — `backend/app/routers/curriculum_router.py` (không prefix)

| Method | Path | Mục đích | Auth |
|---|---|---|---|
| GET | `/tracks` | Liệt kê track | Bearer |
| GET | `/modules` | Liệt kê module (lọc theo `track_id` — kiểm chứng query param khi chạy) | Bearer |
| GET | `/modules/{code}` | Lấy module theo code | Bearer |
| GET | `/lessons` | Liệt kê lesson (lọc theo module — kiểm chứng query param khi chạy) | Bearer |
| GET | `/lessons/{lesson_id}` | Lấy chi tiết lesson | Bearer |
| GET | `/lessons/{lesson_id}/exercises` | Liệt kê exercise của lesson | Bearer |
| GET | `/exercises/{exercise_id}` | Lấy chi tiết exercise | Bearer |
| GET | `/skills` | Liệt kê skill | Bearer |

### 2.4 Drawing — `backend/app/routers/drawing_router.py` (prefix `/drawing`)

| Method | Path | Mục đích | Auth |
|---|---|---|---|
| POST | `/drawing/projects` | Tạo drawing project → 201 | Bearer (owner = current user) |
| GET | `/drawing/projects` | Liệt kê project của user | Bearer |
| GET | `/drawing/projects/{pid}` | Lấy chi tiết project | Bearer + ownership |
| PUT | `/drawing/projects/{pid}` | Cập nhật project | Bearer + ownership |
| DELETE | `/drawing/projects/{pid}` | Xóa project | Bearer + ownership |
| POST | `/drawing/projects/{pid}/layers` | Thêm layer → 201 | Bearer + ownership |
| PUT | `/drawing/projects/{pid}/layers/{lid}` | Cập nhật layer | Bearer + ownership |
| DELETE | `/drawing/projects/{pid}/layers/{lid}` | Xóa layer | Bearer + ownership |
| POST | `/drawing/projects/{pid}/strokes` | Thêm stroke → 201 | Bearer + ownership |
| DELETE | `/drawing/projects/{pid}/strokes/{sid}` | Xóa stroke | Bearer + ownership |
| GET | `/drawing/projects/{pid}/export` | Export project thành ảnh | Bearer + ownership |

### 2.5 Submissions / Uploads / Assessments — `backend/app/routers/submission_router.py` (không prefix)

| Method | Path | Mục đích | Auth |
|---|---|---|---|
| POST | `/uploads` | Upload ảnh bài vẽ tay (multipart) → 201 | Bearer |
| POST | `/submissions` | Nộp bài cho exercise → 201 | Bearer |
| GET | `/submissions` | Liệt kê submission của user (phân trang) | Bearer |
| GET | `/submissions/{sid}` | Lấy chi tiết submission + version | Bearer + ownership |
| POST | `/submissions/{sid}/assess` | Chạy AI assessment → 201, trả `AssessmentOut` | Bearer + ownership |
| GET | `/assessments/{aid}` | Lấy kết quả assessment | Bearer + ownership |
| GET | `/submissions/{sid}/corrections` | Lấy annotation + gợi ý sửa của submission | Bearer + ownership |

### 2.6 Learning — `backend/app/routers/learning_router.py` (không prefix)

| Method | Path | Mục đích | Auth |
|---|---|---|---|
| POST | `/tutor/chat` | Chat với AI tutor (ngữ cảnh lesson/submission) | Bearer |
| POST | `/progress` | Ghi nhận tiến độ → 201 | Bearer |
| GET | `/progress` | Lấy tổng quan tiến độ của user | Bearer |
| GET | `/mastery` | Lấy mastery từng skill | Bearer |
| GET | `/recommendations` | Lấy gợi ý cá nhân hóa | Bearer |
| POST | `/portfolio` | Thêm item vào portfolio → 201 | Bearer |
| GET | `/portfolio` | Liệt kê portfolio của user | Bearer |
| GET | `/users/me/profile` | Lấy hồ sơ (onboarding) của user | Bearer |
| PUT | `/users/me/profile` | Cập nhật hồ sơ | Bearer |

### 2.7 Admin — `backend/app/routers/admin_router.py` (prefix `/admin`)

| Method | Path | Mục đích | Auth |
|---|---|---|---|
| GET | `/admin/overview` | Thống kê tổng quan (user, submission, assessment…) | Bearer + role `admin` |
| GET | `/admin/users` | Liệt kê user (phân trang, tìm kiếm) | Bearer + role `admin` |
| PUT | `/admin/users/{uid}/role` | Đổi role của user | Bearer + role `admin` |
| POST | `/admin/lessons` | Tạo lesson mới → 201 | Bearer + role `admin` |
| PUT | `/admin/lessons/{lesson_id}/status` | Đổi trạng thái lesson (draft/published/archived) | Bearer + role `admin` |
| GET | `/admin/ai-jobs` | Liệt kê AI job (theo dõi, retry) | Bearer + role `admin` |
| GET | `/admin/audit-logs` | Xem audit log | Bearer + role `admin` |

**Tổng: 48 endpoint** (2 hệ thống + 4 auth + 8 curriculum + 11 drawing + 7 submission + 9 learning + 7 admin = 46 router + 2 hệ thống — đếm lại bằng `grep -c` decorator ngày 2026-11-24 trong re-audit; khớp với code hiện tại).

---

## 3. Lưu ý tích hợp — ĐÃ KIỂM CHỨNG (re-audit 2026-11-24 ~23:15 +07)

### 3.1 Tiền tố API: KHÔNG lệch (đính chính bản nháp trước)

- **Frontend** (`frontend/src/lib/api.ts` dòng 1, bản hiện tại): `API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'` — **không có `/api/v1`**, kèm ghi chú trong code rằng backend mount router ở gốc.
- **Backend** (`backend/app/main.py`): mount router ở gốc — `/auth`, `/tracks`, `/drawing`, `/admin`… **không có `/api/v1`**. Hai bên KHỚP nhau.
- **Đã gọi thật trên server chạy local (uvicorn, SQLite):** `POST /auth/login` (JSON `{"email":"learner@drawpath.app","password":"learner123"}`) → **200**, token JWT 141 ký tự; `GET /auth/me` → **200** (`learner@drawpath.app`, role `learner`); `GET /health` → **200** (0,04s); `GET /modules` → **200**; `GET /tracks` → **5 track**; `GET /lessons` → **75 lesson**.
- Lưu ý: bản nháp trước của tài liệu này ghi frontend mặc định `/api/v1` — đó là **đọc nhầm bản cũ của `api.ts`**; đã đính chính tại đây và trong README. **Chưa kiểm chứng:** gọi API thật từ trình duyệt (frontend chạy `next dev` gọi backend) — mới chỉ gọi bằng `curl` trực tiếp vào backend.

### 3.2 Những điều chưa rõ cho tới khi chạy thử

- Query param lọc của `GET /modules` và `GET /lessons` (tên param chính xác, có phân trang không).
- Tên field chính xác trong request/response body (xem `backend/app/schemas.py`, 91 dòng — chưa đối chiếu từng schema trong đợt này).
- `POST /uploads` trả về cấu trúc gì (id asset? URL?); giới hạn MIME cụ thể.
- `POST /tutor/chat` nhận `lesson_id` / `submission_id` dưới tên field nào.
- Error envelope thực tế (xem §4 — đó là **đặc tả mong muốn**, chưa xác minh code có trả đúng vậy không).

---

## 4. Conventions (đặc tả — cần đối chiếu code khi chạy)

### 4.1 Auth

```
Authorization: Bearer <JWT>
```

- Token hết hạn / sai → `401 Unauthorized`.
- Đủ token nhưng sai role (ví dụ learner gọi `/admin/*`) → `403 Forbidden`.
- Truy cập tài nguyên của user khác → `403 Forbidden` (hoặc `404` để không lộ sự tồn tại — cần chốt một hành vi thống nhất; hiện tại code dùng HTTPException — kiểm chứng từng route).

### 4.2 Phân trang

Query param chuẩn (đặc tả; kiểm chứng khi chạy):

```
GET /submissions?page=1&page_size=20
```

Response:

```json
{
  "items": [ "..." ],
  "page": 1,
  "page_size": 20,
  "total": 57,
  "total_pages": 3
}
```

Mặc định `page=1`, `page_size=20`, tối đa `page_size=100`.

### 4.3 Error envelope (đặc tả mong muốn)

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Nội dung lỗi bằng tiếng Việt, rõ ràng cho người dùng",
    "detail": { "field": "email", "issue": "Email đã tồn tại" }
  }
}
```

Mã lỗi thường gặp:

| HTTP | `code` | Khi nào |
|---|---|---|
| 400 | `VALIDATION_ERROR` | Body sai, file sai định dạng/quá lớn |
| 401 | `UNAUTHORIZED` | Thiếu/sai/hết hạn token |
| 403 | `FORBIDDEN` | Sai role hoặc không phải owner |
| 404 | `NOT_FOUND` | Không tìm thấy tài nguyên |
| 409 | `CONFLICT` | Trùng lặp (email/username đã tồn tại) |
| 422 | `VALIDATION_ERROR` | Pydantic validation fail (FastAPI mặc định) |
| 429 | `RATE_LIMITED` | Vượt rate limit |
| 500 | `INTERNAL_ERROR` | Lỗi server (không lộ stack trace) |
| 503 | `AI_UNAVAILABLE` | Mọi AI provider đều lỗi (assessment/tutor) |

> ⚠️ FastAPI mặc định trả lỗi validation dạng `{"detail": [...]}` (422), **không** phải envelope trên. Cần kiểm chứng code có custom exception handler không; nếu chưa có, envelope này là việc cần làm, không phải thực trạng.

### 4.4 Rate limits (đặc tả — chưa có code)

| Nhóm endpoint | Giới hạn đề xuất |
|---|---|
| `POST /auth/login`, `POST /auth/register` | 10 req/phút/IP |
| `POST /submissions/{sid}/assess` | 5 req/phút/user |
| `POST /tutor/chat` | 20 req/phút/user |
| Các GET thông thường | 120 req/phút/user |

Vượt giới hạn → `429` + header `Retry-After`. **Hiện chưa thấy code rate limit trong backend đã đọc** — đây là hạng mục cần bổ sung.

### 4.5 Upload

```
POST /uploads
Content-Type: multipart/form-data
Authorization: Bearer <JWT>

file: <binary>   # JPEG/PNG/WebP, ≤ 10 MB
```

- Sai MIME / quá lớn → `400` với message rõ ràng.
- File được lưu kèm metadata; response trả về định danh để dùng khi `POST /submissions` (kiểm chứng tên field khi chạy).

### 4.6 Ownership

Mọi route có `{pid}`, `{sid}`, `{aid}` đều phải kiểm tra `owner_id == current_user.id`, trừ role `admin` (và `instructor` khi có luồng chấm). Code đã có ownership check trong `auth.py` (theo `backend/README.md`) — **chưa kiểm chứng từng route**.

---

## 5. Ví dụ gọi API (đã chạy thử một phần ngày 2026-11-24 — login/me/health/modules/tracks/lessons → 200; các ví dụ còn lại là minh họa, chưa chạy)

```bash
# Đăng nhập (tài khoản seed thật trong code — xem README §8)
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "learner@drawpath.app", "password": "learner123"}'  # đã gọi thật 2026-11-24 → 200
# → {"access_token": "<JWT>", "token_type": "bearer"}

# Lấy track (thay <JWT> bằng token thật)
curl http://localhost:8000/tracks \
  -H "Authorization: Bearer <JWT>"

# Nộp bài rồi chấm (giả định submission id = 1)
curl -X POST http://localhost:8000/submissions/1/assess \
  -H "Authorization: Bearer <JWT>"
```

> Các ví dụ trên là **minh họa cú pháp** theo route đã đọc; chưa có lần gọi thật nào thành công để xác nhận response. Khi chạy thử lần đầu, ghi lại request/response thật vào báo cáo thay vì sửa tài liệu cho khớp suy đoán.

---

## 6. Route quy hoạch (chưa có trong code — không gọi được)

Những route này thuộc đặc tả nhưng **không thấy trong 6 router đã đọc**; chỉ thêm khi có yêu cầu + migration tương ứng:

| Route đề xuất | Mục đích | Phụ thuộc |
|---|---|---|
| `GET /health/ready` | Readiness: DB + Redis + storage | FR-MON-02 |
| `GET /portfolio/public/{username}` | Portfolio công khai | FR-PFL-03 |
| `GET /drawing/projects/{pid}/replay` | Replay stroke | FR-RPL-01 |
| `POST /submissions/{sid}/versions` | Nộp lại (version mới) tường minh | FR-REV-01 (hiện nộp lại qua `POST /submissions`) |
| `DELETE /auth/me` | Xóa tài khoản (anonymize) | Retention, DATABASE.md §9 |
| `GET /notifications` | Thông báo | Bảng `notifications` (chưa có) |

---

## 7. OpenAPI

- Khi backend chạy, Swagger UI ở `/docs`, ReDoc ở `/redoc` (mặc định FastAPI), JSON ở `/openapi.json`.
- **Quy tắc:** `/openapi.json` là nguồn sự thật về route khi có mâu thuẫn giữa tài liệu này và code — nhưng chỉ sau khi server chạy và sinh ra file đó. Trước lúc đó, bảng ở §2 (đọc từ decorator) là căn cứ tốt nhất.
- Sau mỗi lần backend thay đổi route, cập nhật lại §2 trong cùng đợt (không để tài liệu lệch code).
