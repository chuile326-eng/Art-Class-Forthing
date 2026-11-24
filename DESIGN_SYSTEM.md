# DESIGN_SYSTEM.md — Hệ thống thiết kế DrawPath AI

> **Tên sản phẩm:** DrawPath AI (tên tạm thời)
> **Phiên bản tài liệu:** 0.1 — ngày 24/11/2026
> **Ngôn ngữ tài liệu:** Tiếng Việt (thuật ngữ chuyên môn giữ nguyên tiếng Anh khi cần).
> **Trạng thái:** Tài liệu đặc tả thiết kế. Chưa có giao diện nào được triển khai xong và kiểm chứng theo hệ thống này; mọi token và component dưới đây là **đặc tả mục tiêu**, chưa phải là mô tả của sản phẩm đã hoàn thành. Tại thời điểm viết, thư mục `frontend/` đã được quan sát là tồn tại nhưng nội dung không thuộc phạm vi nhiệm vụ này nên không được kiểm tra hay khẳng định gì về mức độ tuân thủ design system.

Tài liệu này định nghĩa **design tokens** (màu, chữ, khoảng cách, bo góc, bóng, breakpoint) và **components** dùng chung cho toàn bộ sản phẩm DrawPath AI — gồm 3 trải nghiệm: marketing (trang giới thiệu), learning (học bài, lộ trình) và drawing (canvas vẽ). Xem thêm `ART_DIRECTION.md` để hiểu lý do mỹ thuật đằng sau các lựa chọn này.

---

## 1. Nguyên tắc thiết kế (Design Principles)

1. **Giấy trước, màn hình sau.** Giao diện phải có cảm giác như một cuốn sketchbook / xưởng vẽ, không phải một dashboard doanh nghiệp.
2. **Nội dung là nhân vật chính.** Bài vẽ của học viên và bài học phải chiếm diện tích lớn nhất; chrome (thanh công cụ, menu) gọn, lùi về sau.
3. **Ấm áp nhưng không rối.** Màu giấy ấm + 1 màu nhấn terracotta; không dùng nhiều màu bão hòa cùng lúc.
4. **Một hành động chính mỗi màn hình.** Mỗi màn hình có 1 CTA chính duy nhất, rõ ràng.
5. **Tiếng Việt là ngôn ngữ chính.** Mọi nhãn giao diện viết bằng tiếng Việt trước; thuật ngữ tiếng Anh (nếu có) đặt trong ngoặc hoặc tooltip.

---

## 2. Design Tokens

### 2.1. Màu sắc (Colors)

#### 2.1.1. Bảng màu thương hiệu (Brand palette)

| Token | Hex | Vai trò | Ghi chú |
|---|---|---|---|
| `--paper` / Warm Paper | `#F7F3EA` | Nền chính của app (learning, marketing) | Màu giấy ấm — nền mặc định cho hầu hết màn hình |
| `--ivory` / Natural Ivory | `#FFFCF7` | Nền card, nền panel nổi trên giấy | Sáng hơn paper một chút để tạo lớp |
| `--graphite` / Graphite | `#242424` | Màu chữ chính, nét vẽ mặc định | Gần đen nhưng mềm hơn đen tuyệt đối |
| `--charcoal` / Charcoal | `#41403E` | Màu chữ phụ, icon, border đậm | Dùng cho text secondary, icon |
| `--terracotta` / Terracotta | `#D56B46` | Màu nhấn chính (primary accent): CTA, link, trạng thái active | Chỉ dùng cho điểm nhấn — không phủ kín màn hình |
| `--coral` / Coral | `#EF8B73` | Màu nhấn phụ: hover của terracotta, highlight nhẹ, badge | Nhạt/mềm hơn terracotta |
| `--sage` / Sage | `#8C9B85` | Màu thành công (success), tiến độ hoàn thành, trạng thái "đạt" | Xanh lá xám, trầm, hợp bảng giấy |
| `--lavender` / Lavender | `#A59ACB` | Màu thông tin (info), track chuyên sâu, trạng thái "đang học" | Tím xám, trầm |

#### 2.1.2. Màu ngữ nghĩa (Semantic colors)

