# USER_GUIDE.md — Hướng dẫn sử dụng DrawPath AI (dành cho học viên)

> **Tên sản phẩm:** DrawPath AI (tên tạm thời)
> **Phiên bản tài liệu:** 0.1 — ngày 24/11/2026
> **Ngôn ngữ tài liệu:** Tiếng Việt.
>
> **Lưu ý quan trọng về trạng thái tính năng:** Sản phẩm đang trong giai đoạn xây dựng. Nhiều tính năng mô tả trong tài liệu này là **tính năng đã lên kế hoạch (planned), chưa có code hoàn thiện**. Trong từng mục, tài liệu ghi rõ tính năng nào **đã có**, tính năng nào **chưa có (planned — chưa khả dụng)**. Nếu bạn đọc tài liệu này mà không tìm thấy tính năng trong sản phẩm, đó là vì tính năng đó chưa được triển khai — không phải do bạn thao tác sai. Tài liệu sẽ được cập nhật khi tính năng ra mắt.

---

## 1. DrawPath AI là gì?

DrawPath AI là nền tảng học vẽ trực tuyến bằng tiếng Việt, có AI hỗ trợ chấm bài và hướng dẫn sửa lỗi.

**Triết lý học:** Learn → Observe → Practice → Analyze → Correct → Improve → Master
(Học → Quan sát → Luyện tập → Phân tích → Sửa lỗi → Cải thiện → Thành thạo)

**Bạn sẽ học gì?**

- 11 module nền tảng (55 bài): từ cầm bút, đường nét, hình khối, phối cảnh, ánh sáng, màu sắc, giải phẫu, bố cục đến dự án cuối khóa.
- 4 track chuyên sâu (20 bài): Portrait (Chân dung), Anime & Manga, Landscape & Environment (Phong cảnh), Digital Painting (Vẽ số).
- Tổng cộng 75 bài học (xem `CURRICULUM.md` để biết chi tiết từng bài).

**Bạn cần gì để bắt đầu?**

- Trình duyệt web hiện đại (Chrome, Firefox, Safari, Edge).
- Chuột hoặc màn hình cảm ứng để vẽ. Nếu có bút stylus (Wacom, Apple Pencil…), trải nghiệm vẽ sẽ tốt hơn — nhưng **hỗ trợ stylus chưa được kiểm tra trên thiết bị thật** (xem `DRAWING_ENGINE.md` Mục 8), nên nếu bút của bạn chưa hoạt động như ý, hãy báo lại cho chúng tôi.
- Không cần kinh nghiệm vẽ trước — Module 00 dành cho người mới hoàn toàn.

---

## 2. Đăng ký và đăng nhập

> **Trạng thái:** Tính năng đăng ký/đăng nhập **chưa khả dụng (planned)** — hệ thống tài khoản chưa được triển khai xong. Các bước dưới đây là hướng dẫn mục tiêu, sẽ áp dụng khi tính năng ra mắt.

1. Mở trang chủ DrawPath AI, bấm **"Đăng ký"**.
2. Nhập email, mật khẩu, tên hiển thị. Bấm **"Tạo tài khoản"**.
3. Kiểm tra email để xác nhận tài khoản (nếu có yêu cầu xác nhận).
4. Đăng nhập bằng email và mật khẩu đã đăng ký.
5. Nếu quên mật khẩu, bấm **"Quên mật khẩu"** trên trang đăng nhập và làm theo hướng dẫn gửi về email.

**Lưu ý:**

- Mật khẩu nên dài ít nhất 8 ký tự, gồm chữ và số.
- Không chia sẻ mật khẩu với người khác.
- Nếu bạn dùng chung máy tính, hãy đăng xuất sau khi học xong.

---

## 3. Onboarding — Thiết lập ban đầu

> **Trạng thái:** Onboarding **chưa khả dụng (planned)**.

Khi đăng nhập lần đầu, hệ thống sẽ hỏi bạn 3–4 câu ngắn để gợi ý lộ trình phù hợp:

1. **Bạn đã từng vẽ chưa?** (Chưa bao giờ / Vẽ chơi chơi / Đã học cơ bản / Đã vẽ lâu năm)
2. **Bạn muốn học vẽ gì?** (Vẽ người / Vẽ phong cảnh / Anime-Manga / Vẽ số / Chưa biết — học nền tảng trước)
3. **Mỗi ngày bạn dành được bao nhiêu thời gian?** (15 phút / 30 phút / 1 giờ / Hơn 1 giờ)
4. **Bạn vẽ bằng gì?** (Chuột / Ngón tay trên màn hình cảm ứng / Bút stylus)

Dựa trên câu trả lời, hệ thống gợi ý 1 trong 5 lộ trình (xem `CURRICULUM.md` Mục 4). Bạn có thể đổi lộ trình bất cứ lúc nào — gợi ý chỉ là gợi ý, không bắt buộc.

**Bài kiểm tra đầu vào (Diagnostic test) — planned:** Nếu bạn đã biết vẽ, bạn có thể làm bài kiểm tra đầu vào ngắn (vẽ đường thẳng, ellipse, hộp) để hệ thống xác định bạn còn yếu kỹ năng nào và gợi ý học đúng chỗ còn thiếu, thay vì học lại từ đầu.

---

## 4. Lộ trình học (Roadmap)

> **Trạng thái:** Trang lộ trình **chưa khả dụng (planned)**.

Trang lộ trình hiển thị toàn bộ chương trình học dưới dạng "bản đồ":

- 11 module nền tảng xếp theo thứ tự khuyến nghị (00 → 10).
- 4 track chuyên sâu (mở sau khi bạn hoàn thành Module 00–06, hoặc sau khi pass bài kiểm tra đầu vào).
- Mỗi bài học hiển thị: tiêu đề, thời lượng ước tính, độ khó (★☆☆ / ★★☆ / ★★★), trạng thái của bạn (Chưa bắt đầu / Đang luyện / Đạt / Thành thạo).

**Bạn được học tự do:** Bạn có thể mở bất kỳ bài học nào, kể cả khi chưa hoàn thành bài trước đó. Nếu bài học cần kỹ năng tiên quyết mà bạn chưa học, hệ thống sẽ hiển thị cảnh báo và gợi ý xem lại bài tiên quyết — nhưng không khóa bài học. Bạn tự quyết định.

---

## 5. Học một bài học (Lesson)

> **Trạng thái:** Trang bài học **chưa khả dụng (planned)** — nội dung chi tiết từng bài học chưa được viết xong (xem `CURRICULUM.md` Mục 0).

Một bài học gồm các phần sau:

### 5.1. Lý thuyết (ngắn gọn)

- Lý thuyết ngắn (≤ 500 từ), viết bằng tiếng Việt, kèm hình minh họa gốc có đường dựng hình (construction lines).
- Đọc lý thuyết trước khi vẽ — thường chỉ mất 2–3 phút.

### 5.2. Hình demo

- Hình demo từng bước (Step 1 → Step 2 → Step 3) cho thấy quá trình vẽ đúng, không chỉ kết quả cuối cùng.
- Một số bài có video demo phát lại nét vẽ (stroke replay) — bạn có thể phát/tạm dừng/tua (xem Mục 6.5).

### 5.3. Luyện tập có hướng dẫn (Guided)

- Làm theo từng bước hướng dẫn trên canvas.
- Chế độ Guided có gợi ý theo thời gian thực (có thể bật/tắt).

### 5.4. Bài tập (Practice)

- Mỗi bài học có 2–4 bài tập. Bạn vẽ trên canvas (xem Mục 6) rồi nộp bài (xem Mục 7).
- Bạn có thể làm lại bài tập nhiều lần — làm lại không bị trừ điểm, mà còn giúp đạt mastery (thành thạo cần nhiều bằng chứng — xem Mục 9).

