# ADMIN_GUIDE.md — Hướng dẫn quản trị DrawPath AI (dành cho quản trị viên)

> **Tên sản phẩm:** DrawPath AI (tên tạm thời)
> **Phiên bản tài liệu:** 0.1 — ngày 24/11/2026
> **Ngôn ngữ tài liệu:** Tiếng Việt (thuật ngữ chuyên môn giữ nguyên tiếng Anh khi cần).
>
> **Lưu ý quan trọng về trạng thái:** Admin UI (giao diện quản trị) **chưa tồn tại (planned — admin UI does not exist yet)**. Tài liệu này mô tả **quy trình và giao diện quản trị mục tiêu** — các màn hình, thao tác và quy trình dưới đây là đặc tả cần triển khai, không phải mô tả của hệ thống đã hoàn thành. Không có thao tác quản trị nào trong tài liệu này đã được kiểm chứng bằng giao diện thật.

---

## 1. Tổng quan quản trị

### 1.1. Admin làm gì?

Quản trị viên (admin) và biên tập viên (instructor-editor) chịu trách nhiệm:

1. Quản lý người dùng và phân quyền.
2. Soạn, thẩm định và xuất bản nội dung chương trình học (module, bài học, bài tập, rubric).
3. Giám sát hệ thống chấm bài AI (AI job) và chất lượng phản hồi.
4. Xem xét bài nộp bị gắn cờ (flagging) và xử lý vi phạm.
5. Theo dõi số liệu sử dụng (analytics) và nhật ký kiểm tra (audit logs).
6. Bảo đảm an toàn và quyền riêng tư của học viên.

### 1.2. Phân biệt Admin UI và trang quản trị tạm thời

Cho đến khi Admin UI hoàn thiện, một số thao tác quản trị có thể phải thực hiện trực tiếp trên cơ sở dữ liệu hoặc qua công cụ dòng lệnh — **chỉ người có chuyên môn kỹ thuật mới được làm**, và mọi thao tác phải được ghi lại (audit log — xem Mục 9). Không tự ý sửa dữ liệu trực tiếp khi chưa có quy trình ghi lại.

---

## 2. Vai trò (Roles)

| Vai trò | Mô tả | Quyền hạn |
|---|---|---|
| **Guest** (Khách) | Người chưa đăng ký / chưa đăng nhập | Xem trang marketing, xem giới thiệu khóa học; không xem được nội dung bài học, không nộp bài |
| **Learner** (Học viên) | Người đã đăng ký, đang học | Học bài, vẽ trên canvas, nộp bài, xem phản hồi AI, xem tiến độ của mình, quản lý portfolio của mình |
| **Instructor-Editor** (Giảng viên–Biên tập viên) | Người soạn và thẩm định nội dung | Mọi quyền của Learner, cộng: tạo/sửa bản nháp bài học, bài tập, rubric; gửi bài đi thẩm định; xem quality review; gắn cờ bài nộp có vấn đề |
| **Admin** (Quản trị viên) | Người quản lý toàn bộ hệ thống | Mọi quyền của Instructor-Editor, cộng: quản lý người dùng và vai trò, xuất bản/đưa bài học về kho lưu trữ (archive), quản lý media, giám sát AI job, xem audit logs và analytics, quản lý cài đặt hệ thống |

### 2.1. Quy tắc phân quyền

- **Nguyên tắc quyền tối thiểu (least privilege):** Mỗi tài khoản chỉ có đúng quyền cần thiết cho công việc của mình. Không cấp quyền Admin cho người chỉ cần soạn bài.
- **Không tự cấp quyền:** Không ai được tự nâng quyền của mình; việc cấp/thu hồi quyền Admin phải do 1 Admin khác thực hiện và được ghi lại trong audit log.
- **Tách bạch vai trò:** Người soạn bài học (Instructor-Editor) không tự duyệt và xuất bản bài của chính mình — bài phải qua thẩm định của người khác (xem Mục 5 — Publishing Workflow).
- **Tài khoản dùng chung bị cấm:** Mỗi quản trị viên dùng tài khoản riêng; không dùng chung tài khoản Admin.

---

## 3. Dashboard (Bảng điều khiển quản trị)

> **Trạng thái:** Dashboard **chưa khả dụng (planned)**.

Dashboard hiển thị tổng quan hệ thống trong 1 màn hình:

