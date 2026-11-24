# CURRICULUM.md — Chương trình học DrawPath AI

> **Tên sản phẩm:** DrawPath AI (tên tạm thời) — Nền tảng học vẽ bằng AI, tiếng Việt là ngôn ngữ chính.
> **Triết lý:** Learn → Observe → Practice → Analyze → Correct → Improve → Master
> (Học → Quan sát → Luyện tập → Phân tích → Sửa lỗi → Cải thiện → Thành thạo)
> **Phiên bản tài liệu:** 0.1 — ngày 24/11/2026
> **Ngôn ngữ tài liệu:** Tiếng Việt (thuật ngữ chuyên môn giữ nguyên tiếng Anh khi cần).

---

## 0. Trạng thái trung thực (Status — đọc trước)

| Hạng mục | Trạng thái |
|---|---|
| Cấu trúc chương trình (module / bài học / lộ trình) | ✅ ĐÃ ĐỊNH NGHĨA trong tài liệu này |
| Nội dung chi tiết từng bài học (lesson body: hướng dẫn từng bước, bài tập, đáp án mẫu) | ❌ CHƯA VIẾT — tài liệu này chỉ liệt kê tiêu đề, mục tiêu, kỹ năng, độ khó, thời lượng dự kiến |
| Expert review (chuyên gia mỹ thuật / sư phạm thẩm định) | ❌ CHƯA THỰC HIỆN |
| Kiểm chứng hiệu quả học tập (thử nghiệm với học viên thật) | ❌ CHƯA CÓ — không có kết quả nào được xác minh |
| Bài học / tính năng được tuyên bố "đã hoàn thành" hay "đã pass test" | ❌ KHÔNG CÓ — không tuyên bố nào như vậy trong tài liệu này |

**Lưu ý về trạng thái triển khai code:** Tài liệu này mô tả đặc tả mục tiêu của chương trình học, không mô tả trạng thái code. Tại thời điểm kiểm chứng 24/11/2026 ~22:56 (+07, Asia/Saigon), thư mục dự án được ghi nhận là trống. Tại thời điểm viết tài liệu này (~23:01 cùng ngày), các thư mục `backend/` và `frontend/` đã được quan sát là tồn tại trong `~/workspace/art-class-forthing/`; nội dung bên trong không thuộc phạm vi nhiệm vụ viết tài liệu này nên **không được kiểm tra và không được khẳng định gì về mức độ hoàn thiện code** trong tài liệu này. Việc triển khai backend/frontend thuộc về các agent khác.

**Nguyên tắc bản quyền:** Tài liệu này KHÔNG sao chép nội dung từ Drawabox, Proko, NMA (New Masters Academy), Ctrl+Paint, Line of Action hay bất kỳ nguồn có bản quyền nào khác. Các nguồn đó chỉ được **trích dẫn làm tài liệu tham khảo** (xem Mục 7) và mọi tóm tắt trong tài liệu này đều được viết lại bằng lời của tác giả. Việc nghiên cứu đầy đủ và đối chiếu nguồn vẫn đang **chờ xác minh (pending)**.

---

## 1. Tổng quan chương trình

### 1.1. Đối tượng học viên

| Đối tượng | Mô tả |
|---|---|
| Người mới hoàn toàn | Chưa từng vẽ nghiêm túc, cần bắt đầu từ đường thẳng và hình khối |
| Người tự học dở dang | Đã vẽ một thời gian nhưng thiếu nền tảng hệ thống, hay mắc lỗi phối cảnh / tỷ lệ |
| Người muốn chuyên sâu | Đã có nền tảng, muốn đi vào Portrait, Anime & Manga, Landscape hoặc Digital Painting |
| Người học lại sau thời gian dài | Cần lộ trình ôn tập nhanh theo kỹ năng còn thiếu (diagnostic → lộ trình cá nhân) |

### 1.2. Cấu trúc tổng thể

| Khối | Số lượng | Ghi chú |
|---|---|---|
| Module nền tảng (Foundation) | 11 module | Module 00 → 10, học theo thứ tự khuyến nghị |
| Bài học nền tảng | 55 bài | Mỗi module 5 bài |
| Track chuyên sâu (Specialisation) | 4 track | Portrait, Anime & Manga, Landscape & Environment, Digital Painting |
| Bài học chuyên sâu | 20 bài | Mỗi track 5 bài |
| **Tổng số bài học** | **75 bài** | Xem bảng đếm ở Mục 5 |

### 1.3. Cách đọc bảng bài học

Mỗi bài học được liệt kê với:

- **Tiêu đề** — tên bài học (tiếng Việt, có thể kèm thuật ngữ tiếng Anh trong ngoặc).
- **Mục tiêu (Objectives)** — học viên làm được gì sau bài học, viết dưới dạng hành vi quan sát được.
- **Kỹ năng (Skills)** — kỹ năng cụ thể được luyện.
- **Độ khó (Difficulty)** — ★☆☆ Cơ bản / ★★☆ Trung bình / ★★★ Nâng cao.
- **Thời lượng (Minutes)** — thời gian luyện tập ước tính (không tính thời gian đọc lý thuyết), tính bằng phút.

---

## 2. Module nền tảng (Foundation — 11 module, 55 bài)

### Module 00 — Fundamentals (Nền tảng tư duy và dụng cụ)

*Mục đích: học viên hiểu vẽ là kỹ năng quan sát + vận động, biết cầm bút, làm quen canvas số, và thiết lập thói quen luyện tập.*

| # | Bài học | Mục tiêu | Kỹ năng | Độ khó | Phút |
|---|---|---|---|---|---|
| 00.1 | Vẽ là gì? Tư duy quan sát thay vì "tài năng" | Giải thích được vì sao vẽ là kỹ năng quan sát và vận động có thể luyện; phân biệt "vẽ theo ký hiệu" và "vẽ theo quan sát" | Tư duy tăng trưởng (growth mindset), quan sát | ★☆☆ | 15 |
| 00.2 | Cầm bút và tư thế tay — nền tảng của đường nét | Cầm bút đúng 2 cách (tripod cho chi tiết, overhand cho phác dài); vẽ được đường dài bằng chuyển động cánh tay, không chỉ cổ tay | Cầm bút, vận động cánh tay | ★☆☆ | 20 |
| 00.3 | Làm quen canvas số và công cụ vẽ | Sử dụng được bút chì, tẩy, undo/redo, chọn màu, chỉnh cỡ nét, zoom/pan trên canvas DrawPath | Thao tác canvas, công cụ cơ bản | ★☆☆ | 20 |
| 00.4 | Bài tập khởi động: đường thẳng, đường cong, vòng tròn | Vẽ 3 trang khởi động: đường thẳng song song, đường cong S/C, vòng tròn khép kín; nhận biết độ rung tay của mình | Khởi động (warm-up), kiểm soát tay | ★☆☆ | 25 |
| 00.5 | Thiết lập thói quen luyện vẽ mỗi ngày | Xây dựng được lịch luyện 15–30 phút/ngày, biết cách ghi nhật ký luyện tập và tự đánh giá tiến bộ | Thói quen luyện tập, tự đánh giá | ★☆☆ | 15 |

