# DRAWING_ENGINE.md — Đặc tả Canvas Engine DrawPath AI

> **Tên sản phẩm:** DrawPath AI (tên tạm thời)
> **Phiên bản tài liệu:** 0.1 — ngày 24/11/2026
> **Ngôn ngữ tài liệu:** Tiếng Việt (thuật ngữ chuyên môn giữ nguyên tiếng Anh khi cần).
> **Trạng thái:** NOT_STARTED — Tài liệu này là **đặc tả kỹ thuật mục tiêu**. Chưa có dòng code canvas engine nào được viết xong và kiểm chứng theo đặc tả này. Mọi tính năng dưới đây là **yêu cầu cần triển khai**, không phải mô tả của phần mềm đã hoàn thành. Tại thời điểm viết, thư mục `frontend/` đã được quan sát là tồn tại nhưng nội dung không thuộc phạm vi nhiệm vụ này nên không được kiểm tra hay khẳng định gì về mức độ triển khai.

---

## 1. Tổng quan

### 1.1. Mục đích

Canvas engine là trái tim của DrawPath AI: nơi học viên vẽ bài tập, nơi AI lấy dữ liệu nét vẽ (stroke data) để chấm bài, và nơi học viên xem lại quá trình vẽ của mình (stroke replay) để học từ lỗi sai.

### 1.2. Yêu cầu phi chức năng

| Yêu cầu | Mục tiêu |
|---|---|
| Độ trễ nét vẽ (input latency) | < 16ms (1 frame ở 60fps) từ khi pointer di chuyển đến khi nét xuất hiện — mục tiêu, chưa đo |
| Số nét tối đa xử lý mượt | 5.000 nét / 1 project (xem Acceptance Test 16–18) |
| Kích thước canvas logic | Không giới hạn cứng; mặc định 1920×1080 (tỷ lệ 16:9) hoặc theo khổ bài tập |
| Thiết bị hỗ trợ | Chuột, touch, bút stylus (xem Mục 8 — lưu ý: stylus CHƯA được kiểm tra vì không có thiết bị) |
| Trình duyệt mục tiêu | Chrome, Firefox, Safari, Edge — phiên bản hiện hành (chưa kiểm tra thực tế) |
| Công nghệ đề xuất | HTML5 Canvas 2D (ưu tiên) hoặc WebGL nếu cần hiệu năng; quyết định cuối cùng thuộc về team frontend |

### 1.3. Stack liên quan

- **Frontend:** Next.js / React / TypeScript / Tailwind CSS (xem `DESIGN_SYSTEM.md`).
- **Backend:** Python FastAPI, PostgreSQL (lưu stroke data, project, submission).
- Tài liệu này chỉ đặc tả **phía client (canvas engine)** và **định dạng dữ liệu trao đổi** với backend; API chi tiết thuộc về team backend.

---

## 2. Công cụ vẽ (Tools)

### 2.1. Danh sách công cụ

