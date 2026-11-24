# ART_DIRECTION.md — Định hướng mỹ thuật DrawPath AI

> **Tên sản phẩm:** DrawPath AI (tên tạm thời)
> **Phiên bản tài liệu:** 0.1 — ngày 24/11/2026
> **Ngôn ngữ tài liệu:** Tiếng Việt (thuật ngữ chuyên môn giữ nguyên tiếng Anh khi cần).
> **Trạng thái:** Tài liệu định hướng mỹ thuật. Đây là **đặc tả mục tiêu** — chưa có tài sản mỹ thuật (brand asset, illustration set, motion) nào được sản xuất xong và kiểm chứng theo tài liệu này. Mọi ví dụ hình ảnh trong tài liệu này đều là mô tả bằng lời, không phải tài sản đã có.

---

## 1. Brand Concept — "Modern Creative Atelier"

### 1.1. Câu khái niệm (Concept statement)

> **"Digital Sketchbook Meets Art Academy"** — Cuốn sổ phác thảo số gặp gỡ trường mỹ thuật.
>
> DrawPath AI là một **xưởng vẽ hiện đại (modern atelier)**: không gian ấm áp, có tổ chức, nơi học viên được hướng dẫn bài bản như ở trường mỹ thuật, nhưng công cụ và trải nghiệm thì hiện đại, nhẹ nhàng, kỹ thuật số. Sản phẩm phải có cảm giác **thủ công (handmade) nhưng không lộn xộn**, **học thuật (academic) nhưng không khô khan**, **hiện đại nhưng không lạnh lùng**.

### 1.2. Ba từ khóa thương hiệu

| Từ khóa | Ý nghĩa | Thể hiện qua |
|---|---|---|
| **Ấm áp (Warm)** | Học vẽ là hành trình dài, cần cảm giác an toàn và khuyến khích | Màu giấy ấm, chữ mềm, ngôn ngữ động viên |
| **Rõ ràng (Clear)** | Học viên luôn biết mình đang ở đâu, cần làm gì tiếp theo | Lộ trình rõ ràng, phản hồi cụ thể, giao diện gọn |
| **Thủ công (Crafted)** | Vẽ là nghề thủ công; sản phẩm tôn trọng quá trình làm bằng tay | Nét phác, đường construction, texture giấy, hình minh họa vẽ tay |

### 1.3. Tính cách thương hiệu (Brand Personality)

DrawPath AI nói chuyện như **một người thầy vẽ giỏi và kiên nhẫn** — không phải như một phần mềm, không phải như một influencer.

| Đặc điểm | Thể hiện | Ví dụ giọng văn |
|---|---|---|
| Kiên nhẫn, khuyến khích | Không chê bai; lỗi được gọi tên cụ thể và kèm cách sửa | "Đường ellipse này hơi lệch trục dọc — thử vẽ trục trước rồi mới vẽ ellipse nhé." |
| Chính xác, có chuyên môn | Dùng đúng thuật ngữ, giải thích rõ ràng | "Điểm tụ (vanishing point) của em đặt quá gần, nên tòa nhà bị méo." |
| Giản dị, không phô trương | Không dùng từ ngữ hoa mỹ, không hứa hẹn "thành thạo trong 7 ngày" | "Kỹ năng này cần khoảng 2–3 tuần luyện đều. Không có đường tắt." |
| Vui vẻ vừa phải | Có thể hài hước nhẹ, nhưng không đùa cợt về bài vẽ của học viên | "Bàn tay này trông hơi giống… chân gà. Không sao — 90% người mới đều vẽ tay như vậy lúc đầu." |

**Giọng văn (Tone of Voice):**

- Xưng hô: hệ thống xưng "DrawPath" hoặc không xưng; gọi học viên là "bạn".
- Ngôn ngữ: tiếng Việt tự nhiên, câu ngắn, rõ ràng; thuật ngữ tiếng Anh kèm giải thích lần đầu xuất hiện.
- Không dùng: từ ngữ tuyệt đối ("chắc chắn", "đảm bảo 100%"), hứa hẹn phi thực tế, giọng văn ra lệnh ("Bạn phải…", "Bắt buộc…").