**Kỹ năng đầu ra Module 00:** cầm bút đúng, thao tác canvas thành thạo, có thói quen khởi động trước mỗi buổi vẽ.

### Module 01 — Line Control (Kiểm soát đường nét)

*Mục đích: đường nét sạch, tự tin, có chủ đích — nền tảng của mọi bản vẽ.*

| # | Bài học | Mục tiêu | Kỹ năng | Độ khó | Phút |
|---|---|---|---|---|---|
| 01.1 | Đường thẳng tự tin — vẽ một nét, không tô lại | Vẽ được đường thẳng dài trong 1 nét, độ lệch khỏi đường chuẩn < 5% chiều dài; không tô đè nhiều lần | Đường thẳng, tự tin nét vẽ | ★☆☆ | 20 |
| 01.2 | Đường cong và đường S — kiểm soát hướng cong | Vẽ được cung tròn và đường cong S mượt, độ cong đều, không gãy khúc | Đường cong, kiểm soát độ cong | ★☆☆ | 20 |
| 01.3 | Đường song song và khoảng cách đều | Vẽ được 5 đường thẳng song song với khoảng cách đều nhau (sai số < 10%); áp dụng vào vẽ vạch (hatching) | Song song, khoảng cách | ★★☆ | 25 |
| 01.4 | Độ đậm nhạt của nét — line weight | Thay đổi được độ đậm/mảnh của nét theo áp lực và tốc độ; vẽ được cùng một hình với 3 mức line weight khác nhau | Line weight, áp lực bút | ★★☆ | 25 |
| 01.5 | Vẽ đường theo mẫu — bài kiểm tra đường thẳng | Nối được 2 điểm bằng 1 đường thẳng duy nhất trong 8/10 lần thử; tự chấm điểm bằng công cụ đo của AI | Đánh giá đường nét, tự chấm | ★★☆ | 20 |

**Kỹ năng đầu ra Module 01:** đường thẳng/cong sạch, line weight có chủ đích.

### Module 02 — Shapes & Proportion (Hình khối phẳng và tỷ lệ)

*Mục đích: nhìn mọi vật thể phức tạp thành các hình phẳng đơn giản và đo tỷ lệ chính xác.*

| # | Bài học | Mục tiêu | Kỹ năng | Độ khó | Phút |
|---|---|---|---|---|---|
| 02.1 | Hình vuông, hình tròn, hình tam giác — vẽ tay không | Vẽ tay không được hình vuông (4 góc ~90°), hình tròn khép kín, tam giác cân với sai số cạnh < 10% | Hình phẳng cơ bản | ★☆☆ | 20 |
| 02.2 | Hình ellipse — nền tảng của hình trụ và hình tròn trong phối cảnh | Vẽ được ellipse với 2 trục đối xứng, độ dẹt (minor/major axis) đúng ý đồ; phân biệt ellipse đúng và ellipse "quả trứng" | Ellipse control | ★★☆ | 25 |
| 02.3 | Đo tỷ lệ bằng mắt — phương pháp so sánh (comparative measurement) | Dùng bút/cánh tay đo tỷ lệ chiều cao–chiều rộng của vật mẫu, sai số < 10%; áp dụng cho 3 vật khác nhau | Đo tỷ lệ, so sánh | ★★☆ | 30 |
| 02.4 | Tỷ lệ cơ thể người cơ bản — đơn vị "đầu" (head unit) | Vẽ được figure đứng đơn giản với tỷ lệ ~7,5 đầu; xác định được vị trí rốn, đầu gối, khuỷu tay theo đơn vị đầu | Tỷ lệ figure, head unit | ★★☆ | 30 |
| 02.5 | Phân rã vật thể thành hình phẳng — bài tập "nhìn hình trong vật" | Phân rã 5 vật thể (cốc, ghế, xe, chai, bàn) thành các hình phẳng chồng nhau và vẽ lại bằng hình phẳng | Phân rã hình (decomposition) | ★★☆ | 30 |

**Kỹ năng đầu ra Module 02:** vẽ hình phẳng chính xác, đo tỷ lệ bằng mắt, phân rã vật thể.

### Module 03 — Form Construction (Dựng hình khối 3D)

*Mục đích: từ hình phẳng dựng thành khối 3D — hộp, trụ, cầu, nón — và kết hợp chúng thành vật thể.*

| # | Bài học | Mục tiêu | Kỹ năng | Độ khó | Phút |
|---|---|---|---|---|---|
| 03.1 | Hình hộp (box) — khối 3D đầu tiên | Vẽ được hộp 3D với 3 mặt thấy được, các cạnh song song hội tụ đúng hướng; vẽ được hộp xoay ở 3 góc khác nhau | Box construction | ★★☆ | 25 |
| 03.2 | Hình trụ (cylinder) — từ ellipse đến trụ | Dựng được hình trụ từ 2 ellipse + 2 đường sinh; vẽ được trụ đứng, trụ nằm, trụ nghiêng | Cylinder construction | ★★☆ | 25 |
| 03.3 | Hình cầu (sphere) và hình nón (cone) | Vẽ được hình cầu với đường xích đạo và trục đúng; vẽ được hình nón với đỉnh và đáy ellipse | Sphere, cone | ★★☆ | 25 |
| 03.4 | Kết hợp khối — dựng vật thể từ nhiều khối cơ bản | Dựng được cốc (trụ + quai torus đơn giản), bàn (hộp + trụ), chai (trụ + nón cụt) bằng cách chồng khối | Kết hợp khối, boolean tư duy | ★★★ | 35 |
| 03.5 | Cắt và giao nhau của khối — hiểu cấu trúc bên trong | Vẽ được mặt cắt của hộp/trụ (cross-section) và giao tuyến 2 khối giao nhau; hiểu "vẽ xuyên thấu" (draw-through) | Cross-section, draw-through | ★★★ | 35 |

**Kỹ năng đầu ra Module 03:** dựng và kết hợp khối 3D, hiểu cấu trúc bên trong vật thể.

### Module 04 — Perspective (Phối cảnh)

*Mục đích: vẽ không gian 3D thuyết phục trên mặt phẳng 2D bằng phối cảnh 1, 2 và 3 điểm tụ.*

