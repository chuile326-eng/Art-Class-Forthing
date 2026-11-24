# BUG_REPORT.md — DrawPath AI — Bug Log

> **Ngày:** 2026-11-24
> **Nguyên tắc: không bịa bug trong code sản phẩm.** Tại thời điểm kiểm tra
> (~22:56 +07) repo được ghi nhận là trống — không có code sản phẩm, nên không
> thể có bug trong code sản phẩm. Các bug dưới đây là **bug/quan sát thật ở
> provider ngoài** (đã đo được) + **rủi ro mức spec** (chưa phải bug).
> Bug mới chỉ được thêm khi có bước tái hiện + bằng chứng thật.

## Quy ước mức độ

| Severity | Ý nghĩa |
|---|---|
| Critical | Mất dữ liệu / lộ dữ liệu / hệ thống không dùng được |
| Major | Tính năng chính lỗi hoặc không ổn định |
| Minor | Tính năng phụ chậm / khó chịu, có workaround |
| Trivial | Lỗi chính tả / UI nhỏ |

| Status | Ý nghĩa |
|---|---|
| OPEN | Đang mở, chưa sửa / chưa xác minh sửa xong |
| IN PROGRESS | Đang sửa |
| FIXED — UNVERIFIED | Đã sửa theo báo cáo nhưng chưa chạy lại để xác minh |
| VERIFIED FIXED | Đã chạy lại và xác nhận hết lỗi |
| WON'T FIX / BY DESIGN | Quyết định không sửa, ghi lý do |

---

## 1. Bug đã quan sát được (có bằng chứng)

### BUG-001 — Pollinations image endpoint trả 503 ở lần thử đầu tiên

- **Severity:** Major
- **Status:** OPEN
- **Ngày phát hiện:** 2026-11-24 22:56 UTC
- **Môi trường:** Gọi HTTP trực tiếp tới Pollinations image endpoint (không qua app DrawPath AI, vì app chưa tồn tại)
- **Bước tái hiện:**
  1. Gọi Pollinations image endpoint (request ảnh).
  2. Lần 1: nhận **HTTP 503** sau **3,03s**.
  3. Thử lại (retry): nhận **HTTP 200** sau **5,78s**, ảnh JPEG **8.666 byte**.
- **Kết quả mong đợi:** Endpoint trả 200 ngay lần đầu, hoặc trả lỗi có ý nghĩa với `Retry-After` rõ ràng.
- **Kết quả thực tế:** 503 lần đầu, 200 khi retry — **flaky** (không ổn định).
- **Ảnh hưởng:** Nếu DrawPath AI gọi Pollinations image đồng bộ không có retry/fallback, một tỉ lệ request chấm/tạo ảnh sẽ lỗi ngẫu nhiên trước mặt user.
- **Mitigation (giảm thiểu, chưa triển khai — vì chưa có code):**
  - Retry có giới hạn (ví dụ tối đa 2–3 lần) + backoff.
  - Timeout rõ ràng cho mỗi lần gọi.
  - Fallback sang local CV khi provider ngoài lỗi (xem `SECURITY.md` §12).
  - Không bao giờ báo "chấm xong bằng AI" khi thực tế đã fallback — phải ghi rõ nguồn.
- **Ghi chú:** Một lần quan sát 503 không chứng minh tỉ lệ lỗi là bao nhiêu. Cần đo lặp lại nhiều lần để biết tần suất thật trước khi chốt số lần retry.

### BUG-002 — Openverse latency 16,6s (quá chậm)

- **Severity:** Minor
- **Status:** OPEN
- **Ngày phát hiện:** 2026-11-24 22:56 UTC
- **Môi trường:** Gọi HTTP trực tiếp tới Openverse (không qua app)
- **Bước tái hiện:**
  1. Gọi Openverse search (tìm ảnh tham chiếu).
  2. Nhận **HTTP 200** sau **16,6s**.
- **Kết quả mong đợi:** Trả kết quả trong vài giây để dùng được trong flow tìm ảnh tham chiếu.
- **Kết quả thực tế:** 200 nhưng mất 16,6s — đúng về mặt chức năng, sai về mặt trải nghiệm nếu gọi đồng bộ.
- **Ảnh hưởng:** Nếu gọi đồng bộ khi user đang chờ ảnh tham chiếu, user sẽ chờ 16s+ hoặc request timeout.
- **Mitigation (chưa triển khai):**
  - Gọi nền / cache kết quả tìm kiếm phổ biến.
  - Timeout riêng cho Openverse, báo rõ khi chậm.
  - Cân nhắc provider ảnh tham chiếu khác hoặc ảnh tự chuẩn bị sẵn cho lesson.
