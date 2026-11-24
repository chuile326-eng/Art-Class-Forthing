'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api, normalizeModule } from '@/lib/api';
import { MODULES, TRACKS } from '@/lib/curriculum';
import { SourceBadge } from '@/components/ui';

const STEPS = [
  { n: '01', t: 'Học', d: 'Lý thuyết trực quan, từng bước rõ ràng.' },
  { n: '02', t: 'Quan sát', d: 'Xem minh họa và nét vẽ mẫu chạy từng nét.' },
  { n: '03', t: 'Thực hành', d: 'Vẽ trên bảng vẽ hoặc nộp ảnh bài trên giấy.' },
  { n: '04', t: 'Phân tích', d: 'AI chấm theo rubric từng tiêu chí.' },
  { n: '05', t: 'Sửa', d: 'Thấy đúng vị trí lỗi và lớp hướng dẫn sửa.' },
  { n: '06', t: 'Tiến bộ', d: 'Nộp lại, so sánh phiên bản, theo dõi kỹ năng.' },
  { n: '07', t: 'Thành thạo', d: 'Vững kỹ năng nền tảng rồi đi chuyên ngành.' },
];

export default function Home() {
  const [modules, setModules] = useState<any[]>(MODULES);
  const [fromApi, setFromApi] = useState(false);
  const [faq, setFaq] = useState<number | null>(0);
  useEffect(() => {
    api<any[]>('/modules').then(d => { if (Array.isArray(d) && d.length) { setModules(d.map(normalizeModule)); setFromApi(true); } }).catch(() => {});
  }, []);
  const faqs = [
    { q: 'Tôi chưa từng vẽ, có học được không?', a: 'Được. Lộ trình bắt đầu từ Module 00: cầm bút, lực tay, nét cơ bản — không yêu cầu kinh nghiệm trước.' },
    { q: 'AI chấm bài như thế nào?', a: 'AI chấm theo rubric riêng cho từng dạng bài (nét, hình, tỉ lệ, phối cảnh, sáng tối…), kèm vị trí lỗi và hướng sửa. Kết quả có mức tin cậy; bài sáng tạo không bị chấm bằng độ giống tuyệt đối.' },
    { q: 'Tôi vẽ trên giấy được không?', a: 'Được. Bạn chụp ảnh bài vẽ và tải lên; hệ thống kiểm tra chất lượng ảnh trước khi chấm.' },
    { q: 'Có cần trả phí không?', a: 'Phiên bản này dùng các API miễn phí có dự phòng. Không có thanh toán trong phạm vi hiện tại.' },
    { q: 'Bài vẽ của tôi có bị công khai không?', a: 'Không. Bài vẽ mặc định riêng tư, chỉ bạn xem được, trừ khi bạn tự chia sẻ từ Portfolio.' },
  ];
  return (
    <div>
      {/* Hero */}
      <section className="paper-texture mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 md:grid-cols-2">
        <div>
          <span className="chip">Nền tảng học vẽ · Gia sư AI</span>
          <h1 className="mt-4 font-display text-5xl font-bold leading-tight md:text-6xl">Học vẽ từ <span className="text-terracotta">nét đầu tiên</span> đến bức tranh hoàn chỉnh.</h1>
          <p className="mt-4 text-lg text-graphite/75">Lộ trình rõ ràng, bảng vẽ tương tác, bài tập có rubric và AI chỉ đúng chỗ bạn sai — rồi hướng dẫn bạn sửa.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/auth/register" className="btn-primary">Bắt đầu học miễn phí →</Link>
            <Link href="/roadmap" className="btn-secondary">Khám phá lộ trình</Link>
            <Link href="/workspace" className="btn-ghost">Thử bảng vẽ ngay</Link>
          </div>
          <p className="mt-4 text-sm text-graphite/60">Không cần kinh nghiệm. Vẽ trên giấy hay digital đều được.</p>
        </div>
        <div className="sketch-border bg-ivory p-4" aria-label="Minh họa vẽ tay: khối hộp, hình cầu và đường nét phác thảo">
          <svg viewBox="0 0 500 380" className="h-auto w-full" role="img" aria-label="Hình minh họa: dựng khối hộp và hình cầu bằng nét phác thảo">
            <rect x="20" y="20" width="460" height="340" rx="12" fill="#FFFCF7" stroke="#242424" strokeWidth="2" strokeDasharray="6 5" />
            <path className="animate-draw" d="M80 260 L180 200 L300 200 L200 260 Z M180 200 L180 110 L300 110 L300 200 M80 260 L80 170 L180 110" fill="none" stroke="#242424" strokeWidth="3" strokeLinecap="round" />
            <circle className="animate-draw" cx="380" cy="130" r="55" fill="none" stroke="#D56B46" strokeWidth="3" />
            <path d="M340 150 Q380 190 420 150" fill="none" stroke="#8C9B85" strokeWidth="3" strokeLinecap="round" />
            <ellipse cx="380" cy="215" rx="70" ry="12" fill="#A59ACB" opacity="0.35" />
            <path d="M60 310 Q200 280 320 310 T460 300" fill="none" stroke="#EF8B73" strokeWidth="3" strokeLinecap="round" />
            <text x="40" y="350" fontSize="16" fill="#41403E" fontFamily="serif">Khối hộp · Hình cầu · Nét phác thảo</text>
          </svg>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-4 py-8" aria-labelledby="how">
        <h2 id="how" className="font-display text-3xl font-bold">Cách nền tảng hoạt động</h2>
        <p className="mt-2 text-graphite/70">Learn → Observe → Practice → Analyze → Correct → Improve → Master.</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(s => (
            <article key={s.n} className="card"><p className="font-display text-3xl font-bold text-terracotta">{s.n}</p><h3 className="mt-1 text-lg font-bold">{s.t}</h3><p className="mt-1 text-sm text-graphite/70">{s.d}</p></article>
          ))}
          <article className="card bg-terracotta text-white"><h3 className="text-lg font-bold">Vòng lặp không dừng ở một bài</h3><p className="mt-1 text-sm text-white/85">Mỗi lần nộp lại là một lần tiến bộ có thể đo được — hệ thống lưu lịch sử và so sánh các phiên bản.</p></article>
        </div>
      </section>

      {/* Modules */}
      <section className="mx-auto max-w-7xl px-4 py-8" aria-labelledby="modules">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="modules" className="font-display text-3xl font-bold">Hệ thống học phần</h2>
          <SourceBadge fromApi={fromApi} />
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {modules.slice(0, 6).map((m: any, i: number) => (
            <Link key={m.id} href="/roadmap" className="card transition hover:-translate-y-1">
              <p className="text-xs font-bold uppercase tracking-wide text-terracotta">{m.name || m.title || `Module ${i}`}</p>
              <h3 className="mt-1 text-lg font-bold">{m.title || m.name}</h3>
              <p className="mt-1 text-sm text-graphite/70">{m.description || ''}</p>
              <p className="mt-3 text-sm font-semibold text-terracotta">Xem lộ trình →</p>
            </Link>
          ))}
        </div>
        <p className="mt-4 text-sm text-graphite/60">Tổng cộng {MODULES.length} module nền tảng · {MODULES.reduce((a, m) => a + m.lessons.length, 0)} bài học · 4 chuyên ngành nâng cao.</p>
      </section>

      {/* Workspace + AI feedback example */}
      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 md:grid-cols-2">
        <article className="card">
          <h2 className="font-display text-2xl font-bold">Bảng vẽ tương tác</h2>
          <p className="mt-2 text-sm text-graphite/70">Bút chì, cọ, tẩy, lớp vẽ, hoàn tác, thu phóng, lưu tự động và phát lại từng nét. Vẽ bằng chuột, cảm ứng hoặc bút stylus.</p>
          <Link href="/workspace" className="btn-primary mt-4">Mở bảng vẽ</Link>
        </article>
        <article className="card border-terracotta/40">
          <div className="flex items-center justify-between"><h2 className="font-display text-2xl font-bold">Ví dụ phản hồi AI</h2><span className="chip bg-coral/20">Ví dụ minh họa</span></div>
          <p className="mt-2 text-sm text-graphite/70">Bài luyện ellipse — điểm tổng <strong>72/100</strong>. Đây là ví dụ minh họa định dạng phản hồi, không phải kết quả thật của bạn.</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>✓ <strong>Điểm mạnh:</strong> Độ cong đều ở nửa trên của ellipse.</li>
            <li>✗ <strong>Cần sửa:</strong> Trục ellipse lệch 8° so với trục ngang; nửa dưới bị dẹt.</li>
            <li>→ <strong>Hướng sửa:</strong> Vẽ trục ngang trước, kiểm tra hai đầu ellipse cách trục đều nhau.</li>
          </ul>
          <Link href="/lessons/L01-03" className="btn-secondary mt-4">Học bài Ellipse</Link>
        </article>
      </section>

      {/* Tracks */}
      <section className="mx-auto max-w-7xl px-4 py-8" aria-labelledby="tracks">
        <h2 id="tracks" className="font-display text-3xl font-bold">Chuyên ngành nâng cao</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {TRACKS.map(t => (
            <article key={t.id} className="card"><h3 className="text-lg font-bold">{t.name}</h3><p className="mt-1 text-sm text-graphite/70">{t.description}</p><p className="mt-3 text-xs text-graphite/60">Cần học trước: {t.prerequisites.join(', ')}</p></article>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 py-8" aria-labelledby="faq">
        <h2 id="faq" className="font-display text-3xl font-bold">Câu hỏi thường gặp</h2>
        <div className="mt-6 space-y-3">
          {faqs.map((f, i) => (
            <div key={i} className="card !p-0 overflow-hidden">
              <button className="flex w-full items-center justify-between px-5 py-4 text-left font-semibold" aria-expanded={faq === i} onClick={() => setFaq(faq === i ? null : i)}>{f.q}<span aria-hidden>{faq === i ? '−' : '+'}</span></button>
              {faq === i && <p className="border-t border-graphite/10 px-5 py-4 text-sm text-graphite/75">{f.a}</p>}
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/auth/register" className="btn-primary !px-8 !py-3 text-lg">Bắt đầu bài học đầu tiên</Link>
        </div>
      </section>
    </div>
  );
}