| # | Công cụ | Mô tả | Tham số |
|---|---|---|---|
| 1 | **Pencil (Bút chì)** | Nét chì: có texture hạt nhẹ, độ đậm theo áp lực; dùng cho phác thảo, dựng hình | Màu, cỡ, opacity, áp lực |
| 2 | **Brush (Cọ)** | Nét cọ mềm: đầu cọ tròn, chuyển tông mượt; dùng cho tô màu, shading | Màu, cỡ, opacity, flow, độ cứng (hardness) |
| 3 | **Eraser (Tẩy)** | Xóa nét trên layer hiện tại; có 2 chế độ: xóa theo nét (stroke eraser — xóa cả nét chạm vào) và xóa theo điểm ảnh (pixel eraser — xóa phần nét bị quét qua) | Cỡ, chế độ |
| 4 | **Undo / Redo** | Hoàn tác / làm lại từng thao tác (mỗi nét vẽ là 1 thao tác; xóa layer, đổi màu không tính là thao tác undo) | — |
| 5 | **Clear (Xóa hết)** | Xóa toàn bộ nét trên layer hiện tại (kèm xác nhận) hoặc toàn bộ project (kèm xác nhận 2 lần) | Phạm vi |
| 6 | **Colour (Màu)** | Chọn màu: bảng màu preset (màu thương hiệu + bảng màu cơ bản) + color picker đầy đủ (HSL/RGB/Hex) + eyedropper (lấy màu từ canvas) | Màu |
| 7 | **Size (Cỡ nét)** | Thanh trượt + nhập số (1–100px, theo tọa độ logic); hiển thị preview nét | px |
| 8 | **Opacity (Độ mờ)** | Thanh trượt 1–100%; áp dụng cho nét vẽ tiếp theo (không đổi nét đã vẽ) | % |
| 9 | **Zoom (Phóng to/thu nhỏ)** | Zoom 10%–800%, theo tâm canvas hoặc theo vị trí con trỏ; nút zoom +/-, thanh trượt, phím tắt (Ctrl + +/-), pinch trên touch | % |
| 10 | **Pan (Di chuyển khung nhìn)** | Kéo canvas bằng Space + kéo chuột, hoặc nút Pan, hoặc 2 ngón trên touch | — |
| 11 | **Fit (Vừa khung hình)** | Đưa toàn bộ canvas về vừa khung nhìn (fit to screen); nút riêng + phím tắt | — |
| 12 | **Layers (Lớp)** | Thêm/xóa/đổi tên/ẩn/hiện/khóa/sắp xếp layer; chọn layer hiện tại để vẽ (xem Mục 4) | — |
| 13 | **Reference (Ảnh tham chiếu)** | Hiển thị ảnh tham chiếu trong panel riêng (có thể di chuyển, thu nhỏ, xoay, chỉnh opacity); không vẽ lên ảnh tham chiếu | Ảnh, opacity |
| 14 | **Guidelines (Đường hướng dẫn)** | Bật/tắt: lưới (grid), đường trục (center lines), đường phối cảnh (điểm tụ + đường hội tụ), khung 1/3 (rule of thirds) | Loại, hiển thị |
| 15 | **Save / Load (Lưu / Mở)** | Lưu project (thủ công + tự động — xem Mục 6); mở project đã lưu | — |
| 16 | **Autosave (Tự động lưu)** | Tự động lưu sau mỗi thay đổi (debounce — xem Mục 6) | Khoảng debounce |
| 17 | **Export PNG (Xuất ảnh)** | Xuất canvas thành file PNG (nền trắng/kem hoặc trong suốt — do người dùng chọn); độ phân giải theo kích thước canvas logic | Định dạng, nền |
| 18 | **Stroke Replay (Phát lại nét vẽ)** | Phát lại quá trình vẽ từ đầu (xem Mục 5) | Play/pause/seek/speed/step |

### 2.2. Phím tắt (Keyboard Shortcuts — đề xuất)

| Phím | Hành động |
|---|---|
| `B` | Chọn Brush |
| `P` | Chọn Pencil |
| `E` | Chọn Eraser |
| `Ctrl+Z` / `Cmd+Z` | Undo |
| `Ctrl+Shift+Z` / `Cmd+Shift+Z` hoặc `Ctrl+Y` | Redo |
| `Ctrl+S` / `Cmd+S` | Lưu |
| `Space` + kéo | Pan (tạm thời) |
| `Ctrl + +` / `Ctrl + -` / `Ctrl+0` | Zoom in / Zoom out / Fit |
| `[` / `]` | Giảm / tăng cỡ nét |
| `X` | Đổi màu foreground/background (nếu có 2 màu) |
| `F` | Bật/tắt Focus mode (ẩn panel phụ) |

> Phím tắt là đề xuất; team frontend có thể điều chỉnh nhưng phải ghi lại trong `USER_GUIDE.md` và hiển thị trong giao diện (tooltip + trang phím tắt).

---

## 3. Stroke Data Model — Mô hình dữ liệu nét vẽ

### 3.1. Nguyên tắc

- **Mọi nét vẽ đều được lưu dưới dạng dữ liệu vector (stroke data), không chỉ là ảnh bitmap.** Nhờ đó AI có thể phân tích hình học của nét vẽ (độ thẳng, độ cong, tỷ lệ), và hệ thống có thể phát lại quá trình vẽ (replay).
- **Tọa độ logic chuẩn hóa (normalised logical coordinates):** Mọi tọa độ được lưu trong hệ tọa độ logic của canvas, độc lập với kích thước hiển thị (viewport) và mức zoom. Khi hiển thị, tọa độ logic được chuyển đổi sang tọa độ màn hình bằng phép biến đổi view (pan + zoom).
- **Không lưu tọa độ màn hình (screen coordinates)** trong dữ liệu bền vững — tọa độ màn hình chỉ tồn tại trong lúc vẽ (transient).