| # | Bài học | Mục tiêu | Kỹ năng | Độ khó | Phút |
|---|---|---|---|---|---|
| 04.1 | Phối cảnh 1 điểm tụ (1-point perspective) — hành lang và căn phòng | Vẽ được căn phòng/hành lang 1 điểm tụ với mọi cạnh hội tụ đúng điểm tụ; đặt được đồ vật đúng vị trí trong không gian | 1-point perspective | ★★☆ | 30 |
| 04.2 | Phối cảnh 2 điểm tụ (2-point perspective) — tòa nhà và góc phố | Vẽ được tòa nhà 2 điểm tụ với 2 bộ cạnh hội tụ đúng 2 điểm tụ trên đường chân trời; xác định được đường chân trời (horizon line) | 2-point perspective | ★★☆ | 35 |
| 04.3 | Phối cảnh 3 điểm tụ (3-point perspective) — nhìn từ trên cao / dưới thấp | Vẽ được tòa nhà cao tầng nhìn từ dưới lên (hoặc trên cao nhìn xuống) với điểm tụ thứ 3 theo chiều dọc | 3-point perspective | ★★★ | 35 |
| 04.4 | Ellipse và hình tròn trong phối cảnh | Vẽ được hình tròn nằm trên mặt phẳng nghiêng (bánh xe, miệng cốc nhìn nghiêng) dưới dạng ellipse có độ dẹt đúng với góc nhìn | Ellipse in perspective | ★★★ | 30 |
| 04.5 | Phối cảnh trong cảnh thực — vẽ góc phòng của bạn | Vẽ được góc phòng thật của học viên bằng phối cảnh 2 điểm tụ, có ít nhất 3 đồ vật đặt đúng vị trí không gian | Áp dụng phối cảnh thực tế | ★★★ | 40 |

**Kỹ năng đầu ra Module 04:** vẽ không gian 1/2/3 điểm tụ, đặt vật thể đúng vị trí không gian.

### Module 05 — Observation Drawing (Vẽ quan sát / Still Life)

*Mục đích: vẽ đúng những gì mắt thấy — still life, đo đạc, so sánh âm–dương (negative space).*

| # | Bài học | Mục tiêu | Kỹ năng | Độ khó | Phút |
|---|---|---|---|---|---|
| 05.1 | Still life đầu tiên — 3 vật đơn giản | Vẽ được still life 3 vật (cốc, quả táo, hộp) đúng vị trí tương đối và tỷ lệ, sai số < 15% | Still life, bố cục | ★★☆ | 35 |
| 05.2 | Negative space — vẽ khoảng trống giữa các vật | Vẽ được still life bằng cách vẽ khoảng trống (negative space) trước, kiểm chứng tỷ lệ chính xác hơn cách vẽ vật trực tiếp | Negative space | ★★☆ | 30 |
| 05.3 | Đo đạc và căn chỉnh (sighting & measuring) | Dùng phương pháp sighting (giơ bút, nhắm 1 mắt) để đo góc nghiêng và tỷ lệ; vẽ được vật nghiêng đúng góc ±5° | Sighting, đo góc | ★★★ | 35 |
| 05.4 | Vẽ tay và vật thể quen thuộc — quan sát chi tiết | Vẽ được bàn tay của mình ở 1 tư thế đơn giản, đúng tỷ lệ các ngón và khớp; nhận biết lỗi "vẽ theo ký hiệu" | Quan sát chi tiết, vẽ tay | ★★★ | 40 |
| 05.5 | Still life hoàn chỉnh — từ phác đến hoàn thiện | Hoàn thành 1 still life 4–5 vật: phác khối → đo tỷ lệ → dựng hình → hoàn thiện nét, trong 1 buổi | Quy trình still life đầy đủ | ★★★ | 45 |

**Kỹ năng đầu ra Module 05:** vẽ still life đúng tỷ lệ và vị trí, dùng negative space và sighting.

### Module 06 — Light & Shadow (Ánh sáng và bóng đổ)

*Mục đích: hiểu ánh sáng tạo khối như thế nào — 5 giá trị sáng tối, bóng đổ, phản quang.*

| # | Bài học | Mục tiêu | Kỹ năng | Độ khó | Phút |
|---|---|---|---|---|---|
| 06.1 | 5 giá trị sáng tối (5 values) trên hình cầu | Tô được hình cầu với đủ 5 giá trị: highlight, light, halftone, core shadow, reflected light; chuyển tông mượt, không vạch | Value scale, shading | ★★☆ | 30 |
| 06.2 | Bóng đổ (cast shadow) — hướng và hình dạng | Vẽ được bóng đổ của hộp/trụ trên mặt phẳng với hướng và độ dài đúng theo hướng nguồn sáng; phân biệt bóng đổ và bóng bản thân (form shadow) | Cast shadow, light direction | ★★☆ | 30 |
| 06.3 | Chất liệu và ánh sáng — bóng, mờ, trong suốt | Thể hiện được 3 chất liệu khác nhau bằng sáng tối: kim loại bóng (highlight sắc), vải mờ (chuyển tông mềm), thủy tinh (highlight + trong suốt) | Chất liệu, rendering | ★★★ | 35 |
| 06.4 | Ánh sáng trong cảnh — 1 nguồn sáng chính + ánh sáng phụ | Vẽ được still life 3 vật với 1 nguồn sáng chính nhất quán (mọi bóng đổ cùng hướng); thêm ánh sáng phụ nhẹ không phá vỡ nguồn chính | Light consistency | ★★★ | 40 |
| 06.5 | Bóng đổ sai — nhận diện và sửa lỗi ánh sáng thường gặp | Nhận diện được 5 lỗi ánh sáng thường gặp (bóng đổ ngược hướng, thiếu reflected light, highlight đặt sai, value nhảy cóc, bóng quá đen) và sửa được trong bài của mình | Phân tích lỗi ánh sáng | ★★★ | 30 |

**Kỹ năng đầu ra Module 06:** tô khối 5 giá trị, bóng đổ nhất quán hướng sáng, thể hiện chất liệu.

### Module 07 — Materials & Color (Chất liệu và màu sắc)

*Mục đích: hiểu màu sắc cơ bản — bánh xe màu, hòa sắc, nhiệt độ màu — và áp dụng vào bài vẽ.*