| Khu vực | Nội dung |
|---|---|
| **Tổng quan người dùng** | Tổng số học viên, số học viên mới (7 ngày / 30 ngày), số học viên đang hoạt động (active) |
| **Tổng quan nội dung** | Số bài học theo trạng thái (draft / in review / published / archived), số bài đang chờ thẩm định |
| **Tổng quan AI** | Số bài nộp chờ chấm, số AI job đang chạy / lỗi, thời gian chấm trung bình, tỷ lệ bài bị gắn cờ |
| **Cảnh báo** | AI job lỗi, bài nộp bị gắn cờ prompt injection, người dùng báo cáo sự cố, dung lượng lưu trữ gần đầy |
| **Hoạt động gần đây** | Nhật ký hoạt động mới nhất (ai làm gì, lúc nào) |

Dashboard chỉ hiển thị số liệu tổng hợp — không hiển thị nội dung bài vẽ riêng tư của học viên (trừ khi có lý do chính đáng và được ghi lại — xem Mục 10).

---

## 4. Quản lý người dùng và vai trò (User / Role Management)

> **Trạng thái:** Chưa khả dụng (planned).

### 4.1. Xem danh sách người dùng

- Tìm kiếm theo tên, email; lọc theo vai trò, trạng thái (đang hoạt động / bị khóa / chờ xác nhận), ngày đăng ký.
- Xem hồ sơ người dùng: thông tin cơ bản, lộ trình đang học, tiến độ, lịch sử nộp bài (chỉ khi cần xử lý sự cố hoặc khiếu nại — và phải ghi lại lý do xem).

### 4.2. Cấp / thu hồi vai trò

1. Mở hồ sơ người dùng, chọn **"Đổi vai trò"**.
2. Chọn vai trò mới (Learner / Instructor-Editor / Admin), ghi rõ lý do.
3. Xác nhận. Hệ thống ghi lại vào audit log (ai đổi, đổi cho ai, từ vai trò nào sang vai trò nào, lúc nào, lý do gì).

### 4.3. Khóa / mở khóa tài khoản

- **Khóa tạm thời:** Khi tài khoản có hành vi vi phạm (spam, nội dung không phù hợp, nghi ngờ bị hack). Học viên bị khóa không đăng nhập được; bài vẽ và tiến độ được giữ nguyên.
- **Mở khóa:** Sau khi xác minh xong, mở khóa và thông báo cho học viên.
- **Xóa tài khoản:** Chỉ xóa khi học viên yêu cầu (xem Mục 10 — Safety/Privacy) hoặc theo quy định pháp luật. Xóa tài khoản phải kèm xác nhận 2 lần và ghi lại audit log.

### 4.4. Xử lý khiếu nại

- Học viên có thể khiếu nại về: điểm AI chấm sai, bài nộp bị gắn cờ oan, tài khoản bị khóa oan.
- Quy trình: nhận khiếu nại → xem xét bài nộp/kết quả chấm → quyết định (giữ nguyên / sửa điểm / mở khóa) → trả lời học viên bằng văn bản → ghi lại toàn bộ vào audit log.

---

## 5. Quản lý chương trình học — Curriculum / Lesson / Exercise / Rubric Editors

> **Trạng thái:** Các editor **chưa khả dụng (planned)**. Nội dung bài học hiện chỉ tồn tại dưới dạng cấu trúc trong `CURRICULUM.md`; chưa có editor để soạn nội dung đầy đủ.

### 5.1. Curriculum Editor (Soạn chương trình)

- Tạo/sửa/xóa module và track (tên, mô tả, thứ tự, điều kiện vào track).
- Sắp xếp lại thứ tự module/bài học (kéo-thả).
- Xem đồ thị phụ thuộc kỹ năng (skill dependency graph) để kiểm tra tiên quyết.

### 5.2. Lesson Editor (Soạn bài học)

- Soạn đủ **18 mục của Lesson Contract** (xem `CURRICULUM.md` Mục 8): id, tiêu đề (VI/EN), module, mục tiêu, kỹ năng, tiên quyết, độ khó, thời lượng, lý thuyết, demo, bước hướng dẫn, bài tập, exercise_type, rubric, lỗi thường gặp, bước tiếp theo, nguồn tham khảo.
- **Kiểm tra bắt buộc trước khi gửi thẩm định:** Editor không cho gửi đi nếu thiếu bất kỳ mục nào trong 18 mục; kiểm tra trùng lặp id; kiểm tra tiên quyết có tồn tại không.
- **Quy tắc bản quyền (bắt buộc):** Mọi hình minh họa phải là hình gốc do team tự vẽ hoặc hình CC0/CC-BY (ghi rõ nguồn + giấy phép). Editor có trường bắt buộc "nguồn hình" cho mỗi hình; không điền nguồn thì không gửi thẩm định được. Không sao chép nội dung từ Drawabox/Proko/NMA/Ctrl+Paint/Line of Action (xem `CURRICULUM.md` Mục 9).

