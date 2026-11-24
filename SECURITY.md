# SECURITY.md — DrawPath AI

> **Trạng thái triển khai: NOT_STARTED** (kiểm tra lần cuối 2026-11-24 ~22:56 +07, Asia/Saigon).
> Tài liệu này là **mô hình đe dọa + yêu cầu bảo mật**, chưa phải bằng chứng đã triển khai.
> Không có đoạn code nào trong tài liệu này được coi là đã kiểm chứng chạy được, vì
> tại thời điểm kiểm tra, thư mục repo được ghi nhận là trống (không có `backend/`,
> `frontend/`, không có code, test hay Dockerfile để kiểm tra).
>
> **Lưu ý cập nhật khi bàn giao:** vào khoảng 23:01 +07 cùng ngày, các agent song song
> đã tạo thêm file trong `backend/` và `frontend/`. Tác giả tài liệu này KHÔNG chạm vào,
> KHÔNG chạy và KHÔNG kiểm chứng các file đó. Mọi khẳng định NOT_STARTED trong bộ tài liệu
> này phản ánh đúng **cuộc kiểm tra lúc 22:56**, và phải được kiểm tra lại (re-audit)
> trước khi dùng làm căn cứ phát hành.
>
> Sản phẩm: **DrawPath AI** — Nền tảng học vẽ bằng AI, tiếng Việt là ngôn ngữ chính.
> Stack theo spec: Next.js / React / TypeScript / Tailwind (frontend),
> Python FastAPI / Pydantic / SQLAlchemy / Alembic (backend), PostgreSQL, Redis/Celery,
> S3/MinIO, OpenCV, Docker Compose.

---

## 1. Phạm vi và tài sản cần bảo vệ

| Tài sản | Mức nhạy cảm | Ghi chú |
|---|---|---|
| Tài khoản người học (email, mật khẩu băm, hồ sơ) | Cao | Rò rỉ = chiếm đoạt tài khoản |
| Bài vẽ / bản nháp canvas của người dùng | Cao | **Riêng tư theo mặc định** (xem §10). Không dùng để train khi chưa có đồng ý |
| Ảnh chụp bài vẽ trên giấy (upload) | Cao | Có thể chứa thông tin cá nhân trong ảnh nền |
| Tiến độ học, điểm rubric, lịch sử sửa bài | Trung bình | Dữ liệu học tập, không công khai mặc định |
| Nội dung giáo trình (lesson, rubric) | Trung bình | Do admin biên soạn; chỉ admin được sửa/xuất bản |
| API key / secret của nhà cung cấp AI | Cao | Chỉ nằm trong biến môi trường, không commit |
| Log kiểm tra (audit log) | Trung bình | Chứa dấu vết truy cập; tự nó cũng cần bảo vệ |
| Token phiên (JWT / refresh token) | Cao | Mất token = giả mạo phiên |

Người dùng mục tiêu bao gồm cả người học vị thành niên có thể dùng chung thiết bị
với gia đình — xem §11 về trẻ em / độ tuổi.

## 2. Mô hình đe dọa (Threat model)

### 2.1. Kẻ tấn công giả định

1. **Người dùng ẩn danh trên Internet** — quét endpoint, thử đăng nhập, dò ID.
2. **Người dùng đã đăng nhập nhưng tò mò / gian lận** — xem bài của người khác
   bằng cách đổi ID trên URL/API (IDOR), sửa điểm của mình, truy cập trang admin.
3. **Kẻ tấn công chèn nội dung** — XSS qua tên bài, bình luận, tên file; SQL injection
   qua tham số tìm kiếm; prompt injection qua nội dung bài vẽ / prompt gửi AI.
4. **Kẻ tấn công upload** — tải file độc hại, file quá lớn, ảnh chứa mã, path traversal.
5. **Kẻ tấn công lạm dụng AI** — spam yêu cầu chấm bài để đốt quota API miễn phí,
   hoặc trích xuất prompt hệ thống / rubric nội bộ qua phản hồi AI.
6. **Kẻ tấn công đánh cắp secret** — secret lọt vào Git, log, ảnh Docker, file `.env`.
7. **Người nội bộ / admin lạm quyền** — xem bài riêng tư của học viên khi không cần thiết.

