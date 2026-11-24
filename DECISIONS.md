# DECISIONS.md — DrawPath AI — Architecture & Product Decisions

> **Ngày ghi:** 2026-11-24
> Mỗi quyết định ghi: ngày, nội dung, rationale (lý do), hệ quả / điều kiện
> thay đổi. Quyết định chỉ được đổi khi có ghi chú mới ở đây, không đổi lặng lẽ.

---

## D-01 — Stack: Next.js/React/TypeScript/Tailwind + FastAPI/Python + PostgreSQL

- **Ngày:** 2026-11-24 (theo spec)
- **Nội dung:** Frontend: Next.js / React / TypeScript / Tailwind.
  Backend: Python FastAPI / Pydantic / SQLAlchemy / Alembic.
  Database: PostgreSQL. Hàng đợi: Redis/Celery. Storage: S3/MinIO.
  Xử lý ảnh: OpenCV. Đóng gói: Docker Compose.
- **Rationale:** Stack theo spec dự án; FastAPI + Pydantic phù hợp API có
  schema chặt (assessment rubric), Next.js phù hợp trang public + app trong
  một codebase, PostgreSQL + Alembic cho dữ liệu học tập có quan hệ rõ ràng.
- **Hệ quả:** Mọi code mới phải theo stack này; đổi stack cần quyết định mới ở đây.
- **Trạng thái:** Quyết định đã ghi; triển khai NOT_STARTED (theo kiểm tra 22:56).

## D-02 — Tên sản phẩm tạm thời: DrawPath AI

- **Ngày:** 2026-11-24
- **Nội dung:** Dùng tên **DrawPath AI** cho sản phẩm trong toàn bộ tài liệu
  và code (tên repo GitHub: `Art-Class-Forthing` giữ nguyên, không đổi tên repo
  trong đợt này).
- **Rationale:** Cần một tên nhất quán để tài liệu, code và trao đổi không bị
  lẫn với tên repo chung chung.
- **Hệ quả:** Tên là tạm thời; nếu đổi tên thương hiệu thì cập nhật toàn bộ
  tài liệu + UI cùng lúc, ghi vào CHANGELOG.

## D-03 — Free-API-first với multi-provider fallback

- **Ngày:** 2026-11-24
- **Nội dung:** Ưu tiên API miễn phí, không key trước (Pollinations text/image,
  Openverse, Wikipedia REST). Mỗi chức năng có **nhiều provider dự phòng**;
  một provider chết thì tự động chuyển sang provider khác.
- **Rationale:** Quy tắc đứng của dự án: mọi API phải tìm nguồn free, nhét thật
  nhiều API dự phòng cho mỗi chức năng để không bị ngắt quãng khi sử dụng.
  Đồng thời tránh phụ thuộc vào một provider duy nhất không có SLA.
- **Hệ quả:** Cần provider abstraction (interface chung) trước khi tích hợp
  provider cụ thể. Không hard-code một provider vào logic chấm bài.
- **Bằng chứng kiểm tra 2026-11-24 22:56 UTC:** Pollinations text 200 (4,35s),
  Pollinations image flaky (503 rồi 200 khi retry), Openverse 200 nhưng 16,6s,
  Wikipedia 200 (0,59s). Xem `TEST_RESULTS.md` §3, `BUG_REPORT.md` BUG-001/002.

## D-04 — Local CV là fallback đảm bảo

- **Ngày:** 2026-11-24
- **Nội dung:** **Local CV (OpenCV, xử lý tại chỗ) là đường fallback đảm bảo**
  khi mọi provider ngoài đều lỗi. Chấm bằng local CV vẫn trả đủ rubric và
  feedback, và phải báo rõ cho user là "chấm bằng phương pháp nội bộ".
- **Rationale:** Provider miễn phí không có SLA (đã quan sát 503 trong đợt đo).
  Không thể để user nộp bài rồi không nhận được kết quả gì chỉ vì mạng/provider lỗi.
- **Hệ quả:** Engine local CV phải được xây trước hoặc cùng lúc với tích hợp
  provider ngoài, không được để provider ngoài là đường duy nhất.
  Không giả vờ kết quả local CV là kết quả AI đa mô thức.

## D-05 — Không dùng paid keys khi chưa có phê duyệt

- **Ngày:** 2026-11-24
- **Nội dung:** **Không mua / không dùng API key trả phí khi chưa có phê duyệt
  của người dùng.** Các provider key-gated (HuggingFace Inference, OpenRouter
  chat) chỉ được đánh giá, không được tích hợp chạy thật khi chưa có key +
  phê duyệt bằng văn bản.
- **Rationale:** Tránh phát sinh chi phí không được đồng ý; tránh đưa secret
  vào repo/CI khi chưa có quy trình quản lý secret.
- **Bằng chứng:** HuggingFace Inference không token timeout 30s (NOT VERIFIED);
  OpenRouter chỉ list được model không key, chat cần key. Xem `TEST_RESULTS.md` §3.

## D-06 — Không deploy production khi chưa có phê duyệt

- **Ngày:** 2026-11-24
- **Nội dung:** **Không deploy production khi chưa có phê duyệt của người dùng.**
  Không tự ý mua domain, thuê server, mở dữ liệu người dùng thật.
- **Rationale:** Production liên quan chi phí, dữ liệu người dùng thật, trách
  nhiệm pháp lý (privacy, trẻ em). Phải có checklist release + phê duyệt
  (xem `RELEASE_ACCEPTANCE.md`) trước.