| Token | Hex | Vai trò |
|---|---|---|
| `--success` | `#8C9B85` (Sage) | Thành công, hoàn thành, đạt |
| `--info` | `#A59ACB` (Lavender) | Thông tin, đang học, gợi ý |
| `--warning` | `#C99A3C` (Ochre — bổ sung, trầm) | Cảnh báo (bỏ qua tiên quyết, bài chưa đủ bằng chứng mastery) |
| `--error` | `#B4452F` (Terracotta đậm — bổ sung) | Lỗi, bài nộp không hợp lệ, thao tác thất bại |
| `--accent` | `#D56B46` (Terracotta) | CTA chính, link, active |
| `--accent-hover` | `#C25A38` (Terracotta đậm hơn 1 nấc) | Hover/focus của CTA chính |
| `--accent-soft` | `#F6E3DB` (Terracotta rất nhạt trên nền giấy) | Nền highlight nhẹ cho vùng active/selected |

> Lưu ý: `--warning` và `--error` là màu bổ sung ngoài 8 màu thương hiệu gốc, được chọn cùng tông trầm để không phá vỡ bảng màu. Cần kiểm tra độ tương phản trước khi dùng cho chữ (xem Mục 6).

#### 2.1.3. Màu trung tính (Neutrals — dẫn xuất từ Graphite/Charcoal trên nền giấy)

| Token | Hex | Vai trò |
|---|---|---|
| `--text-primary` | `#242424` | Chữ chính |
| `--text-secondary` | `#41403E` | Chữ phụ |
| `--text-muted` | `#6E6C68` | Chữ mờ (caption, placeholder, metadata) |
| `--border` | `#DDD5C2` | Border nhẹ trên nền giấy |
| `--border-strong` | `#B9AE94` | Border đậm (input focus, divider quan trọng) |
| `--surface` | `#FFFCF7` | Nền card/panel |
| `--surface-muted` | `#EFE9DB` | Nền vùng phụ (sidebar, toolbar nền) |
| `--overlay` | `rgba(36, 36, 36, 0.5)` | Lớp phủ modal/drawer |

#### 2.1.4. Quy tắc dùng màu

- **Nền:** luôn bắt đầu từ Warm Paper `#F7F3EA`; card dùng Natural Ivory `#FFFCF7`.
- **CTA chính:** Terracotta `#D56B46`, chữ trắng `#FFFCF7`. Không dùng quá 1 CTA terracotta lớn trên 1 màn hình.
- **Không dùng** màu neon, gradient cầu vồng, hoặc nhiều màu bão hòa cùng lúc (xem `ART_DIRECTION.md` — mục "What NOT to do").
- **Màu vẽ trên canvas:** bảng màu vẽ mặc định gồm Graphite, Terracotta, Sage, Lavender + bảng chọn màu đầy đủ; màu giao diện không giới hạn màu vẽ của học viên.

### 2.2. Typography (Chữ)

#### 2.2.1. Font chữ

| Vai trò | Font | Lý do chọn | Fallback |
|---|---|---|---|
| **Body / UI chính** | **Be Vietnam Pro** | Hỗ trợ đầy đủ tiếng Việt (dấu tiếng Việt đẹp, không lỗi font), hiện đại, dễ đọc; là font Việt-first phù hợp với sản phẩm tiếng Việt | `Inter, system-ui, -apple-system, "Segoe UI", sans-serif` |
| **Body dự phòng / số liệu** | **Inter** | Hỗ trợ tiếng Việt tốt, tabular numbers đẹp cho số liệu/tiến độ | `system-ui, sans-serif` |
| **Display / Tiêu đề lớn** | **Be Vietnam Pro** (weight 700–800) | Dùng cùng họ với body để thống nhất; tiêu đề lớn dùng weight đậm + tracking chặt | — |
| **Chữ viết tay / chú thích vẽ** | *Chưa chọn* — cần 1 font handwriting hỗ trợ tiếng Việt hoặc dùng chữ viết tay thật (scan) | Chỉ dùng cho chi tiết trang trí nhỏ (ghi chú trên sketchbook, annotation mẫu); không dùng cho nội dung chính | — |

**Quy tắc font:**

