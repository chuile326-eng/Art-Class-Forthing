# PERFORMANCE_REPORT.md — DrawPath AI — Báo cáo hiệu năng

> **Ngày:** 2026-11-24
> **Nguyên tắc: file này CHỈ chứa số đo thật. Mọi thứ chưa đo ghi NOT MEASURED.**
> Sản phẩm chưa tồn tại tại thời điểm kiểm tra (~22:56 +07) nên không có số đo
> hiệu năng sản phẩm nào. Thứ duy nhất đã đo là độ trễ của các API miễn phí
> bên ngoài (xem §2) — đó là số đo của provider ngoài, không phải của DrawPath AI.

---

## 1. Tóm tắt

| Hạng mục | Trạng thái |
|---|---|
| Hiệu năng sản phẩm (page load, canvas, API nội bộ) | **NOT MEASURED — no app exists** |
| Độ trễ API ngoài (Pollinations, Openverse, Wikipedia…) | **Đã đo 2026-11-24 22:56 UTC — xem §2** |
| Lighthouse / Core Web Vitals | **NOT MEASURED** |
| Stress test canvas (100 / 1.000 / 5.000 strokes) | **NOT MEASURED** |
| Load test (đồng thời nhiều user) | **NOT MEASURED** |

**Kết luận: chưa thể kết luận gì về hiệu năng sản phẩm. Không được dùng các số
API ngoài để tuyên bố sản phẩm "nhanh" hay "chậm".**

## 2. Số đo thật duy nhất: độ trễ API miễn phí bên ngoài

Đo ngày 2026-11-24 22:56 UTC bằng gọi HTTP trực tiếp. Mỗi dòng là một lần đo
đơn lẻ (không phải trung bình nhiều lần, không phải p95) — trừ khi ghi rõ.

| Provider / Endpoint | Kết quả HTTP | Latency đo được | Nhận xét |
|---|---|---|---|
| Pollinations text — `https://text.pollinations.ai/` | 200 | **4,35s** | Chậm cho 1 request text |
| Pollinations text (prompt ngắn khác, đo trước đó) | 200 | **6,22s** | Chậm; dao động giữa các lần đo |
| Pollinations image — lần 1 | **503** | 3,03s (fail) | **Flaky** — lỗi rồi mới thành công (xem BUG-001) |
| Pollinations image — retry | 200, JPEG 8.666 byte | **5,78s** | Thành công khi retry, vẫn chậm |
| Openverse | 200 | **16,6s** | Rất chậm (xem BUG-002) |
| Wikipedia REST | 200 | **0,59s** | Nhanh trong lần đo này |
| HuggingFace Inference (không token) | 000 (timeout 30s) | > 30s | NOT VERIFIED, key-gated — không kết luận provider hỏng |
| OpenRouter `/v1/models` (không key) | 200 | Không ghi | Chỉ list model; chat cần key |
| DuckDuckGo Instant Answer | 202, abstract rỗng | Không ghi | Đã kiểm tra, không phù hợp |

### Hệ quả thiết kế (suy ra từ số đo, không phải số đo sản phẩm)

1. **Không gọi provider ngoài đồng bộ trong request HTTP của user.**
   Với latency 4–17s, gọi đồng bộ sẽ làm request chấm bài timeout hoặc khiến
   user chờ quá lâu. Phải dùng hàng đợi (Celery/Redis) + trả về ngay
   "đang chấm", rồi cập nhật kết quả sau.
2. **Timeout + retry + fallback là bắt buộc, không phải tùy chọn.**
   Pollinations đã 503 ngay trong đợt đo. Thiết kế: retry có giới hạn +
   backoff, sau đó fallback sang local CV (OpenCV, xử lý tại chỗ).
3. **Openverse 16,6s** nghĩa là tìm ảnh tham chiếu qua Openverse không thể
   làm đồng bộ khi user đang chờ; cần cache kết quả, tải nền, hoặc giới hạn
   số lượng ảnh mỗi lần tìm.
4. Các số trên là **một lần đo**. Trước khi chốt timeout/retry, cần đo lặp
   lại nhiều lần, nhiều thời điểm trong ngày, và ghi p50/p95 — chưa làm.

## 3. Chưa đo được (NOT MEASURED) — toàn bộ hiệu năng sản phẩm

