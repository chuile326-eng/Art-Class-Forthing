# DATABASE.md — Thiết kế cơ sở dữ liệu DrawPath AI

> **Trạng thái:** thiết kế mục tiêu + đối chiếu code thật.
> Đã đọc `backend/app/models.py` (369 dòng, 26 model) ngày 2026-11-24 ~23:01. **Chưa có migration nào chạy thật; chưa có database nào được tạo/kiểm chứng trong đợt này.**
> **Thực trạng quan trọng:** code hiện tại mặc định **SQLite** (`drawpath.db`, `DATABASE_URL=<redacted>` trong `backend/.env.example`) và dùng `Base.metadata.create_all()` khi startup. **PostgreSQL là mục tiêu deploy**, chưa phải thực trạng dev. Alembic chỉ là stub (xem §5).

---

## 1. Nguyên tắc thiết kế

- **Một nguồn sự thật cho tiến độ:** `LearningProgress` ghi "đã học gì", `SkillMastery` ghi "giỏi tới đâu", `Assessment` ghi "bằng chứng" — ba bảng này không được mâu thuẫn nhau (mastery chỉ đổi qua assessment hoặc admin điều chỉnh có log).
- **Không ghi đè lịch sử:** submission/project sửa → tạo version mới (`SubmissionVersion`), không UPDATE đè bản cũ.
- **Tọa độ chuẩn hóa:** mọi annotation lưu tọa độ theo **% kích thước ảnh** (0–100), không lưu pixel tuyệt đối — để hiển thị đúng ở mọi màn hình.
- **Soft-delete cho nội dung người học:** xóa submission/project nên đánh dấu `deleted_at` (hoặc xóa cascade có chủ đích + log), không để assessment/annotation mồ côi.
- **Mọi bảng đều có `id` khóa chính số nguyên và `created_at`** (theo quy ước trong `models.py`); bảng nghiệp vụ chính thêm `updated_at` khi cần.
- **Tiền tố đặt tên:** bảng dùng snake_case số nhiều (`users`, `submissions`…); khóa ngoại `*_id`; bảng nối `*_prerequisite`.

---

## 2. Sơ đồ ER (tổng quan)

```
User 1───1 UserProfile
User 1───* DrawingProject 1───* DrawingLayer 1───* DrawingStroke
User 1───* Submission 1───* SubmissionVersion
User 1───* LearningProgress   User 1───* SkillMastery
User 1───* Recommendation     User 1───* PortfolioItem
User 1───* AIConversation    User 1───* Notification (quy hoạch)

CourseTrack (Track) 1───* Module 1───* Lesson 1───* LessonBlock
Lesson 1───* Exercise 1───1 Rubric 1───* RubricCriterion
Lesson *───* LearningObjective (quy hoạch)
Lesson *───* LessonPrerequisite (quy hoạch)
Skill 1───* SkillPrerequisite (skill cần skill khác)
Exercise *───* Skill (kỹ năng bài tập rèn luyện — qua bảng nối, xem §3.10)

Submission *───1 Exercise
Submission 1───* Assessment 1───* AssessmentCriterionResult
Assessment 1───* AssessmentAnnotation
Assessment *───1 AIJob (job đã chạy assessment — mục tiêu async)

Admin *───* AuditLog (mọi hành động admin)
DrawingProject 1───* DrawingAsset (quy hoạch: file export/upload gắn project)
```

---

## 3. Chi tiết từng entity

Quy ước cột: `PK` = khóa chính, `FK` = khóa ngoại, `UQ` = unique, `IDX` = nên đánh index. Kiểu dữ liệu ghi theo **PostgreSQL mục tiêu**; cột nào đã có trong `models.py` thì ghi chú "✅ đã có", chưa có thì ghi "🟡 quy hoạch".

### 3.1 User — `users` ✅ đã có

| Cột | Kiểu | Ràng buộc | Ghi chú |
|---|---|---|---|
| `id` | INTEGER | PK, IDX | |
| `email` | VARCHAR(255) | UQ, IDX, NOT NULL | Đăng nhập bằng email |
| `username` | VARCHAR(100) | UQ, IDX, NOT NULL | Hiển thị |
| `hashed_password` | VARCHAR(255) | NOT NULL | bcrypt, không bao giờ lưu plaintext |
| `role` | VARCHAR(20) | DEFAULT `'learner'` | `guest` / `learner` / `instructor` / `admin`. **Role là cột string, không phải bảng riêng** (xem §4) |
| `is_active` | BOOLEAN | DEFAULT true | `false` → không đăng nhập được |
| `is_verified` | BOOLEAN | DEFAULT false | Xác minh email (luồng gửi mail chưa có) |
| `created_at` | DATETIME | DEFAULT now | |