### 5.5. Lỗi thường gặp

- Mỗi bài học liệt kê 3–5 lỗi thường gặp + cách sửa, kèm hình minh họa lỗi và hình sửa đúng.
- Đọc phần này trước khi nộp bài để tự kiểm tra.

---

## 6. Canvas — Công cụ vẽ

> **Trạng thái:** Canvas **chưa khả dụng (planned)** — canvas engine chưa được triển khai xong (xem `DRAWING_ENGINE.md` — trạng thái NOT_STARTED).

### 6.1. Tổng quan

Canvas là nơi bạn vẽ bài tập. Canvas chiếm phần lớn màn hình; thanh công cụ (toolbar) gọn ở bên cạnh (desktop) hoặc phía dưới (điện thoại).

### 6.2. Công cụ vẽ

| Công cụ | Dùng để làm gì | Cách dùng |
|---|---|---|
| **Bút chì (Pencil)** | Phác thảo, dựng hình | Chọn bút chì, chọn màu và cỡ nét, vẽ lên canvas |
| **Cọ (Brush)** | Tô màu, shading | Chọn cọ, chỉnh opacity và flow, vẽ lên canvas |
| **Tẩy (Eraser)** | Xóa nét | Chọn tẩy, chỉnh cỡ, quét qua nét cần xóa |
| **Màu (Colour)** | Chọn màu vẽ | Bấm vào ô màu để mở bảng màu; có bảng màu preset + color picker đầy đủ |
| **Cỡ nét (Size)** | Chỉnh độ dày nét vẽ | Kéo thanh trượt hoặc nhập số (1–100px) |
| **Độ mờ (Opacity)** | Chỉnh độ mờ của nét vẽ | Kéo thanh trượt 1–100% |
| **Undo / Redo** | Hoàn tác / làm lại | Bấm nút hoặc phím Ctrl+Z (hoàn tác) / Ctrl+Shift+Z (làm lại) |
| **Xóa hết (Clear)** | Xóa toàn bộ nét trên layer hiện tại | Bấm nút, xác nhận trong hộp thoại |
| **Zoom / Pan / Fit** | Phóng to, di chuyển, vừa khung hình | Zoom: Ctrl + +/- hoặc nút +/-; Pan: giữ Space + kéo chuột; Fit: Ctrl+0 |
| **Layer (Lớp)** | Tổ chức bài vẽ thành nhiều lớp | Thêm/xóa/đổi tên/ẩn/hiện/khóa layer trong panel Layer |
| **Ảnh tham chiếu (Reference)** | Xem ảnh mẫu trong lúc vẽ | Ảnh tham chiếu hiển thị trong panel riêng, có thể di chuyển và thu nhỏ |
| **Đường hướng dẫn (Guidelines)** | Lưới, đường 1/3, điểm tụ | Bật/tắt trong menu Guidelines |
| **Lưu (Save)** | Lưu bài vẽ | Tự động lưu (autosave) sau mỗi 1 giây không có thay đổi; hoặc bấm Ctrl+S để lưu ngay |
| **Xuất PNG (Export)** | Tải bài vẽ về máy dưới dạng ảnh PNG | Bấm nút Export, chọn nền (trắng/kem/trong suốt), tải file về |

### 6.3. Layer (Lớp) — gợi ý cho người mới

Nếu bạn chưa quen dùng layer, hãy bắt đầu đơn giản:

- **Layer "Sketch":** Phác thảo nhẹ, dựng hình.
- **Layer "Line":** Vẽ nét chính đè lên phác thảo.
- **Layer "Shadow":** Tô bóng (khi học đến Module 06).

Bạn có thể ẩn layer "Sketch" sau khi đã vẽ xong nét chính, để bài vẽ sạch hơn.

### 6.4. Lưu tự động (Autosave)

