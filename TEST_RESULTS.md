# TEST_RESULTS.md — DrawPath AI — Kết quả kiểm thử (CHỈ KẾT QUẢ THẬT)

> **Ngày kiểm tra:** 2026-11-24
> **Múi giờ:** Asia/Saigon (+07)
> **Kết luận ngắn: 0 product test đã PASS. Sản phẩm NOT_READY.**
> File này chỉ ghi những gì đã chạy thật. Mọi thứ chưa chạy ghi NOT RUN,
> không suy diễn, không làm tròn thành PASS.

---

## 1. Môi trường kiểm tra (đã xác minh bằng lệnh)

| Hạng mục | Giá trị đo được | Cách xác minh |
|---|---|---|
| Python | **3.12.3** | `python3 --version` |
| Node.js | **v24.22.1** | `node --version` |
| npm | **10.9.4** | `npm --version` |
| Docker | **KHÔNG cài đặt** trong VM này | `which docker` không trả về gì |
| psql (PostgreSQL client) | **KHÔNG cài đặt** trong VM này | `which psql` không trả về gì |
| Thư mục repo `~/workspace/art-class-forthing/` | **Được ghi nhận là TRỐNG tại ~22:56 +07** — không có `backend/`, `frontend/`, không có code, test, Dockerfile | `ls` tại thời điểm kiểm tra |
| Ngày/giờ kiểm tra API ngoài | 2026-11-24 22:56 UTC (tức 2026-11-25 05:56 +07 — xem ghi chú) | Xem §3 |

**Ghi chú về mốc thời gian:** task giao ghi "kiểm tra 2026-11-24 22:56 UTC".
Các file trong repo được tạo lúc 15:55–16:00 UTC cùng ngày bởi các agent song
song (sau thời điểm kiểm tra đó, trước khi file này được viết). Người viết file
này **không chạy lại** kiểm tra trên code mới đó, không chạm vào `backend/` /
`frontend/`. Nếu repo hiện tại đã có code, các dòng NOT RUN dưới đây phản ánh
đúng **cuộc kiểm tra lúc 22:56**, và phải chạy lại trước khi dùng làm căn cứ.

## 2. Kết quả test sản phẩm (product tests)

| Hạng mục | Lệnh / cách chạy | Kết quả thật | Số test PASS |
|---|---|---|---|
| Backend pytest | `pytest` (không chạy được — không có code) | **NOT RUN — no backend code (0 tests collected)** | **0** |
| Frontend build | `npm run build` (không chạy được — không có `package.json`) | **NOT RUN — no package.json** | **0** |
| Python compile | `python -m py_compile` (không chạy được — không có file `.py`) | **NOT RUN — no .py files** | **0** |
| Typecheck `tsc --noEmit` | Không chạy được — không có frontend code | **NOT RUN** | **0** |
| Lint (`ruff`/`eslint`) | Không chạy được — không có code | **NOT RUN** | **0** |
| E2E (Playwright, Flows A–H) | Không chạy được — không có app | **NOT RUN** | **0** |
| API tests (TestClient) | Không chạy được — không có app | **NOT RUN** | **0** |
| Integration (DB/Redis/MinIO) | Không chạy được — Docker không cài, không có compose chạy | **NOT RUN** | **0** |
| Security tests (TC-SEC-*) | Không chạy được — không có endpoint | **NOT RUN** | **0** |
| Accessibility (axe) | Không chạy được — không có trang | **NOT RUN** | **0** |
| Visual regression | Không chạy được — không có baseline/trang | **NOT RUN** | **0** |
| AI evaluation (golden set) | Không chạy được — không có engine/golden set | **NOT RUN** | **0** |
| Performance (Lighthouse, canvas) | Không chạy được — không có app | **NOT MEASURED** | **0** |

### Tuyên bố rõ ràng

> **0 product test đã pass. 0 product test đã fail. 0 product test đã chạy.**
> Toàn bộ test sản phẩm ở trạng thái NOT RUN vì không có code để test tại thời
> điểm kiểm tra. Đây không phải là "sản phẩm không có lỗi" — đây là "chưa biết
> sản phẩm có lỗi hay không".

## 3. Kiểm tra API miễn phí bên ngoài (live checks — ĐÃ CHẠY THẬT)