- Không dùng quá 2 họ font trong sản phẩm (Be Vietnam Pro + Inter).
- Mọi font phải hỗ trợ tiếng Việt đầy đủ (kiểm tra dấu: ơ, ư, đ, à, ả, ã, ạ, ấ, ầ, ậ, ễ, ộ, ữ, ự…). Trước khi chốt font, kiểm tra render với đoạn văn tiếng Việt mẫu có đầy đủ dấu.
- Font load từ Google Fonts (hoặc self-host); có fallback system-ui để không vỡ layout khi font chưa tải xong.

#### 2.2.2. Type scale

| Token | Size / Line-height | Weight | Dùng cho |
|---|---|---|---|
| `--text-display` | 40px / 48px (2.5rem / 3rem) | 800 | Tiêu đề hero (marketing), tiêu đề capstone |
| `--text-h1` | 32px / 40px (2rem / 2.5rem) | 700 | Tiêu đề trang chính |
| `--text-h2` | 24px / 32px (1.5rem / 2rem) | 700 | Tiêu đề section, tiêu đề bài học |
| `--text-h3` | 20px / 28px (1.25rem / 1.75rem) | 600 | Tiêu đề card, tiêu đề con |
| `--text-body-lg` | 18px / 28px (1.125rem / 1.75rem) | 400 | Đoạn mở đầu, nội dung bài học |
| `--text-body` | 16px / 26px (1rem / 1.625rem) | 400 | Nội dung chính, đoạn văn |
| `--text-body-sm` | 14px / 22px (0.875rem / 1.375rem) | 400 | Chú thích, mô tả phụ, nhãn form |
| `--text-caption` | 12px / 18px (0.75rem / 1.125rem) | 400–500 | Metadata, timestamp, caption hình |
| `--text-button` | 15px / 24px | 600 | Nhãn nút |
| `--text-label` | 13px / 20px | 600 | Nhãn field, nhãn nhỏ (uppercase, letter-spacing 0.04em khi cần) |

**Quy tắc:**

- Line-height tối thiểu 1.5 cho body text (dễ đọc tiếng Việt có dấu).
- Không dùng chữ nhỏ hơn 12px cho nội dung có ý nghĩa (chỉ dùng cho metadata thực sự phụ).
- Tiêu đề không viết hoa toàn bộ (trừ nhãn ngắn ≤ 3 từ, có tracking).

### 2.3. Spacing (Khoảng cách)

Dùng thang spacing theo bội số của **4px**:

| Token | Giá trị | Dùng cho |
|---|---|---|
| `--space-1` | 4px | Khoảng cách nhỏ nhất (icon–text) |
| `--space-2` | 8px | Khoảng cách trong component |
| `--space-3` | 12px | Padding nhỏ, gap giữa các item liên quan |
| `--space-4` | 16px | Padding card, gap mặc định |
| `--space-5` | 20px | Gap giữa các block |
| `--space-6` | 24px | Padding section nhỏ |
| `--space-8` | 32px | Gap giữa các section |
| `--space-10` | 40px | Padding section lớn |
| `--space-12` | 48px | Khoảng cách section lớn (marketing) |
| `--space-16` | 64px | Khoảng cách hero / phân đoạn lớn |

**Quy tắc:** Không dùng giá trị spacing lẻ ngoài thang này, trừ khi có lý do đặc biệt và ghi chú lại.

### 2.4. Radii (Bo góc)

| Token | Giá trị | Dùng cho |
|---|---|---|
| `--radius-sm` | 6px | Badge, chip, input nhỏ |
| `--radius-md` | 10px | Button, input, card nhỏ |
| `--radius-lg` | 16px | Card lớn, modal, panel |
| `--radius-xl` | 24px | Hero card, khung hình lớn |
| `--radius-full` | 9999px | Avatar, nút tròn, toggle |

**Quy tắc:** Bo góc mềm, thân thiện — không dùng góc vuông 0px cho card/button (trừ canvas vẽ và đường kẻ trang trí kiểu sketch, xem `ART_DIRECTION.md`).

### 2.5. Shadows (Bóng đổ)

| Token | Giá trị | Dùng cho |
|---|---|---|
| `--shadow-sm` | `0 1px 2px rgba(36,36,36,0.06)` | Card nghỉ, chip |
| `--shadow-md` | `0 4px 12px rgba(36,36,36,0.08)` | Card nổi, dropdown |
| `--shadow-lg` | `0 12px 32px rgba(36,36,36,0.12)` | Modal, popover |
| `--shadow-none` | `none` | Nền giấy phẳng, vùng sketch |