### 5.3. Exercise Editor (Soạn bài tập)

- Tạo/sửa bài tập cho từng bài học: yêu cầu, tiêu chí hoàn thành, exercise_type (để AI chọn chiến lược chấm), hình mẫu (nếu có).
- Mỗi bài tập phải gắn với đúng 1 bài học và 1 exercise_type.

### 5.4. Rubric Editor (Soạn rubric)

- Tạo/sửa rubric: tiêu chí, trọng số (tổng = 100%), mô tả 4 mức (Chưa đạt / Đang hình thành / Đạt / Tốt), phương pháp đo (`cv` / `ai` / `human`), ngưỡng cho từng mức (đối với tiêu chí đo bằng CV).
- **Versioning:** Mỗi lần sửa rubric tạo version mới (semantic versioning — xem `AI_EVALUATION_PLAN.md` Mục 5). Kết quả chấm cũ giữ nguyên rubric version cũ; không tự động đổi theo rubric mới.
- Rubric mới/chỉnh sửa phải qua thẩm định (in review) trước khi áp dụng cho bài nộp mới.

---

## 6. Publishing Workflow — Quy trình xuất bản

> **Trạng thái:** Quy trình **chưa khả dụng (planned)** — chưa có hệ thống quản lý trạng thái bài học.

### 6.1. Các trạng thái

```
Draft (Bản nháp)
  │  Instructor-Editor soạn bài
  ▼
In Review (Đang thẩm định)
  │  Người thẩm định (không phải người soạn) kiểm tra: đủ 18 mục, đúng chính tả,
  │  hình đúng bản quyền, rubric đúng, tiên quyết đúng
  ▼
Published (Đã xuất bản) ──→ Archived (Đã lưu trữ)
  │  Học viên thấy và học được    Bài cũ, không còn hiển thị cho học viên mới
  │  (nhưng học viên đang học dở vẫn học tiếp được)
  ▼
(có thể quay lại Draft để sửa — tạo version mới)
```

| Trạng thái | Ai thấy được | Được sửa không |
|---|---|---|
| **Draft** | Chỉ tác giả + admin | Được (tự do) |
| **In Review** | Tác giả + người thẩm định + admin | Không sửa trực tiếp — người thẩm định trả về Draft kèm nhận xét, hoặc duyệt lên Published |
| **Published** | Mọi học viên | Không sửa trực tiếp — muốn sửa phải tạo bản sửa (tạo version mới ở Draft, đi lại quy trình thẩm định) |
| **Archived** | Chỉ admin (học viên đang học dở vẫn thấy bài mình đang học) | Không |

### 6.2. Quy tắc

1. **Người soạn không tự duyệt bài của mình.** Bài Draft phải do 1 Instructor-Editor/Admin khác thẩm định.
2. **Thẩm định kiểm tra:** đủ 18 mục Lesson Contract; lý thuyết đúng và dễ hiểu; hình minh họa đúng bản quyền và đúng phong cách (`ART_DIRECTION.md`); rubric có trọng số tổng 100% và ngưỡng rõ ràng; tiên quyết đúng theo dependency graph.
3. **Xuất bản là hành động có ghi lại:** Ai xuất bản, lúc nào, version nào — ghi vào audit log.
4. **Rollback:** Nếu bài Published phát hiện lỗi nghiêm trọng, Admin có thể đưa về Draft (kèm thông báo cho học viên đang học bài đó) hoặc Archived, và ghi lại lý do.

---

## 7. Quản lý Media (Media Management)

> **Trạng thái:** Chưa khả dụng (planned).

- **Kho media:** Tất cả hình minh họa, hình demo, ảnh tham chiếu, video demo được lưu tập trung, có metadata: tên, loại, bài học sử dụng, nguồn (tự vẽ / CC0 / CC-BY + link nguồn), giấy phép, người tải lên, ngày tải lên.
- **Quy tắc đặt tên:** `bai-{lesson_id}-{mo-ta}-{so-thu-tu}.webp` (ví dụ: `bai-02-2-ellipse-truc-01.webp`).
- **Định dạng:** Ảnh — WebP (ưu tiên), JPG/PNG (khi cần); Video — MP4/WebM.
- **Kiểm tra bản quyền:** Trước khi đưa media vào bài học, kiểm tra nguồn và giấy phép; media không rõ nguồn không được dùng.
- **Xóa media:** Chỉ xóa khi không còn bài học nào dùng đến; xóa media phải kèm xác nhận và ghi lại audit log.