### 2.2. Những gì KHÔNG nằm trong mô hình đe dọa (out of scope)

- Bảo mật vật lý của máy chủ thuê ngoài / nhà cung cấp cloud (phụ thuộc nhà cung cấp).
- Tấn công vào chính nhà cung cấp AI bên thứ ba (Pollinations, Openverse, …).
- Thiết bị đầu cuối của người dùng đã bị nhiễm mã độc.
- Tấn công DDoS quy mô lớn (chỉ yêu cầu rate limiting + giới hạn tài nguyên cơ bản).

### 2.3. Nguyên tắc thiết kế

- **Deny by default:** mọi tài nguyên thuộc về một user; không có quyền thì từ chối.
- **Kiểm tra quyền ở tầng server, không tin frontend.**
- **Least privilege:** admin, giáo viên (nếu có), học viên có vai trò tách biệt.
- **Không tin dữ liệu đầu vào:** mọi input từ client, file upload, phản hồi AI
  đều được coi là không đáng tin cho tới khi kiểm chứng.
- **Fail closed:** khi AI lỗi, khi kiểm tra quyền lỗi, khi upload không rõ ràng —
  từ chối an toàn thay vì cho qua.

## 3. Xác thực (Authentication)

**Trạng thái: NOT_STARTED — chưa có code để kiểm tra.**

- Đăng ký / đăng nhập bằng email + mật khẩu. Không tự chế cơ chế session riêng.
- **Băm mật khẩu:** dùng **argon2id** (ưu tiên, qua `passlib` / `argon2-cffi`)
  hoặc **bcrypt** (qua `passlib`) nếu argon2 không khả thi. Tuyệt đối không dùng
  MD5, SHA-1, SHA-256 trần, không lưu mật khẩu plaintext.
  - Tham số argon2id tối thiểu: memory ≥ 64 MB, iterations ≥ 3, parallelism ≥ 1
    (điều chỉnh theo benchmark máy chủ thực tế; ghi lại con số đã chọn).
  - Mỗi mật khẩu có salt riêng, do thư viện tự sinh — không tự sinh salt thủ công.
- **Chính sách mật khẩu:** tối thiểu 8 ký tự; khuyến nghị (không bắt buộc)
  passphrase dài. Không áp đặt quy tắc ký tự phức tạp gây khó nhớ.
  Không giới hạn độ dài tối đa một cách vô lý (tối thiểu cho phép 128 ký tự).
- **Chống brute-force:** giới hạn số lần đăng nhập sai (ví dụ 5 lần / 15 phút / IP+email),
  khóa tạm thời, log lại. Không tiết lộ "email không tồn tại" vs "sai mật khẩu"
  (trả cùng một thông báo chung).
- **Quên mật khẩu:** token reset dùng một lần, hết hạn ngắn (≤ 1 giờ), gửi qua email,
  không tiết lộ token trong URL log.
- **JWT sessions:**
  - Access token ngắn hạn (ví dụ 15 phút), refresh token dài hơn (ví dụ 7–30 ngày),
    refresh token có thể thu hồi (lưu hash trong DB/Redis, không lưu token trần).
  - Ký bằng thuật toán `HS256` với secret đủ dài (≥ 256 bit, sinh ngẫu nhiên)
    hoặc `RS256` với khóa riêng. Không dùng `alg: none`.
  - Validate `exp`, `iss`, `aud` (nếu dùng), từ chối token hết hạn / sai chữ ký.
  - Đăng xuất = thu hồi refresh token; access token còn lại hết hạn tự nhiên.
  - Không lưu JWT trong `localStorage` nếu có thể tránh — ưu tiên cookie
    `HttpOnly`, `Secure`, `SameSite=Lax` (hoặc `Strict` cho session cookie).
    Nếu dùng `Authorization: Bearer` thì phải chấp nhận rủi ro XSS cao hơn
    và bù bằng CSP nghiêm ngặt (xem §5).
- **Không lưu secret trong code, xem §8.**

## 4. Phân quyền (Authorization) — chống IDOR / Broken Access Control

**Trạng thái: NOT_STARTED.**