**Quy tắc:** Bóng nhẹ, ấm (dùng màu graphite với opacity thấp, không dùng bóng đen đậm). Không dùng bóng màu neon. Canvas vẽ không có bóng đổ — nền canvas là giấy trắng/kem phẳng.

### 2.6. Breakpoints (Điểm ngắt responsive)

| Token | Width | Thiết bị / layout |
|---|---|---|
| `--bp-mobile` | **375px** | Điện thoại — 1 cột, toolbar canvas thu gọn, menu hamburger |
| `--bp-tablet` | **768px** | Tablet — 2 cột cho lưới bài học, sidebar thu gọn thành drawer |
| `--bp-desktop` | **1280px** | Desktop — layout đầy đủ: sidebar + nội dung + panel phụ |
| `--bp-wide` | **1440px** | Màn hình rộng — nội dung giới hạn max-width 1280px, căn giữa |

**Quy tắc:**

- Thiết kế mobile-first: bắt đầu từ 375px rồi mở rộng lên.
- Canvas vẽ: trên mobile chiếm toàn bộ chiều rộng, toolbar chuyển xuống dưới dạng thanh cuộn ngang; trên desktop toolbar ở bên trái/dưới, canvas ở giữa.
- Không dùng breakpoint khác ngoài 4 breakpoint trên, trừ khi có lý do đặc biệt.

### 2.7. Z-index (Thứ tự lớp — tham khảo)

| Lớp | Giá trị | Dùng cho |
|---|---|---|
| Nội dung thường | 0–10 | — |
| Sticky header / toolbar | 20 | Header, toolbar canvas |
| Dropdown / popover | 30 | Menu, tooltip |
| Drawer / sidebar mobile | 40 | Drawer |
| Modal | 50 | Modal, dialog |
| Toast / thông báo | 60 | Toast |

---

## 3. Components

Mọi component dưới đây là **đặc tả** — chưa được triển khai hay kiểm chứng. Mỗi component ghi rõ: mục đích, biến thể, trạng thái, và quy tắc dùng.

### 3.1. Button (Nút bấm)

| Biến thể | Style | Dùng cho |
|---|---|---|
| **Primary** | Nền Terracotta `#D56B46`, chữ `#FFFCF7`, bo `--radius-md`, padding 10px 20px | CTA chính (Bắt đầu học, Nộp bài, Lưu) — tối đa 1 nút primary lớn / màn hình |
| **Secondary** | Nền Natural Ivory, border `--border-strong`, chữ Graphite | Hành động phụ (Xem lại, Hủy, Quay lại) |
| **Ghost / Text** | Không nền, không border, chữ Terracotta | Link hành động trong đoạn văn, nút phụ ít quan trọng |
| **Danger** | Nền `--error` `#B4452F`, chữ trắng | Xóa bài, xóa tài khoản (luôn kèm xác nhận) |
| **Icon button** | Vuông 40×40px (mobile 44×44px), icon 20px, bo `--radius-md` | Công cụ canvas, đóng/mở panel |

**Trạng thái (States):**

| Trạng thái | Biểu hiện |
|---|---|
| Default | Như biến thể |
| Hover | Primary → `--accent-hover` `#C25A38`; Secondary → nền `--surface-muted` |
| Focus | Viền focus 2px Terracotta + outline offset 2px (xem Mục 6 — Accessibility) |
| Active / Pressed | Nền đậm hơn 1 nấc, scale 0.98 (nhẹ) |
| Disabled | Opacity 0.5, cursor not-allowed, không nhận sự kiện |
| Loading | Hiển thị spinner + chữ "Đang xử lý…", disabled trong lúc loading |

**Kích thước:** Small (padding 6px 12px, text 13px), Medium (10px 20px, text 15px — mặc định), Large (14px 28px, text 16px — dùng cho hero CTA).

### 3.2. Card

