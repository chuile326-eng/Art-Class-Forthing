'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api, currentUserName, isGuest, MASTERY_LABEL, MASTERY_PCT, normalizeLesson } from '@/lib/api';
import { ALL_LESSONS, MODULES } from '@/lib/curriculum';
import { EmptyBox, ErrorBox, Loading, ProgressBar, SourceBadge } from '@/components/ui';

const SKILL_NAMES = ['Kiểm soát nét', 'Độ chính xác hình', 'Tỉ lệ', 'Dựng hình khối', 'Phối cảnh', 'Quan sát', 'Sáng tối', 'Màu sắc', 'Giải phẫu', 'Bố cục'];

export default function DashboardPage() {
  const [progress, setProgress] = useState<any>(null);
  const [mastery, setMastery] = useState<any[]>([]);
  const [recs, setRecs] = useState<any[]>([]);
  const [subs, setSubs] = useState<any[]>([]);
  const [error, setError] = useState(''); const [loading, setLoading] = useState(true);
  const [fromApi, setFromApi] = useState(false);
  const guest = isGuest();
  useEffect(() => {
    (async () => {
      try {
        const [p, r, m] = await Promise.allSettled([api('/progress'), api('/recommendations'), api('/mastery')]);
        if (p.status === 'fulfilled') { setProgress(p.value); setFromApi(true); }
        if (r.status === 'fulfilled' && Array.isArray(r.value)) setRecs(r.value);
        if (m.status === 'fulfilled' && Array.isArray(m.value)) setMastery(m.value);
        const s = await api<any>('/submissions').catch(() => null);
        if (Array.isArray(s)) setSubs(s); else if (s?.items) setSubs(s.items);
      } catch (e: any) { setError(e.message); }
      setLoading(false);
    })();
  }, []);
  if (loading) return <div className="mx-auto max-w-7xl px-4"><Loading label="Đang tải bảng học tập…" /></div>;
  // Backend GET /progress -> {total_lessons, completed, items:[{lesson_id:int,...}]}
  const completed = progress?.completed ?? progress?.completed_lessons ?? 0;
  const total = progress?.total_lessons ?? ALL_LESSONS.length;
  const pct = total ? Math.round((completed / total) * 100) : 0;
  const skills: any[] = mastery.length ? mastery.map((s: any) => ({ name: s.name, level: MASTERY_PCT[s.level] ?? s.score ?? 0, status: MASTERY_LABEL[s.level] || s.level })) : SKILL_NAMES.map(n => ({ name: n, level: 0, status: 'Chưa bắt đầu' }));
  const weak = skills.filter((s: any) => (s.level ?? 0) < 40).slice(0, 3);
  const recommended: any[] = recs.length
    ? recs.map((r: any) => ({ lesson: ALL_LESSONS.find(l => String(l.id) === String(r.lesson_id)) || { id: r.lesson_id, title: `Bài ${r.lesson_id}` }, reason: r.reason }))
    : ALL_LESSONS.slice(0, 3).map(l => ({ lesson: l, reason: 'Bài tiếp theo trong lộ trình nền tảng.' }));
  const continueLesson = ALL_LESSONS[Math.min(completed, ALL_LESSONS.length - 1)];
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="font-display text-3xl font-bold">Xin chào, {currentUserName()}</h1><p className="text-graphite/70">Bảng học tập của bạn — tiến độ thật từ tài khoản của bạn, không dùng số liệu giả.</p></div>
        <SourceBadge fromApi={fromApi} />
      </div>
      {guest && <div className="card mt-4 border-lavender bg-lavender/10"><p>Bạn đang ở chế độ khách — tiến độ không được lưu. <Link href="/auth/register" className="font-semibold text-terracotta">Đăng ký tài khoản</Link> để lưu tiến độ.</p></div>}
      {error && <div className="mt-4"><ErrorBox message={error} onRetry={() => location.reload()} /></div>}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="card" aria-labelledby="continue">
            <h2 id="continue" className="font-display text-xl font-bold">Tiếp tục học</h2>
            <ProgressBar value={pct} label={`Đã hoàn thành ${completed}/${total} bài`} />
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div><p className="font-semibold">{continueLesson.title}</p><p className="text-sm text-graphite/60">{continueLesson.description}</p></div>
              <Link href={`/lessons/${continueLesson.id}`} className="btn-primary">Học tiếp →</Link>
            </div>
          </section>
          <section className="card" aria-labelledby="rec">
            <h2 id="rec" className="font-display text-xl font-bold">Bài học gợi ý</h2>
            {recommended.length === 0 ? <EmptyBox title="Chưa có gợi ý nào">Hoàn thành thêm bài học để nhận gợi ý cá nhân hóa.</EmptyBox> : (
              <ul className="mt-3 space-y-3">{recommended.map((r: any, i: number) => {
                const l = r.lesson || r; if (!l?.id) return null;
                return <li key={i} className="flex items-center justify-between gap-3 rounded-xl border border-graphite/10 p-3">
                  <div><p className="font-semibold">{l.title}</p><p className="text-sm text-graphite/60">{r.reason || l.description || ''}</p></div>
                  <Link href={`/lessons/${l.id}`} className="btn-secondary !px-3 !py-1.5 text-sm">Học</Link></li>;
              })}</ul>)}
          </section>
          <section className="card" aria-labelledby="subs">
            <h2 id="subs" className="font-display text-xl font-bold">Bài nộp gần đây</h2>
            {subs.length === 0 ? <EmptyBox title="Bạn chưa nộp bài nào">Hoàn thành một bài luyện và nộp bài để nhận phản hồi AI.</EmptyBox> : (
              <ul className="mt-3 space-y-2">{subs.slice(0, 5).map((s: any) => (
                <li key={s.id} className="flex justify-between gap-3 rounded-xl border border-graphite/10 p-3 text-sm">
                  <span>Bài nộp #{String(s.id).slice(0, 8)} — {s.status || 'đang xử lý'}</span>
                  <Link href={`/submissions/${s.id}`} className="font-semibold text-terracotta">Xem →</Link></li>))}</ul>)}
          </section>
        </div>
        <div className="space-y-6">
          <section className="card" aria-labelledby="skills">
            <h2 id="skills" className="font-display text-xl font-bold">Hồ sơ kỹ năng</h2>
            {skills.length === 0 ? <p className="mt-2 text-sm text-graphite/60">Chưa có dữ liệu kỹ năng. Nộp bài để hệ thống đo kỹ năng của bạn.</p> : (
              <ul className="mt-3 space-y-3">{skills.map((s: any, i: number) => (
                <li key={i}><div className="flex justify-between text-sm"><span>{s.name}</span><span>{s.level ?? 0}/100 · {s.status || ''}</span></div>
                <div className="mt-1 h-2 rounded-full bg-graphite/10"><div className="h-full rounded-full bg-sage" style={{ width: `${Math.min(100, s.level ?? 0)}%` }} /></div></li>))}</ul>)}
          </section>
          <section className="card" aria-labelledby="weak">
            <h2 id="weak" className="font-display text-xl font-bold">Kỹ năng cần luyện thêm</h2>
            {weak.length === 0 ? <p className="mt-2 text-sm text-graphite/60">Chưa xác định được kỹ năng yếu — hãy nộp thêm bài.</p> : (
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">{weak.map((s: any, i: number) => <li key={i}>{s.name} — luyện lại bài liên quan trong lộ trình.</li>)}</ul>)}
            <Link href="/roadmap" className="btn-secondary mt-4">Xem lộ trình</Link>
          </section>
          <section className="card">
            <h2 className="font-display text-xl font-bold">Lộ trình</h2>
            <p className="mt-1 text-sm text-graphite/70">{MODULES.length} module · {ALL_LESSONS.length} bài học · 4 chuyên ngành.</p>
            <Link href="/workspace" className="btn-primary mt-3 w-full">Mở bảng vẽ</Link>
          </section>
        </div>
      </div>
    </div>
  );
}