| # | Bài học | Mục tiêu | Kỹ năng | Độ khó | Phút |
|---|---|---|---|---|---|
| 07.1 | Bánh xe màu và 3 thuộc tính màu (hue, saturation, value) | Xác định được hue/saturation/value của 1 màu bất kỳ; pha được màu phụ từ 3 màu gốc; giải thích được vì sao màu trông khác nhau trên nền khác nhau | Color theory cơ bản | ★☆☆ | 25 |
| 07.2 | Hòa sắc (color harmony) — tương đồng, bổ túc, tam giác | Chọn được 1 bảng hòa sắc (tương đồng / bổ túc / tam giác) cho 1 bài vẽ và áp dụng nhất quán; giải thích lựa chọn của mình | Color harmony | ★★☆ | 30 |
| 07.3 | Nhiệt độ màu (warm/cool) và chiều sâu không gian | Dùng màu ấm cho vật gần và màu lạnh cho vật xa để tạo chiều sâu; vẽ được phong cảnh đơn giản có chiều sâu bằng nhiệt độ màu | Warm/cool, atmospheric perspective | ★★☆ | 30 |
| 07.4 | Màu của ánh sáng và bóng — bóng không phải màu đen | Tô được bóng đổ bằng màu lạnh/xanh tím thay vì đen; thể hiện được màu ánh sáng (vàng ấm buổi chiều, xanh lạnh buổi sáng) | Màu ánh sáng, màu bóng | ★★★ | 35 |
| 07.5 | Bảng màu giới hạn (limited palette) — vẽ chỉ với 3 màu + trắng | Hoàn thành 1 bài vẽ chỉ dùng 3 màu + trắng, vẫn thể hiện được đủ sắc độ và không khí; hiểu sức mạnh của giới hạn | Limited palette | ★★★ | 40 |

**Kỹ năng đầu ra Module 07:** dùng bánh xe màu, hòa sắc, nhiệt độ màu, bảng màu giới hạn.

### Module 08 — Gesture & Anatomy (Cử chỉ và giải phẫu)

*Mục đích: vẽ figure người sống động — gesture nhanh, cấu trúc xương/khớp, tỷ lệ cơ thể.*

| # | Bài học | Mục tiêu | Kỹ năng | Độ khó | Phút |
|---|---|---|---|---|---|
| 08.1 | Gesture drawing — bắt chuyển động trong 30 giây | Vẽ được 10 gesture 30 giây, mỗi gesture bắt được đường hành động (line of action) và hướng chuyển động chính, không sa đà chi tiết | Gesture, line of action | ★★☆ | 25 |
| 08.2 | Khung xương và khớp — cấu trúc bên dưới figure | Vẽ được figure dạng "que diêm có khớp" (stick figure với khớp vai/khuỷu/hông/gối) đúng tỷ lệ ở 3 tư thế khác nhau | Cấu trúc xương, khớp | ★★☆ | 30 |
| 08.3 | Khối cơ bản của cơ thể — torso, pelvis, đầu | Dựng được torso (hộp nghiêng) + pelvis (hộp) + đầu (cầu + hàm) thành figure 3D đơn giản, đúng hướng xoay | Figure construction | ★★★ | 35 |
| 08.4 | Tay và chân — 2 bộ phận khó nhất | Vẽ được bàn tay ở 2 tư thế và bàn chân ở 1 tư thế, đúng tỷ lệ đốt ngón và hướng lòng bàn tay/chân | Vẽ tay, vẽ chân | ★★★ | 40 |
| 08.5 | Figure hoàn chỉnh — từ gesture đến hoàn thiện | Hoàn thành 1 figure đứng/ngồi: gesture 30s → dựng khối → thêm giải phẫu → hoàn thiện nét, trong 1 buổi | Quy trình figure đầy đủ | ★★★ | 45 |

**Kỹ năng đầu ra Module 08:** gesture nhanh, dựng figure từ khối, vẽ tay/chân đúng tỷ lệ.

### Module 09 — Composition & Visual Storytelling (Bố cục và kể chuyện bằng hình)

*Mục đích: sắp xếp hình ảnh để dẫn mắt người xem và kể một câu chuyện rõ ràng.*

| # | Bài học | Mục tiêu | Kỹ năng | Độ khó | Phút |
|---|---|---|---|---|---|
| 09.1 | Quy tắc 1/3 và điểm nhấn (focal point) | Bố cục được 1 bức vẽ với điểm nhấn đặt ở giao điểm 1/3; giải thích vì sao mắt người xem bị dẫn tới đó | Rule of thirds, focal point | ★★☆ | 25 |
| 09.2 | Đường dẫn mắt (leading lines) và khung hình | Dùng đường dẫn mắt (đường, sông, hàng rào) để dẫn mắt tới điểm nhấn; dùng khung tự nhiên (cửa sổ, cành cây) để đóng khung chủ thể | Leading lines, framing | ★★☆ | 30 |
| 09.3 | Cân bằng và nhịp điệu — đối xứng, bất đối xứng, lặp lại | Bố cục được 1 bức vẽ cân bằng bất đối xứng (asymmetrical balance) và có nhịp điệu lặp lại của 1 yếu tố hình học | Balance, rhythm | ★★★ | 30 |
| 09.4 | Kể chuyện bằng 1 khung hình — ai, ở đâu, đang làm gì | Vẽ được 1 khung hình trả lời được 3 câu hỏi (nhân vật là ai, ở đâu, đang làm gì) mà không cần chữ; người xem khác đọc được câu chuyện | Visual storytelling | ★★★ | 40 |
| 09.5 | Thumbnail và phân cảnh — 6 thumbnail cho 1 ý tưởng | Vẽ được 6 thumbnail bố cục khác nhau cho cùng 1 ý tưởng, chọn ra 1 thumbnail tốt nhất và giải thích lựa chọn | Thumbnailing, lựa chọn bố cục | ★★★ | 40 |

**Kỹ năng đầu ra Module 09:** bố cục có điểm nhấn, dẫn mắt, kể chuyện bằng hình.

### Module 10 — Advanced Drawing (Vẽ nâng cao — tổng hợp)

*Mục đích: tổng hợp mọi kỹ năng — vẽ từ trí tưởng tượng, phong cách cá nhân, và 1 dự án cuối khóa.*

| # | Bài học | Mục tiêu | Kỹ năng | Độ khó | Phút |
|---|---|---|---|---|---|
| 10.1 | Vẽ từ trí tưởng tượng — kết hợp khối đã học | Vẽ được 1 vật thể tưởng tượng (ví dụ: phương tiện bay) bằng cách kết hợp hộp/trụ/cầu đã học, có phối cảnh và bóng đổ nhất quán | Imaginative drawing | ★★★ | 40 |
| 10.2 | Môi trường tưởng tượng — từ thumbnail đến cảnh hoàn chỉnh | Vẽ được 1 môi trường tưởng tượng (thành phố, rừng, hang động) từ thumbnail → phối cảnh → ánh sáng → hoàn thiện | Environment design | ★★★ | 45 |
| 10.3 | Nhân vật tưởng tượng — thiết kế character đơn giản | Thiết kế được 1 nhân vật gốc: gesture → dựng khối → trang phục/đạo cụ → turnaround 2 góc (trước/sau hoặc trước/nghiêng) | Character design | ★★★ | 45 |
| 10.4 | Phong cách cá nhân — phân tích và chọn hướng đi | Phân tích được 3 họa sĩ mình thích (điểm chung về nét, màu, bố cục) và xác định 1 hướng phong cách cá nhân để luyện tiếp | Phân tích phong cách | ★★☆ | 30 |
| 10.5 | Dự án cuối khóa (Capstone) — 1 tác phẩm hoàn chỉnh | Hoàn thành 1 tác phẩm hoàn chỉnh (tự chọn chủ đề) áp dụng ít nhất 5 kỹ năng nền tảng; trình bày được quá trình (process) từ phác đến hoàn thiện | Capstone, portfolio | ★★★ | 90 |