Quan hệ: 1–1 `UserProfile`, 1–* `DrawingProject`, 1–* `Submission`.

### 3.2 UserProfile — `user_profiles` ✅ đã có

| Cột | Kiểu | Ràng buộc | Ghi chú |
|---|---|---|---|
| `id` | INTEGER | PK | |
| `user_id` | INTEGER | FK → `users.id`, UQ, NOT NULL | 1–1 với User, cascade delete |
| `display_name` | VARCHAR(200) | | Tên hiển thị |
| `goal` | VARCHAR(200) | | Mục tiêu học (onboarding) |
| `self_level` | VARCHAR(50) | | Trình độ tự đánh giá |
| `medium` | VARCHAR(50) | | `paper` / `digital` / `both` |
| `minutes_per_day` | INTEGER | DEFAULT 30 | Thời gian học/ngày |
| `avatar_url` | VARCHAR(500) | | |
| `bio` | TEXT | | |

### 3.3 Role — 🟡 QUY HOẠCH, không phải bảng riêng

**Không có bảng `roles` trong `models.py`.** Vai trò hiện là cột `users.role` (string). Đây là quyết định có chủ đích ở MVP (ít vai trò, ít thay đổi). Chỉ tách thành bảng `Role` + bảng nối `UserRole` khi cần: (a) vai trò có quyền hạn cấu hình được, (b) một user có nhiều vai trò đồng thời. Tới lúc đó cần migration tạo bảng và chuyển dữ liệu từ cột string sang. **Không tự ý thêm bảng Role khi chưa có yêu cầu.**

### 3.4 CourseTrack — `tracks` ✅ đã có (tên model: `Track`)

| Cột | Kiểu | Ràng buộc | Ghi chú |
|---|---|---|---|
| `id` | INTEGER | PK | |
| `code` | VARCHAR(50) | UQ, IDX | Mã track, ví dụ `basic-drawing` |
| `title` | VARCHAR(200) | NOT NULL | Tên track (tiếng Việt) |
| `description` | TEXT | | |
| `order_index` | INTEGER | DEFAULT 0, IDX | Thứ tự hiển thị |
| `is_published` | BOOLEAN | DEFAULT true | |

Trong code model tên là `Track`, bảng `tracks`. Tài liệu đặc tả gọi là `CourseTrack` cho rõ nghĩa; **không đổi tên model khi chưa thống nhất** — chỉ cần biết hai tên này chỉ cùng một entity.

### 3.5 Module — `modules` ✅ đã có

| Cột | Kiểu | Ràng buộc | Ghi chú |
|---|---|---|---|
| `id` | INTEGER | PK | |
| `track_id` | INTEGER | FK → `tracks.id`, IDX, NOT NULL | |
| `code` | VARCHAR(50) | UQ, IDX | |
| `title` | VARCHAR(200) | NOT NULL | |
| `description` | TEXT | | |
| `order_index` | INTEGER | DEFAULT 0 | |
| `is_published` | BOOLEAN | DEFAULT true | |

### 3.6 Lesson — `lessons` ✅ đã có

| Cột | Kiểu | Ràng buộc | Ghi chú |
|---|---|---|---|
| `id` | INTEGER | PK | |
| `module_id` | INTEGER | FK → `modules.id`, IDX, NOT NULL | |
| `title` | VARCHAR(200) | NOT NULL | |
| `description` | TEXT | | |
| `objectives` | TEXT / JSON | | Mục tiêu học tập (dạng text/JSON — cần chốt kiểu khi viết migration) |
| `estimated_minutes` | INTEGER | | Thời lượng ước tính |
| `order_index` | INTEGER | DEFAULT 0 | |
| `status` | VARCHAR(20) | DEFAULT `'published'` | `draft` / `published` / `archived`; draft không hiển thị cho learner |
| `created_at` | DATETIME | | |

### 3.7 LessonBlock — `lesson_blocks` ✅ đã có

| Cột | Kiểu | Ràng buộc | Ghi chú |
|---|---|---|---|
| `id` | INTEGER | PK | |
| `lesson_id` | INTEGER | FK → `lessons.id`, IDX, NOT NULL | |
| `block_type` | VARCHAR(50) | NOT NULL | `text` / `image` / `video` / `demo` / `example` / `quiz` |
| `content` | TEXT / JSON | | Nội dung theo loại block |
| `order_index` | INTEGER | DEFAULT 0 | |

### 3.8 LearningObjective — 🟡 QUY HOẠCH (chưa có trong models.py)

Mục tiêu học tập hiện nằm trong cột `lessons.objectives` (text/JSON). Chỉ tách thành bảng riêng khi cần: (a) một objective dùng chung cho nhiều lesson, (b) đo mức đạt từng objective riêng. Bảng dự kiến:

| Cột | Kiểu | Ràng buộc |
|---|---|---|
| `id` | INTEGER | PK |
| `lesson_id` | INTEGER | FK → `lessons.id`, IDX |
| `code` | VARCHAR(50) | UQ theo lesson |
| `description` | TEXT | NOT NULL |
| `skill_id` | INTEGER | FK → `skills.id`, nullable |
| `order_index` | INTEGER | |

### 3.9 Skill — `skills` ✅ đã có

| Cột | Kiểu | Ràng buộc | Ghi chú |
|---|---|---|---|
| `id` | INTEGER | PK | |
| `code` | VARCHAR(50) | UQ, IDX | Ví dụ `line-control`, `proportion` |
| `title` | VARCHAR(200) | NOT NULL | |
| `description` | TEXT | | |
| `category` | VARCHAR(100) | | Nhóm kỹ năng (nét, tỷ lệ, phối cảnh, màu sắc…) |

### 3.10 SkillPrerequisite — `skill_prerequisites` ✅ đã có

| Cột | Kiểu | Ràng buộc | Ghi chú |
|---|---|---|---|
| `id` | INTEGER | PK | |
| `skill_id` | INTEGER | FK → `skills.id`, IDX, NOT NULL | Skill cần mở khóa |
| `required_skill_id` | INTEGER | FK → `skills.id`, IDX, NOT NULL | Skill phải có trước |
| `min_mastery` | INTEGER | DEFAULT 60 | Ngưỡng mastery yêu cầu (0–100) |

Ràng buộc: `skill_id != required_skill_id` (không tự prerequisite chính mình); không tạo chu trình prerequisite (kiểm tra ở tầng application khi admin sửa).

### 3.11 LessonPrerequisite — 🟡 QUY HOẠCH (chưa có trong models.py)

Tương tự SkillPrerequisite nhưng ở cấp lesson ("học xong lesson A mới mở lesson B"):

| Cột | Kiểu | Ràng buộc |
|---|---|---|
| `id` | INTEGER | PK |
| `lesson_id` | INTEGER | FK → `lessons.id`, IDX, NOT NULL |
| `required_lesson_id` | INTEGER | FK → `lessons.id`, IDX, NOT NULL |
| `required_mastery` | INTEGER | nullable — ngưỡng mastery skill liên quan (nếu có) |

Hiện tại logic khóa/mở lesson dựa trên `SkillPrerequisite` + `LearningProgress`; khi cần prerequisite lesson-trực-tiếp thì thêm bảng này bằng migration.

### 3.12 Exercise — `exercises` ✅ đã có

| Cột | Kiểu | Ràng buộc | Ghi chú |
|---|---|---|---|
| `id` | INTEGER | PK | |
| `lesson_id` | INTEGER | FK → `lessons.id`, IDX, NOT NULL | |
| `title` | VARCHAR(200) | NOT NULL | |
| `instructions` | TEXT | NOT NULL | Hướng dẫn làm bài (tiếng Việt) |
| `evaluation_type` | VARCHAR(50) | NOT NULL, IDX | Loại chấm: quyết định geometry nào chạy trong `assessment/engine.py` |
| `difficulty` | VARCHAR(20) | | `easy` / `medium` / `hard` |
| `rubric_id` | INTEGER | FK → `rubrics.id`, nullable | Rubric gắn kèm (1–1 hoặc dùng chung) |
| `order_index` | INTEGER | DEFAULT 0 | |

### 3.13 Rubric — `rubrics` ✅ đã có

| Cột | Kiểu | Ràng buộc | Ghi chú |
|---|---|---|---|
| `id` | INTEGER | PK | |
| `title` | VARCHAR(200) | NOT NULL | |
| `description` | TEXT | | |
| `exercise_id` | INTEGER | FK → `exercises.id`, IDX, nullable | Rubric thuộc exercise (hoặc dùng chung — cần chốt khi migration) |

### 3.14 RubricCriterion — `rubric_criteria` ✅ đã có

| Cột | Kiểu | Ràng buộc | Ghi chú |
|---|---|---|---|
| `id` | INTEGER | PK | |
| `rubric_id` | INTEGER | FK → `rubrics.id`, IDX, NOT NULL | |
| `name` | VARCHAR(200) | NOT NULL | Tên tiêu chí (ví dụ "Độ thẳng của nét") |
| `description` | TEXT | | Mô tả mức đạt |
| `weight` | FLOAT | NOT NULL | Trọng số; **tổng weight trong một rubric phải = 1.0 (hoặc 100)** — kiểm tra bằng `validate_rubric()` |
| `max_score` | FLOAT | DEFAULT 10 | Điểm tối đa tiêu chí |