- Bài vẽ của bạn được **tự động lưu** sau mỗi 1 giây không có thay đổi (không cần bấm Lưu).
- Trạng thái lưu hiển thị nhẹ ở góc màn hình: "Đang lưu…" → "Đã lưu • 23:01".
- Nếu mất mạng, bài vẽ được lưu tạm trên trình duyệt của bạn và sẽ đồng bộ lên máy chủ khi có mạng trở lại — bài của bạn không bị mất.
- **Lưu ý:** Đừng đóng tab trình duyệt ngay khi vừa vẽ xong nét cuối cùng — hãy đợi 1–2 giây để hệ thống kịp lưu (hoặc bấm Ctrl+S).

### 6.5. Phát lại nét vẽ (Stroke Replay)

- Sau khi vẽ xong, bạn có thể xem lại **quá trình** vẽ của mình: bấm nút Replay để phát lại từ đầu.
- Điều khiển: Phát/Tạm dừng, thanh tua (seek), tốc độ (0.5x / 1x / 2x / 4x), nút "Nét trước / Nét sau" để xem từng nét một.
- Xem replay giúp bạn tự nhận ra lỗi: ví dụ, bạn vẽ ellipse bằng 5 nét chắp vá thay vì 1 nét — replay sẽ cho thấy điều đó rõ ràng.

### 6.6. Phím tắt

| Phím | Hành động |
|---|---|
| `B` | Chọn Brush |
| `P` | Chọn Pencil |
| `E` | Chọn Eraser |
| `Ctrl+Z` | Undo |
| `Ctrl+Shift+Z` hoặc `Ctrl+Y` | Redo |
| `Ctrl+S` | Lưu |
| `Space` + kéo | Pan |
| `Ctrl + +` / `Ctrl + -` / `Ctrl+0` | Zoom in / Zoom out / Fit |
| `[` / `]` | Giảm / tăng cỡ nét |
| `F` | Bật/tắt Focus mode (ẩn panel phụ, chỉ còn canvas) |

---

## 7. Nộp bài (Submit) — Vẽ trên canvas và chụp bài vẽ trên giấy

> **Trạng thái:** Tính năng nộp bài **chưa khả dụng (planned)**.

Có 2 cách nộp bài:

### 7.1. Nộp bài vẽ trên canvas

1. Vẽ xong bài tập trên canvas (Mục 6).
2. Bấm nút **"Nộp bài"**.
3. Kiểm tra lại bài vẽ trong hộp thoại xác nhận (đúng bài tập, đủ nội dung, không thiếu phần nào).
4. Bấm **"Xác nhận nộp"**. Hệ thống chấm bài và trả kết quả (xem Mục 8).

### 7.2. Nộp bài vẽ trên giấy (chụp ảnh)

Nếu bạn thích vẽ trên giấy thật, bạn có thể chụp ảnh bài vẽ và nộp:

1. Đặt bài vẽ trên mặt phẳng, đủ ánh sáng (ánh sáng tự nhiên hoặc đèn trắng, không bóng đổ lên bài).
2. Chụp **thẳng từ trên xuống** (điện thoại song song với mặt giấy, không chụp xiên).
3. Đảm bảo toàn bộ bài vẽ nằm trong khung hình, không bị cắt mất góc.
4. Ảnh phải rõ nét, không mờ, không rung.
5. Tải ảnh lên (định dạng JPG/PNG, dung lượng tối đa sẽ được ghi rõ trong giao diện khi tính năng ra mắt).
6. Bấm **"Nộp bài"** và xác nhận.

**Mẹo chụp ảnh tốt:**

- Chụp dưới ánh sáng đều, tránh bóng của tay/điện thoại đổ lên bài.
- Dùng 2 tay giữ điện thoại chắc, hoặc đặt điện thoại lên giá đỡ.
- Kiểm tra ảnh sau khi chụp: nếu mờ hoặc xiên, chụp lại — ảnh mờ/xiên có thể khiến AI không chấm được bài của bạn (xem Mục 8.3).

---

## 8. Đọc phản hồi AI (AI Feedback) và xem Annotation