### 3.2. Schema — Stroke

```jsonc
{
  "id": "stroke_uuid_v4",           // string, UUID v4, duy nhất toàn hệ thống
  "project_id": "project_uuid",     // string, UUID của project chứa nét này
  "layer_id": "layer_uuid",         // string, UUID của layer chứa nét này
  "tool": "pencil",                 // enum: "pencil" | "brush" | "eraser"
  "color": "#242424",               // string, hex (ví dụ "#242424"); eraser có thể để null
  "width": 3.0,                     // number, cỡ nét (px, theo tọa độ logic)
  "opacity": 1.0,                   // number, 0.0–1.0
  "points": [                       // array, tối thiểu 1 điểm; thứ tự là thứ tự vẽ
    {
      "x": 0.5123,                  // number, tọa độ logic chuẩn hóa 0.0–1.0 theo chiều rộng canvas
      "y": 0.3421,                  // number, tọa độ logic chuẩn hóa 0.0–1.0 theo chiều cao canvas
      "pressure": 0.75,             // number, 0.0–1.0; 0.5 nếu thiết bị không hỗ trợ áp lực
      "tilt_x": 0.0,                // number, độ nghiêng bút theo trục X (độ); 0 nếu không hỗ trợ
      "tilt_y": 0.0,                // number, độ nghiêng bút theo trục Y (độ); 0 nếu không hỗ trợ
      "t": 1712345678901            // integer, timestamp (ms, epoch) của điểm này
    }
  ],
  "timestamp": 1712345678901,       // integer, ms epoch — thời điểm bắt đầu nét vẽ
  "sequence": 42,                   // integer, số thứ tự của nét trong project (tăng dần, dùng cho replay)
  "created_by": "user_uuid",        // string, UUID người vẽ (để phân biệt khi có collab trong tương lai)
  "is_deleted": false               // boolean, soft-delete (dùng cho undo/redo và đồng bộ)
}
```

**Ghi chú schema:**

- `points[].x / y` chuẩn hóa 0.0–1.0 theo kích thước canvas logic (chiều rộng/chiều cao). Khi canvas logic thay đổi kích thước (resize), tọa độ chuẩn hóa vẫn giữ nguyên ý nghĩa tương đối — nhưng **khuyến nghị không đổi kích thước canvas logic sau khi project đã có nét vẽ**; nếu bắt buộc, phải ghi lại sự kiện resize và kiểm tra lại.
- `pressure`: nếu thiết bị không hỗ trợ áp lực (chuột thường), giá trị mặc định là `0.5` (không phải 0.0 hay 1.0) để phân biệt "không có dữ liệu áp lực" với "áp lực bằng 0". Khi phân tích AI, `pressure == 0.5` trên toàn bộ điểm + `pointerType == "mouse"` được hiểu là "không có dữ liệu áp lực", không phải "áp lực không đổi".
- `tilt_x / tilt_y`: chỉ có ý nghĩa khi dùng bút stylus hỗ trợ tilt; mặc định `0.0`.
- `sequence`: số thứ tự tăng dần trong project, **không tái sử dụng** số của nét đã xóa (để replay và đồng bộ không bị nhầm).
- `is_deleted`: soft-delete — nét bị xóa bằng tẩy (stroke eraser) hoặc undo được đánh dấu `is_deleted = true` thay vì xóa hẳn, để undo/redo và đồng bộ hoạt động đúng. Nét soft-deleted không được render, không được đưa vào AI assessment, nhưng vẫn được lưu (cho đến khi project được "dọn dẹp" — compaction — theo quy định, xem Mục 6.3).

### 3.3. Schema — Project