- **Ghi chú:** Đây là một lần đo đơn lẻ; latency có thể dao động theo thời điểm. Cần đo lặp lại.

## 2. Rủi ro mức spec (chưa phải bug — chưa có code để gọi là bug)

Bảng này ghi những rủi ro đã biết từ spec/thiết kế, để không ai nhầm chúng
với bug đã tái hiện được. Khi code xuất hiện và rủi ro thành lỗi thật, chuyển
thành bug entry ở §1 với bước tái hiện.

| # | Rủi ro | Mức | Ghi chú |
|---|---|---|---|
| RISK-01 | Không có backend/frontend code nào được xác minh chạy được tại thời điểm kiểm tra | Major | Toàn bộ sản phẩm NOT_STARTED theo kiểm tra 22:56; code do agent song song tạo sau đó chưa được kiểm chứng trong đợt này |
| RISK-02 | Provider AI miễn phí không đảm bảo availability/rate limit | Major | Pollinations đã 503 một lần; không có SLA. Cần fallback local CV |
| RISK-03 | Chưa có chuyên gia duyệt giáo trình / rubric | Major | Điểm AI + nội dung lesson chưa được xác thực chuyên môn |
| RISK-04 | Docker không cài trong VM này → Docker Compose chưa test được local | Minor | Cần máy/CI có Docker để kiểm chứng compose |
| RISK-05 | Không có thiết bị stylus → pressure/tilt chưa test được | Minor | Xem `KNOWN_LIMITATIONS.md` |
| RISK-06 | HuggingFace Inference không xác minh được khi không có key (timeout 30s) | Minor | Key-gated; không dùng khi chưa có key + phê duyệt |
| RISK-07 | OpenRouter chat cần key; mới chỉ list được model không key | Minor | Key-gated; không dùng khi chưa có key + phê duyệt |
| RISK-08 | DuckDuckGo Instant Answer trả abstract rỗng → không phù hợp làm nguồn nội dung | Minor | Đã kiểm tra, loại khỏi danh sách nguồn |
| RISK-09 | Ảnh tham chiếu phải tôn trọng licence (Openverse) | Minor | Cần kiểm tra licence từng ảnh trước khi dùng trong lesson |
| RISK-10 | AI scores là assistive, không authoritative — nguy cơ user hiểu điểm AI là kết luận chính thức | Major | Phải ghi rõ trong UI + tài liệu; xem `KNOWN_LIMITATIONS.md` |

## 3. Template thêm bug mới

```markdown
### BUG-XXX — <tiêu đề ngắn>

- **Severity:** Critical / Major / Minor / Trivial
- **Status:** OPEN
- **Ngày phát hiện:** YYYY-MM-DD
- **Môi trường:** (commit, môi trường chạy, trình duyệt/thiết bị nếu liên quan)
- **Bước tái hiện:**
  1. ...
  2. ...
- **Kết quả mong đợi:** ...
- **Kết quả thực tế:** ...
- **Ảnh hưởng:** ...
- **Mitigation / Fix:** ...
- **Bằng chứng:** (log, screenshot, lệnh + output — dán nguyên văn)
```

**Quy tắc thêm bug:**
- Chỉ thêm bug khi tái hiện được hoặc có bằng chứng đo được.
- Không thêm bug "nghe nói", "có thể", "chắc là" — những thứ đó vào §2 (rủi ro).
- Khi sửa xong, đổi status thành FIXED — UNVERIFIED trước, chỉ đổi thành
  VERIFIED FIXED sau khi chạy lại bước tái hiện và ghi kết quả vào `TEST_RESULTS.md`.

## Bug mới trong re-audit 2026-11-24 ~23:15 +07

| ID | Mô tả | Severity | Trạng thái | Bằng chứng |
|---|---|---|---|---|
| BUG-003 | Compose trỏ Postgres nhưng `requirements.txt` thiếu `psycopg2` → backend lỗi khi chạy compose | Major | OPEN (xem BLK-008) | `docker-compose.yml:64` vs `requirements.txt` |
| BUG-004 | CORS `allow_origins=["*"]` + `SECRET_KEY` mặc định | Critical (trước deploy chia sẻ) | OPEN (xem BLK-009) | `app/main.py`, `app/auth.py:12` |
| BUG-005 | 74 warning `datetime.utcnow()` deprecated trong pytest | Minor | OPEN (xem BLK-011) | pytest output 2026-11-24 |
| BUG-006 | Tài liệu nháp ghi nhầm seed `.local` và lệch `/api/v1` | Minor (docs) | **FIXED trong re-audit** | Đã đính chính README/API/ARCHITECTURE/DEPLOYMENT; seed thật là `.app`, hai bên đều dùng gốc |