---

## 8. Giám sát AI Job (AI Job Monitoring)

> **Trạng thái:** Chưa khả dụng (planned) — pipeline chấm bài chưa được triển khai; tích hợp AI trực tuyến đang BLOCKED/INCOMPLETE (xem `AI_ASSESSMENT.md` Mục 9.5).

### 8.1. AI Job là gì?

Mỗi lần học viên nộp bài, hệ thống tạo 1 AI Job (chấm bài) đi qua pipeline 10 bước (xem `AI_ASSESSMENT.md` Mục 2). Admin giám sát các job này để phát hiện lỗi và đảm bảo học viên nhận được kết quả đúng hạn.

### 8.2. Màn hình giám sát

| Cột | Nội dung |
|---|---|
| Job ID | Mã job |
| Bài nộp | Mã bài nộp, bài học, học viên (ẩn danh hóa khi hiển thị danh sách — chỉ hiện khi mở chi tiết) |
| Trạng thái | Đang chờ / Đang chạy / Hoàn thành / Lỗi / Timeout |
| Provider | Provider đã dùng (Pollinations Text / Local CV / …) + `source` (live / local_cv_only / mock) |
| Thời gian | Thời gian bắt đầu, thời gian xử lý, thời gian hoàn thành |
| Confidence | confident / uncertain / insufficient / cannot_assess |
| Lỗi (nếu có) | Mã lỗi, thông báo lỗi, số lần retry |

### 8.3. Xử lý job lỗi

1. **Job lỗi/timeout:** Hệ thống tự động retry theo chính sách (tối đa 2 retry — xem `AI_ASSESSMENT.md` Mục 9.4), rồi chuyển sang Local CV only. Admin không cần can thiệp thủ công trừ khi job lỗi lặp lại nhiều lần.
2. **Job lỗi lặp lại:** Nếu cùng 1 loại lỗi xảy ra ≥ 5 lần trong 1 giờ, hệ thống gửi cảnh báo cho Admin; Admin kiểm tra provider (Pollinations có đang down không? Backend có lỗi không?) và ghi lại sự cố.
3. **Job bị kẹt (stuck):** Job ở trạng thái "Đang chạy" quá 5 phút → đánh dấu timeout, trả về kết quả Local CV + template cho học viên, ghi log.
4. **Không sửa kết quả chấm thủ công:** Admin không tự sửa điểm AI chấm. Nếu kết quả chấm sai, ghi nhận vào quality review (Mục 9) và sửa hệ thống/rubric — không sửa từng kết quả lẻ.

---

## 9. Quality Review / Flagging — Thẩm định chất lượng và gắn cờ

> **Trạng thái:** Chưa khả dụng (planned).

### 9.1. Flagging — Gắn cờ bài nộp

Hệ thống tự động gắn cờ (flag) các bài nộp sau:

| Flag | Ý nghĩa | Hành động |
|---|---|---|
| `prompt_injection_suspected` | Nghi ngờ có lệnh chèn trong bài nộp (xem `AI_ASSESSMENT.md` Mục 6.3) | Admin xem xét; nếu đúng là injection, ghi nhận và theo dõi tài khoản; nếu là hiểu lầm (học viên viết chữ trong bài vẽ vô tình giống lệnh), gỡ flag |
| `invalid_input` | Bài nộp không hợp lệ (trắng, mờ, không liên quan) | Không cần hành động — hệ thống đã trả `insufficient`/`cannot_assess`; chỉ xem khi học viên khiếu nại |
| `off_template` | Bài đúng nhưng khác mẫu | Không phải lỗi — chỉ để theo dõi (AI có trừ điểm oan bài khác mẫu không?) |
| `low_confidence` | Kết quả chấm có confidence `uncertain` | Chuyên gia xem xét mẫu để cải thiện rubric/model |
| `reported_by_user` | Học viên khác báo cáo nội dung không phù hợp | Admin xem xét trong 48 giờ (xem 9.2) |

### 9.2. Quy trình xem xét nội dung bị báo cáo