| Biến thể | Style | Dùng cho |
|---|---|---|
| **Default card** | Nền `--surface` `#FFFCF7`, border `--border`, bo `--radius-lg`, padding 20px, shadow `--shadow-sm` | Card nội dung chung |
| **Lesson card** | Như default + ảnh thumbnail (tỷ lệ 16:9), tiêu đề, mô tả 2 dòng, metadata (thời lượng, độ khó), thanh tiến độ nhỏ | Lưới bài học, lộ trình |
| **Elevated card** | Như default + shadow `--shadow-md`, không border | Card nổi bật (gợi ý tiếp theo, thành tựu) |

**Trạng thái:** Default / Hover (shadow tăng 1 nấc, translateY -2px nhẹ) / Selected (border Terracotta 2px + nền `--accent-soft`) / Disabled (opacity 0.6).

### 3.3. Input (Ô nhập liệu)

- **Text input / Textarea:** Nền trắng `#FFFFFF` hoặc Ivory, border `--border-strong`, bo `--radius-md`, padding 10px 14px, text 15px. Focus: border Terracotta + outline 2px `--accent-soft` (hoặc box-shadow 0 0 0 3px rgba(213,107,70,0.2)).
- **Select / Dropdown:** Như text input + icon mũi tên; menu dropdown nền Ivory, shadow `--shadow-md`, bo `--radius-md`.
- **Nhãn (Label):** `--text-label` 13px, weight 600, đặt trên input; trường bắt buộc có dấu `*` màu Terracotta.
- **Lỗi:** Border `--error`,ข้อความ lỗi 13px màu `--error` dưới input, có icon cảnh báo.
- **Gợi ý (Hint):** Text 13px màu `--text-muted` dưới input.

### 3.4. Modal (Hộp thoại)

- Nền Ivory, bo `--radius-lg`, shadow `--shadow-lg`, padding 24px, max-width 560px (mobile: full-width với margin 16px).
- Header: tiêu đề H3 + nút đóng (icon button) ở góc phải.
- Footer: nút Primary bên phải, nút Secondary bên trái (hoặc chỉ 1 nút).
- Lớp phủ: `--overlay` rgba(36,36,36,0.5); bấm ra ngoài để đóng (trừ modal xác nhận xóa — phải bấm nút).
- Focus trap: khi modal mở, focus ở trong modal; bấm Esc để đóng.

### 3.5. Badge / Chip

| Biến thể | Style | Dùng cho |
|---|---|---|
| **Status — Đạt** | Nền Sage nhạt `#E4E9E0`, chữ `#4A5A44` | Trạng thái hoàn thành |
| **Status — Đang học** | Nền Lavender nhạt `#E8E5F3`, chữ `#5A5480` | Đang học |
| **Status — Chưa bắt đầu** | Nền `--surface-muted`, chữ `--text-muted` | Chưa bắt đầu |
| **Difficulty** | Nền Ivory, border `--border`, chữ Charcoal | ★☆☆ / ★★☆ / ★★★ |
| **Tag** | Nền `--accent-soft`, chữ Terracotta đậm | Tag chủ đề, track |

Bo `--radius-full`, padding 4px 10px, text 12px weight 600.

### 3.6. Progress (Tiến độ)

- **Progress bar:** Chiều cao 8px, nền `--surface-muted`, phần đầy màu Sage (hoàn thành) hoặc Terracotta (đang học); bo `--radius-full`.
- **Progress ring (vòng tròn):** Dùng cho tổng tiến độ module/track; đường kính 64–96px, nét 8px.
- **Mastery indicator:** 4 nấc (Chưa bắt đầu / Đang luyện / Đạt / Thành thạo) — hiển thị bằng 4 chấm hoặc thanh 4 đoạn, màu từ xám → Sage đậm.
- Luôn kèm nhãn chữ (ví dụ: "3/5 bài — 60%"), không chỉ hiển thị bằng màu (xem Mục 6).

### 3.7. Lesson Card (Thẻ bài học — component quan trọng nhất)

**Cấu trúc (từ trên xuống):**

1. Thumbnail 16:9 (hình minh họa gốc của bài học; nếu chưa có hình, dùng placeholder màu giấy + icon bút chì — không dùng hình stock có bản quyền).
2. Badge độ khó + badge trạng thái (góc trên thumbnail).
3. Tiêu đề bài học (H3, tối đa 2 dòng).
4. Mô tả ngắn (tối đa 2 dòng, `--text-body-sm`, màu `--text-secondary`).
5. Metadata: thời lượng (icon đồng hồ + "25 phút"), số bài tập, kỹ năng chính.
6. Thanh tiến độ nhỏ (nếu đã bắt đầu) + nút hành động ("Học ngay" / "Tiếp tục" / "Ôn lại").

