# RELEASE_ACCEPTANCE.md — DrawPath AI — Release Acceptance (P0)

> **Ngày:** 2026-11-24
> **Verdict: NOT_READY (giữ nguyên sau re-audit 2026-11-24 ~23:15 +07).**
>
> **Lý do ngắn (cập nhật):** backend + frontend ĐÃ chạy được local (pytest 27 passed,
> build 14/14, `/health` 200, login thật → 200) — nhưng E2E trên trình duyệt,
> kiểm thử bảo mật, Docker Compose, benchmark AI và expert review giáo trình
> vẫn chưa có. 3/24 mục P0 PASS; chưa đủ để READY_FOR_LOCAL_TESTING.
>
> **Lưu ý khi bàn giao:** các agent song song đã tạo file trong `backend/` và
> `frontend/` sau thời điểm kiểm tra đó. File này **không** đánh giá code mới
> đó (người viết không chạm vào / không chạy). Verdict NOT_READY phản ánh đúng
> cuộc kiểm tra lúc 22:56 và phải được đánh giá lại sau khi kiểm chứng code mới.

---

## 1. Cách đọc matrix

| Cột | Ý nghĩa |
|---|---|
| Requirement | Yêu cầu P0 phải đạt để release |
| Expected | Kết quả mong đợi |
| Actual | Kết quả thật tại thời điểm kiểm tra |
| Status | `PASS` / `FAIL` / `NOT TESTED` / `NOT_STARTED` — chỉ ghi PASS khi có bằng chứng chạy |
| Evidence | Bằng chứng (file, lệnh, output) hoặc "no code, 2026-11-24 audit" |
| Blocking? | `Yes` = chặn release nếu chưa đạt |

## 2. P0 Acceptance Matrix