Đây là phần **duy nhất** có số đo thật trong đợt kiểm tra này. Các lệnh gọi HTTP
trực tiếp tới provider bên ngoài, ngày 2026-11-24 22:56 UTC. Các số này đo
**độ trễ / tính khả dụng của provider ngoài**, không phải hiệu năng sản phẩm
DrawPath AI (vì sản phẩm chưa tồn tại để đo).

| Provider / Endpoint | Kết quả | Latency | Ghi chú |
|---|---|---|---|
| Pollinations text — `https://text.pollinations.ai/` | **HTTP 200** | **4,35s** (lần đo chính); **6,22s** với một prompt ngắn khác trước đó | Chạy được, nhưng chậm (vài giây cho 1 request text) |
| Pollinations image | **HTTP 503** lần đầu (3,03s), rồi **HTTP 200** khi retry (5,78s), ảnh JPEG 8.666 byte | 3,03s (fail) / **5,78s** (retry thành công) | **FLAKY** — lỗi 1 lần rồi thành công khi thử lại. Xem BUG-001 trong `BUG_REPORT.md` |
| Openverse | **HTTP 200** | **16,6s** | Chạy được nhưng **rất chậm**. Xem BUG-002 |
| Wikipedia REST | **HTTP 200** | **0,59s** | Nhanh, ổn định trong lần đo này |
| HuggingFace Inference (không token) | **HTTP 000 — timeout sau 30s** | > 30s (timeout) | **NOT VERIFIED, key-gated** — không dùng được khi chưa có key; không kết luận provider hỏng |
| OpenRouter `/v1/models` | **HTTP 200** (không cần key) | (không ghi latency) | **Chỉ list model**; gọi chat cần key — **key-gated** |
| DuckDuckGo Instant Answer | **HTTP 202, abstract rỗng** | (không ghi latency) | **Đã kiểm tra, không phù hợp** (không trả nội dung dùng được) |

### Cách hiểu đúng các số trên

- Một lần đo HTTP 200 **không** chứng minh provider sẽ luôn chạy được.
  Pollinations image đã 503 ngay trong đợt đo này.
- Latency vài giây tới 16,6s nghĩa là: nếu gọi trực tiếp (synchronous) trong
  request chấm bài, người dùng sẽ phải chờ rất lâu. Thiết kế phải dùng hàng đợi
  (Celery) + timeout + fallback local CV (xem `SECURITY.md` §12, `TEST_PLAN.md` §2.10).
- HuggingFace timeout không có key **không** có nghĩa là "HuggingFace hỏng" —
  chỉ có nghĩa là chưa xác minh được khi không có key.

## 4. Template cho lần chạy sau (để trống, điền bằng kết quả thật)

> **Quy tắc:** chỉ điền vào bảng này sau khi đã chạy lệnh thật. Copy output
> vào, ghi ngày/giờ, ghi rõ lệnh. Không điền PASS từ trí nhớ.

### 4.1. Lần chạy: ____ (ngày ____, người chạy ____, commit ____)

| Hạng mục | Lệnh | Kết quả | Số test (pass/fail/skip) |
|---|---|---|---|
| Backend pytest | `cd backend && python -m pytest -q` | (chưa chạy) | — |
| Frontend build | `cd frontend && npm run build` | (chưa chạy) | — |
| Typecheck | `cd frontend && npx tsc --noEmit` | (chưa chạy) | — |
| Lint | `ruff check backend/app && npm run lint` | (chưa chạy) | — |
| API tests | (ghi lệnh) | (chưa chạy) | — |
| E2E Playwright | (ghi lệnh) | (chưa chạy) | — |
| Security checklist | (xem `SECURITY_REVIEW.md`) | (chưa chạy) | — |
| Lighthouse | (ghi lệnh/URL) | (chưa chạy) | — |

**Output thô (dán nguyên văn):**

```
(chưa có — dán output thật vào đây khi chạy)
```

### 4.2. Lịch sử các lần chạy

| Ngày | Phạm vi chạy | Kết quả tóm tắt | Link / ghi chú |
|---|---|---|---|
| 2026-11-24 | Chỉ kiểm tra API ngoài (§3) + xác minh môi trường (§1) | 0 product test chạy; API ngoài: xem §3 | File này, §2–§3 |
| (trống) | — | — | — |

---

## 5. RE-AUDIT 2026-11-24 ~23:15 +07 — code do agent song song tạo đã được CHẠY THẬT