- Mọi endpoint đọc/ghi tài nguyên thuộc về user (`/submissions/{id}`,
  `/drawings/{id}`, `/feedback/{id}` …) **phải** kiểm tra:
  `resource.owner_id == current_user.id` HOẶC `current_user.role == admin`
  (và chỉ khi admin thực sự cần cho nhiệm vụ hỗ trợ).
- Không dùng ID đoán được một mình làm cơ chế bảo mật. Dùng UUID không đoán được
  **cộng với** kiểm tra quyền — UUID không thay thế kiểm tra quyền.
- Kiểm tra quyền ở **mỗi** endpoint, kể cả endpoint "chỉ đọc" và endpoint nội bộ.
- Vai trò tối thiểu: `learner`, `admin`. Nếu thêm `teacher/reviewer` thì tách quyền:
  reviewer chỉ xem bài được giao, không xem toàn bộ bài riêng tư.
- Admin không được âm thầm đổi điểm / sửa bài của học viên mà không để lại audit log.
- Test bắt buộc (xem `SECURITY_REVIEW.md` / `TEST_CASES.md` TC-SEC-*):
  user A gọi API của user B phải nhận `403` (không phải `404` giả vờ — chọn một
  chính sách nhất quán và ghi lại), user thường gọi endpoint admin phải nhận `403`.
- Không tin `role` hay `user_id` gửi từ client (body/header) — chỉ tin token đã xác thực.

## 5. CSRF / XSS / Injection

**Trạng thái: NOT_STARTED.**

### CSRF
- Nếu dùng cookie session: bật `SameSite=Lax` (tối thiểu) + token CSRF cho
  mọi mutation (POST/PUT/PATCH/DELETE), validate phía server.
- Nếu dùng Bearer token (không cookie): CSRF ít rủi ro hơn nhưng vẫn phải
  đảm bảo CORS chặt (xem §9) và không cho phép credential từ origin lạ.

### XSS
- Frontend React tự escape khi render — **không dùng `dangerouslySetInnerHTML`**
  với dữ liệu người dùng. Mọi chỗ bắt buộc chèn HTML phải qua sanitize
  (DOMPurify hoặc tương đương) và ghi rõ lý do.
- Nội dung phản hồi AI (feedback, gợi ý) là dữ liệu không đáng tin: render như text,
  không chèn HTML thô.
- Tên file, tên bài, tên người dùng hiển thị ở đâu cũng phải escape.
- **Content-Security-Policy (CSP)** nghiêm ngặt, xem §9.

### Injection
- SQL: chỉ dùng ORM (SQLAlchemy) + tham số hóa; cấm nối chuỗi SQL từ input.
- NoSQL / tìm kiếm: validate và escape toán tử truy vấn.
- Lệnh hệ thống / file: không gọi shell với input người dùng; không dùng tên file
  người dùng làm đường dẫn trực tiếp (xem §6).
- **Prompt injection:** prompt gửi nhà cung cấp AI phải tách rõ system prompt
  (nội bộ) và user content; không để nội dung bài vẽ / tên bài của user ghi đè
  system instruction. Phản hồi AI không được tự động thực thi hành động
  (đổi điểm, xóa bài) mà không qua kiểm tra của server.

## 6. Upload an toàn (ảnh bài vẽ trên giấy, ảnh tham chiếu)

**Trạng thái: NOT_STARTED.**

- Giới hạn kích thước: đề xuất tối đa **10 MB / file** (ghi lại con số cuối cùng),
  giới hạn tổng dung lượng / user / ngày.
- **MIME sniffing:** không tin `Content-Type` header hay phần mở rộng file.
  Đọc magic bytes phía server (ví dụ `python-magic` / Pillow `Image.open().verify()`),
  chỉ chấp nhận `image/jpeg`, `image/png`, `image/webp`.
  Từ chối SVG, HTML, file thực thi, file nén chứa script.
- Đổi tên file khi lưu: UUID + phần mở rộng đã kiểm chứng; không giữ tên gốc
  làm đường dẫn. Lưu ngoài thư mục web root hoặc qua S3/MinIO với URL có ký
  (presigned URL, hết hạn ngắn).
- **Chống path traversal:** không bao giờ nối tên file người dùng vào đường dẫn
  bằng nối chuỗi; dùng `pathlib` + kiểm tra đường dẫn cuối cùng nằm trong
  thư mục cho phép.