| # | Requirement | Expected | Actual | Status | Evidence | Blocking? |
|---|---|---|---|---|---|---|
| P0-01 | Backend chạy được local (FastAPI khởi động, `/health` 200) | App khởi động không lỗi, `/health` trả 200 | Khởi động được; `/health` → 200 (0,04s), `/` → 200 | **PASS** | Re-audit 2026-11-24 ~23:15 +07, `TEST_RESULTS.md` §5.2 | Yes |
| P0-02 | Frontend build được (`npm run build` PASS, `tsc --noEmit` PASS) | Build thành công, không lỗi type | `npm run build` compiled successfully, 14/14 trang; `tsc --noEmit` độc lập CHƯA chạy | **PASS (build)** | Re-audit 2026-11-24, `TEST_RESULTS.md` §5.2 | Yes |
| P0-03 | Auth: đăng ký → đăng nhập → JWT dùng được | TC-AUTH-01 PASS | Chưa chạy | NOT RUN | No code, 2026-11-24 audit | Yes |
| P0-04 | Auth: không token → 401; token hết hạn/giả → 401 | TC-AUTH-02/03/05 PASS | Chưa chạy | NOT RUN | No code, 2026-11-24 audit | Yes |
| P0-05 | Lesson: learner xem được lesson miễn phí đã publish | TC-E2E-B-01/02 PASS | Chưa chạy | NOT RUN | No code, 2026-11-24 audit | Yes |
| P0-06 | Canvas: vẽ, undo/redo, reload còn đủ nét | TC-E2E-D-01/02 PASS | Chưa chạy | NOT RUN | No code, 2026-11-24 audit | Yes |
| P0-07 | Submit: nộp bài tạo submission + job chấm | TC-SUB-01, TC-E2E-B-03 PASS | Chưa chạy | NOT RUN | No code, 2026-11-24 audit | Yes |
| P0-08 | Local assessment: chấm bằng local CV trả đủ rubric | TC-AI-01/03 PASS | Chưa chạy | NOT RUN | No code, 2026-11-24 audit | Yes |
| P0-09 | Feedback: xem được điểm rubric + gợi ý | TC-E2E-B-04 PASS | Chưa chạy | NOT RUN | No code, 2026-11-24 audit | Yes |
| P0-10 | Paper upload: upload JPEG/PNG hợp lệ; từ chối file giả mạo/quá lớn | TC-E2E-C-01/02/03 PASS | Chưa chạy | NOT RUN | No code, 2026-11-24 audit | Yes |
| P0-11 | Authorization: A không đọc/sửa được bài của B | TC-SEC-01/02 PASS (403) | Chưa chạy | NOT RUN | No code, 2026-11-24 audit | Yes |
| P0-12 | Authorization: learner không gọi được admin API | TC-SEC-03 PASS (403) | Chưa chạy | NOT RUN | No code, 2026-11-24 audit | Yes |
| P0-13 | Admin: publish lesson → learner thấy | TC-E2E-E-02 PASS | Chưa chạy | NOT RUN | No code, 2026-11-24 audit | Yes |
| P0-14 | AI failure: provider lỗi → fallback local CV, báo rõ nguồn | TC-E2E-G-01 PASS | Chưa chạy | NOT RUN | No code, 2026-11-24 audit | Yes |
| P0-15 | Revision history: nộp lại, lịch sử còn đủ | TC-E2E-H-01/02 PASS | Chưa chạy | NOT RUN | No code, 2026-11-24 audit | Yes |
| P0-16 | Upload an toàn: MIME sniffing, strip EXIF, chống traversal | TC-SEC-06/07, TC-E2E-C-04 PASS | Chưa chạy | NOT RUN | No code, 2026-11-24 audit | Yes |
| P0-17 | Rate limiting: brute-force login + spam AI bị chặn | TC-AUTH-06, TC-SEC-10 PASS | Chưa chạy | NOT RUN | No code, 2026-11-24 audit | Yes |
| P0-18 | Secrets: không có secret thật trong Git/log | TC-SEC-11 PASS (quét sạch) | Chưa chạy | NOT TESTED | No code, 2026-11-24 audit | Yes |
| P0-19 | Backend tests: pytest PASS (unit + API) | `pytest` PASS, 0 fail | **27 passed, 0 fail, 11,63s** (74 warnings `utcnow()` deprecated) | **PASS** | Re-audit 2026-11-24, `TEST_RESULTS.md` §5.2 | Yes |
| P0-20 | E2E Flows A–H PASS trên trình duyệt thật | Mọi flow A–H PASS | Chưa chạy | NOT RUN | No code, 2026-11-24 audit | Yes |
| P0-21 | Security review: không còn mục P0 NOT TESTED | `SECURITY_REVIEW.md` không còn P0 NOT TESTED | Toàn bộ NOT TESTED | NOT TESTED | SECURITY_REVIEW.md, 2026-11-24 | Yes |
| P0-22 | Privacy: bài vẽ private-by-default; xóa tài khoản/dữ liệu chạy được | TC kiểm tra privacy PASS | Chưa chạy | NOT RUN | No code, 2026-11-24 audit | Yes |
| P0-23 | Docs Phase 1 đầy đủ + nhất quán | 14 file docs đầy đủ, số liệu nhất quán | 14 file đã viết 2026-11-24, **chưa review chéo** | INCOMPLETE | Files tại repo root, unreviewed | Yes (cho release docs) |
| P0-24 | Không có bug P0/P1 mở (trừ bug provider ngoài đã có mitigation) | BUG log không còn P0/P1 OPEN chặn release | BUG-001 (Major, OPEN), BUG-002 (Minor, OPEN) | FAIL | BUG_REPORT.md, 2026-11-24 | Yes — BUG-001 cần mitigation (retry + fallback) trước khi release tính năng dùng Pollinations image |