```jsonc
{
  "id": "project_uuid",
  "owner_id": "user_uuid",
  "lesson_id": "01.2",              // mã bài học (hoặc null nếu vẽ tự do)
  "exercise_id": "01.2-ex1",        // mã bài tập (hoặc null)
  "title": "Bài tập đường thẳng — lần 1",
  "canvas_width": 1920,             // px logic
  "canvas_height": 1080,            // px logic
  "background": "#FFFCF7",          // màu nền canvas (mặc định Natural Ivory)
  "layers": [ /* Layer objects — xem Mục 4 */ ],
  "strokes": [ /* Stroke objects — xem Mục 3.2; hoặc lưu riêng theo layer */ ],
  "created_at": "2026-11-24T10:00:00+07:00",
  "updated_at": "2026-11-24T10:05:00+07:00",
  "version": 3                      // số phiên bản (tăng mỗi lần lưu — dùng cho conflict handling, xem Mục 6.2)
}
```

### 3.4. Schema — Layer

```jsonc
{
  "id": "layer_uuid",
  "project_id": "project_uuid",
  "name": "Sketch",                 // tên do người dùng đặt ("Sketch", "Line", "Shadow"…)
  "order": 0,                       // số thứ tự từ dưới lên (0 = dưới cùng)
  "visible": true,                  // boolean, ẩn/hiện
  "locked": false,                  // boolean, khóa (không vẽ được lên layer đã khóa)
  "opacity": 1.0                    // number, 0.0–1.0, opacity của toàn layer
}
```

---

## 4. Layer System — Hệ thống lớp

### 4.1. Quy tắc

- Mỗi project có ít nhất **1 layer** ("Layer 1" mặc định). Không được xóa layer cuối cùng.
- Chỉ vẽ được lên **layer hiện tại (active layer)** và layer đó phải `visible == true` và `locked == false`.
- Thứ tự render: từ `order` thấp (dưới) đến `order` cao (trên).
- Opacity của layer nhân với opacity của từng nét trong layer đó.
- Layer bị ẩn (`visible == false`) không được render và **không được đưa vào AI assessment** (AI chỉ chấm những gì nhìn thấy được).
- Layer bị khóa (`locked == true`) không nhận nét vẽ mới, nhưng vẫn render và vẫn được chấm.

### 4.2. Thao tác layer

| Thao tác | Mô tả | Undo được? |
|---|---|---|
| Thêm layer | Tạo layer mới rỗng, đặt tên mặc định "Layer N", trở thành active layer | Có |
| Xóa layer | Xóa layer + toàn bộ nét trong đó (kèm xác nhận nếu layer có nét) | Có (khôi phục được) |
| Đổi tên | Đổi tên layer | Không (không cần undo) |
| Ẩn/hiện | Bật/tắt `visible` | Không |
| Khóa/mở khóa | Bật/tắt `locked` | Không |
| Sắp xếp lại | Kéo-thả để đổi `order` | Có |
| Gộp layer (merge down) | Gộp layer hiện tại xuống layer dưới (nét được chuyển sang layer dưới, giữ nguyên `sequence`) | Có |
| Nhân đôi (duplicate) | Sao chép layer + toàn bộ nét (nét mới có `id` mới, `sequence` mới) | Có |

### 4.3. Layer gợi ý theo bài học (không bắt buộc)

| Loại bài học | Layer gợi ý |
|---|---|
| Phác thảo / dựng hình | `Sketch` (phác) → `Line` (nét chính) |
| Tô bóng / màu | `Sketch` → `Line` → `Flat` (màu phẳng) → `Shadow` (bóng) → `Highlight` (sáng) |
| Digital Painting | `Sketch` → `Line` → `Flat` → `Shadow` → `Light` → `Detail` |

Học viên được tự do đặt tên và tổ chức layer theo ý mình; bảng trên chỉ là gợi ý.

---

## 5. Stroke Replay — Phát lại quá trình vẽ

### 5.1. Mục đích

- Học viên xem lại **quá trình** vẽ của mình (không chỉ kết quả) để tự nhận ra lỗi (ví dụ: vẽ ellipse bằng nhiều nét chắp vá thay vì 1 nét).
- Giáo viên/AI xem replay để hiểu **cách** học viên vẽ (thứ tự nét, tốc độ, chỗ nào chần chừ, chỗ nào tô lại nhiều lần).
- Bài mẫu (demo) có thể phát lại để học viên học theo từng bước.

### 5.2. Chức năng

