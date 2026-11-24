# KNOWN_LIMITATIONS.md — DrawPath AI — Giới hạn đã biết

> **Ngày:** 2026-11-24
> **Mục đích:** liệt kê thẳng thắn những gì sản phẩm **chưa có / chưa làm được /
> chưa xác minh được**, để không ai — kể cả người viết — vô tình tuyên bố quá
> mức. File này phải được cập nhật mỗi khi một giới hạn được gỡ bỏ (kèm bằng chứng).

## 1. Chưa có code sản phẩm được xác minh

- Tại thời điểm kiểm tra (~22:56 +07, 2026-11-24), repo được ghi nhận là trống:
  không có `backend/`, `frontend/`, không có code, test hay Dockerfile nào
  được xác minh chạy được.
- Các file trong `backend/` / `frontend/` do các agent song song tạo sau thời
  điểm đó **chưa được kiểm chứng trong đợt viết tài liệu này** (người viết
  không chạm vào, không chạy, không review sâu các file đó). Mọi giới hạn dưới
  đây phản ánh đúng cuộc kiểm tra lúc 22:56 và phải được kiểm tra lại.
- **Hệ quả:** chưa có tính năng nào của người dùng cuối chạy được; chưa có
  trang nào, API nào, job chấm bài nào được chứng minh hoạt động.

## 2. Chưa có expert review (chuyên gia duyệt nội dung)

- **Giáo trình / lesson / rubric chưa được chuyên gia mỹ thuật / sư phạm duyệt.**
  Nội dung lesson, thang rubric, gợi ý học tập hiện chỉ là bản nháp theo spec.
- **Golden set chấm AI chưa có chuẩn do chuyên gia chấm.** Vì vậy không thể
  tuyên bố điểm AI "chính xác" hay "đáng tin" ở mức độ nào.
- Không có quy trình duyệt nội dung trước khi publish được xác minh chạy.

## 3. Live multimodal AI phụ thuộc provider miễn phí

- Tích hợp AI đa mô thức trực tiếp (live) phụ thuộc vào các provider miễn phí
  (Pollinations và các provider tương tự). **Không có key trả phí nào**, không
  có SLA, không có đảm bảo về availability hay rate limit.
- **Fallback đảm bảo duy nhất là local CV (OpenCV, xử lý tại chỗ)** — đây là
  đường chắc chắn có, không phụ thuộc mạng/provider ngoài. Khi provider ngoài
  lỗi, hệ thống phải fallback sang local CV và báo rõ cho user.
- Kết quả kiểm tra provider ngoài ngày 2026-11-24 22:56 UTC (xem `TEST_RESULTS.md`):
  - Pollinations text: HTTP 200, 4,35s (6,22s ở lần đo prompt ngắn trước đó).
  - Pollinations image: **HTTP 503 lần đầu (3,03s), HTTP 200 khi retry (5,78s,
    JPEG 8.666 byte) — FLAKY** (BUG-001).
  - Openverse: HTTP 200 nhưng **16,6s** (BUG-002).
  - Wikipedia REST: HTTP 200, 0,59s.
  - HuggingFace Inference không token: timeout sau 30s (HTTP 000) — **NOT VERIFIED,
    key-gated**.
  - OpenRouter `/v1/models`: HTTP 200 không key (chỉ list model; chat cần key —
    **key-gated**).
  - DuckDuckGo Instant Answer: HTTP 202, abstract rỗng — **không phù hợp**.
- **Không dùng provider key-gated nào** (HuggingFace Inference, OpenRouter chat)
  khi chưa có key và chưa có phê duyệt của người dùng.

## 4. Pollinations image flaky (đã quan sát)

- Đã quan sát HTTP 503 một lần rồi thành công khi retry trong cùng đợt đo.
  Tần suất lỗi thật chưa biết (mới đo 1–2 lần). Cần đo lặp lại trước khi chốt
  chính sách retry/timeout.
- Mitigation: retry có giới hạn + backoff + fallback local CV (chưa triển khai
  vì chưa có code).

## 5. Stylus / pressure chưa test được

- **Không có thiết bị stylus** trong môi trường kiểm tra này.
- Pressure / tilt / palm rejection chưa test được. Canvas hiện chỉ có thể test
  bằng chuột / touch (khi có app).
- Nếu sau này hỗ trợ stylus, phải test riêng trên thiết bị thật và ghi kết quả.