**Trạng thái:** Chưa bắt đầu (nút "Học ngay") / Đang học (nút "Tiếp tục", hiện % tiến độ) / Đã đạt (badge Sage "Đạt", nút "Ôn lại") / Bị khóa — **không dùng trạng thái khóa** (học tự do — xem `CURRICULUM.md` Mục 6.4); thay vào đó hiển thị cảnh báo tiên quyết khi mở bài.

### 3.8. Toolbar (Thanh công cụ vẽ)

- **Vị trí:** Desktop — dọc bên trái canvas hoặc ngang dưới canvas; Mobile — ngang dưới canvas, cuộn được.
- **Nhóm công cụ:** (1) Bút chì / Cọ / Tẩy; (2) Màu + cỡ nét + opacity; (3) Undo / Redo / Xóa; (4) Zoom / Pan / Fit; (5) Layer / Reference / Guidelines; (6) Lưu / Xuất PNG.
- **Nút công cụ:** Icon button 40×40px (mobile 44×44px); công cụ đang chọn có nền `--accent-soft` + icon Terracotta + border Terracotta.
- **Nhóm cách nhau** bằng divider dọc 1px `--border`.
- Xem chi tiết trong `DRAWING_ENGINE.md`.

---

## 4. Layout (Bố cục)

### 4.1. Khung trang (Page frame)

- **Max-width nội dung:** 1280px, căn giữa; padding ngang 16px (mobile) / 24px (desktop).
- **Header:** Cao 64px, nền Ivory, border-bottom `--border`; gồm logo (trái), nav chính (giữa/trái), tìm kiếm + avatar/tài khoản (phải).
- **Sidebar (learning):** Rộng 280px (desktop), nền `--surface-muted` hoặc Ivory; chứa cây module/bài học; trên tablet/mobile thành drawer.
- **Footer:** Nền Graphite, chữ Ivory; chứa link, bản quyền, ngôn ngữ.

### 4.2. Lưới (Grid)

- Lưới 12 cột (desktop), gap 24px; tablet 8 cột, gap 16px; mobile 4 cột, gap 16px.
- Lưới bài học: 1 cột (mobile) / 2 cột (tablet) / 3 cột (desktop 1280) / 4 cột (wide 1440, nếu đủ chỗ).

---

## 5. Iconography (Biểu tượng)

- **Phong cách:** Line icon (nét mảnh 1.5–2px), bo tròn đầu nét, màu Charcoal; icon active màu Terracotta.
- **Kích thước:** 16px (inline nhỏ), 20px (mặc định), 24px (toolbar/lớn).
- **Nguồn:** Dùng bộ icon mã nguồn mở có giấy phép phù hợp (ví dụ: Lucide, Feather) — ghi rõ giấy phép; không dùng icon có bản quyền không rõ nguồn.
- **Không dùng emoji làm icon giao diện** (emoji chỉ xuất hiện trong nội dung do người dùng tạo, nếu có).

---

## 6. Accessibility (Khả năng tiếp cận)

### 6.1. Độ tương phản (Contrast — WCAG 2.1 AA)

| Cặp màu | Tỷ lệ tương phản (ước tính) | Đạt AA? |
|---|---|---|
| Graphite `#242424` trên Warm Paper `#F7F3EA` | ~14.5:1 | ✅ Đạt AAA |
| Charcoal `#41403E` trên Warm Paper | ~9.5:1 | ✅ Đạt AAA |
| Text-muted `#6E6C68` trên Warm Paper | ~5.0:1 | ✅ Đạt AA (chữ thường) |
| Trắng `#FFFCF7` trên Terracotta `#D56B46` | ~3.9:1 | ⚠️ Chỉ đạt AA cho chữ lớn (≥ 18px hoặc bold ≥ 14px); **chữ nhỏ trên nền Terracotta cần kiểm tra lại** — nút Primary dùng text 15px weight 600: cần đo thực tế và tăng độ đậm nền nếu cần (`--accent-hover` `#C25A38` cho chữ nhỏ) |
| Sage `#8C9B85` trên trắng | ~2.9:1 | ❌ Không dùng Sage làm màu chữ trên nền sáng — chỉ dùng làm nền/màu trang trí; chữ trên nền Sage nhạt dùng màu tối `#4A5A44` |