| Chức năng | Mô tả |
|---|---|
| **Play / Pause** | Phát / tạm dừng replay từ vị trí hiện tại |
| **Seek (tua)** | Thanh trượt thời gian (timeline) — kéo đến bất kỳ thời điểm nào; hiển thị thời gian hiện tại / tổng thời gian |
| **Speed (tốc độ)** | 0.5x / 1x / 2x / 4x (mặc định 1x = tốc độ vẽ thật, dựa trên `timestamp` của nét và `t` của từng điểm) |
| **Step (từng bước)** | Nút "Nét trước / Nét sau" — nhảy từng nét một theo `sequence` (dùng để phân tích từng nét) |
| **Hiển thị số nét** | Hiển thị "Nét 12/48" trong lúc replay |
| **Xuất video (tương lai)** | Xuất replay thành video (MP4/WebM) — **chưa đặc tả**, tính năng tương lai, không có trong v0.1 |

### 5.3. Cách hoạt động (logic)

1. Replay sắp xếp tất cả nét (không bị soft-delete) theo `sequence` tăng dần.
2. Mỗi nét được vẽ lại theo thứ tự điểm (`points[]`), với thời gian giữa các điểm dựa trên `t` (đã chia cho tốc độ speed).
3. Khi seek đến thời gian T: tất cả nét có `timestamp <= T` được vẽ đầy đủ; nét đang vẽ dở tại T được vẽ đến điểm có `t <= T`.
4. Replay không làm thay đổi dữ liệu gốc — chỉ render tạm thời lên canvas phụ (offscreen) hoặc canvas chính ở chế độ "xem".

---

## 6. Persistence — Lưu trữ, Autosave, Conflict Handling

### 6.1. Autosave (Tự động lưu)

- **Debounce:** Sau mỗi thay đổi (nét vẽ mới, xóa, đổi layer…), hệ thống đợi **1.000ms (1 giây)** không có thay đổi mới rồi mới lưu. Nếu có thay đổi mới trong lúc đợi, đếm lại từ đầu.
- **Lưu ngay (không debounce)** khi: người dùng bấm nút Lưu (Ctrl+S), đóng tab/trình duyệt (beforeunload), chuyển bài học, nộp bài.
- **Trạng thái lưu hiển thị:** "Đang lưu…" → "Đã lưu • HH:MM" → "Lỗi lưu — sẽ thử lại" (kèm nút "Thử lại ngay").
- **Lưu cục bộ (local):** Trước khi gửi lên server, dữ liệu được lưu vào local storage / IndexedDB của trình duyệt để chống mất bài khi mất mạng hoặc crash. Khi có mạng trở lại, đồng bộ lên server.
- **Không bao giờ** hiển thị pop-up làm gián đoạn việc vẽ để báo đã lưu.

### 6.2. Conflict Handling (Xung đột phiên bản)

- Mỗi project có `version` (số nguyên, tăng 1 mỗi lần lưu thành công lên server).
- Khi lưu, client gửi kèm `version` mà nó đang giữ. Server kiểm tra:
  - Nếu `version` gửi lên == `version` hiện tại trên server → lưu thành công, `version + 1`.
  - Nếu `version` gửi lên < `version` trên server → **xung đột**: có thể project đã được sửa ở nơi khác (tab khác, thiết bị khác).
- Khi xung đột, hệ thống **không tự động ghi đè**. Hiển thị hộp thoại cho người dùng chọn:
  1. **Giữ bản của tôi** (ghi đè — tạo bản sao lưu của bản trên server trước khi ghi đè).
  2. **Lấy bản trên server** (bỏ bản của tôi — bản của tôi được lưu thành bản nháp riêng, không mất).
  3. **Lưu thành bản sao mới** (tạo project mới từ bản của tôi).
- Mọi trường hợp ghi đè đều tạo **bản sao lưu tự động** của bản bị ghi đè, để khôi phục được.

### 6.3. Dọn dẹp (Compaction)

- Nét soft-deleted (`is_deleted == true`) được giữ lại để phục vụ undo/redo và đồng bộ.
- Khi project được lưu thành công và không còn thao tác undo nào tham chiếu đến nét đã xóa (undo stack đã qua điểm xóa), các nét soft-deleted **có thể** được xóa hẳn (compaction) để giảm dung lượng.
- Compaction chỉ chạy khi lưu thành công và không làm mất khả năng undo của các thao tác hiện tại trong phiên làm việc.