### 3.15 DrawingProject — `drawing_projects` ✅ đã có

| Cột | Kiểu | Ràng buộc | Ghi chú |
|---|---|---|---|
| `id` | INTEGER | PK | |
| `owner_id` | INTEGER | FK → `users.id`, IDX, NOT NULL | Ownership check trên mọi thao tác |
| `lesson_id` | INTEGER | FK → `lessons.id`, nullable, IDX | Project gắn lesson nào (nếu có) |
| `exercise_id` | INTEGER | FK → `exercises.id`, nullable, IDX | |
| `title` | VARCHAR(200) | | |
| `canvas_width` / `canvas_height` | INTEGER | | Kích thước canvas (để render lại đúng) |
| `status` | VARCHAR(20) | DEFAULT `'draft'` | `draft` / `submitted` / `archived` |
| `created_at` / `updated_at` | DATETIME | | |

### 3.16 DrawingStroke — `drawing_strokes` ✅ đã có

| Cột | Kiểu | Ràng buộc | Ghi chú |
|---|---|---|---|
| `id` | INTEGER | PK | |
| `project_id` | INTEGER | FK → `drawing_projects.id`, IDX, NOT NULL | |
| `layer_id` | INTEGER | FK → `drawing_layers.id`, IDX, NOT NULL | |
| `points` | JSON / TEXT | NOT NULL | Danh sách điểm `[{x, y, t}]` — tọa độ theo hệ canvas |
| `color` | VARCHAR(20) | | |
| `width` | FLOAT | | Độ dày nét |
| `order_index` | INTEGER | | Thứ tự vẽ (phục vụ replay) |
| `created_at` | DATETIME | | |

Lưu ý hiệu năng: project nhiều stroke → `points` JSON có thể lớn; khi cần, tách sang bảng `stroke_points` hoặc lưu file JSON trong storage. Chưa làm ở MVP.

### 3.17 DrawingLayer — `drawing_layers` ✅ đã có

| Cột | Kiểu | Ràng buộc | Ghi chú |
|---|---|---|---|
| `id` | INTEGER | PK | |
| `project_id` | INTEGER | FK → `drawing_projects.id`, IDX, NOT NULL | |
| `name` | VARCHAR(100) | | |
| `order_index` | INTEGER | DEFAULT 0 | |
| `visible` | BOOLEAN | DEFAULT true | |
| `opacity` | FLOAT | DEFAULT 1.0 | |

### 3.18 DrawingAsset — 🟡 QUY HOẠCH (chưa có trong models.py)

File ảnh gắn với project/submission (ảnh export, ảnh upload, thumbnail). Hiện tại upload được xử lý trong `submission_router` và lưu local, chưa có bảng asset riêng. Bảng dự kiến:

| Cột | Kiểu | Ràng buộc |
|---|---|---|
| `id` | INTEGER | PK |
| `owner_id` | INTEGER | FK → `users.id`, IDX, NOT NULL |
| `project_id` | INTEGER | FK → `drawing_projects.id`, nullable, IDX |
| `submission_id` | INTEGER | FK → `submissions.id`, nullable, IDX |
| `kind` | VARCHAR(50) | `upload` / `export` / `thumbnail` / `reference` |
| `storage_key` | VARCHAR(500) | NOT NULL — key trong storage (S3/MinIO) hoặc đường dẫn local |
| `mime_type` | VARCHAR(100) | |
| `size_bytes` | INTEGER | |
| `width` / `height` | INTEGER | |
| `created_at` | DATETIME | |

Khi chuyển sang MinIO, `storage_key` là key duy nhất frontend/backend dùng; **không lộ đường dẫn local ra API**.

### 3.19 Submission — `submissions` ✅ đã có

| Cột | Kiểu | Ràng buộc | Ghi chú |
|---|---|---|---|
| `id` | INTEGER | PK | |
| `owner_id` | INTEGER | FK → `users.id`, IDX, NOT NULL | |
| `exercise_id` | INTEGER | FK → `exercises.id`, IDX, NOT NULL | |
| `project_id` | INTEGER | FK → `drawing_projects.id`, nullable, IDX | Nộp từ workspace |
| `asset_id` | INTEGER | FK → `drawing_assets.id`, nullable (khi có bảng asset) | Nộp từ ảnh upload |
| `status` | VARCHAR(20) | DEFAULT `'pending'`, IDX | `pending` / `assessing` / `assessed` / `failed` |
| `current_version` | INTEGER | DEFAULT 1 | Trỏ version mới nhất |
| `created_at` / `updated_at` | DATETIME | | |

### 3.20 SubmissionVersion — `submission_versions` ✅ đã có