> **Trạng thái:** Tính năng chấm bài AI **chưa khả dụng (planned)** — pipeline chấm bài chưa được triển khai; tích hợp AI trực tuyến đang BLOCKED/INCOMPLETE (xem `AI_ASSESSMENT.md` Mục 9.5).

### 8.1. Kết quả chấm bài gồm những gì?

Sau khi nộp bài, bạn sẽ nhận được:

1. **Điểm từng tiêu chí (rubric):** Mỗi tiêu chí có mức (Chưa đạt / Đang hình thành / Đạt / Tốt) + nhận xét cụ thể. **Không có 1 con điểm tổng duy nhất** — bạn cần biết mình mạnh/yếu ở tiêu chí nào.
2. **Annotation trực tiếp trên bài vẽ:** Vòng tròn/mũi tên chỉ ra vị trí lỗi cụ thể; đường chuẩn đè lên bài vẽ của bạn để so sánh (đối với bài hình học); đôi khi có hình tham chiếu đã sửa đúng đặt cạnh bài của bạn.
3. **Tóm tắt bằng lời:** 1–2 câu tóm tắt bài của bạn đúng/sai ở đâu.
4. **Bước tiếp theo (Next steps):** 1–3 hành động cụ thể bạn có thể làm ngay (ví dụ: "Vẽ lại 5 ellipse với trục ngang dài gấp đôi trục dọc").

### 8.2. Nguồn kết quả (Mock vs Live)

Mọi kết quả chấm bài đều ghi rõ nguồn:

- **"AI trực tuyến" (Live):** Kết quả từ AI thật đang chạy.
- **"Chấm bằng đo hình học" (Local CV only):** Chỉ có điểm đo hình học (không dùng AI tạo sinh) — vẫn chính xác về mặt kỹ thuật, nhưng phần giải thích bằng lời sẽ ngắn gọn hơn.
- **"Dữ liệu mẫu" (Mock):** Chỉ dùng trong bản demo — không phải kết quả thật.

Nếu bạn thấy nhãn "Dữ liệu mẫu", đừng coi đó là kết quả chấm bài thật của bạn.

### 8.3. Khi AI nói "không chấm được"

Đôi khi AI sẽ trả về **"không chấm được"** thay vì điểm số. Đó là hành vi đúng — thà nói không chấm được còn hơn bịa điểm. Các trường hợp thường gặp:

| Thông báo | Ý nghĩa | Bạn nên làm gì |
|---|---|---|
| "Bài nộp thiếu nội dung" | Canvas gần như trắng, hoặc thiếu yếu tố yêu cầu | Vẽ đủ nội dung rồi nộp lại |
| "Ảnh quá mờ" | Ảnh chụp bài trên giấy bị mờ, không đọc được nét | Chụp lại rõ hơn (xem Mục 7.2) |
| "Ảnh bị xoay/cắt/méo" | Ảnh chụp xiên, xoay, hoặc cắt mất 1 phần bài | Chụp lại thẳng, đủ khung hình |
| "Không thể đánh giá" | Bài nộp không liên quan đến đề bài, hoặc sai đề hoàn toàn | Đọc lại đề bài và nộp đúng bài |

---

## 9. Sửa bài và nộp lại (Revise & Resubmit)

> **Trạng thái:** Tính năng nộp lại **chưa khả dụng (planned)**.

1. Đọc kỹ phản hồi AI (Mục 8) và xem annotation trên bài vẽ.
2. Làm theo 1–3 bước tiếp theo (next steps) mà AI gợi ý.
3. Sửa bài trực tiếp trên canvas (bản cũ vẫn còn — bạn không cần vẽ lại từ đầu, trừ khi AI gợi ý vẽ lại).
4. Nộp lại. Lần nộp mới được chấm độc lập; lịch sử các lần nộp được lưu lại để bạn so sánh tiến bộ.
5. **Làm lại không bị trừ điểm.** Ngược lại, làm lại nhiều lần là cách để đạt mastery (xem dưới đây).