**Kỹ năng đầu ra Module 10:** vẽ tưởng tượng, thiết kế nhân vật/môi trường, 1 tác phẩm capstone.

---

## 3. Track chuyên sâu (Specialisation — 4 track, 20 bài)

**Điều kiện vào track:** hoàn thành Module 00–06 (hoặc pass bài kiểm tra đầu vào tương đương — xem Mục 6). Track không thay thế nền tảng; học viên có thể học song song 1 track với module nền tảng từ Module 07 trở đi.

### Track P — Portrait (Chân dung)

| # | Bài học | Mục tiêu | Kỹ năng | Độ khó | Phút |
|---|---|---|---|---|---|
| P.1 | Tỷ lệ khuôn mặt — Loomis head cơ bản | Vẽ được đầu người đúng tỷ lệ Loomis (mắt ở giữa đầu, mũi ở 1/2 dưới, miệng ở 1/3 dưới); xác định được trục mặt | Loomis head, tỷ lệ mặt | ★★☆ | 30 |
| P.2 | Mắt, mũi, miệng — từng bộ phận | Vẽ được mắt/mũi/miệng riêng lẻ đúng cấu trúc (nhãn cầu trong hốc mắt, sống mũi, môi trên/dưới); ghép được vào khuôn mặt | Facial features | ★★☆ | 35 |
| P.3 | Góc mặt — 3/4, nghiêng, nhìn lên/xuống | Vẽ được khuôn mặt ở góc 3/4 và góc nghiêng, đúng vị trí bộ phận theo trục mặt xoay | Góc mặt, trục mặt | ★★★ | 35 |
| P.4 | Biểu cảm — 6 cảm xúc cơ bản | Vẽ được 6 biểu cảm (vui, buồn, giận, ngạc nhiên, sợ, khinh) bằng thay đổi lông mày/mắt/miệng, người xem nhận diện đúng ≥ 5/6 | Biểu cảm | ★★★ | 40 |
| P.5 | Chân dung hoàn chỉnh — từ ảnh tham chiếu | Hoàn thành 1 chân dung từ ảnh tham chiếu: dựng Loomis → bộ phận → sáng tối → hoàn thiện, giống mẫu ≥ mức "nhận ra được" theo rubric | Chân dung hoàn chỉnh | ★★★ | 60 |

### Track A — Anime & Manga

| # | Bài học | Mục tiêu | Kỹ năng | Độ khó | Phút |
|---|---|---|---|---|---|
| A.1 | Tỷ lệ mặt anime — mắt to, mặt nhỏ | Vẽ được mặt anime đúng tỷ lệ đặc trưng (mắt lớn, mũi tối giản, cằm nhọn) và phân biệt được với tỷ lệ thực | Tỷ lệ anime | ★★☆ | 30 |
| A.2 | Mắt anime — highlight, lông mi, cảm xúc | Vẽ được mắt anime với highlight, lông mi trên/dưới, thể hiện được 3 cảm xúc khác nhau chỉ bằng mắt | Mắt anime | ★★☆ | 30 |
| A.3 | Tóc anime — khối tóc và lọn tóc | Vẽ được khối tóc (hair mass) + lọn tóc (strands) theo hướng chuyển động; tóc không "dính" vào đầu | Tóc anime | ★★★ | 35 |
| A.4 | Dáng người anime — chibi và tỷ lệ chuẩn | Vẽ được figure anime tỷ lệ chuẩn (6–7 đầu) và chibi (2–3 đầu), đúng phong cách đã chọn | Figure anime, chibi | ★★★ | 35 |
| A.5 | Trang truyện 1 trang — panel, thoại, tốc độ | Vẽ được 1 trang manga 4 panel: bố cục panel, nhân vật nhất quán qua các panel, hiệu ứng tốc độ (speed lines) đúng chỗ | Manga page, panel | ★★★ | 60 |

### Track L — Landscape & Environment (Phong cảnh và môi trường)

| # | Bài học | Mục tiêu | Kỹ năng | Độ khó | Phút |
|---|---|---|---|---|---|
| L.1 | Phối cảnh khí quyển (atmospheric perspective) | Vẽ được phong cảnh 3 lớp (gần/trung/xa) với độ tương phản và độ bão hòa giảm dần theo khoảng cách | Atmospheric perspective | ★★☆ | 30 |
| L.2 | Cây và thực vật — khối tán và cành | Vẽ được 3 loại cây khác nhau bằng khối tán + cành có hướng; cây không trông như "kẹo bông gòn" | Vẽ cây | ★★☆ | 30 |
| L.3 | Nước và phản chiếu — sông, hồ, biển | Vẽ được mặt nước với phản chiếu đúng (đối xứng dọc, méo theo gợn sóng) và đường chân trời nước đúng | Nước, phản chiếu | ★★★ | 35 |
| L.4 | Kiến trúc trong cảnh — nhà, cầu, phố | Vẽ được 1 ngôi nhà/cây cầu đặt đúng phối cảnh trong cảnh thiên nhiên; kiến trúc và thiên nhiên hòa hợp tỷ lệ | Kiến trúc trong cảnh | ★★★ | 40 |
| L.5 | Phong cảnh hoàn chỉnh — từ ảnh tham chiếu | Hoàn thành 1 phong cảnh từ ảnh tham chiếu: thumbnail → phối cảnh → lớp không gian → ánh sáng → hoàn thiện | Phong cảnh hoàn chỉnh | ★★★ | 60 |

### Track D — Digital Painting

| # | Bài học | Mục tiêu | Kỹ năng | Độ khó | Phút |
|---|---|---|---|---|---|
| D.1 | Cọ số và áp lực bút — làm quen brush engine | Điều chỉnh được size/opacity/flow theo áp lực bút; vẽ được 1 dải chuyển tông mượt bằng cọ mềm và 1 nét sắc bằng cọ cứng | Brush control, pressure | ★★☆ | 25 |
| D.2 | Layer và blending mode — quy trình vẽ số | Tổ chức được bài vẽ thành ≥ 4 layer (sketch/line/flat/shadow) có tên rõ ràng; dùng được Multiply cho bóng và Screen/Overlay cho sáng | Layer, blending mode | ★★☆ | 30 |
| D.3 | Tô màu phẳng (flat color) và cell shading | Tô được nhân vật/vật thể bằng flat color sạch (không lem) + cell shading 2 tông; ranh giới sáng/tối sắc nét | Flat color, cell shading | ★★☆ | 35 |
| D.4 | Render mềm (soft rendering) — chuyển tông và chất liệu | Render được 1 vật thể (quả táo/kim loại/vải) bằng chuyển tông mềm, có highlight và reflected light; không dùng filter thay cho kỹ năng | Soft rendering | ★★★ | 40 |
| D.5 | Tranh số hoàn chỉnh — từ sketch đến xuất file | Hoàn thành 1 tranh số: sketch → line → flat → shading → hiệu ứng → xuất PNG; quy trình layer gọn, đặt tên rõ ràng | Quy trình digital painting | ★★★ | 60 |