- **EXIF:** strip metadata EXIF (đặc biệt GPS, thông tin thiết bị) trước khi lưu
  / hiển thị. Không để lộ vị trí chụp của học viên.
- Xử lý ảnh bằng OpenCV/Pillow trong tiến trình tách biệt, giới hạn bộ nhớ/CPU,
  chống ảnh "bom nén" (decompression bomb) bằng giới hạn kích thước pixel
  (ví dụ tối đa 8000×8000) trước khi decode đầy đủ.
- Quét virus: nếu có hạ tầng, quét bằng ClamAV hoặc dịch vụ tương đương trước khi
  đưa vào xử lý AI. Ghi rõ nếu chưa triển khai (hiện tại: chưa có).
- Ảnh upload chỉ chủ sở hữu (và admin khi cần hỗ trợ) xem được; URL không đoán được
  và có kiểm tra quyền, không phải link công khai vĩnh viễn.

## 7. Rate limiting & chống lạm dụng

**Trạng thái: NOT_STARTED.**

- Rate limit theo IP + theo user cho: đăng nhập, đăng ký, quên mật khẩu,
  upload, gửi bài chấm AI, gọi API AI.
- Giới hạn số lần chấm AI / ngày / user (miễn phí), vì API miễn phí có quota
  và chi phí ẩn (xem `PERFORMANCE_REPORT.md` về độ trễ Pollinations).
- Hàng đợi chấm bài (Celery/Redis) có giới hạn độ dài, timeout cho mỗi job,
  retry có giới hạn + backoff; job trùng lặp phải idempotent (xem `TEST_CASES.md`).
- Giới hạn kích thước request body toàn cục ở reverse proxy + FastAPI.
- Log và cảnh báo khi vượt ngưỡng bất thường.

## 8. Secrets management

**Trạng thái: NOT_STARTED.**

- Secret chỉ nằm trong **biến môi trường** (`.env` local, secret manager ở production).
  Không bao giờ commit `.env`, API key, JWT secret, mật khẩu DB vào Git.
- Repo phải có `.gitignore` chặn `.env`, `*.pem`, `*.key`, thư mục chứa secret.
- `.env.example` chỉ chứa **tên biến + giá trị giả**, không chứa secret thật.
- API key của nhà cung cấp AI (nếu có, khi dùng key-gated provider như
  OpenRouter chat, HuggingFace Inference) phải có cơ chế xoay key và thu hồi.
- Không in secret ra log. Log lỗi AI phải redact key/token.
- CI không echo secret; secret CI chỉ qua GitHub Secrets (nếu dùng).
- Kiểm tra định kỳ bằng quét secret (ví dụ `gitleaks` / `trufflehog`) — chưa chạy,
  ghi vào `SECURITY_REVIEW.md` khi chạy.

## 9. Security headers & cấu hình mạng

**Trạng thái: NOT_STARTED.**

Áp dụng (ở reverse proxy / FastAPI middleware / Next.js config — chọn một nơi
duy nhất làm chủ, ghi lại):

| Header | Giá trị đề xuất |
|---|---|
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` (chỉ khi đã có HTTPS) |
| `Content-Security-Policy` | Hạn chế `script-src 'self'`, `img-src 'self' data: https:` (điều chỉnh theo nhu cầu ảnh tham chiếu), `object-src 'none'`, `frame-ancestors 'none'` |
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` (hoặc `frame-ancestors 'none'` trong CSP) |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | Tắt các API không dùng (camera/microphone/geolocation trừ khi tính năng cần) |
| CORS | Chỉ cho phép origin frontend đã biết; không dùng `*` khi có credential |

- HTTPS bắt buộc ở production; redirect HTTP → HTTPS.
- Cookie: `Secure`, `HttpOnly`, `SameSite=Lax` (xem §3).
- Tắt header tiết lộ version (`Server`, `X-Powered-By`).
- Database / Redis / MinIO không expose ra Internet; chỉ cho phép từ mạng nội bộ
  / Docker network.

## 10. Quyền riêng tư (Privacy)

**Trạng thái: NOT_STARTED (chính sách, chưa có code thực thi).**

- **Bài vẽ riêng tư theo mặc định.** Học viên phải chủ động chọn "công khai"
  (nếu tính năng portfolio công khai tồn tại) thì bài mới hiển thị cho người khác.