**Mastery (Thành thạo):** Một kỹ năng được coi là "thành thạo" khi bạn có ít nhất **3 bài nộp đạt ngưỡng** ở **2 bài học khác nhau** trở lên dùng kỹ năng đó. Ví dụ: vẽ ellipse đạt trong bài 02.2 và áp dụng đúng trong bài 03.2 (dựng hình trụ). Tiến độ của bạn hiển thị theo 4 mức: Chưa bắt đầu → Đang luyện → Đạt → Thành thạo.

---

## 10. Tiến độ (Progress) và Portfolio

> **Trạng thái:** Trang tiến độ và portfolio **chưa khả dụng (planned)**.

### 10.1. Tiến độ

- Trang tiến độ hiển thị: % hoàn thành từng module, trạng thái mastery từng kỹ năng (4 mức), số bài đã nộp, và gợi ý bài học tiếp theo.
- Bạn có thể xem lịch sử nộp bài và so sánh bài cũ với bài mới để thấy tiến bộ.

### 10.2. Portfolio

- Portfolio là nơi trưng bày các tác phẩm tốt nhất của bạn (bài capstone, bài chân dung, bài phong cảnh…).
- Bạn chọn bài nào đưa vào portfolio; bài trong portfolio có thể chia sẻ bằng link (khi tính năng chia sẻ ra mắt).
- **Lưu ý về quyền riêng tư:** Mặc định portfolio của bạn là riêng tư (chỉ bạn xem được). Bạn tự quyết định có công khai hay không — hệ thống không tự động công khai bài vẽ của bạn.

---

## 11. Cài đặt (Settings)

> **Trạng thái:** Trang cài đặt **chưa khả dụng (planned)**.

Trang cài đặt gồm:

- **Hồ sơ:** Tên hiển thị, ảnh đại diện, giới thiệu ngắn.
- **Tài khoản:** Đổi email, đổi mật khẩu.
- **Học tập:** Lộ trình hiện tại, mục tiêu thời gian mỗi ngày, bật/tắt gợi ý trong lúc vẽ (Guided/Assisted/Independent).
- **Hiển thị:** Ngôn ngữ (tiếng Việt mặc định), bật/tắt texture giấy trên canvas, bật/tắt giảm chuyển động (prefers-reduced-motion).
- **Quyền riêng tư:** Bài vẽ mặc định riêng tư/công khai, cho phép/không cho phép dùng bài vẽ ẩn danh để cải thiện hệ thống.
- **Xóa tài khoản:** Xóa tài khoản và toàn bộ dữ liệu của bạn (kèm xác nhận 2 lần).

---

## 12. FAQ — Câu hỏi thường gặp

**Hỏi: Tôi chưa biết gì về vẽ, có học được không?**
Đáp: Được. Module 00 dành cho người mới hoàn toàn — bạn sẽ bắt đầu từ cách cầm bút và vẽ đường thẳng.

**Hỏi: Tôi cần mua dụng cụ gì không?**
Đáp: Không. Bạn chỉ cần trình duyệt web và chuột (hoặc màn hình cảm ứng). Nếu muốn vẽ trên giấy rồi chụp ảnh nộp, bạn cần giấy và bút chì — loại nào cũng được.

**Hỏi: AI chấm bài có thay thế giáo viên không?**
Đáp: Không. AI giúp bạn nhận ra lỗi kỹ thuật (đường lệch, phối cảnh sai…) và gợi ý cách sửa. Với bài sáng tạo (bố cục, kể chuyện, phong cách), AI chỉ đưa ra gợi ý — đánh giá cuối cùng cần con người. Nếu bạn muốn học sâu, hãy tìm thêm giáo viên hoặc cộng đồng vẽ.