---

## 4. Lộ trình học khuyến nghị (Learning Paths)

| Lộ trình | Thứ tự | Dành cho |
|---|---|---|
| **Path 1 — Người mới hoàn toàn** | 00 → 01 → 02 → 03 → 04 → 05 → 06 → 07 → 08 → 09 → 10 | Học viên chưa biết gì; đi hết nền tảng rồi mới chọn track |
| **Path 2 — Muốn vẽ người** | 00 → 01 → 02 → 03 → 05 → 08 → Track P hoặc Track A | Ưu tiên figure/chân dung; quay lại 04/06/07 khi cần |
| **Path 3 — Muốn vẽ cảnh** | 00 → 01 → 02 → 03 → 04 → 06 → 07 → Track L | Ưu tiên phối cảnh, ánh sáng, màu sắc |
| **Path 4 — Muốn vẽ số (digital)** | 00 → 01 → 02 → 03 → 06 → 07 → Track D | Ưu tiên kỹ năng nền + digital painting |
| **Path 5 — Ôn tập nhanh** | Diagnostic test → chỉ học module còn yếu → Capstone 10.5 | Người đã biết vẽ, cần lấp lỗ hổng |

**Quy tắc lộ trình:** Học viên được tự do học ngoài thứ tự (xem Mục 6.4 "Học tự do"), nhưng hệ thống luôn hiển thị lộ trình khuyến nghị và cảnh báo khi học viên bỏ qua tiên quyết.

---

## 5. Bảng đếm tổng (Lesson Count)

| Khối | Module / Track | Số bài | Tổng phút ước tính |
|---|---|---|---|
| Foundation | 00 Fundamentals | 5 | 95 |
| Foundation | 01 Line Control | 5 | 110 |
| Foundation | 02 Shapes & Proportion | 5 | 135 |
| Foundation | 03 Form Construction | 5 | 145 |
| Foundation | 04 Perspective | 5 | 170 |
| Foundation | 05 Observation Drawing | 5 | 185 |
| Foundation | 06 Light & Shadow | 5 | 165 |
| Foundation | 07 Materials & Color | 5 | 160 |
| Foundation | 08 Gesture & Anatomy | 5 | 175 |
| Foundation | 09 Composition & Visual Storytelling | 5 | 165 |
| Foundation | 10 Advanced Drawing | 5 | 250 |
| **Cộng Foundation** | **11 module** | **55** | **1.755 phút (~29,3 giờ)** |
| Specialisation | P — Portrait | 5 | 200 |
| Specialisation | A — Anime & Manga | 5 | 190 |
| Specialisation | L — Landscape & Environment | 5 | 195 |
| Specialisation | D — Digital Painting | 5 | 190 |
| **Cộng Specialisation** | **4 track** | **20** | **775 phút (~12,9 giờ)** |
| **TỔNG CỘNG** | **15 khối** | **75 bài** | **2.530 phút (~42,2 giờ)** |

> Thời lượng trên là thời gian luyện tập ước tính cho 1 lần làm bài. Học viên thường cần lặp lại bài tập 2–3 lần để đạt mastery (xem Mục 6.5), nên tổng thời gian thực tế để thành thạo toàn bộ chương trình sẽ cao hơn nhiều. Con số 42,2 giờ là **thời lượng nội dung**, không phải thời gian cam kết thành thạo.

---

## 6. Đồ thị phụ thuộc kỹ năng (Skill Dependency Graph)

### 6.1. Nguyên tắc

- Một kỹ năng chỉ được dạy khi các kỹ năng tiên quyết của nó đã được giới thiệu.
- Hệ thống gợi ý thứ tự học, nhưng không khóa cứng (xem 6.4).
- Mỗi bài học liệt kê `prerequisites` (mã bài học) trong dữ liệu — xem Lesson Contract (Mục 8).

### 6.2. Chuỗi phụ thuộc chính

```
00.2 Cầm bút
  └─> 01.1 Đường thẳng ─> 01.2 Đường cong ─> 01.3 Song song ─> 01.4 Line weight
        └─> 02.1 Hình phẳng ─> 02.2 Ellipse Control ─> 03.2 Cylinder
              │                                              └─> 03.4 Kết hợp khối (cốc, chai)
              │                                                   └─> 05.1 Still life
              └─> 02.3 Đo tỷ lệ ─> 02.4 Tỷ lệ figure ─> 08.2 Khung xương
                                                              └─> 08.3 Khối cơ thể ─> 08.5 Figure hoàn chỉnh
        └─> 03.1 Box ─> 04.1 1-point ─> 04.2 2-point ─> 04.3 3-point
              │              └─> 04.4 Ellipse trong phối cảnh ─> 04.5 Góc phòng thực
              └─> 03.3 Sphere/Cone ─> 06.1 5 values ─> 06.2 Cast shadow
                                                              └─> 06.4 Ánh sáng trong cảnh
        └─> 05.2 Negative space ─> 05.3 Sighting ─> 05.5 Still life hoàn chỉnh
        └─> 06.1 5 values ─> 07.1 Bánh xe màu ─> 07.2 Hòa sắc ─> 07.4 Màu ánh sáng/bóng
        └─> 09.1 Rule of thirds ─> 09.2 Leading lines ─> 09.4 Kể chuyện ─> 10.5 Capstone
```

### 6.3. Các chuỗi phụ thuộc tiêu biểu (ví dụ bắt buộc phải đúng thứ tự)

| Chuỗi | Lý do |
|---|---|
| Ellipse Control (02.2) → Cylinder (03.2) → Cylindrical Objects (03.4, 05.1) | Không vẽ được ellipse thì không dựng được trụ; không dựng được trụ thì không vẽ được cốc/chai |
| Box (03.1) → 1-point (04.1) → 2-point (04.2) → 3-point (04.3) | Mỗi cấp phối cảnh dựa trên hiểu biết về hộp ở cấp trước |
| 5 Values (06.1) → Cast Shadow (06.2) → Light Consistency (06.4) | Phải hiểu giá trị sáng tối trên 1 vật trước khi xử lý bóng đổ và ánh sáng toàn cảnh |
| Gesture (08.1) → Skeleton (08.2) → Body Blocks (08.3) → Full Figure (08.5) | Figure hoàn chỉnh cần cả chuyển động, cấu trúc xương và khối cơ thể |
| Line Control (01.x) → mọi module sau | Mọi bài học đều giả định học viên đã có đường nét cơ bản |
| Loomis Head (P.1) → Facial Features (P.2) → Angles (P.3) → Portrait (P.5) | Chân dung hoàn chỉnh cần tỷ lệ đầu, bộ phận, và góc mặt |