- Không dùng bài vẽ / ảnh upload của người dùng để **train mô hình** khi chưa có
  sự đồng ý rõ ràng, có thể thu hồi được. Đồng ý phải là opt-in, không phải
  điều khoản giấu trong ToS.
- Thu thập dữ liệu tối thiểu: chỉ thu những gì tính năng cần (email, tiến độ,
  bài nộp). Không thu vị trí, danh bạ, dữ liệu thiết bị không liên quan.
- Người dùng có quyền: xem, tải về, xóa bài vẽ và tài khoản của mình
  (xóa phải xóa cả file trong S3/MinIO và bản sao trong hàng đợi).
- Log không chứa nội dung bài vẽ, mật khẩu, token.
- Chính sách bảo mật + điều khoản sử dụng bằng tiếng Việt, dễ hiểu, phải có
  trước khi mở cho người dùng thật.

## 11. Trẻ em / độ tuổi

**Trạng thái: NOT_STARTED (ghi chú chính sách, chưa có tư vấn pháp lý).**

- Sản phẩm hướng tới người học vẽ, có thể bao gồm trẻ vị thành niên.
  Tài liệu này **không phải tư vấn pháp lý**.
- Yêu cầu tối thiểu trước khi mở cho người dưới 18 tuổi:
  1. Xác định độ tuổi tối thiểu và cơ chế đồng ý của phụ huynh (theo luật áp dụng).
  2. Không thu thập dữ liệu không cần thiết từ trẻ em; không quảng cáo nhắm
     mục tiêu vào trẻ em.
  3. Không cho phép nhắn tin / tương tác công khai không kiểm duyệt giữa người lạ.
  4. Có quy trình báo cáo / chặn nội dung không phù hợp.
- Cho tới khi các điểm trên được quyết định bằng văn bản, **không quảng bá
  sản phẩm cho trẻ em** và ghi rõ đối tượng trong tài liệu sản phẩm.

## 12. Xử lý dữ liệu AI (AI data handling)

**Trạng thái: NOT_STARTED — chưa có tích hợp AI nào chạy được trong repo
tại thời điểm kiểm tra.**

| Nhà cung cấp / đường đi | Dữ liệu gửi đi | Ghi chú |
|---|---|---|
| Pollinations (text / image, free, không key) | Prompt text, có thể kèm ảnh bài vẽ (khi gọi image) | Đã kiểm tra 2026-11-24: text HTTP 200; image flaky (503 rồi 200 khi retry). Xem `TEST_RESULTS.md`, `BUG_REPORT.md` BUG-001. Không gửi thông tin định danh (tên, email) trong prompt |
| Openverse (ảnh tham chiếu) | Từ khóa tìm kiếm | HTTP 200 nhưng chậm 16,6s (BUG-002). Chỉ lấy ảnh có licence phù hợp |
| Wikipedia REST | Từ khóa tra cứu | HTTP 200, 0,59s |
| HuggingFace Inference | (chưa xác minh — timeout 30s không key) | Key-gated; không dùng khi chưa có key + phê duyệt |
| OpenRouter | (chỉ list model không key; chat cần key) | Key-gated; không dùng khi chưa có key + phê duyệt |
| Local CV (OpenCV, fallback đảm bảo) | Ảnh bài vẽ, xử lý **tại chỗ** | Không gửi ra ngoài — đây là đường fallback khi provider ngoài lỗi |

Quy tắc:
- Không gửi email, tên thật, ID nội bộ, token vào prompt AI.
- Ảnh gửi provider ngoài phải là ảnh bài vẽ đã được strip EXIF.
- Phản hồi AI phải được validate theo schema (Pydantic) trước khi lưu điểm;
  điểm AI là **hỗ trợ, không phải kết luận chính thức** (xem `KNOWN_LIMITATIONS.md`).
- Ghi log: provider nào đã dùng, thời gian, thành công/thất bại — không log
  toàn bộ prompt chứa dữ liệu người dùng nhạy cảm.
- Khi provider ngoài lỗi: fallback sang local CV, báo rõ cho người dùng là
  "chấm bằng phương pháp nội bộ", không giả vờ là AI đa mô thức.

## 13. Audit logs (nhật ký kiểm tra)