1. Nhận báo cáo → ghi lại (ai báo cáo, báo cáo cái gì, lúc nào).
2. Admin xem xét nội dung trong **48 giờ**.
3. Quyết định: giữ nguyên / ẩn tạm thời / xóa + cảnh báo tài khoản / khóa tài khoản (tùy mức độ).
4. Thông báo kết quả cho người báo cáo (không tiết lộ thông tin cá nhân của người bị báo cáo).
5. Ghi toàn bộ vào audit log.

### 9.3. Quality Review — Thẩm định chất lượng AI (định kỳ)

- **Hàng tuần:** Admin/Instructor-Editor đọc mẫu ngẫu nhiên 10–20 feedback AI, kiểm tra: nhận xét có đúng không, có suy luận không có cơ sở không, annotation có đúng vị trí không, next steps có hành động được không.
- **Hàng tháng:** Chạy lại đánh giá theo `AI_EVALUATION_PLAN.md` (hoặc khi đổi model/rubric/pipeline).
- Kết quả quality review được ghi lại và dùng để cải thiện rubric, template giải thích, và pipeline.

---

## 10. Audit Logs — Nhật ký kiểm tra

> **Trạng thái:** Chưa khả dụng (planned).

### 10.1. Ghi lại cái gì?

Mọi hành động quản trị quan trọng đều được ghi lại:

| Hành động | Ghi lại |
|---|---|
| Đổi vai trò người dùng | Ai đổi, đổi cho ai, từ vai trò nào sang vai trò nào, lúc nào, lý do |
| Khóa/mở khóa/xóa tài khoản | Ai làm, tài khoản nào, lúc nào, lý do |
| Xuất bản / lưu trữ / đưa về Draft bài học | Ai làm, bài nào, version nào, lúc nào |
| Sửa rubric | Ai sửa, rubric nào, version cũ/mới, thay đổi gì |
| Xem bài vẽ riêng tư của học viên | Ai xem, bài của ai, lúc nào, lý do (xem 10.2) |
| Xử lý flag / báo cáo | Ai xử lý, flag nào, quyết định gì, lúc nào |
| Thay đổi cài đặt hệ thống / API key | Ai thay đổi, thay đổi gì, lúc nào (không ghi giá trị key) |
| Đăng nhập Admin | Ai đăng nhập, lúc nào, từ đâu (IP/thiết bị — nếu có) |

### 10.2. Quy tắc xem bài vẽ riêng tư của học viên

- Mặc định, Admin **không xem** bài vẽ riêng tư của học viên.
- Chỉ xem khi có lý do chính đáng: xử lý khiếu nại, xem xét báo cáo vi phạm, kiểm tra lỗi hệ thống (AI chấm sai).
- Mỗi lần xem đều được ghi lại (ai xem, bài của ai, lúc nào, lý do). Học viên có quyền yêu cầu xem nhật ký ai đã xem bài của mình (khi tính năng này ra mắt).
- **Không bao giờ** dùng bài vẽ của học viên cho mục đích quảng cáo khi chưa có sự đồng ý rõ ràng bằng văn bản.

### 10.3. Lưu trữ và bảo mật log

- Audit log được lưu ít nhất **12 tháng** (mục tiêu, chưa chốt chính sách cuối cùng).
- Audit log chỉ Admin xem được; không cho phép sửa/xóa log (chỉ đọc).
- Log không chứa: mật khẩu, API key, nội dung bài vẽ (chỉ chứa mã tham chiếu).

---

## 11. Analytics — Số liệu sử dụng

> **Trạng thái:** Chưa khả dụng (planned).

### 11.1. Số liệu theo dõi

| Nhóm | Chỉ số |
|---|---|
| Người dùng | Số học viên mới, số học viên active (7/30 ngày), tỷ lệ giữ chân (retention), thời gian học trung bình/ngày |
| Nội dung | Bài học được học nhiều nhất, bài học có tỷ lệ hoàn thành thấp nhất, bài học bị bỏ dở nhiều nhất (drop-off) |
| AI | Số bài nộp/ngày, thời gian chấm trung bình, tỷ lệ confidence (confident/uncertain/insufficient/cannot_assess), tỷ lệ bài bị gắn cờ |
| Học tập | Tỷ lệ đạt/mastery theo kỹ năng, kỹ năng nào học viên yếu nhất, thời gian trung bình để đạt mastery 1 kỹ năng |

### 11.2. Quy tắc