| Cột | Kiểu | Ràng buộc | Ghi chú |
|---|---|---|---|
| `id` | INTEGER | PK | |
| `submission_id` | INTEGER | FK → `submissions.id`, IDX, NOT NULL | |
| `version` | INTEGER | NOT NULL | Tăng dần, UQ theo submission |
| `asset_id` / `project_snapshot` | INTEGER / JSON | | Nội dung bản này (ảnh hoặc snapshot stroke) |
| `note` | TEXT | | Ghi chú của người học khi nộp lại |
| `created_at` | DATETIME | | |

### 3.21 Assessment — `assessments` ✅ đã có

| Cột | Kiểu | Ràng buộc | Ghi chú |
|---|---|---|---|
| `id` | INTEGER | PK | |
| `submission_id` | INTEGER | FK → `submissions.id`, IDX, NOT NULL | |
| `submission_version` | INTEGER | | Version được chấm |
| `total_score` | FLOAT | | Điểm tổng (thang theo rubric, thường 0–100) |
| `feedback_text` | TEXT | | Nhận xét tổng (có thể do AI text làm giàu) |
| `provider` | VARCHAR(50) | NOT NULL | Provider đã dùng: `local-cv` / `pollinations` / `huggingface` / `openrouter` / `openai-compat` |
| `confidence` | VARCHAR(20) | | `high` / `medium` / `low` / `uncertain` |
| `ai_job_id` | INTEGER | FK → `ai_jobs.id`, nullable | Job đã chạy assessment này (khi có async) |
| `created_at` | DATETIME | | |

### 3.22 AssessmentCriterionResult — `assessment_criterion_results` ✅ đã có

| Cột | Kiểu | Ràng buộc | Ghi chú |
|---|---|---|---|
| `id` | INTEGER | PK | |
| `assessment_id` | INTEGER | FK → `assessments.id`, IDX, NOT NULL | |
| `criterion_id` | INTEGER | FK → `rubric_criteria.id`, IDX, NOT NULL | |
| `score` | FLOAT | NOT NULL | Điểm tiêu chí |
| `max_score` | FLOAT | | |
| `comment` | TEXT | | Nhận xét riêng tiêu chí |

### 3.23 AssessmentAnnotation — `assessment_annotations` ✅ đã có

| Cột | Kiểu | Ràng buộc | Ghi chú |
|---|---|---|---|
| `id` | INTEGER | PK | |
| `assessment_id` | INTEGER | FK → `assessments.id`, IDX, NOT NULL | |
| `criterion_id` | INTEGER | FK → `rubric_criteria.id`, nullable | Tiêu chí liên quan |
| `kind` | VARCHAR(50) | NOT NULL | `circle` / `arrow` / `region` / `text` |
| `x` / `y` / `w` / `h` | FLOAT | | **Tọa độ chuẩn hóa 0–100 (% ảnh)** |
| `text` | TEXT | | Nội dung ghi chú |

### 3.24 AIJob — `ai_jobs` ✅ đã có

| Cột | Kiểu | Ràng buộc | Ghi chú |
|---|---|---|---|
| `id` | INTEGER | PK | |
| `job_type` | VARCHAR(50) | NOT NULL, IDX | `assess` / `tutor` / `enrich` |
| `status` | VARCHAR(20) | DEFAULT `'pending'`, IDX | `pending` / `running` / `done` / `failed` |
| `owner_id` | INTEGER | FK → `users.id`, IDX, nullable | |
| `submission_id` | INTEGER | FK → `submissions.id`, nullable, IDX | |
| `provider` | VARCHAR(50) | | Provider đã dùng (ghi sau khi chạy) |
| `payload` | JSON | | Input (không chứa secret) |
| `result` | JSON | | Output / lỗi |
| `error` | TEXT | | Lý do failed |
| `created_at` / `updated_at` | DATETIME | | |

### 3.25 AIConversation — `ai_conversations` ✅ đã có

| Cột | Kiểu | Ràng buộc | Ghi chú |
|---|---|---|---|
| `id` | INTEGER | PK | |
| `user_id` | INTEGER | FK → `users.id`, IDX, NOT NULL | |
| `lesson_id` | INTEGER | FK → `lessons.id`, nullable, IDX | Ngữ cảnh |
| `submission_id` | INTEGER | FK → `submissions.id`, nullable, IDX | Ngữ cảnh |
| `messages` | JSON | NOT NULL | Lịch sử chat `[{role, content, at}]` |
| `provider` | VARCHAR(50) | | Provider đã trả lời |
| `created_at` / `updated_at` | DATETIME | | |

Giới hạn: lưu tối đa N tin nhắn gần nhất mỗi conversation (ví dụ 50) để tránh phình DB; tin cũ hơn archive hoặc tóm tắt.