### 6.4. Học tự do + cảnh báo (Free Learning + Warnings)

- Học viên **được phép** mở bất kỳ bài học nào, kể cả khi chưa hoàn thành tiên quyết.
- Khi mở bài học mà chưa hoàn thành tiên quyết, hệ thống hiển thị cảnh báo: *"Bài này cần kỹ năng X (Bài 02.2). Bạn có thể học ngay, nhưng có thể gặp khó ở phần Y. Bạn có muốn xem lại Bài 02.2 trước không?"* — với 2 nút: [Xem lại tiên quyết] / [Học tiếp].
- Cảnh báo là gợi ý, không phải rào chắn. Không khóa bài học.
- Hệ thống ghi lại việc học viên bỏ qua cảnh báo để phân tích sau (học viên bỏ qua tiên quyết có tỷ lệ hoàn thành thấp hơn không?) — phân tích này chưa được triển khai, chỉ là kế hoạch.

### 6.5. Mastery — thành thạo cần nhiều bằng chứng

- **Không có "đậu/rớt" tuyệt đối cho 1 bài nộp.** Mỗi bài nộp được chấm theo rubric (xem `AI_ASSESSMENT.md`), cho ra điểm từng tiêu chí + phản hồi.
- **Mastery của 1 kỹ năng = nhiều bằng chứng (multiple evidence):** học viên được coi là "thành thạo" một kỹ năng khi có ít nhất **3 bài nộp đạt ngưỡng** (threshold theo rubric, xem `AI_EVALUATION_PLAN.md`) ở **2 bài học khác nhau** trở lên sử dụng kỹ năng đó, hoặc 1 bài nộp đạt ngưỡng cao + 1 bài áp dụng trong ngữ cảnh khác (ví dụ: ellipse đạt trong bài 02.2 và áp dụng đúng trong bài 03.2).
- Ngưỡng mastery cụ thể cho từng kỹ năng **chưa được chốt** — cần expert review (xem Mục 0).
- Tiến độ hiển thị theo 4 mức: `Chưa bắt đầu` → `Đang luyện` → `Đạt` → `Thành thạo (Mastered)`.

---

## 7. Quyết định sư phạm (Pedagogy Decisions)

### 7.1. Ba chế độ luyện tập

| Chế độ | Mô tả | Khi dùng |
|---|---|---|
| **Guided (Có hướng dẫn)** | Từng bước có chỉ dẫn, có video/hình mẫu, có gợi ý theo thời gian thực | Bài học mới, kỹ năng mới |
| **Assisted (Có hỗ trợ)** | Học viên tự vẽ, AI gợi ý khi phát hiện lỗi rõ ràng, có thể bật/tắt gợi ý | Luyện tập sau khi đã hiểu lý thuyết |
| **Independent (Tự lập)** | Không gợi ý trong lúc vẽ; chỉ chấm và phản hồi sau khi nộp | Kiểm tra, ôn tập, bài tập cuối module |

Mặc định: bài đầu tiên của mỗi kỹ năng mới là Guided; bài lặp lại chuyển dần sang Assisted rồi Independent. Học viên có thể tự đổi chế độ bất kỳ lúc nào.

### 7.2. Không có điểm số duy nhất (No Single Score)

- Mỗi bài nộp có **điểm theo từng tiêu chí rubric** (ví dụ: 1-point perspective — edge convergence 35%, form 25%, proportion 20%, line clarity 10%, completion 10%; xem `AI_ASSESSMENT.md`).
- **Không cộng thành 1 con số duy nhất** để xếp hạng học viên. Lý do: 1 con số che giấu điểm mạnh/yếu cụ thể; học viên cần biết mình yếu ở tiêu chí nào để luyện tiếp.
- Hệ thống hiển thị: điểm từng tiêu chí + nhận xét từng tiêu chí + 1–3 hành động cải thiện cụ thể ("next step").
- Có thể hiển thị "mức tổng thể" dạng định tính (Đang hình thành / Đạt / Tốt / Xuất sắc) dựa trên rubric, nhưng không dùng làm xếp hạng công khai.

### 7.3. Rubric kỹ thuật vs rubric sáng tạo (Technical vs Creative Rubrics)

| Loại | Áp dụng | Đặc điểm |
|---|---|---|
| **Technical rubric** | Bài tập kỹ thuật (đường thẳng, ellipse, phối cảnh, tỷ lệ, bóng đổ) | Tiêu chí đo được bằng hình học/CV (độ lệch, góc hội tụ, tỷ lệ); chấm khách quan, có thể tự động |
| **Creative rubric** | Bài tập sáng tạo (kể chuyện, bố cục, phong cách, capstone) | Tiêu chí định tính (rõ ràng câu chuyện, điểm nhấn, tính gốc); AI đưa ra nhận xét + gợi ý, không chấm điểm tuyệt đối; cần human review để xác nhận |

- Một bài học có thể dùng cả 2 loại rubric cho các tiêu chí khác nhau (ví dụ: Capstone 10.5 — kỹ thuật: phối cảnh + bóng đổ; sáng tạo: câu chuyện + bố cục).
- Rubric sáng tạo **không bao giờ** cho điểm số tuyệt đối thay cho đánh giá con người; AI chỉ hỗ trợ gợi ý.

### 7.4. Học tự do (Free Learning)

- Xem 6.4. Học viên tự chọn thứ tự, tốc độ, track.
- Hệ thống gợi ý, không ép buộc. Không khóa bài học sau bài chưa hoàn thành.

### 7.5. Phản hồi phải hành động được (Actionable Feedback)

- Mọi phản hồi AI phải kết thúc bằng **1–3 hành động cụ thể** học viên có thể làm ngay ("Vẽ lại 5 ellipse với trục ngang dài gấp đôi trục dọc", "Đặt điểm tụ xa hơn 2 lần chiều rộng tranh").
- Không đưa phản hồi chung chung ("Cố gắng hơn nhé", "Bài này chưa tốt").
- Phản hồi kèm **annotation trực tiếp trên bài vẽ** (xem `AI_ASSESSMENT.md` — Mode A/B/C).

---

## 8. Lesson Contract — Hợp đồng bài học (18 mục)

**Mọi bài học khi được viết nội dung đầy đủ PHẢI có đủ 18 mục sau.** Hiện tại (24/11/2026) chưa có bài học nào có đủ 18 mục — đây là hợp đồng để các agent/tác giả nội dung tuân theo khi viết bài.