**Trạng thái: NOT_STARTED.**

Ghi lại (không chứa secret / mật khẩu / nội dung bài vẽ):
- Đăng nhập thành công / thất bại, đổi mật khẩu, reset mật khẩu.
- Truy cập admin, xuất bản / thu hồi lesson, thay đổi rubric / điểm.
- Truy cập bị từ chối (403) lặp lại.
- Upload / xóa file, yêu cầu chấm AI, job thất bại.
- Thay đổi quyền / vai trò người dùng.

Log phải có timestamp (UTC), user ID, IP (đã cân nhắc privacy), hành động,
đối tượng, kết quả. Lưu tập trung, giữ tối thiểu 90 ngày (ghi lại con số cuối cùng),
chỉ admin xem được.

## 14. Ứng phó sự cố (Incident notes)

**Trạng thái: NOT_STARTED — chưa có quy trình vận hành.**

Khi nghi ngờ rò rỉ / xâm nhập:
1. Cô lập: thu hồi token/secret nghi bị lộ, khóa tài khoản liên quan.
2. Bảo toàn bằng chứng: giữ log, không xóa dữ liệu.
3. Đánh giá phạm vi: tài khoản nào, dữ liệu nào bị ảnh hưởng.
4. Khắc phục: vá lỗ hổng, xoay secret, buộc đổi mật khẩu nếu cần.
5. Thông báo: báo cho người dùng bị ảnh hưởng bằng tiếng Việt, rõ ràng,
   nêu dữ liệu nào bị ảnh hưởng và họ nên làm gì.
6. Hậu kiểm: ghi incident report, cập nhật tài liệu này + `BUG_REPORT.md`.

Chưa có sự cố nào được ghi nhận cho DrawPath AI (chưa có hệ thống chạy).

## 15. Checklist triển khai (để đối chiếu khi code xuất hiện)

- [ ] Argon2/bcrypt qua passlib, không lưu plaintext — **NOT_STARTED**
- [ ] JWT access ngắn + refresh thu hồi được — **NOT_STARTED**
- [ ] Kiểm tra quyền object-level ở mọi endpoint — **NOT_STARTED**
- [ ] CSRF token (nếu dùng cookie) — **NOT_STARTED**
- [ ] CSP + security headers — **NOT_STARTED**
- [ ] Upload: MIME sniffing, giới hạn size, strip EXIF, chống traversal — **NOT_STARTED**
- [ ] Rate limiting (auth, upload, AI) — **NOT_STARTED**
- [ ] Secrets chỉ qua env, `.gitignore`, quét secret — **NOT_STARTED**
- [ ] Audit log — **NOT_STARTED**
- [ ] Privacy: private-by-default, xóa tài khoản/dữ liệu — **NOT_STARTED**
- [ ] Quy trình incident + thông báo người dùng — **NOT_STARTED**

---

*File này là yêu cầu, không phải bằng chứng. Mọi mục NOT_STARTED chỉ được đổi
trạng thái khi có code + test tương ứng được chạy và ghi vào `TEST_RESULTS.md`.*

---

## Re-audit 2026-11-24 ~23:15 +07 — code đã tồn tại, trạng thái triển khai đổi

> Dòng "NOT_STARTED (kiểm tra 22:56)" ở đầu file nay đã lỗi thời: backend +
> frontend đã có code và chạy được (pytest 27 passed, build 14/14).
> Các biện pháp trong file này vẫn ở trạng thái **chưa được kiểm chứng đầy đủ** —
> chỉ có 2 phát hiện đã xác minh bằng đọc code + chạy thật, ghi vào `BLOCKERS.md`:
>
> - **BLK-009 (mới, đã xác minh):** CORS `allow_origins=["*"]` trong
>   `app/main.py`; `SECRET_KEY` fallback mặc định `"dev-secret-change-me-drawpath"`
>   trong `app/auth.py:12`. Phải sửa trước mọi deploy chia sẻ/công khai.
> - Auth cơ bản đã chạy thật: login JSON + JWT + `/auth/me` → 200.
>
> Toàn bộ checklist còn lại trong `SECURITY_REVIEW.md` vẫn **NOT TESTED**
> (IDOR, XSS, rate limit, upload an toàn…) — chưa chạy kiểm thử bảo mật nào.