---

## 2. Illustration Style — Phong cách minh họa

### 2.1. Nguyên tắc chung

Mọi hình minh họa trong sản phẩm (thumbnail bài học, hình demo, hình minh họa lý thuyết, hình trang trí) tuân theo cùng một phong cách:

1. **Vẽ tay là gốc.** Hình minh họa phải trông như được vẽ bằng tay (bút chì, bút mực, màu nước nhẹ), không phải render 3D bóng bẩy hay vector phẳng kiểu corporate.
2. **Construction lines được giữ lại.** Đường dựng hình (construction lines), đường trục, đường phác nhẹ **không bị xóa** trong hình demo — chúng là một phần của phong cách và có giá trị dạy học: học viên thấy được quá trình dựng hình, không chỉ kết quả cuối cùng.
3. **Màu sắc hạn chế.** Mỗi hình minh họa dùng tối đa **3–4 màu** từ bảng màu thương hiệu (xem `DESIGN_SYSTEM.md`), cộng với màu graphite cho nét vẽ. Không dùng bảng màu rực rỡ, không dùng màu neon.
4. **Giấy là một phần của hình.** Hình minh họa nằm trên nền giấy (Warm Paper `#F7F3EA` hoặc trắng kem), có thể có texture giấy nhẹ — hình không "nổi" trên nền trắng tinh như ảnh stock.

### 2.2. Các yếu tố phong cách cụ thể

| Yếu tố | Mô tả | Ví dụ áp dụng |
|---|---|---|
| **Sketch strokes (nét phác)** | Nét vẽ có độ đậm nhạt thay đổi, đầu nét hơi mảnh, có thể hơi rung nhẹ (như vẽ tay thật); không dùng nét vector đều tăm tắp | Nét vẽ trong hình demo bài học, icon trang trí |
| **Construction lines (đường dựng hình)** | Đường thẳng/mốc dựng hình vẽ bằng nét đứt hoặc nét nhạt màu Lavender/Sage; giữ lại trong hình demo | Hình hộp, Loomis head, phối cảnh — luôn thấy đường trục và điểm tụ |
| **Paper texture (chất giấy)** | Texture giấy nhẹ (grain mịn, không quá rõ) trên nền; dùng sparingly — 1 lớp texture cho toàn trang, không texture khác nhau mỗi card | Nền trang marketing, nền canvas (tùy chọn, có thể tắt) |
| **Hatching (vạch chéo)** | Tô bóng bằng vạch chéo (hatching/cross-hatching) thay vì tô đặc hoặc gradient mượt | Hình minh họa sáng tối, thumbnail Module 06 |
| **Màu nước nhẹ (light watercolor wash)** | Vùng màu tô bằng wash màu nước nhạt, có viền không đều, trong suốt — chỉ dùng cho điểm nhấn (1 vùng màu / hình) | Thumbnail track, hình trang trí hero |

### 2.3. Các loại hình minh họa trong sản phẩm

| Loại | Yêu cầu | Nguồn |
|---|---|---|
| Thumbnail bài học (16:9) | Hình gốc do team tự vẽ theo phong cách trên; thể hiện rõ kỹ năng của bài học (ví dụ: bài ellipse → hình ellipse + trục) | Team tự vẽ — **chưa sản xuất** |
| Hình demo trong bài học | Hình gốc, có construction lines, có thể gồm nhiều bước (step 1 → step 2 → step 3) | Team tự vẽ — **chưa sản xuất** |
| Hình minh họa lỗi thường gặp | Hình gốc vẽ lỗi + hình sửa đúng đặt cạnh nhau, có annotation | Team tự vẽ — **chưa sản xuất** |
| Hình trang trí (hero, empty state) | Hình vẽ tay nhẹ, ít chi tiết, không tranh giành sự chú ý với nội dung | Team tự vẽ — **chưa sản xuất** |
| Ảnh tham chiếu (reference photo) | Ảnh thật (still life, phong cảnh, mẫu người) dùng làm mẫu vẽ | Ảnh tự chụp hoặc ảnh CC0/CC-BY (ghi rõ nguồn + giấy phép); không dùng ảnh có bản quyền không rõ nguồn |