### 3.26 LearningProgress — `learning_progress` ✅ đã có

| Cột | Kiểu | Ràng buộc | Ghi chú |
|---|---|---|---|
| `id` | INTEGER | PK | |
| `user_id` | INTEGER | FK → `users.id`, IDX, NOT NULL | |
| `lesson_id` | INTEGER | FK → `lessons.id`, IDX, NOT NULL | |
| `status` | VARCHAR(20) | DEFAULT `'in_progress'` | `not_started` / `in_progress` / `completed` |
| `progress_pct` | INTEGER | DEFAULT 0 | 0–100 |
| `time_spent_seconds` | INTEGER | DEFAULT 0 | |
| `completed_at` | DATETIME | nullable | |
| `updated_at` | DATETIME | | |

UQ: `(user_id, lesson_id)`.

### 3.27 SkillMastery — `skill_masteries` ✅ đã có

| Cột | Kiểu | Ràng buộc | Ghi chú |
|---|---|---|---|
| `id` | INTEGER | PK | |
| `user_id` | INTEGER | FK → `users.id`, IDX, NOT NULL | |
| `skill_id` | INTEGER | FK → `skills.id`, IDX, NOT NULL | |
| `score` | FLOAT | DEFAULT 0 | 0–100 |
| `level` | VARCHAR(20) | | `beginner` / `intermediate` / `advanced` / `mastered` |
| `updated_at` | DATETIME | | |

UQ: `(user_id, skill_id)`. **Công thức cập nhật score chưa có tài liệu** — cần backend agent ghi lại (xem REQUIREMENTS.md §6).

### 3.28 Recommendation — `recommendations` ✅ đã có

| Cột | Kiểu | Ràng buộc | Ghi chú |
|---|---|---|---|
| `id` | INTEGER | PK | |
| `user_id` | INTEGER | FK → `users.id`, IDX, NOT NULL | |
| `lesson_id` | INTEGER | FK → `lessons.id`, nullable, IDX | Bài học gợi ý |
| `exercise_id` | INTEGER | FK → `exercises.id`, nullable, IDX | Bài tập gợi ý |
| `reason` | TEXT | | Vì sao gợi ý (hiển thị cho user) |
| `kind` | VARCHAR(50) | | `next` / `remedial` / `review` |
| `status` | VARCHAR(20) | DEFAULT `'new'` | `new` / `seen` / `done` / `dismissed` |
| `created_at` | DATETIME | | |

### 3.29 PortfolioItem — `portfolio_items` ✅ đã có

| Cột | Kiểu | Ràng buộc | Ghi chú |
|---|---|---|---|
| `id` | INTEGER | PK | |
| `user_id` | INTEGER | FK → `users.id`, IDX, NOT NULL | |
| `submission_id` | INTEGER | FK → `submissions.id`, nullable, IDX | |
| `project_id` | INTEGER | FK → `drawing_projects.id`, nullable, IDX | |
| `title` | VARCHAR(200) | | |
| `description` | TEXT | | |
| `is_public` | BOOLEAN | DEFAULT false | Chỉ public mới hiển thị cho người khác |
| `order_index` | INTEGER | DEFAULT 0 | |
| `created_at` | DATETIME | | |

### 3.30 Notification — 🟡 QUY HOẠCH (chưa có trong models.py)

Chưa có bảng notification; hiện tại user tự vào xem tiến độ/kết quả. Khi cần thông báo (assessment xong, lesson mở khóa, streak), thêm bảng:

| Cột | Kiểu | Ràng buộc |
|---|---|---|
| `id` | INTEGER | PK |
| `user_id` | INTEGER | FK → `users.id`, IDX, NOT NULL |
| `kind` | VARCHAR(50) | `assessment_done` / `lesson_unlocked` / `streak` / `system` |
| `title` / `body` | VARCHAR(200) / TEXT | |
| `ref_type` / `ref_id` | VARCHAR(50) / INTEGER | Đối tượng liên quan |
| `is_read` | BOOLEAN | DEFAULT false |
| `created_at` | DATETIME | |

### 3.31 AuditLog — `audit_logs` ✅ đã có

| Cột | Kiểu | Ràng buộc | Ghi chú |
|---|---|---|---|
| `id` | INTEGER | PK | |
| `actor_id` | INTEGER | FK → `users.id`, IDX, nullable | Ai làm (null = hệ thống) |
| `action` | VARCHAR(100) | NOT NULL, IDX | Ví dụ `admin.change_role`, `admin.update_lesson_status` |
| `target_type` / `target_id` | VARCHAR(50) / INTEGER | IDX | Đối tượng bị tác động |
| `detail` | JSON | | Chi tiết (không chứa secret) |
| `created_at` | DATETIME | IDX | |