> **Lưu ý:** Các tỷ lệ trên là ước tính; **bắt buộc phải đo lại bằng công cụ đo tương phản** (ví dụ: WebAIM Contrast Checker) trước khi chốt. Không tuyên bố đạt WCAG khi chưa đo.

### 6.2. Quy tắc bắt buộc

1. **Focus visible:** Mọi phần tử tương tác (button, link, input) phải có trạng thái focus nhìn thấy rõ (outline 2px Terracotta + offset 2px). Không dùng `outline: none` mà không thay thế.
2. **Touch target:** Tối thiểu **44×44px** trên mobile (nút, icon button, link trong nav). Trên desktop tối thiểu 32×32px, khuyến nghị 40×40px.
3. **Không chỉ dùng màu để truyền đạt thông tin:** Trạng thái (đạt/chưa đạt/lỗi) luôn kèm icon + nhãn chữ, không chỉ đổi màu.
4. **Alt text:** Mọi hình minh họa có ý nghĩa đều có alt text tiếng Việt; hình trang trí thuần túy có `alt=""`.
5. **Heading đúng thứ tự:** H1 → H2 → H3, không nhảy cấp; mỗi trang chỉ có 1 H1.
6. **Form:** Mọi input có label liên kết (`<label for>`); lỗi có thông báo bằng chữ + `aria-invalid` + `aria-describedby`.
7. **Canvas vẽ:** Cung cấp giải pháp thay thế bằng bàn phím cho các thao tác chính (undo Ctrl+Z, redo Ctrl+Shift+Z / Ctrl+Y, lưu Ctrl+S); thông báo trạng thái lưu bằng text (không chỉ bằng icon).
8. **Giảm chuyển động:** Tôn trọng `prefers-reduced-motion` — tắt animation trang trí khi người dùng bật chế độ này (xem `ART_DIRECTION.md` — Motion).
9. **Ngôn ngữ:** Khai báo `lang="vi"` cho nội dung tiếng Việt; đoạn tiếng Anh (nếu có) khai báo `lang="en"`.

---

## 7. Do / Don't

### ✅ Do

- Dùng nền giấy ấm + card Ivory + 1 điểm nhấn Terracotta.
- Để nhiều khoảng trắng (whitespace) — giao diện "thở" như trang giấy.
- Dùng Be Vietnam Pro cho mọi chữ tiếng Việt.
- Giữ toolbar và chrome gọn, để bài vẽ chiếm diện tích lớn nhất.
- Kiểm tra tương phản bằng công cụ trước khi chốt màu chữ.

### ❌ Don't

- Không dùng gradient neon, gradient cầu vồng, glassmorphism dày đặc.
- Không dùng nền tối (dark mode) làm mặc định — sản phẩm là "giấy sáng"; dark mode (nếu có) là tính năng tương lai, chưa đặc tả.
- Không dùng quá 2 họ font.
- Không dùng chữ nhỏ hơn 12px cho nội dung có ý nghĩa.
- Không dùng màu Sage/Lavender làm màu chữ trên nền sáng (tương phản không đủ).
- Không làm dashboard kiểu doanh nghiệp (bảng số liệu dày đặc, nhiều widget) cho trang học — trang học phải giống sketchbook, không giống phần mềm quản trị.
- Không dùng hình stock có bản quyền làm thumbnail bài học.

---

## 8. Tài liệu liên quan

| Tài liệu | Nội dung |
|---|---|
| `ART_DIRECTION.md` | Định hướng mỹ thuật, phong cách minh họa, motion |
| `CURRICULUM.md` | Chương trình học, lesson contract |
| `DRAWING_ENGINE.md` | Đặc tả canvas engine |
| `USER_GUIDE.md` | Hướng dẫn sử dụng |

---

*Hết DESIGN_SYSTEM.md — v0.1, 24/11/2026. Đặc tả mục tiêu; chưa triển khai xong hay kiểm chứng.*