---

## 7. Rendering — Kết xuất

- **Render theo layer:** Vẽ từ layer dưới lên trên; trong mỗi layer, vẽ nét theo `sequence`.
- **Render nét:** Nối các điểm bằng đường cong mượt (quadratic/cubic Bézier qua các điểm, hoặc Catmull-Rom → Bézier); độ rộng nét tại mỗi điểm = `width × pressure_factor` (pressure_factor từ `pressure`, mặc định 1.0 khi không có dữ liệu áp lực).
- **Pencil texture:** Nét bút chì có texture hạt nhẹ (có thể dùng pattern hoặc jitter alpha); **không** làm nét chì quá mờ — phải đọc được rõ trên nền giấy.
- **Hiệu năng:** Chỉ render lại vùng bị thay đổi (dirty region) khi có thể; với canvas lớn (> 2.000 nét), dùng offscreen canvas cho từng layer và composite khi cần.
- **Xuất PNG:** Render toàn bộ project (các layer visible) lên offscreen canvas theo kích thước logic, xuất PNG; nền theo lựa chọn (trắng/kem/trong suốt).

---

## 8. Pointer / Stylus / Pressure Support

### 8.1. Hỗ trợ

| Đầu vào | Hỗ trợ | Ghi chú |
|---|---|---|
| Chuột (mouse) | ✅ Bắt buộc | `pressure` mặc định 0.5 (không có dữ liệu áp lực) |
| Touch (ngón tay) | ✅ Bắt buộc | Hỗ trợ 1 ngón vẽ, 2 ngón pan/zoom (pinch) |
| Bút stylus (pen) | ✅ Mục tiêu | Dùng Pointer Events API (`pointerType == "pen"`, `pressure`, `tiltX`, `tiltY`) |
| Palm rejection | ⚠️ Mục tiêu | Dựa vào Pointer Events (`pointerType`); không tự triển khai thuật toán palm rejection riêng trong v0.1 |

### 8.2. Lưu ý quan trọng — CHƯA KIỂM TRA STYLUS

> **Stylus (bút cảm ứng) CHƯA được kiểm tra** vì không có thiết bị stylus trong môi trường phát triển tài liệu này. Mọi khẳng định về hỗ trợ stylus, áp lực bút (pressure) và độ nghiêng (tilt) trong tài liệu này là **yêu cầu thiết kế, chưa được kiểm chứng thực tế**. Cần kiểm tra trên thiết bị thật (ví dụ: Wacom, iPad + Apple Pencil, Samsung S Pen) trước khi tuyên bố hỗ trợ stylus.

### 8.3. Pointer Events

- Dùng **Pointer Events API** (`pointerdown` / `pointermove` / `pointerup` / `pointercancel`) thay vì Mouse Events + Touch Events riêng lẻ.
- Dùng `getCoalescedEvents()` (khi có) để lấy các điểm trung gian, giúp nét vẽ mượt hơn ở tần số quét cao.
- Ngăn hành vi mặc định của trình duyệt khi vẽ trên canvas (`touch-action: none`).

---

## 9. Acceptance Tests — 18 bài kiểm tra chấp nhận

> **Trạng thái:** Các test dưới đây là **danh sách yêu cầu kiểm tra**, chưa có test nào được chạy hay pass. "Pass" chỉ được tuyên bố sau khi test chạy thật và có kết quả ghi lại.