---

## 4. Đối chiếu: entity trong đặc tả vs model trong code

| Entity đặc tả | Model trong `models.py` | Kết luận |
|---|---|---|
| User, UserProfile | ✅ `User`, `UserProfile` | Có |
| Role | ❌ không có | **Cột `users.role`** — xem §3.3 |
| CourseTrack | ✅ `Track` (bảng `tracks`) | Có, khác tên |
| Module, Lesson, LessonBlock | ✅ | Có |
| LearningObjective | ❌ không có | Nằm trong `lessons.objectives` — xem §3.8 |
| Skill, SkillPrerequisite | ✅ | Có |
| LessonPrerequisite | ❌ không có | Quy hoạch — xem §3.11 |
| Exercise, Rubric, RubricCriterion | ✅ | Có |
| DrawingProject, DrawingStroke, DrawingLayer | ✅ | Có |
| DrawingAsset | ❌ không có | Quy hoạch — xem §3.18 |
| Submission, SubmissionVersion | ✅ | Có |
| Assessment, AssessmentCriterionResult, AssessmentAnnotation | ✅ | Có |
| AIJob, AIConversation | ✅ | Có |
| LearningProgress, SkillMastery, Recommendation | ✅ | Có |
| PortfolioItem | ✅ | Có |
| Notification | ❌ không có | Quy hoạch — xem §3.30 |
| AuditLog | ✅ | Có |

**Tổng kết: 28/34 entity đã có model (tính `Track` = `CourseTrack`); 5 entity chưa có bảng riêng** (Role, LearningObjective, LessonPrerequisite, DrawingAsset, Notification) — đều đã mô tả ở dạng quy hoạch phía trên, cần migration khi thực sự cần.

---

## 5. Migration strategy (Alembic)

### Thực trạng (đọc từ code, 2026-11-24)

- `backend/alembic/` **chỉ là stub**: file `alembic/README.md` tự ghi rõ *"Current deployment uses `Base.metadata.create_all()` on startup… This folder is a placeholder"*.
- `app/main.py` gọi `Base.metadata.create_all(bind=engine)` mỗi lần startup.
- `requirements.txt` có `alembic==1.14.0` nhưng chưa có `alembic.ini`, chưa có `env.py`, chưa có revision nào.

### Chiến lược mục tiêu (chưa thực hiện)

1. **Ngay khi có thể (trước dữ liệu thật):** khởi tạo Alembic đúng chuẩn:
   ```bash
   cd backend
   alembic init alembic          # nếu chưa có (hiện đã có thư mục stub — kiểm tra trước khi init đè)
   # alembic.ini: sqlalchemy.url = ${DATABASE_URL}
   # alembic/env.py: target_metadata = Base.metadata
   alembic revision --autogenerate -m "init"
   alembic upgrade head
   ```
2. **Bỏ `create_all()` khỏi `main.py`** ngay sau khi migration đầu tiên chạy được trên cả SQLite (dev) và Postgres (compose) — giữ `create_all()` chỉ cho test (`tests/conftest.py` tự tạo schema test riêng).
3. **Quy tắc revision:** một thay đổi schema = một revision có message rõ ràng (`add drawing_assets table`, `add lesson_prerequisites`…); không sửa revision đã merge; production chỉ chạy `alembic upgrade head`, không bao giờ `downgrade` tay trên dữ liệu thật khi chưa backup.
4. **Autogenerate không tin tuyệt đối:** luôn đọc file revision sinh ra trước khi apply — đặc biệt với thay đổi kiểu cột, đổi tên, và dữ liệu cần migrate (ví dụ tách `lessons.objectives` → bảng `learning_objectives`).
5. **Seed tách khỏi migration:** seed data (user + curriculum) chạy bằng `app/seed.py` khi startup (đã có), **không** nhét seed vào migration. Migration chỉ lo schema.

### ⚠️ Chưa được tạo

**Không có migration nào tồn tại tính tới 2026-11-24 ~23:01.** Mọi câu về "đã migrate" đều là sai cho tới khi có file revision thật + lệnh `alembic upgrade head` chạy qua có log.

---

## 6. Seed data plan

Seed chạy từ `app/seed.py` khi backend startup (gọi trong `app/main.py`), dữ liệu chương trình từ `app/data/curriculum.json`.

| Nhóm seed | Nội dung (theo code đã đọc) |
|---|---|
| User | `admin@drawpath.local` / `admin123` (admin), `learner@drawpath.local` / `learner123` (learner) — xem README §8 về mâu thuẫn với brief |
| Curriculum | 15 module, 75 lesson, 14 skill (theo `backend/README.md`) |
| Track | Danh sách trong `curriculum.json` (key `tracks`) |
| Module/Lesson/Skill | Danh sách trong `curriculum.json` (key `modules`, `lessons`, `skills`) |