| Hạng mục | Mục tiêu (đề xuất) | Trạng thái | Cách đo sau này |
|---|---|---|---|
| Page load — trang public (landing, lessons) | Lighthouse ≥ 90; LCP < 2,5s (mạng 4G giả lập) | NOT MEASURED | Lighthouse CI / Chrome DevTools, 3 lần chạy lấy trung vị |
| Core Web Vitals (LCP / INP / CLS) | LCP < 2,5s; INP < 200 ms; CLS < 0,1 | NOT MEASURED | Lighthouse + Web Vitals field data (khi có user thật) |
| Canvas latency (pointer → render) | Trung bình < 16 ms trên máy dev | NOT MEASURED | Đo bằng Performance API trong canvas handler, log p50/p95 |
| Stroke rendering — 100 strokes | Render mượt, không drop frame rõ rệt | NOT MEASURED | Import 100 strokes, đo FPS / thời gian render |
| Stroke rendering — 1.000 strokes | Render được, độ trễ ghi lại | NOT MEASURED | Như trên với 1.000 strokes |
| Stroke rendering — 5.000 strokes | Render được hoặc báo giới hạn rõ | NOT MEASURED | Như trên với 5.000 strokes |
| API nội bộ p95 (đọc lesson, nộp bài) | p95 < 500 ms (đọc), < 2s (ghi) — mục tiêu đề xuất, chưa chốt | NOT MEASURED | k6 / locust / đo bằng middleware log |
| Thời gian chấm local CV | Ghi p50/p95 thật khi có engine | NOT MEASURED | Log thời gian job Celery |
| Thời gian chấm provider ngoài (end-to-end) | Ghi p50/p95 + tỉ lệ fallback | NOT MEASURED | Log job: provider, latency, fallback hay không |
| Load test đồng thời | (chưa đặt mục tiêu — cần chốt số user đồng thời) | NOT MEASURED | k6/locust với kịch bản thật |
| Thời gian build (frontend/backend) | Ghi lại khi có code | NOT MEASURED | Đo `npm run build` / `pytest` duration |
| Dung lượng bundle JS | Ghi lại, đặt budget (ví dụ < 300 KB gzip cho trang chính) | NOT MEASURED | `next build` output / bundle analyzer |

## 4. Mục tiêu hiệu năng (targets — chưa phải cam kết đã đạt)

| Chỉ số | Mục tiêu |
|---|---|
| Lighthouse — trang public | **≥ 90** (Performance, Accessibility, Best Practices, SEO — từng hạng mục) |
| LCP (trang public) | < 2,5s |
| INP | < 200 ms |
| CLS | < 0,1 |
| Canvas pointer → render | < 16 ms trung bình |
| API đọc p95 | < 500 ms |
| Chấm bài local CV p95 | < 10s (đề xuất — chốt lại sau khi đo thật) |
| Chấm bài provider ngoài | Không chặn user; job nền, timeout rõ ràng, fallback local CV |

Các mục tiêu trên là **đề xuất để chốt**, chưa phải SLA. Khi đo lần đầu, ghi số
thật vào §5 và điều chỉnh mục tiêu nếu cần — không sửa số đo cho vừa mục tiêu.

## 5. Template kết quả đo sau này (để trống)

### Lần đo: ____ (ngày ____, môi trường ____, commit ____)

| Hạng mục | Công cụ / lệnh | Kết quả | Đạt mục tiêu? |
|---|---|---|---|
| Lighthouse trang ____ | (ghi lệnh) | (chưa đo) | — |
| Canvas 100 / 1.000 / 5.000 strokes | (ghi lệnh) | (chưa đo) | — |
| API p95 | (ghi lệnh) | (chưa đo) | — |
| Chấm local CV p50/p95 | (ghi lệnh) | (chưa đo) | — |
| Chấm provider ngoài p50/p95 + tỉ lệ fallback | (ghi lệnh) | (chưa đo) | — |

**Ghi chú / bottleneck phát hiện:**

```
(chưa có)
```

---

## 6. Re-audit 2026-11-24 ~23:15 +07 — số đo thật đầu tiên trên server local

| Đo | Kết quả |
|---|---|
| `GET /health` (uvicorn local, SQLite) | **200, 0,04s** |
| Backend pytest (27 test) | **11,63s** toàn bộ |
| Frontend `npm run build` | **~25,7s**, 14/14 trang, First Load JS 88–113 kB/trang |
| `GET /tracks` / `/lessons` | 200 (chưa đo latency riêng) |

Vẫn NOT MEASURED: Core Web Vitals, Lighthouse, canvas latency, stress
100/1.000/5.000 nét, đo trên trình duyệt thật, đo với Postgres/Redis.
