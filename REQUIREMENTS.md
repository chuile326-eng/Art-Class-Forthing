# REQUIREMENTS.md — Yêu cầu hệ thống DrawPath AI

> **Ngôn ngữ:** tiếng Việt là ngôn ngữ mặc định của sản phẩm và tài liệu; thuật ngữ kỹ thuật giữ nguyên tiếng Anh.
> **Trạng thái:** tài liệu đặc tả. Code backend/frontend đã xuất hiện trong repo (xem [README.md](./README.md#️-trạng-thái-xác-minh--đọc-trước-cập-nhật-2026-11-24-2301-asiasaigon)), nhưng **chưa có yêu cầu nào trong file này được xác minh là đã chạy đúng** — chưa chạy pytest, chưa chạy build, chưa chạy thử end-to-end. Mỗi FR dưới đây cần được đối chiếu với test tương ứng trước khi đánh dấu "đạt".
> **Quy ước ID:** `FR-<nhóm>-<số>` cho yêu cầu chức năng, `NFR-<nhóm>-<số>` cho yêu cầu phi chức năng. Độ ưu tiên: **P0** = bắt buộc cho MVP, **P1** = cần có ngay sau MVP, **P2** = nice-to-have.

---

## 1. Phạm vi tổng thể (20 nhóm scope)

| # | Nhóm | Mô tả một dòng | Độ ưu tiên nhóm |
|---|---|---|---|
| 1 | Auth (xác thực & tài khoản) | Đăng ký, đăng nhập JWT, vai trò, hồ sơ | P0 |
| 2 | Onboarding | Khảo sát đầu vào: mục tiêu, trình độ tự đánh giá, chất liệu, thời gian/ngày | P0 |
| 3 | Curriculum (chương trình học) | Track → Module → Lesson → LessonBlock → Exercise | P0 |
| 4 | Roadmap (lộ trình) | Lộ trình cá nhân theo skill + prerequisite, khóa/mở bài học | P0 |
| 5 | Lessons (bài học) | Nội dung bài học, block text/image/video/demo, mục tiêu học tập | P0 |
| 6 | Workspace (không gian vẽ) | Canvas vẽ trên trình duyệt: layer, stroke, undo/redo, export | P0 |
| 7 | Replay | Xem lại quá trình vẽ theo từng stroke (phát lại) | P1 |
| 8 | Upload | Upload ảnh bài vẽ tay (JPEG/PNG/WebP, ≤ 10 MB) | P0 |
| 9 | Submission (nộp bài) | Nộp bài cho exercise, versioning, trạng thái | P0 |
| 10 | AI Assessment (chấm AI) | Chấm theo rubric: điểm từng tiêu chí + điểm tổng + confidence | P0 |
| 11 | Annotation | Ghi chú trực quan trên bài vẽ (khoanh vùng, mũi tên, text) | P0 |
| 12 | Correction (bài sửa) | Gợi ý sửa cụ thể từng lỗi + bài tập khắc phục | P1 |
| 13 | AI Tutor (gia sư AI) | Chat hỏi–đáp theo ngữ cảnh bài học / bài nộp | P1 |
| 14 | Progress (tiến độ) | % hoàn thành lesson/module/track, streak, thời gian học | P0 |
| 15 | Mastery (thành thạo kỹ năng) | Điểm mastery từng skill, cập nhật sau mỗi assessment | P0 |
| 16 | Recommendations | Gợi ý bài học / bài tập tiếp theo dựa trên mastery & điểm yếu | P1 |
| 17 | Revision History | Lịch sử phiên bản submission & project, so sánh, khôi phục | P1 |
| 18 | Portfolio | Tuyển tập bài vẽ tốt nhất, chia sẻ/xem công khai (tùy chọn) | P1 |
| 19 | Admin | Quản trị user, nội dung (lesson/exercise/rubric), AI jobs, audit log | P0 |
| 20 | Monitoring (giám sát) | Health check, log, metrics, theo dõi AI job & lỗi | P1 |

---

## 2. Yêu cầu chức năng

### 2.1 Auth — FR-AUTH

| ID | Yêu cầu | P |
|---|---|---|
| FR-AUTH-01 | Người dùng đăng ký bằng email + username + mật khẩu (mật khẩu ≥ 8 ký tự, hash bcrypt, không lưu plaintext). | P0 |
| FR-AUTH-02 | Đăng nhập bằng email + mật khẩu, trả về JWT Bearer token (hạn mặc định 7 ngày — `ACCESS_TOKEN_EXPIRE_MINUTES=10080`). | P0 |
| FR-AUTH-03 | `GET /auth/me` trả về thông tin user hiện tại từ token hợp lệ; token sai/hết hạn → 401. | P0 |
| FR-AUTH-04 | Phân vai trò: `guest` / `learner` / `instructor` / `admin` (lưu ở cột `users.role`; xem DATABASE.md — Role **không** phải bảng riêng trong code hiện tại). Chỉ admin đổi được role của user khác (`PUT /admin/users/{uid}/role`). | P0 |
| FR-AUTH-05 | Mọi thao tác trên dữ liệu của user khác phải kiểm tra ownership (IDOR check): user chỉ xem/sửa/xóa project, submission, portfolio của chính mình, trừ admin/instructor theo quyền. | P0 |
| FR-AUTH-06 | Đăng xuất phía client = xóa token (không có server-side blacklist ở MVP); token hết hạn phải đăng nhập lại. | P1 |
| FR-AUTH-07 | Quên mật khẩu: endpoint `POST /auth/forgot-password` tồn tại nhưng **hiện trả `not_configured`** (chưa có email service) — FR này là P1, chỉ "đạt" khi có email thật gửi được. | P1 |
| FR-AUTH-08 | Xác minh email: cột `users.is_verified` đã có; luồng gửi/nhận link xác minh chưa có — P2. | P2 |
| FR-AUTH-09 | Khóa tài khoản: `users.is_active=false` thì đăng nhập bị từ chối. | P1 |

> Đối chiếu code đã đọc: `backend/app/routers/auth_router.py` có `POST /auth/register`, `POST /auth/login`, `GET /auth/me`, `POST /auth/forgot-password`; `backend/app/auth.py` xử lý JWT + role + ownership. Chưa chạy test nên chưa xác minh hành vi thật.

### 2.2 Onboarding — FR-ONB

| ID | Yêu cầu | P |
|---|---|---|
| FR-ONB-01 | Sau đăng ký, user mới làm onboarding: chọn mục tiêu học (goal), tự đánh giá trình độ (self_level), chất liệu (medium: paper / digital / both), thời gian học mỗi ngày (minutes_per_day, mặc định 30). | P0 |
| FR-ONB-02 | Onboarding lưu vào `UserProfile` (`GET/PUT /users/me/profile`); cho phép sửa lại sau trong Settings. | P0 |
| FR-ONB-03 | Dựa trên onboarding, hệ thống gợi ý track khởi đầu và lesson đầu tiên (nối sang FR-REC-01). | P1 |
| FR-ONB-04 | User có thể bỏ qua onboarding và làm sau; trạng thái "đã onboarding" được ghi nhận để không hỏi lại. | P1 |

### 2.3 Curriculum — FR-CUR

| ID | Yêu cầu | P |
|---|---|---|
| FR-CUR-01 | Chương trình có 4 cấp: Track → Module → Lesson → LessonBlock; mỗi Lesson có nhiều Exercise. Seed hiện tại: 15 module, 75 lesson, 14 skill (theo `backend/README.md` + `app/data/curriculum.json`). | P0 |
| FR-CUR-02 | `GET /tracks` liệt kê track; `GET /modules?track_id=…`, `GET /modules/{code}`, `GET /lessons?module_id=…`, `GET /lessons/{id}` trả về nội dung. | P0 |
| FR-CUR-03 | Mỗi Lesson có: tiêu đề, mô tả, mục tiêu học tập (learning objectives), thứ tự, trạng thái (draft/published/archived), thời lượng ước tính. | P0 |
| FR-CUR-04 | Mỗi Exercise có: loại bài tập (evaluation_type — ví dụ: vẽ đường thẳng, tỷ lệ, phối cảnh, sáng tạo…), hướng dẫn, rubric gắn kèm, độ khó. | P0 |
| FR-CUR-05 | `GET /skills` liệt kê kỹ năng; mỗi skill có mô tả và prerequisite (skill cần có trước). | P0 |
| FR-CUR-06 | Admin tạo/sửa lesson (`POST /admin/lessons`, `PUT /admin/lessons/{id}/status`); lesson ở trạng thái draft không hiển thị cho learner. | P0 |

### 2.4 Roadmap — FR-RM

| ID | Yêu cầu | P |
|---|---|---|
| FR-RM-01 | Trang Roadmap hiển thị track → module → lesson theo thứ tự, kèm trạng thái từng lesson (locked / available / in_progress / completed). | P0 |
| FR-RM-02 | Lesson bị khóa khi chưa đạt prerequisite (lesson hoặc skill prerequisite chưa đủ mastery) — phải hiển thị rõ *vì sao* bị khóa và cần làm gì để mở. | P0 |
| FR-RM-03 | Roadmap cá nhân hóa theo mastery hiện tại của user (không phải roadmap cứng giống nhau cho mọi người). | P1 |
| FR-RM-04 | Hiển thị % hoàn thành theo module và track. | P0 |

### 2.5 Lessons — FR-LES

| ID | Yêu cầu | P |
|---|---|---|
| FR-LES-01 | Trang lesson hiển thị các LessonBlock theo thứ tự: text, hình minh họa, video/demo, ví dụ đúng–sai. | P0 |
| FR-LES-02 | Mỗi lesson liệt kê learning objectives ngay đầu bài; cuối bài có exercise gắn kèm (`GET /lessons/{id}/exercises`). | P0 |
| FR-LES-03 | Đánh dấu lesson đã hoàn thành khi user hoàn thành exercise bắt buộc hoặc bấm "đánh dấu đã học" (tùy thiết kế — cần chốt một hành vi duy nhất, ghi vào LearningProgress). | P0 |
| FR-LES-04 | Nội dung lesson hỗ trợ tiếng Việt đầy đủ (UTF-8), hiển thị đúng trên mobile. | P0 |

### 2.6 Workspace — FR-WS

| ID | Yêu cầu | P |
|---|---|---|
| FR-WS-01 | Canvas vẽ trên trình duyệt: vẽ stroke bằng chuột/cảm ứng, chọn màu, độ dày nét, tẩy. | P0 |
| FR-WS-02 | Quản lý Layer: tạo/sửa/xóa layer (`POST/PUT/DELETE /drawing/projects/{pid}/layers/{lid}`), đổi thứ tự, ẩn/hiện. | P0 |
| FR-WS-03 | Quản lý Stroke: thêm stroke (`POST /drawing/projects/{pid}/strokes`), xóa stroke; mỗi stroke lưu tọa độ, màu, độ dày, layer, thứ tự, timestamp (phục vụ replay). | P0 |
| FR-WS-04 | DrawingProject CRUD: tạo/lấy/sửa/xóa project (`/drawing/projects`), mỗi project gắn với một lesson/exercise (tùy chọn) và thuộc về đúng owner. | P0 |
| FR-WS-05 | Export project thành ảnh (`GET /drawing/projects/{pid}/export`) để nộp hoặc tải về. | P0 |
| FR-WS-06 | Tự động lưu nháp (autosave) định kỳ và khi rời trang; mở lại project phải khôi phục đúng trạng thái đã lưu. | P1 |
| FR-WS-07 | Undo/redo tối thiểu 20 bước trong phiên vẽ. | P1 |

### 2.7 Replay — FR-RPL

| ID | Yêu cầu | P |
|---|---|---|
| FR-RPL-01 | Phát lại quá trình vẽ của một project/submission theo thứ tự stroke, có điều khiển play/pause, tốc độ, tua. | P1 |
| FR-RPL-02 | Replay dùng đúng dữ liệu stroke đã lưu (không render lại từ ảnh tĩnh). | P1 |
| FR-RPL-03 | Tutor/admin có thể xem replay bài nộp của học viên để nhận xét quá trình, không chỉ kết quả. | P2 |

### 2.8 Upload — FR-UPL

| ID | Yêu cầu | P |
|---|---|---|
| FR-UPL-01 | Upload ảnh bài vẽ tay qua `POST /uploads` (multipart): chấp nhận JPEG/PNG/WebP, tối đa 10 MB (`MAX_UPLOAD_MB=10`); sai định dạng/quá lớn → 400 với message rõ ràng. | P0 |
| FR-UPL-02 | File upload được lưu kèm metadata (owner, tên gốc, kích thước, MIME, thời gian) và chỉ owner + admin xem được. | P0 |
| FR-UPL-03 | Lưu trữ: local `./uploads` ở MVP; chuyển sang S3-compatible/MinIO khi deploy (xem ARCHITECTURE.md — storage abstraction). Không lưu file upload vào git. | P1 |
| FR-UPL-04 | Ảnh upload được chuẩn hóa (giới hạn kích thước xử lý, strip EXIF vị trí) trước khi đưa vào AI assessment. | P1 |

### 2.9 Submission — FR-SUB

| ID | Yêu cầu | P |
|---|---|---|
| FR-SUB-01 | Nộp bài cho một exercise: `POST /submissions` với `exercise_id` + (ảnh upload hoặc project export). | P0 |
| FR-SUB-02 | Mỗi submission có trạng thái: `pending` → `assessing` → `assessed` / `failed`; user xem được trạng thái của bài mình. | P0 |
| FR-SUB-03 | Submission versioning: nộp lại tạo `SubmissionVersion` mới, giữ lại các bản cũ; `GET /submissions/{sid}` trả về bản mới nhất + lịch sử. | P1 |
| FR-SUB-04 | `GET /submissions` liệt kê bài nộp của user hiện tại (phân trang); admin xem được tất cả. | P0 |
| FR-SUB-05 | Xóa submission chỉ owner hoặc admin được phép; xóa phải xóa cả version/assessment/annotation liên quan hoặc đánh dấu đã xóa (không để dữ liệu mồ côi). | P1 |

### 2.10 AI Assessment — FR-ASM

| ID | Yêu cầu | P |
|---|---|---|
| FR-ASM-01 | `POST /submissions/{sid}/assess` chạy đánh giá và trả về Assessment: điểm tổng (0–100 hoặc thang rubric), điểm từng tiêu chí (`AssessmentCriterionResult`), nhận xét tổng, confidence. | P0 |
| FR-ASM-02 | Đánh giá dựa trên rubric của exercise: mỗi `RubricCriterion` có trọng số và mô tả mức điểm; `engine.validate_rubric` / `validate_assessment_schema` phải chặn rubric không hợp lệ. | P0 |
| FR-ASM-03 | Đánh giá hình học (geometry) chạy local bằng OpenCV/NumPy/Pillow (`assessment/geometry.py`, `engine.py`): đo độ thẳng, tỷ lệ, đối xứng… theo `evaluation_type` của exercise; nếu thiếu OpenCV thì fallback NumPy/PIL và ghi rõ trong kết quả. | P0 |
| FR-ASM-04 | Bài tập sáng tạo/bố cục: chỉ dùng geometry proxy + gắn cờ `uncertain` — **không được giả vờ là đánh giá thẩm mỹ thật** (theo `backend/README.md`). | P0 |
| FR-ASM-05 | Mọi assessment ghi lại provider đã dùng (`provider` field); kết quả local-CV ghi `local-cv`, không ghi nhận là LLM output. | P0 |
| FR-ASM-06 | Assessment chạy bất đồng bộ qua AIJob khi bài toán nặng (hàng đợi Redis/Celery — mục tiêu; hiện tại code chạy đồng bộ trong request, xem ARCHITECTURE.md §7). | P1 |
| FR-ASM-07 | Assessment thất bại (timeout/provider lỗi) phải trả trạng thái `failed` + lý do, không trả điểm giả; cho phép chạy lại. | P0 |
| FR-ASM-08 | `GET /assessments/{aid}` lấy kết quả đánh giá; chỉ owner/admin xem được. | P0 |

Chi tiết provider + fallback chain: xem [ARCHITECTURE.md](./ARCHITECTURE.md#6-ai-provider-abstraction--fallback-chain) và `backend/app/ai_providers.py`.

### 2.11 Annotation — FR-ANN

| ID | Yêu cầu | P |
|---|---|---|
| FR-ANN-01 | Mỗi assessment có thể kèm nhiều annotation (`AssessmentAnnotation`): loại (circle/arrow/text/region), tọa độ chuẩn hóa (x, y, w, h theo % ảnh — không phụ thuộc kích thước hiển thị), nội dung, tiêu chí liên quan. | P0 |
| FR-ANN-02 | Frontend hiển thị annotation đúng vị trí trên ảnh bài vẽ ở mọi kích thước màn hình (tọa độ chuẩn hóa, không hard-code pixel). | P0 |
| FR-ANN-03 | `GET /submissions/{sid}/corrections` trả về annotation + gợi ý sửa theo từng tiêu chí. | P0 |

### 2.12 Correction — FR-COR

| ID | Yêu cầu | P |
|---|---|---|
| FR-COR-01 | Mỗi lỗi được chỉ ra phải kèm gợi ý sửa cụ thể ("đường này lệch ~15° sang phải, thử…"), không chỉ nói "chưa tốt". | P1 |
| FR-COR-02 | Gợi ý bài tập khắc phục: sau assessment, hệ thống đề xuất 1–3 exercise nhắm vào tiêu chí điểm thấp nhất. | P1 |
| FR-COR-03 | So sánh bản trước/sau: user xem được bài cũ, annotation cũ và bài làm lại cạnh nhau. | P1 |

### 2.13 AI Tutor — FR-TUT

| ID | Yêu cầu | P |
|---|---|---|
| FR-TUT-01 | `POST /tutor/chat`: chat hỏi–đáp với AI tutor theo ngữ cảnh (lesson hiện tại / submission được chọn); lưu lịch sử vào `AIConversation`. | P1 |
| FR-TUT-02 | Tutor trả lời bằng tiếng Việt, ngắn gọn, hướng dẫn từng bước; không làm hộ bài tập (không vẽ thay, không đưa đáp án hoàn chỉnh khi bài tập yêu cầu tự làm). | P1 |
| FR-TUT-03 | Khi provider AI ngoài không khả dụng, tutor trả về thông báo "tạm thời không khả dụng" một cách trung thực — **không bịa câu trả lời** (theo `backend/README.md`). | P0 |
| FR-TUT-04 | Giới hạn độ dài hội thoại / rate limit để tránh lạm dụng (xem API.md). | P1 |
| FR-TUT-05 | Sanitize input người dùng trước khi đưa vào prompt (đã có `sanitize_user_text` trong `ai_providers.py`). | P0 |

### 2.14 Progress — FR-PRG

| ID | Yêu cầu | P |
|---|---|---|
| FR-PRG-01 | `POST /progress` ghi nhận tiến độ (lesson hoàn thành / thời gian học); `GET /progress` trả về tổng quan tiến độ của user. | P0 |
| FR-PRG-02 | Tiến độ tính theo: lesson đã xong / tổng lesson, module, track; streak (số ngày học liên tiếp); tổng thời gian học. | P0 |
| FR-PRG-03 | Dashboard hiển thị tiến độ, bài tập tiếp theo, kỹ năng yếu nhất. | P0 |

### 2.15 Mastery — FR-MAS

| ID | Yêu cầu | P |
|---|---|---|
| FR-MAS-01 | Mỗi skill có `SkillMastery` theo user: điểm 0–100, level (ví dụ beginner/intermediate/advanced/mastered), cập nhật sau mỗi assessment. | P0 |
| FR-MAS-02 | `GET /mastery` trả về mastery từng skill + lịch sử thay đổi (để vẽ biểu đồ tiến bộ). | P0 |
| FR-MAS-03 | Công thức cập nhật mastery phải có tài liệu (trọng số bài mới vs cũ, decay theo thời gian nếu có) — không để công thức chìm trong code không ai biết. | P1 |
| FR-MAS-04 | Đạt ngưỡng mastery của một skill sẽ mở khóa lesson/module yêu cầu skill đó (nối FR-RM-02). | P0 |

### 2.16 Recommendations — FR-REC

| ID | Yêu cầu | P |
|---|---|---|
| FR-REC-01 | `GET /recommendations` trả về danh sách gợi ý cá nhân hóa: bài học tiếp theo, bài tập khắc phục điểm yếu, ôn tập skill sắp quên. | P1 |
| FR-REC-02 | Recommendation lưu vào bảng `Recommendation` kèm lý do (vì sao gợi ý bài này) và trạng thái (đã xem / đã làm / đã bỏ qua). | P1 |
| FR-REC-03 | Không gợi ý bài đã khóa (chưa đủ prerequisite) hoặc bài đã hoàn thành xuất sắc trừ khi là ôn tập. | P1 |

### 2.17 Revision History — FR-REV

| ID | Yêu cầu | P |
|---|---|---|
| FR-REV-01 | Mọi lần nộp lại / sửa project đều lưu version mới, không ghi đè bản cũ. | P1 |
| FR-REV-02 | User xem được timeline các version của một submission/project kèm điểm assessment từng bản. | P1 |
| FR-REV-03 | Khôi phục một version cũ thành bản hiện tại (tạo version mới sao chép nội dung cũ, không xóa lịch sử). | P2 |

### 2.18 Portfolio — FR-PFL

| ID | Yêu cầu | P |
|---|---|---|
| FR-PFL-01 | `POST /portfolio` thêm một submission/project vào portfolio; `GET /portfolio` liệt kê portfolio của user. | P1 |
| FR-PFL-02 | Mỗi PortfolioItem có tiêu đề, mô tả, thứ tự hiển thị, trạng thái công khai/riêng tư. | P1 |
| FR-PFL-03 | Trang portfolio công khai (nếu bật) chỉ hiển thị item đã đặt public; không lộ email hay dữ liệu riêng tư khác. | P1 |

### 2.19 Admin — FR-ADM

| ID | Yêu cầu | P |
|---|---|---|
| FR-ADM-01 | `GET /admin/overview`: tổng số user, submission, assessment, tỷ lệ assessment failed, thống kê theo ngày. | P0 |
| FR-ADM-02 | `GET /admin/users`: danh sách user (phân trang, tìm kiếm); đổi role (`PUT /admin/users/{uid}/role`); vô hiệu hóa tài khoản. | P0 |
| FR-ADM-03 | Quản lý nội dung: tạo/sửa lesson, exercise, rubric (qua `POST /admin/lessons`, `PUT /admin/lessons/{id}/status`). | P0 |
| FR-ADM-04 | `GET /admin/ai-jobs`: theo dõi AIJob (pending/running/done/failed), cho phép retry job failed. | P1 |
| FR-ADM-05 | `GET /admin/audit-logs`: xem AuditLog (ai, làm gì, khi nào, đối tượng nào) — mọi hành động admin phải ghi log. | P0 |
| FR-ADM-06 | Admin không được xem nội dung bài nộp riêng tư của user ngoài mục đích kiểm duyệt/hỗ trợ và phải có log truy cập. | P1 |

### 2.20 Monitoring — FR-MON

| ID | Yêu cầu | P |
|---|---|---|
| FR-MON-01 | `GET /health` trả về `{"status": "ok", "service": "drawpath-ai", "version": "0.1.0"}` khi backend sống (đã có trong `app/main.py`). | P0 |
| FR-MON-02 | Health check mở rộng: kiểm tra kết nối DB, Redis, storage (endpoint riêng, ví dụ `/health/ready`) — P1, chưa có trong code đã đọc. | P1 |
| FR-MON-03 | Log tập trung: mọi request lỗi 5xx, mọi AI job failed đều ghi log có request-id để truy vết. | P1 |
| FR-MON-04 | Metrics cơ bản: số assessment/ngày, thời gian đánh giá trung bình, tỷ lệ fallback sang local-CV. | P2 |

---

## 3. Yêu cầu phi chức năng

| ID | Yêu cầu | Mức |
|---|---|---|
| NFR-PERF-01 | API đọc (GET tracks/lessons/submissions) p95 < 300 ms ở local; trang lesson hiển thị < 2 s ở mạng 4G mô phỏng. | P0 |
| NFR-PERF-02 | Assessment hình học local hoàn thành < 10 s cho ảnh ≤ 10 MB; assessment qua provider ngoài timeout 15 s/provider, tối đa 1 retry/provider (theo `ai_providers.py`). | P0 |
| NFR-PERF-03 | Canvas workspace mượt ở 60 fps cho stroke thông thường; autosave không chặn thao tác vẽ. | P1 |
| NFR-SEC-01 | Mật khẩu hash bcrypt; JWT ký bằng `SECRET_KEY` (đổi ở production, tối thiểu 32 ký tự ngẫu nhiên); không log token/mật khẩu. | P0 |
| NFR-SEC-02 | Mọi endpoint (trừ register/login/health/docs) yêu cầu Bearer JWT; kiểm tra ownership trên mọi tài nguyên theo user (chống IDOR). | P0 |
| NFR-SEC-03 | CORS: production chỉ cho phép origin của frontend thật — **code hiện tại đang `allow_origins=["*"]` (theo `app/main.py`), phải sửa trước khi deploy công khai.** | P0 |
| NFR-SEC-04 | Upload: kiểm tra MIME + kích thước, quét tên file (không cho path traversal), không thực thi file upload. | P0 |
| NFR-SEC-05 | Không commit secret; `.env` nằm trong `.gitignore`; `.env.example` chỉ chứa placeholder. | P0 |
| NFR-SEC-06 | Rate limit: auth (login/register) ≤ 10 req/phút/IP; assess ≤ 5 req/phút/user; tutor chat ≤ 20 req/phút/user (xem API.md). | P1 |
| NFR-A11Y-01 | Đạt **WCAG 2.2 AA**: tương phản chữ ≥ 4.5:1 (brand colours đã chọn cần kiểm chứng lại — Terracotta `#D56B46` trên nền `#FFFCF7` cần đo thật), focus visible, mọi chức năng dùng được bằng bàn phím. | P0 |
| NFR-A11Y-02 | Canvas có phương án thay thế cho người dùng không dùng chuột (upload ảnh thay cho vẽ tay). | P1 |
| NFR-RESP-01 | Responsive ở 4 breakpoint kiểm chứng: **375px (mobile), 768px (tablet), 1280px (laptop), 1440px (desktop)** — workspace vẽ trên mobile phải dùng được, không chỉ "hiển thị được". | P0 |
| NFR-I18N-01 | Tiếng Việt mặc định; chuỗi UI tách khỏi code (i18n-ready), không hard-code tiếng Việt trong logic nghiệp vụ. | P1 |
| NFR-REL-01 | Không mất dữ liệu user khi restart backend (DB persistent volume, không dùng SQLite file trong container khi chạy compose). | P0 |
| NFR-OBS-01 | Mọi lỗi 5xx và AI job failed đều có log + request-id; admin xem được qua `/admin/ai-jobs` và `/admin/audit-logs`. | P1 |
| NFR-COST-01 | **Không dùng infra trả phí ở giai đoạn này**: AI provider ưu tiên free/keyless, DB/Redis/MinIO tự host qua Docker Compose. | P0 |

---

## 4. Out of scope (không làm trong giai đoạn này)

1. Thanh toán / gói trả phí / subscription.
2. App mobile native (iOS/Android) — chỉ web responsive.
3. Livestream / lớp học trực tuyến đồng bộ (real-time classroom).
4. Chấm bài bởi giảng viên người thật (human grading queue) — chỉ AI assessment + tự đánh giá.
5. Email marketing, notification email (trừ forgot-password khi có email service — hiện `not_configured`).
6. Dịch vụ lưu trữ đám mây trả phí (S3 AWS thật) — dùng MinIO local / S3-compatible tự host.
7. Đa ngôn ngữ đầy đủ (chỉ chuẩn bị i18n, chưa dịch toàn bộ UI sang ngôn ngữ khác).
8. Tính năng xã hội: theo dõi bạn bè, bình luận, like (portfolio public chỉ ở mức xem).
9. AI vẽ thay người học / sinh ảnh bài mẫu bằng AI tạo sinh (generative image) — AI chỉ phân tích, gợi ý và trò chuyện.
10. Chế độ offline hoàn toàn.

---

## 5. Traceability (truy vết yêu cầu → code/test)

| Yêu cầu | Code đã đọc (tham chiếu) | Test (trạng thái) |
|---|---|---|
| FR-AUTH-01 → 05 | `backend/app/routers/auth_router.py`, `app/auth.py` | `backend/tests/test_backend.py` (172 dòng) — **chưa chạy** |
| FR-CUR-01 → 06 | `app/routers/curriculum_router.py`, `app/routers/admin_router.py`, `app/data/curriculum.json` | Chưa chạy |
| FR-WS-01 → 07 | `app/routers/drawing_router.py`, `frontend/src/components/Workspace.tsx`, `src/lib/canvas.ts` | Chưa chạy |
| FR-SUB / FR-ASM | `app/routers/submission_router.py`, `app/assessment/engine.py`, `app/assessment/geometry.py` | Chưa chạy |
| FR-TUT | `app/routers/learning_router.py`, `app/ai_providers.py` | Chưa chạy |
| FR-PRG / MAS / REC / PFL | `app/routers/learning_router.py` | Chưa chạy |
| FR-ADM / MON | `app/routers/admin_router.py`, `GET /health` trong `app/main.py` | Chưa chạy |

**Nguyên tắc:** một FR chỉ được đánh dấu "đạt" khi có test chạy qua (pytest hoặc kiểm thử tay có ghi lại bước + kết quả). Đọc code tồn tại **không** tính là đạt. File test hiện tại là `backend/tests/test_backend.py` — cần chạy `pytest -q` trong `backend/` và ghi kết quả vào báo cáo, không suy đoán.

---

## 6. Quyết định còn treo (cần chốt)

1. **Tài khoản seed:** `admin123`/`learner123` (code) vs `Admin123!`/`Demo123!` (brief) — chốt một bộ, cập nhật cả seed lẫn tài liệu.
2. **Tiền tố API:** giữ `/api/v1` (sửa backend mount thêm prefix) hay bỏ `/api/v1` (sửa frontend `lib/api.ts`)? Hiện hai bên lệch nhau.
3. **Assessment đồng bộ hay bất đồng bộ:** MVP chạy đồng bộ trong request hay đưa vào Celery ngay? Cần chốt trước khi viết NFR-PERF-02 thành SLA.
4. **Công thức mastery:** chưa có tài liệu công thức — cần backend agent ghi lại.
5. **Hành vi "hoàn thành lesson":** bấm nút hay hoàn thành exercise bắt buộc — chốt một hành vi (FR-LES-03).
6. **Migration:** bỏ `create_all()` chuyển sang Alembic thật trước khi có dữ liệu production (xem DATABASE.md §5).