| # | Mục | Nội dung bắt buộc |
|---|---|---|
| 1 | `id` | Mã bài học duy nhất, ví dụ `01.2`, `P.3`, `D.5` |
| 2 | `title_vi` | Tiêu đề tiếng Việt |
| 3 | `title_en` | Tiêu đề tiếng Anh (để tra cứu, SEO) |
| 4 | `module` | Module/track chứa bài học |
| 5 | `objectives` | 2–4 mục tiêu, viết dưới dạng hành vi quan sát được ("Học viên vẽ được…", "Học viên giải thích được…") |
| 6 | `skills` | Danh sách kỹ năng (mã kỹ năng, khớp với dependency graph Mục 6) |
| 7 | `prerequisites` | Danh sách mã bài học tiên quyết (có thể rỗng cho Module 00) |
| 8 | `difficulty` | ★☆☆ / ★★☆ / ★★★ |
| 9 | `estimated_minutes` | Thời lượng luyện tập ước tính (phút) |
| 10 | `theory` | Lý thuyết ngắn gọn (≤ 500 từ tiếng Việt), viết lại bằng lời của tác giả, có hình minh họa gốc |
| 11 | `demo` | Hình/video demo gốc (do team tự vẽ/quay), không dùng hình có bản quyền |
| 12 | `guided_steps` | Các bước luyện tập có hướng dẫn (Guided mode), mỗi bước có mục tiêu nhỏ và tiêu chí kiểm tra |
| 13 | `practice_exercises` | 2–4 bài tập luyện (Assisted/Independent), mỗi bài có yêu cầu rõ ràng và tiêu chí hoàn thành |
| 14 | `exercise_type` | Loại bài tập để AI chấm (line / shapes / proportion / form / perspective / light-shadow / anatomy-gesture / colour / composition-creative — xem `AI_ASSESSMENT.md`) |
| 15 | `rubric` | Rubric chấm: tiêu chí + trọng số + mô tả từng mức (theo schema trong `AI_ASSESSMENT.md`) |
| 16 | `common_mistakes` | 3–5 lỗi thường gặp + cách sửa, có hình minh họa lỗi (do team tự vẽ) |
| 17 | `next_steps` | Gợi ý bài học tiếp theo + bài tập lặp lại để đạt mastery |
| 18 | `sources` | Nguồn tham khảo đã dùng khi viết bài (chỉ trích dẫn, không sao chép — xem Mục 9) |

---

## 9. Nguồn tham khảo (Sources — chỉ trích dẫn, không sao chép)

> **Lưu ý quan trọng:** Các nguồn dưới đây được liệt kê làm **tài liệu tham khảo về phương pháp sư phạm và cấu trúc chương trình**. Nội dung trong tài liệu này là **tóm tắt và diễn giải gốc** bằng lời của tác giả, **không sao chép** văn bản, hình ảnh hay bài tập có bản quyền từ các nguồn này. Việc nghiên cứu đầy đủ từng nguồn và đối chiếu chi tiết vẫn đang **chờ xác minh (pending)** — danh sách này là điểm khởi đầu, chưa phải là xác nhận đã nghiên cứu xong.

| Nguồn | Dùng để tham khảo về | Ghi chú |
|---|---|---|
| Drawabox (drawabox.com) | Cấu trúc bài tập nền tảng: đường thẳng, ellipse, hộp, phối cảnh; phương pháp luyện tập có kỷ luật | Chỉ tham khảo cấu trúc; không sao chép bài tập hay văn bản |
| Proko (proko.com) | Phương pháp dạy figure, giải phẫu, chân dung (Loomis, gesture) | Chỉ tham khảo phương pháp; không sao chép video/bài giảng |
| New Masters Academy — NMA | Lộ trình học vẽ cổ điển có hệ thống | Chỉ tham khảo lộ trình; không sao chép giáo trình |
| Ctrl+Paint (ctrlpaint.com) | Phương pháp dạy digital painting cho người mới | Chỉ tham khảo phương pháp; không sao chép bài giảng |
| Line of Action (line-of-action.com) | Bài tập gesture timed (30 giây, 1 phút) | Chỉ tham khảo hình thức bài tập timed; không sao chép nội dung |
| Betty Edwards — *Drawing on the Right Side of the Brain* | Tư duy quan sát, negative space, vẽ theo não phải | Sách tham khảo về tư duy; không sao chép bài tập |
| Andrew Loomis — *Figure Drawing for All It's Worth*, *Drawing the Head and Hands* | Tỷ lệ figure, Loomis head | Sách đã vào public domain ở một số khu vực pháp lý — vẫn chỉ tham khảo phương pháp, không sao chép hình minh họa |
| Scott Robertson — *How to Draw* | Dựng khối, phối cảnh, vẽ tưởng tượng | Chỉ tham khảo phương pháp |
| James Gurney — *Color and Light* | Màu sắc, ánh sáng | Chỉ tham khảo lý thuyết màu/ánh sáng |
| Wikipedia / Openverse (CC-licensed) | Đọc tham khảo, hình ảnh tham chiếu có giấy phép CC | Chỉ dùng nội dung có giấy phép phù hợp; ghi rõ giấy phép khi dùng |

**Quy tắc sử dụng nguồn (bắt buộc cho mọi tác giả nội dung):**

1. Không sao chép văn bản, hình ảnh, bài tập nguyên văn từ bất kỳ nguồn có bản quyền nào.
2. Mọi hình minh họa trong bài học phải là hình gốc do team tự vẽ, hoặc hình có giấy phép CC0/CC-BY (ghi rõ nguồn và giấy phép).
3. Khi tham khảo phương pháp của 1 nguồn, ghi rõ nguồn trong mục `sources` của Lesson Contract (mục 18), và diễn giải lại bằng lời của mình.
4. Nếu không chắc chắn về bản quyền của 1 tài liệu, không dùng — hỏi lại trước khi đưa vào bài học.

---

## 10. Tài liệu liên quan

| Tài liệu | Nội dung |
|---|---|
| `DESIGN_SYSTEM.md` | Hệ thống thiết kế giao diện |
| `ART_DIRECTION.md` | Định hướng mỹ thuật và thương hiệu |
| `DRAWING_ENGINE.md` | Đặc tả canvas engine |
| `AI_ASSESSMENT.md` | Pipeline chấm bài bằng AI + fallback chain |
| `AI_EVALUATION_PLAN.md` | Kế hoạch đánh giá (trước khi có kết quả) |
| `USER_GUIDE.md` | Hướng dẫn sử dụng cho học viên |
| `ADMIN_GUIDE.md` | Hướng dẫn quản trị |

---

*Hết CURRICULUM.md — v0.1, 24/11/2026. Cấu trúc đã định nghĩa; nội dung bài học chưa viết; expert review chưa thực hiện.*