> **Trạng thái:** Chưa có hình minh họa nào được sản xuất. Mọi hình trong sản phẩm hiện tại (nếu có) là placeholder và **phải được thay thế** trước khi ra mắt.

### 2.4. Quy tắc dùng hình ảnh (Imagery Rules)

**Do:**

- Dùng hình gốc do team tự vẽ, theo đúng phong cách Mục 2.2.
- Giữ construction lines trong hình demo.
- Dùng ảnh tham chiếu thật (không phải hình AI tạo) cho bài tập quan sát — học viên cần học quan sát thực tế.
- Ghi rõ nguồn + giấy phép cho mọi ảnh không phải do team tự tạo.
- Nén hình hợp lý (WebP, < 200KB/thumbnail) để tải nhanh.

**Don't:**

- Không dùng hình AI tạo (AI-generated) làm hình demo kỹ thuật — hình AI thường sai giải phẫu, sai phối cảnh, và dạy sai cho học viên.
- Không dùng hình stock có bản quyền không rõ nguồn.
- Không dùng hình minh họa kiểu corporate flat (người que vector, hình khối phẳng màu rực) — sai phong cách thương hiệu.
- Không dùng hình có watermark.
- Không dùng hình minh họa quá chi tiết/rối làm thumbnail — thumbnail phải đọc được ở kích thước nhỏ (320px).

---

## 3. Motion Language — Ngôn ngữ chuyển động

### 3.1. Nguyên tắc

- **Chuyển động phục vụ học tập, không phải trang trí.** Animation chỉ dùng để: (1) dẫn mắt tới nội dung quan trọng, (2) thể hiện quá trình (ví dụ: stroke replay — xem `DRAWING_ENGINE.md`), (3) phản hồi thao tác (bấm nút, chuyển bài).
- **Nhanh và nhẹ.** Thời lượng animation giao diện: **150–300ms**; easing: `ease-out` cho xuất hiện, `ease-in-out` cho di chuyển. Không dùng animation chậm (> 500ms) cho thao tác thường xuyên.
- **Vẽ tay, không máy móc.** Khi có thể, chuyển động nên có cảm giác "vẽ" — ví dụ: đường kẻ xuất hiện như đang được vẽ (stroke-dashoffset), thay vì fade-in đều.

### 3.2. Các loại chuyển động

| Loại | Thời lượng | Dùng cho |
|---|---|---|
| Fade + translate nhẹ (8px) | 200ms, ease-out | Card xuất hiện, modal mở, toast |
| Stroke draw (vẽ nét) | 400–800ms, ease-in-out | Đường trang trí hero, đường construction xuất hiện trong demo |
| Stroke replay (phát lại nét vẽ) | Tốc độ thật hoặc 1x/2x/4x (do người dùng chọn) | Phát lại quá trình vẽ của học viên/bài mẫu — xem `DRAWING_ENGINE.md` |
| Progress fill | 400ms, ease-out | Thanh tiến độ, vòng tiến độ |
| Page transition | 200ms, fade | Chuyển trang/bài học |
| Micro-interaction | 150ms | Hover nút, chọn công cụ, toggle |

### 3.3. Quy tắc

- **Tôn trọng `prefers-reduced-motion`:** Khi người dùng bật chế độ giảm chuyển động, tắt mọi animation trang trí; chỉ giữ lại animation có ý nghĩa chức năng (ví dụ: stroke replay — vì đó là nội dung học tập, nhưng cho phép người dùng tạm dừng/tua).
- Không dùng animation lặp vô hạn (trừ loading spinner).
- Không dùng hiệu ứng parallax mạnh, không dùng hiệu ứng 3D xoay lật cho card bài học.
- Không dùng animation làm chậm thao tác: nút bấm phản hồi ngay (< 100ms), không đợi animation xong mới thực hiện hành động.

---

## 4. Ba trải nghiệm (The 3 Experiences)