| # | Test | Điều kiện pass (định nghĩa trước) |
|---|---|---|
| 1 | Vẽ 1 nét bút chì bằng chuột | Nét xuất hiện trong < 16ms sau pointermove; nét được lưu với đúng `tool`, `color`, `width`, `points[]` |
| 2 | Vẽ 1 nét bằng touch (1 ngón) | Như test 1; không cuộn trang khi vẽ (`touch-action: none` hoạt động) |
| 3 | Undo / Redo 1 nét | Undo xóa nét khỏi canvas và đánh dấu `is_deleted`; Redo khôi phục nét; `sequence` không đổi |
| 4 | Tẩy (stroke eraser) xóa 1 nét | Nét bị chạm được đánh dấu `is_deleted`; các nét khác không bị ảnh hưởng |
| 5 | Tẩy (pixel eraser) xóa 1 phần nét | Chỉ phần nét bị quét qua bị xóa (nét bị tách thành 2 đoạn hoặc bị rút ngắn — theo thiết kế của team frontend, ghi rõ cách xử lý) |
| 6 | Đổi màu / cỡ / opacity | Nét vẽ sau khi đổi dùng đúng tham số mới; nét đã vẽ không bị đổi theo |
| 7 | Zoom 10%–800% + Pan + Fit | Zoom theo vị trí con trỏ đúng; Pan mượt; Fit đưa toàn bộ canvas về vừa khung nhìn |
| 8 | Thêm / xóa / đổi tên / ẩn / khóa / sắp xếp layer | Mọi thao tác hoạt động đúng; không vẽ được lên layer ẩn/khóa; thứ tự render đúng `order` |
| 9 | Lưu thủ công (Ctrl+S) | Project được lưu lên server (hoặc local khi mất mạng) với `version + 1`; hiển thị "Đã lưu • HH:MM" |
| 10 | Autosave debounce 1 giây | Sau khi ngừng vẽ 1 giây, hệ thống tự lưu; vẽ tiếp trong lúc đợi thì đếm lại từ đầu (kiểm tra bằng log/timestamp) |
| 11 | Mất mạng → lưu local → có mạng → đồng bộ | Vẽ khi mất mạng: dữ liệu lưu local, không mất; khi có mạng: đồng bộ lên server, không trùng lặp nét |
| 12 | Conflict handling | Sửa cùng project ở 2 tab: tab thứ 2 lưu bị xung đột → hiển thị hộp thoại 3 lựa chọn (Mục 6.2); không mất dữ liệu ở bất kỳ lựa chọn nào |
| 13 | Xuất PNG | File PNG xuất ra đúng kích thước logic, đúng màu nền đã chọn, chứa đủ các layer visible, không chứa layer ẩn |
| 14 | Replay: play/pause/seek/speed/step | Play phát đúng thứ tự `sequence`; pause dừng đúng vị trí; seek đến đúng thời gian; speed 2x/4x đúng tỷ lệ; step nhảy đúng từng nét |
| 15 | Guidelines: grid / rule of thirds / điểm tụ | Bật/tắt từng loại guideline đúng; guideline không bị lưu thành nét vẽ, không xuất hiện trong PNG (trừ khi người dùng chọn xuất kèm) |
| 16 | Stress test — 100 nét | Vẽ 100 nét liên tiếp: không giật (frame rate ≥ 50fps trong lúc vẽ), lưu và tải lại đúng 100 nét |
| 17 | Stress test — 1.000 nét | Vẽ/tải 1.000 nét: thao tác vẽ vẫn mượt (frame rate ≥ 30fps), thời gian tải project < 3 giây (mục tiêu, chưa đo) |
| 18 | Stress test — 5.000 nét | Tải project 5.000 nét: không crash, thời gian tải < 10 giây (mục tiêu, chưa đo); vẽ thêm nét mới vẫn phản hồi < 100ms; replay phát được từ đầu đến cuối không lỗi |

**Ghi chú:** Các ngưỡng hiệu năng trong test 16–18 (fps, thời gian tải) là **mục tiêu thiết kế, chưa được đo**. Nếu đo thực tế không đạt, phải ghi lại kết quả thật và điều chỉnh mục tiêu hoặc tối ưu hiệu năng — không tuyên bố pass khi chưa đo.

---

## 10. Tài liệu liên quan

| Tài liệu | Nội dung |
|---|---|
| `DESIGN_SYSTEM.md` | Tokens, toolbar, accessibility |
| `ART_DIRECTION.md` | Phong cách, trải nghiệm vẽ |
| `CURRICULUM.md` | Bài học, exercise_type |
| `AI_ASSESSMENT.md` | AI dùng stroke data như thế nào để chấm bài |
| `USER_GUIDE.md` | Hướng dẫn sử dụng canvas cho học viên |

---

*Hết DRAWING_ENGINE.md — v0.1, 24/11/2026. Trạng thái: NOT_STARTED. Đặc tả mục tiêu; chưa triển khai hay kiểm chứng.*