- **Hệ quả:** Mọi demo trước đó chỉ chạy local / staging, không có user thật.

## D-07 — Vietnamese-first + i18n-ready

- **Ngày:** 2026-11-24
- **Nội dung:** **Tiếng Việt là ngôn ngữ chính** của UI, nội dung lesson,
  feedback AI, tài liệu, thông báo lỗi. Thiết kế i18n-ready (chuỗi UI tách khỏi
  code) để sau này thêm ngôn ngữ khác mà không sửa logic.
- **Rationale:** Người dùng mục tiêu là người học Việt Nam; feedback bằng tiếng
  Việt dễ hiểu hơn nhiều so với tiếng Anh máy móc.
- **Hệ quả:** Không hard-code chuỗi tiếng Anh vào UI rồi "dịch sau"; mọi chuỗi
  hiển thị phải qua hệ thống i18n ngay từ đầu. Chưa có bản dịch ngôn ngữ thứ hai
  nào được kiểm chứng.

## D-08 — Private-by-default cho bài vẽ

- **Ngày:** 2026-11-24
- **Nội dung:** **Bài vẽ / bản nháp của người dùng là riêng tư theo mặc định.**
  Chỉ khi user chủ động chọn "công khai" (portfolio công khai, nếu tính năng
  này tồn tại) thì bài mới hiển thị cho người khác.
- **Rationale:** Bài vẽ là dữ liệu cá nhân, có thể chứa thông tin nhạy cảm
  (ảnh chụp có nền nhà, chữ viết tay). Mặc định công khai là thiết kế sai.
- **Hệ quả:** Mọi API đọc bài vẽ phải kiểm tra quyền owner/admin (xem
  `SECURITY.md` §4, §10). Không có endpoint "list mọi bài vẽ" cho user thường.

## D-09 — Không dùng bài vẽ để train khi chưa có đồng ý

- **Ngày:** 2026-11-24
- **Nội dung:** **Không dùng bài vẽ / ảnh upload của người dùng để train mô hình
  khi chưa có sự đồng ý rõ ràng (opt-in), có thể thu hồi được.**
- **Rationale:** Tôn trọng quyền riêng tư và quyền sở hữu tác phẩm của học viên;
  đồng ý giấu trong ToS không được tính là đồng ý.
- **Hệ quả:** ToS/Privacy phải ghi rõ; code không được có đường gửi bài vẽ đi
  train khi chưa có cờ opt-in.

## D-10 — Mock phải được ghi rõ là mock

- **Ngày:** 2026-11-24
- **Nội dung:** **Dữ liệu mock / giả lập phải được ghi rõ là mock** trong UI
  và tài liệu. Không hiển thị dữ liệu mock như dữ liệu thật, không chấm điểm
  bằng mock rồi báo là điểm AI thật.
- **Rationale:** Người dùng và người test cần biết đâu là thật để đánh giá đúng;
  mock không ghi rõ sẽ gây hiểu lầm về chất lượng sản phẩm.
- **Hệ quả:** Mọi seed data, mock provider, ảnh mẫu đều có nhãn rõ ràng.

## D-11 — Docs-before-code Phase 1

- **Ngày:** 2026-11-24
- **Nội dung:** **Phase 1 làm docs trước, code sau.** Bộ 14 file governance/QA
  (SECURITY.md … RELEASE_ACCEPTANCE.md) được viết trước khi (hoặc song song
  nhưng độc lập với) code backend/frontend, để có chuẩn kiểm tra trước khi code
  chạy.
- **Rationale:** Tránh tình trạng code chạy nhưng không có chuẩn để biết "đúng"
  là gì; tránh tuyên bố PASS khi chưa có test.
- **Hệ quả:** Docs Phase 1 đã viết xong 2026-11-24 (IMPLEMENTED, unreviewed).
  Code do agent song song tạo sau đó phải được kiểm chứng lại theo chuẩn trong
  docs này, không tự động được coi là đạt.

## D-12 — AI scores are assistive, not authoritative

- **Ngày:** 2026-11-24
- **Nội dung:** **Điểm AI chỉ mang tính hỗ trợ, không phải kết luận chính thức.**
  UI + tài liệu phải ghi rõ điều này.
- **Rationale:** AI có thể sai, thiên lệch, không hiểu ý đồ nghệ thuật; điểm AI
  không thay thế đánh giá của giáo viên / chuyên gia.
- **Hệ quả:** Không hiển thị điểm AI như "kết quả chính thức" duy nhất; khi có
  người chấm, điểm người chấm là quyết định cuối cùng (nếu tính năng đó tồn tại).

---

## Các quyết định chưa đưa ra (cần quyết định sau, ghi vào đây khi có)

- [ ] Độ tuổi tối thiểu + cơ chế đồng ý phụ huynh (xem `SECURITY.md` §11).
- [ ] Giới hạn kích thước upload cuối cùng (đề xuất 10 MB — chưa chốt).
- [ ] Ngưỡng chấp nhận cho AI evaluation (MAE, tỉ lệ trong ±1 mức) — cần chuyên gia.
- [ ] Số user đồng thời cho load test.
- [ ] Thời gian giữ audit log cuối cùng (đề xuất 90 ngày — chưa chốt).
- [ ] Provider ảnh tham chiếu chính thức (Openverse chậm 16,6s — có giữ hay thay?).