**Hỏi: Điểm AI chấm có chính xác không?**
Đáp: Điểm hình học (độ thẳng, góc hội tụ, tỷ lệ) được đo bằng thuật toán nên khá khách quan. Nhận xét bằng lời có thể chưa hoàn hảo — nếu bạn thấy nhận xét sai, hãy đối chiếu với hình mẫu trong bài học và tin vào mắt mình. Hệ thống cũng ghi rõ mức độ tin cậy (confident/uncertain/insufficient) của mỗi kết quả.

**Hỏi: Tôi có thể học miễn phí không?**
Đáp: (Chưa công bố chính sách giá — sẽ cập nhật khi sản phẩm ra mắt.)

**Hỏi: Bài vẽ của tôi có bị người khác xem không?**
Đáp: Không, trừ khi bạn tự công khai. Mặc định bài vẽ của bạn là riêng tư.

**Hỏi: Tôi có thể học trên điện thoại không?**
Đáp: Được, nhưng vẽ trên màn hình điện thoại nhỏ sẽ khó hơn. Khuyến nghị dùng máy tính bảng hoặc máy tính để vẽ; điện thoại dùng để đọc lý thuyết và xem phản hồi.

---

## 13. Troubleshooting — Xử lý sự cố

> **Trạng thái:** Các tính năng dưới đây chưa khả dụng; phần này là hướng dẫn mục tiêu, sẽ cập nhật khi sản phẩm ra mắt.

| Vấn đề | Cách xử lý |
|---|---|
| Không đăng nhập được | Kiểm tra email/mật khẩu; dùng "Quên mật khẩu" để đặt lại; kiểm tra hộp thư rác (spam) nếu không nhận được email xác nhận |
| Canvas không vẽ được | Thử tải lại trang; kiểm tra trình duyệt đã cập nhật chưa; thử trình duyệt khác (Chrome/Firefox); kiểm tra xem layer hiện tại có bị khóa/ẩn không |
| Nét vẽ bị trễ (lag) | Giảm kích thước canvas (nếu có tùy chọn); đóng các tab khác; kiểm tra số nét trong project (quá 5.000 nét có thể chậm — xem `DRAWING_ENGINE.md` Mục 9) |
| Bài vẽ bị mất sau khi mất mạng | Mở lại project — bài vẽ được lưu tạm trên trình duyệt và sẽ đồng bộ khi có mạng; nếu vẫn mất, kiểm tra xem bạn có đang dùng đúng tài khoản và đúng trình duyệt không (dữ liệu tạm lưu theo trình duyệt) |
| Ảnh chụp nộp lên bị báo "quá mờ" | Chụp lại với đủ ánh sáng, giữ điện thoại chắc, chụp thẳng từ trên xuống (xem Mục 7.2) |
| AI báo "không chấm được" | Đọc lý do cụ thể trong thông báo (Mục 8.3) và nộp lại theo hướng dẫn |
| Bút stylus không nhận áp lực | Kiểm tra driver bút đã cài đúng chưa; thử trình duyệt khác; lưu ý hỗ trợ stylus chưa được kiểm tra đầy đủ (xem `DRAWING_ENGINE.md` Mục 8) |
| Trang tải chậm | Kiểm tra kết nối mạng; thử tải lại; nếu vẫn chậm, báo lại cho chúng tôi kèm tên trình duyệt và loại thiết bị |

**Vẫn gặp sự cố?** Liên hệ hỗ trợ qua (kênh liên hệ sẽ được công bố khi sản phẩm ra mắt).

---

## 14. Tài liệu liên quan

| Tài liệu | Nội dung |
|---|---|
| `CURRICULUM.md` | Chương trình học chi tiết (75 bài) |
| `DRAWING_ENGINE.md` | Đặc tả canvas engine |
| `AI_ASSESSMENT.md` | AI chấm bài như thế nào |
| `ADMIN_GUIDE.md` | Hướng dẫn quản trị (dành cho admin) |

---

*Hết USER_GUIDE.md — v0.1, 24/11/2026. Nhiều tính năng trong tài liệu này là planned, chưa khả dụng; tài liệu sẽ được cập nhật khi tính năng ra mắt.*