- Số liệu luôn ở dạng **tổng hợp, ẩn danh** — không theo dõi hành vi cá nhân của từng học viên để "chấm điểm" họ.
- Không bán, không chia sẻ dữ liệu analytics cho bên thứ ba.
- Analytics dùng để cải thiện sản phẩm (bài nào khó quá, bài nào dễ quá, AI chấm có vấn đề ở đâu) — không dùng để xếp hạng hay so sánh học viên với nhau.

---

## 12. Safety / Privacy Rules — Quy tắc an toàn và quyền riêng tư

### 12.1. Bảo vệ học viên (đặc biệt là học viên vị thành niên)

- **Không thu thập thông tin nhạy cảm không cần thiết:** Không hỏi tuổi chính xác, địa chỉ, số điện thoại, trường học — trừ khi có lý do chính đáng và được sự đồng ý.
- **Học viên vị thành niên:** Nếu sản phẩm hướng đến học viên dưới 18 tuổi, cần có quy trình đồng ý của phụ huynh và chính sách bảo vệ trẻ em riêng — **chính sách này chưa được soạn** (cần làm trước khi ra mắt cho đối tượng vị thành niên).
- **Không cho phép liên lạc trực tiếp giữa người dùng:** Không có tính năng nhắn tin trực tiếp giữa học viên với nhau trong v0.1 (tránh rủi ro quấy rối). Nếu thêm tính năng cộng đồng sau này, cần có kiểm duyệt và báo cáo.

### 12.2. Nội dung không phù hợp

- Cấm nội dung: khiêu dâm, bạo lực cực đoan, kích động thù hận, vi phạm pháp luật.
- Học viên đăng nội dung không phù hợp → ẩn nội dung, cảnh báo tài khoản, khóa tài khoản nếu tái phạm (xem Mục 9.2).
- **Không tải, lưu hay phát tán nội dung tình dục hóa người được trình bày như trẻ vị thành niên** — quy tắc tuyệt đối, không có ngoại lệ.

### 12.3. API key và bí mật (secrets)

- **Không hardcode key** trong code; không commit key lên Git.
- Key (nếu có) do người có thẩm quyền cung cấp qua cấu hình an toàn (secure vault / biến môi trường), chỉ Admin kỹ thuật được truy cập.
- **Không dùng key trả phí** khi chưa có sự đồng ý rõ ràng và ngân sách được duyệt.
- Audit log ghi lại việc thay đổi key, nhưng **không ghi giá trị key**.
- Xem thêm `AI_ASSESSMENT.md` Mục 9 (fallback chain) và Mục 6.3 (prompt-injection guard).

### 12.4. Dữ liệu cá nhân

- Chỉ thu thập dữ liệu cần thiết cho việc học (tên hiển thị, email, tiến độ, bài nộp).
- Học viên có quyền: xem dữ liệu của mình, tải dữ liệu của mình xuống, yêu cầu xóa tài khoản và toàn bộ dữ liệu.
- Yêu cầu xóa dữ liệu phải được xử lý trong **30 ngày** (mục tiêu, chưa chốt chính sách cuối cùng).
- Dữ liệu sao lưu (backup) cũng phải xóa theo yêu cầu (trong chu kỳ backup tiếp theo).

### 12.5. Sự cố bảo mật

- Khi phát hiện sự cố (rò rỉ dữ liệu, truy cập trái phép): (1) ngăn chặn ngay, (2) đánh giá phạm vi ảnh hưởng, (3) thông báo cho người dùng bị ảnh hưởng, (4) ghi lại toàn bộ sự cố và biện pháp khắc phục.
- Quy trình chi tiết ứng phó sự cố **chưa được soạn** — cần làm trước khi ra mắt.

---

## 13. Tài liệu liên quan

| Tài liệu | Nội dung |
|---|---|
| `CURRICULUM.md` | Chương trình học, lesson contract, publishing workflow (nội dung) |
| `AI_ASSESSMENT.md` | Pipeline chấm bài, fallback chain, prompt-injection guard |
| `AI_EVALUATION_PLAN.md` | Kế hoạch đánh giá, quality review |
| `USER_GUIDE.md` | Hướng dẫn sử dụng (dành cho học viên) |
| `DESIGN_SYSTEM.md` | Hệ thống thiết kế (Admin UI tuân theo cùng design system) |

---

*Hết ADMIN_GUIDE.md — v0.1, 24/11/2026. Admin UI chưa tồn tại; tài liệu này là đặc tả quy trình và giao diện mục tiêu.*
