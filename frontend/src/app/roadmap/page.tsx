'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api, normalizeModule } from '@/lib/api';
import { MODULES, TRACKS } from '@/lib/curriculum';
import { Loading, SourceBadge } from '@/components/ui';

export default function RoadmapPage() {
  const [modules, setModules] = useState<any[]>(MODULES);
  const [fromApi, setFromApi] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  useEffect(() => {
    try { const s = JSON.parse(localStorage.getItem('drawpath_completed') || '[]'); setCompleted(new Set(s)); } catch {}
    api<any[]>('/modules').then(d => { if (Array.isArray(d) && d.length) { setModules(d.map(normalizeModule)); setFromApi(true); } }).catch(() => {}).finally(() => setLoading(false));
  }, []);
  const shown = modules.filter((m: any) => filter === 'all' || (m.difficulty || m.level || '').toLowerCase().includes(filter) || (filter === 'cơ bản' && ['M00', 'M01', 'M02'].includes(String(m.id))) || (filter === 'trung bình' && ['M03', 'M04', 'M05', 'M06', 'M07'].includes(String(m.id))) || (filter === 'nâng cao' && ['M08', 'M09', 'M10'].includes(String(m.id))));
  if (loading) return <div className="mx-auto max-w-7xl px-4"><Loading label="Đang tải lộ trình…" /></div>;
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="font-display text-3xl font-bold">Lộ trình học vẽ</h1><p className="mt-1 text-graphite/70">Học theo lộ trình chuẩn hoặc tự do — nội dung không bị khóa. Bài vượt trình độ sẽ hiện cảnh báo kỹ năng tiên quyết.</p></div>
        <SourceBadge fromApi={fromApi} />
      </div>
      <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Lọc theo độ khó">
        {['all', 'cơ bản', 'trung bình', 'nâng cao'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`rounded-full border-2 px-4 py-1.5 font-medium ${filter === f ? 'border-terracotta bg-terracotta text-white' : 'border-graphite/20 bg-ivory'}`}>{f === 'all' ? 'Tất cả' : f}</button>
        ))}
      </div>
      <p className="mt-4 text-sm text-graphite/60">Bản đồ kỹ năng: Kiểm soát nét → Dựng hình khối → Phối cảnh → Vật phức tạp · Giá trị/Sáng tối → Ánh sáng nâng cao · Dáng → Tỉ lệ cơ thể → Dựng hình người.</p>
      <div className="mt-6 space-y-6">
        {shown.map((m: any, mi: number) => {
          const lessons = m.lessons || MODULES.find(x => String(x.id) === String(m.id))?.lessons || [];
          const done = lessons.filter((l: any) => completed.has(String(l.id))).length;
          return (
            <section key={m.id} className="card" aria-label={m.name || m.title}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div><p className="text-xs font-bold uppercase tracking-wide text-terracotta">Module {mi + 1}</p>
                  <h2 className="font-display text-2xl font-bold">{m.title || m.name}</h2>
                  <p className="mt-1 text-sm text-graphite/70">{m.description || ''}</p></div>
                <span className="chip">{done}/{lessons.length} bài xong</span>
              </div>
              {mi > 0 && <p className="mt-2 rounded-lg bg-lavender/15 p-2 text-sm">⚠ Nên học sau Module {mi} — kỹ năng tiên quyết: {MODULES[mi - 1]?.title}. Bạn vẫn có thể học trực tiếp nếu muốn.</p>}
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {lessons.map((l: any) => (
                  <Link key={l.id} href={`/lessons/${l.id}`} className="rounded-xl border border-graphite/10 bg-white p-4 transition hover:-translate-y-0.5 hover:border-terracotta">
                    <p className="font-semibold">{completed.has(String(l.id)) ? '✓ ' : ''}{l.title}</p>
                    <p className="mt-1 text-xs text-graphite/60">{l.difficulty || ''} · {l.duration_minutes || ''} phút</p>
                    <p className="mt-2 text-xs font-semibold text-terracotta">Học bài →</p>
                  </Link>
                ))}
                {lessons.length === 0 && <p className="text-sm text-graphite/60">Module này chưa có bài học nào được công bố.</p>}
              </div>
            </section>
          );
        })}
      </div>
      <section className="mt-10" aria-labelledby="tracks">
        <h2 id="tracks" className="font-display text-2xl font-bold">Chuyên ngành nâng cao</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {TRACKS.map(t => (<article key={t.id} className="card"><h3 className="font-bold">{t.name}</h3><p className="mt-1 text-sm text-graphite/70">{t.description}</p><p className="mt-2 text-xs text-graphite/60">Cần: {t.prerequisites.join(', ')}</p></article>))}
        </div>
      </section>
    </div>
  );
}