Sản phẩm có 3 trải nghiệm khác nhau, mỗi trải nghiệm có trọng tâm mỹ thuật riêng nhưng cùng một hệ thống thiết kế (xem `DESIGN_SYSTEM.md`).

### 4.1. Marketing Experience (Trải nghiệm giới thiệu — trang landing, giới thiệu khóa học)

- **Mục đích:** Người chưa biết DrawPath hiểu sản phẩm là gì, tin tưởng, và đăng ký.
- **Cảm giác:** Như bước vào một xưởng vẽ đẹp, có tổ chức — ấm áp, truyền cảm hứng, nhưng không ồn ào.
- **Đặc điểm:**
  - Hero: tiêu đề lớn (Display), 1 câu mô tả rõ ràng, 1 CTA chính ("Bắt đầu học miễn phí"), 1 hình minh họa vẽ tay (sketchbook mở, bút chì, hình vẽ dở dang có construction lines).
  - Section: lộ trình học (11 module) trình bày dạng "bản đồ" (path) — đường nét vẽ tay nối các mốc module, không phải bảng khô khan.
  - Social proof: trích dẫn học viên (khi có học viên thật — **hiện chưa có**, không bịa testimonial), số liệu thật (khi có — **hiện chưa có**).
  - Footer: link, bản quyền, ngôn ngữ.
- **Không có:** pop-up quảng cáo, countdown giả tạo, hứa hẹn "thành thạo trong 7 ngày", testimonial bịa đặt.

### 4.2. Learning Experience (Trải nghiệm học — lộ trình, bài học, tiến độ)

- **Mục đích:** Học viên tập trung học, biết mình đang ở đâu, làm gì tiếp theo.
- **Cảm giác:** Như mở cuốn sketchbook có cấu trúc — mỗi trang là 1 bài học, có đánh dấu tiến độ bằng tay (dấu tick, gạch chân).
- **Đặc điểm:**
  - Lộ trình: danh sách module dạng "chương sách", mỗi module có số bài, tiến độ, trạng thái mastery.
  - Trang bài học: lý thuyết ngắn (≤ 500 từ) + hình demo có construction lines + bước luyện tập + bài tập nộp bài.
  - Phản hồi AI: hiển thị dạng "nhận xét của thầy" — có annotation trực tiếp trên bài vẽ (xem `AI_ASSESSMENT.md`), điểm từng tiêu chí rubric, và 1–3 hành động tiếp theo.
  - Tiến độ: thanh tiến độ + mastery indicator (4 nấc), không dùng bảng xếp hạng công khai.
- **Không có:** quảng cáo xen giữa bài học, thông báo không liên quan, gamification quá đà (không có "điểm kinh nghiệm" hay "huy hiệu" làm xao nhãng việc học).

### 4.3. Drawing Experience (Trải nghiệm vẽ — canvas)

- **Mục đích:** Học viên vẽ tập trung, không bị phân tâm bởi giao diện.
- **Cảm giác:** Như đặt bút lên giấy — canvas là nhân vật chính, giao diện lùi về sau.
- **Đặc điểm:**
  - Canvas chiếm diện tích lớn nhất màn hình; nền canvas là giấy trắng/kem phẳng (có thể bật/tắt texture giấy nhẹ).
  - Toolbar gọn (xem `DESIGN_SYSTEM.md` Mục 3.8), nhóm công cụ rõ ràng, icon line mảnh.
  - Chế độ tập trung (Focus mode): ẩn mọi panel phụ, chỉ còn canvas + toolbar tối thiểu; bật/tắt bằng 1 nút hoặc phím tắt.
  - Reference: ảnh tham chiếu hiển thị trong panel riêng, có thể di chuyển/thu nhỏ, không che canvas.
  - Lưu tự động (autosave) với thông báo trạng thái nhẹ ("Đã lưu • 23:01") — không dùng pop-up làm gián đoạn.
- **Không có:** quảng cáo, thông báo đẩy, hiệu ứng trang trí trên canvas.

---

## 5. Logo và thương hiệu (Logo & Brand Assets)