**Quy tắc seed:**
- Seed phải **idempotent** (chạy lại không tạo trùng): kiểm tra tồn tại theo `code`/`email` trước khi insert.
- Seed **không** tạo dữ liệu user thật (submission, assessment mẫu) — chỉ tạo tài khoản demo + nội dung chương trình.
- Mật khẩu seed yếu chỉ dùng local; production **tắt seed user demo** (biến env, ví dụ `SEED_DEMO_USERS=false`) hoặc đổi mật khẩu ngay sau khi tạo.
- Muốn xem chi tiết curriculum: đọc `backend/app/data/curriculum.json` và `backend/app/data/generate_curriculum.py`.

---

## 7. PostgreSQL vs SQLite — thực trạng

| | SQLite (hiện tại) | PostgreSQL (mục tiêu) |
|---|---|---|
| Khi nào dùng | Dev local mặc định (`drawpath.db`) | Docker Compose + production |
| `DATABASE_URL` | `sqlite:///./drawpath.db` | `postgresql+psycopg2://drawpath:drawpath@db:5432/drawpath` (compose) |
| Driver | Có sẵn trong Python | **`psycopg2` chưa có trong `requirements.txt`** — phải bổ sung trước khi chạy compose |
| Kiểu JSON | Lưu dạng TEXT (SQLAlchemy JSON type) | JSONB (nên dùng khi migration thật) |
| `create_all()` | Chạy được | Chạy được nhưng không phải migration |
| Rủi ro | File DB nằm trong container → mất khi xóa container nếu không mount volume | Cần volume `pgdata` (đã có trong compose) + backup định kỳ |

**Không dùng SQLite file trong container khi chạy compose** (NFR-REL-01): backend trong compose phải trỏ `DATABASE_URL` sang service `db`, và `drawpath.db` không được dùng làm DB chính ở môi trường compose/production.

---

## 8. Index & hiệu năng (khuyến nghị khi viết migration thật)

- Mọi `FK` đều có index (đã liệt kê IDX ở §3).
- Index composite: `learning_progress(user_id, lesson_id)` UQ; `skill_masteries(user_id, skill_id)` UQ; `submissions(owner_id, created_at)`; `assessments(submission_id, created_at)`; `audit_logs(created_at)`.
- `drawing_strokes.points` (JSON lớn): không index nội dung; nếu project > 1.000 stroke thì cân nhắc tách bảng `stroke_points` hoặc lưu file.
- `ai_conversations.messages` (JSON): giới hạn độ dài, không index.

---

## 9. Retention & xóa dữ liệu

| Dữ liệu | Giữ | Xóa |
|---|---|---|
| Submission + Version + Assessment + Annotation | Vĩnh viễn trong tài khoản user (trừ khi user xóa) | User xóa submission → xóa cascade version/assessment/annotation của submission đó; ghi AuditLog |
| AIJob (done/failed) | 90 ngày | Job quá 90 ngày có thể archive/xóa (chưa có job dọn dẹp — P2) |
| AIConversation | 90 ngày kể từ tin cuối | Quá hạn → tóm tắt hoặc xóa (chưa có job dọn dẹp — P2) |
| AuditLog | Tối thiểu 1 năm | Không cho user thường xóa; chỉ admin hệ thống purge theo chính sách |
| Upload file | Theo submission/project còn tồn tại | Xóa submission/project → xóa file storage tương ứng (khi có storage abstraction) |
| Tài khoản user | Khi user yêu cầu xóa: ẩn danh hóa (anonymize) submission/assessment đã có hoặc xóa hẳn theo yêu cầu + luật | Chưa có endpoint xóa tài khoản — P2 |

---

## 10. Việc chưa làm (checklist cho backend agent)

- [ ] Bổ sung `psycopg2` (và `redis`, `celery` nếu giữ worker) vào `requirements.txt`.
- [ ] Khởi tạo Alembic thật (`alembic.ini`, `env.py`, revision `init`) và chạy `alembic upgrade head` trên cả SQLite và Postgres.
- [ ] Bỏ `create_all()` khỏi `main.py` sau khi migration chạy được.
- [ ] Chốt công thức cập nhật `SkillMastery.score` và ghi thành tài liệu.
- [ ] Chốt kiểu lưu `lessons.objectives` (TEXT vs JSON vs tách bảng `learning_objectives`).
- [ ] Thống nhất tài khoản seed (xem README §8).
- [ ] Kiểm chứng compose chạy được với Postgres (xem DEPLOYMENT.md).