**Tổng kết matrix (cập nhật re-audit 2026-11-24 ~23:15 +07): 3/24 PASS** (P0-01, P0-02 build, P0-19). 1 mục FAIL (P0-24, do BUG-001), còn lại NOT_STARTED / NOT RUN / NOT TESTED / INCOMPLETE. P0-03 có bằng chứng một phần (login JSON + `/auth/me` → 200) nhưng flow register→login đầy đủ và E2E trình duyệt chưa chạy nên vẫn NOT RUN.

## 3. Verdict: NOT_READY — lý do chi tiết

1. ~~**Không có sản phẩm chạy được** (P0-01, P0-02)~~ — **ĐÃ ĐẠT trong re-audit:** backend khởi động (`/health` 200), frontend build 14/14 trang.
2. ~~**0 product test đã PASS** (P0-19, P0-20)~~ — **P0-19 ĐÃ ĐẠT:** pytest **27 passed**; P0-20 (E2E trình duyệt Flows A–H) vẫn NOT RUN.
3. **Mọi flow người dùng (A–H) chưa chạy được** (P0-03…P0-15, P0-20).
4. **Bảo mật chưa kiểm chứng** (P0-04, P0-11, P0-12, P0-16…P0-18, P0-21):
   toàn bộ checklist trong `SECURITY_REVIEW.md` là NOT TESTED.
5. **Bug provider ngoài chưa có mitigation chạy được** (P0-24, BUG-001):
   Pollinations image đã 503 một lần; chưa có retry/fallback code nào.
6. **Docs Phase 1 chưa review chéo** (P0-23): 14 file đã viết nhưng unreviewed.

## 4. Cần gì để đạt READY_FOR_LOCAL_TESTING

Đây là mốc tiếp theo (chưa phải production-ready). Cần **tất cả** các điều sau,
mỗi điều có bằng chứng chạy thật trong `TEST_RESULTS.md`:

- [x] **Backend + frontend first slice chạy được:**
  backend khởi động (`/health` 200), frontend build được (`npm run build` PASS) — **ĐẠT 2026-11-24 (re-audit)**.
- [ ] **Auth + lesson + canvas + submit + local assessment chạy end-to-end:**
  P0-03, P0-05, P0-06, P0-07, P0-08, P0-09 PASS (Flows A, B, D + chấm local).
- [ ] **Phân quyền + upload an toàn PASS:** P0-11, P0-12, P0-16 PASS.
- [ ] **Fallback AI PASS:** P0-14 PASS (provider lỗi → local CV, báo rõ nguồn).
- [ ] **Tests P0 PASS:** P0-19 (pytest) + P0-20 (E2E Flows A–H) PASS, 0 fail P0.
- [ ] **Security review P0 chạy xong:** P0-21 không còn mục P0 NOT TESTED.
- [ ] **BUG-001 có mitigation chạy được:** retry + fallback đã triển khai và
  test PASS (TC-E2E-G-01); BUG-001 chuyển sang VERIFIED FIXED hoặc có quyết
  định ghi rõ "chấp nhận rủi ro + mitigation".
- [ ] **Docs Phase 1 review chéo xong:** P0-23 đạt (số liệu nhất quán, sửa lệch).

Sau khi đạt READY_FOR_LOCAL_TESTING, các mốc tiếp theo (chưa phải bây giờ):
`READY_FOR_STAGING` → `READY_FOR_USER_TESTING` → `READY_FOR_PRODUCTION`
(mỗi mốc có matrix riêng; production cần thêm phê duyệt của user, expert review
giáo trình, privacy/ToS, quyết định độ tuổi — xem `TASKS.md` Phase 10).

## 5. Ai quyết định verdict thay đổi

- Verdict chỉ đổi khi có bằng chứng chạy thật (lệnh + output) trong
  `TEST_RESULTS.md`, và matrix §2 được cập nhật tương ứng.
- Không ai được đổi verdict thành READY chỉ vì "code đã viết xong" mà chưa chạy test.
- Production release cần phê duyệt bằng văn bản của người dùng (xem `DECISIONS.md` D-06).