> **Trạng thái:** Logo và bộ nhận diện thương hiệu **chưa được thiết kế xong**. Mục này là đặc tả yêu cầu, không phải mô tả tài sản đã có.

### 5.1. Yêu cầu logo

- **Tên:** DrawPath AI (tên tạm thời — có thể đổi trước khi ra mắt).
- **Ý tưởng:** Đường nét vẽ tay tạo thành một "path" (con đường) — có thể là 1 nét vẽ liên tục tạo thành chữ D, hoặc 1 đường cong có điểm bắt đầu và điểm đến.
- **Phong cách:** Nét vẽ tay, không dùng font chữ có sẵn làm logo chính; màu Graphite + điểm nhấn Terracotta (1 chi tiết duy nhất màu terracotta, ví dụ: dấu chấm cuối đường vẽ).
- **Biến thể cần có:** Logo ngang (icon + chữ), icon vuông (favicon, avatar), logo đơn sắc (1 màu, dùng cho in ấn/watermark).
- **Không dùng:** gradient, hiệu ứng 3D, nhiều màu, font chữ trang trí khó đọc.

### 5.2. Tên và thuật ngữ

- Tên sản phẩm: **DrawPath AI** (tạm thời).
- Tên gọi học viên: "học viên" hoặc "bạn" — không dùng "user".
- Tên gọi AI chấm bài: "AI" hoặc "trợ lý AI" — không đặt tên người cho AI (không gọi AI là "thầy" — AI là công cụ hỗ trợ, không thay thế giáo viên; xem `AI_ASSESSMENT.md`).

---

## 6. What NOT to Do (Những điều cấm kỵ)

| ❌ Không làm | Vì sao |
|---|---|
| Gradient neon / cầu vồng | Phá vỡ cảm giác giấy ấm, trông như sản phẩm công nghệ generic |
| Glassmorphism dày đặc (nhiều lớp kính mờ) | Trông hiện đại nhưng lạnh, rối, không hợp với "xưởng vẽ" |
| Corporate dashboard look (bảng số liệu dày đặc, nhiều widget, màu xanh dương công ty) | Học viên không phải nhân viên văn phòng; trang học phải giống sketchbook |
| Hình minh họa corporate flat (người que vector, hình khối phẳng màu rực) | Sai phong cách thương hiệu, không dạy được gì về vẽ |
| Hình AI tạo làm hình demo kỹ thuật | Hình AI thường sai giải phẫu/phối cảnh, dạy sai cho học viên |
| Testimonial / số liệu bịa đặt | Mất niềm tin khi bị phát hiện; chỉ dùng số liệu và trích dẫn thật |
| Hứa hẹn phi thực tế ("thành thạo trong 7 ngày", "vẽ đẹp ngay") | Sai sự thật về quá trình học vẽ; vi phạm nguyên tắc trung thực của sản phẩm |
| Gamification quá đà (điểm kinh nghiệm, huy hiệu, bảng xếp hạng công khai) | Làm xao nhãng việc học; tạo áp lực so sánh không lành mạnh |
| Quảng cáo xen giữa bài học | Phá vỡ sự tập trung; học viên đang trả tiền/thời gian để học |
| Dark mode làm mặc định | Sản phẩm là "giấy sáng"; dark mode (nếu có) là tính năng tương lai, chưa đặc tả |
| Emoji làm icon giao diện | Thiếu chuyên nghiệp, không nhất quán |
| Chữ viết tay khó đọc cho nội dung chính | Chỉ dùng font handwriting cho chi tiết trang trí nhỏ |

---

## 7. Tài liệu liên quan

| Tài liệu | Nội dung |
|---|---|
| `DESIGN_SYSTEM.md` | Tokens, components, accessibility |
| `CURRICULUM.md` | Chương trình học |
| `DRAWING_ENGINE.md` | Đặc tả canvas engine |
| `USER_GUIDE.md` | Hướng dẫn sử dụng |

---

*Hết ART_DIRECTION.md — v0.1, 24/11/2026. Định hướng mục tiêu; tài sản mỹ thuật chưa sản xuất.*