> Lý do re-audit: các file §1–§4 trên được viết theo kiểm tra lúc ~22:56 khi repo
> được ghi nhận là trống. Lúc ~23:01 repo đã có `backend/` + `frontend/` thật.
> Re-audit này chạy trực tiếp trên code đó. Các số §1–§4 KHÔNG bị xóa — chúng
> phản ánh đúng thời điểm 22:56; phần này là kết quả mới, thay thế chúng làm căn cứ.

### 5.1. Môi trường re-audit

| Hạng mục | Giá trị |
|---|---|
| Python (venv backend) | `.venv/bin/python` 3.12 |
| Node / npm | v24.22.1 / 10.9.4 |
| Docker / psql | vẫn KHÔNG cài trong VM này |
| Backend | FastAPI 0.115.6, SQLite mặc định (`drawpath.db`), 26 model, 48 endpoint (46 router + `/health`, `/`) |
| Frontend | Next.js 14.2.35 / React 18.3.1 |

### 5.2. Kết quả chạy thật

| Hạng mục | Lệnh | Kết quả |
|---|---|---|
| `py_compile` backend | `python3 -m py_compile app/main.py app/models.py app/seed.py app/ai_providers.py app/assessment/*.py app/routers/*.py` | **PASS** (không lỗi) |
| Backend pytest | `.venv/bin/python -m pytest tests/ -q` | **27 passed, 74 warnings, 11,63 giây** (warnings chủ yếu `datetime.utcnow()` deprecated trong `app/auth.py`, `app/models.py`, `submission_router.py`) |
| Frontend build | `npm run build` | **PASS — compiled successfully, 14/14 trang** (First Load JS 88–113 kB/trang; shared 87,3 kB) |
| Server thật `/health` | uvicorn port 8123, `curl /health` | **200, 0,04s** — `{"status":"ok","service":"drawpath-ai","version":"0.1.0"}` |
| Server thật `/` | `curl /` | **200** |
| Server thật `/modules` | `curl /modules` (không auth) | **200** — module M00 "Drawing Fundamentals" kèm lessons |
| Server thật `/tracks` | `curl /tracks` | **200 — 5 track** (Portrait, Anime & Manga, Landscape & Environment, Digital Painting, Foundation) |
| Server thật `/lessons` | `curl /lessons` | **200 — 75 lesson** |
| Login seed (JSON) | `POST /auth/login {"email":"learner@drawpath.app","password":"learner123"}` | **200** — token JWT 141 ký tự |
| `/auth/me` | `GET /auth/me` với token trên | **200** — `{"id":2,"email":"learner@drawpath.app","username":"learner","role":"learner"}` |
| Seed curriculum (file) | `curriculum.json` | **15 module, 75 lesson, 14 skill, 5 track** |

### 5.3. Ghi chú / sai sót của chính người kiểm tra trong re-audit

- Lần gọi đầu `POST /login` (form-encoded) → **404 là lỗi của người gọi**:
  login thật là `POST /auth/login` và nhận **JSON** `{"email","password"}`,
  không phải form `username/password`. Gọi đúng → 200 (xem §5.2). Không phải bug.
- Server test đã dừng sau mỗi lần kiểm tra (pkill uvicorn); không để server chạy nền.

### 5.4. Vẫn NOT RUN sau re-audit

- E2E trên trình duyệt thật (Flows A–H), `next dev` + gọi API từ frontend.
- `docker compose up --build` (Docker chưa cài; compose trỏ Postgres nhưng
  `requirements.txt` chưa có `psycopg2` — backend sẽ lỗi nếu chạy compose như-is).
- Alembic migration thật (hiện chỉ là stub, schema tạo bằng `create_all()`).
- Kiểm thử bảo mật (IDOR, XSS, rate limit…), Lighthouse, đo hiệu năng canvas,
  stylus, đánh giá AI trên golden set, live Pollinations qua backend
  (chỉ mới đo trực tiếp bằng curl, chưa qua `app/ai_providers.py`).

### 5.5. Lịch sử các lần chạy (bổ sung)

| Ngày | Phạm vi chạy | Kết quả tóm tắt |
|---|---|---|
| 2026-11-24 ~23:15 +07 | Re-audit: py_compile, pytest, npm build, server thật + auth + curriculum API | **pytest 27 passed; build 14/14; API 200** (xem §5.2) |