## 6. Chưa có production deployment

- Không có hạ tầng production, không có domain, không có HTTPS production,
  không có backup/restore đã kiểm chứng.
- **Không deploy production khi chưa có phê duyệt của người dùng** (xem `DECISIONS.md`).
- Docker Compose chưa test được local vì **Docker không cài trong VM này**.

## 7. Chưa có real user testing

- Chưa có người dùng thật nào dùng thử sản phẩm (vì chưa có sản phẩm chạy).
- Chưa có feedback người dùng, chưa có usability test, chưa có dữ liệu về
  việc học viên có hiểu rubric/feedback hay không.
- Mọi nhận định về trải nghiệm người dùng hiện chỉ là giả định theo spec.

## 8. Nội dung chưa được expert-verified

- Xem §2. Nhắc lại vì quan trọng: **đừng trích dẫn nội dung lesson hay điểm
  rubric như "đã được chuyên gia xác nhận"** cho tới khi có văn bản duyệt.

## 9. AI scores are assistive, not authoritative

- **Điểm AI chỉ mang tính hỗ trợ, không phải kết luận chính thức về năng lực
  vẽ của học viên.**
- Điểm AI có thể sai, có thể thiên lệch, có thể không hiểu ý đồ nghệ thuật.
- UI và tài liệu phải ghi rõ điều này; không hiển thị điểm AI như "kết quả
  chính thức" duy nhất. Khi có giáo viên/người chấm, điểm của người chấm
  là quyết định cuối cùng (nếu tính năng đó tồn tại).

## 10. Reference images phải tôn trọng licence

- Ảnh tham chiếu lấy từ Openverse và các nguồn mở khác **phải kiểm tra licence
  từng ảnh** (CC-BY, CC0, …) trước khi dùng trong lesson.
- Phải ghi attribution đầy đủ khi licence yêu cầu.
- Không dùng ảnh không rõ nguồn / không rõ licence trong nội dung chính thức.
- Không dùng ảnh có mặt người / thông tin cá nhân làm ảnh mẫu khi chưa có quyền.

## 11. Hiệu năng chưa đo được

- Page load, Core Web Vitals, canvas latency, stroke rendering,
  stress 100 / 1.000 / 5.000 strokes: **tất cả NOT MEASURED** (xem
  `PERFORMANCE_REPORT.md` §3). Mục tiêu Lighthouse ≥ 90 cho trang public
  là mục tiêu đề xuất, chưa phải kết quả đạt được.
- Độ trễ API ngoài (§3) không thay thế được số đo hiệu năng sản phẩm.

## 12. Bảo mật / quyền riêng tư chưa triển khai

- Mọi mục trong `SECURITY.md` và `SECURITY_REVIEW.md` đều ở trạng thái
  NOT_STARTED / NOT TESTED tại thời điểm kiểm tra.
- Chưa có kiểm chứng nào về: băm mật khẩu, JWT, IDOR, XSS, upload an toàn,
  rate limiting, secrets, audit log.
- Bài vẽ private-by-default là **chính sách**, chưa phải hành vi đã kiểm chứng
  của code.

## 13. Các giới hạn khác

- **Ngôn ngữ:** tiếng Việt là ngôn ngữ chính; i18n-ready là mục tiêu thiết kế,
  chưa có bản dịch ngôn ngữ thứ hai nào được kiểm chứng.
- **Offline:** chưa có chế độ offline; mất mạng giữa chừng có thể mất nét vẽ
  chưa đồng bộ (xem TC-E2E-D-05 — NOT RUN).
- **Trình duyệt / thiết bị:** chưa có danh sách trình duyệt hỗ trợ chính thức
  được kiểm chứng; chưa test trên mobile thật.
- **Khả năng mở rộng:** chưa load test; chưa biết hệ thống chịu được bao nhiêu
  user đồng thời.
- **Dữ liệu seed:** bộ curriculum mẫu (nếu có) chưa được xác minh đầy đủ.

## 14. Khi nào cập nhật file này

- Mỗi khi một giới hạn được gỡ bỏ: ghi ngày, bằng chứng (lệnh + output / link
  test), và xóa hoặc sửa dòng tương ứng — không xóa lặng lẽ.
- Mỗi khi phát hiện giới hạn mới: thêm vào ngay, ghi ngày phát hiện.
