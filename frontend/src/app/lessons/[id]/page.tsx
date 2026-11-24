'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { api, normalizeLesson } from '@/lib/api';
import { findLesson, nextLesson, ALL_LESSONS } from '@/lib/curriculum';
import { renderAll, LOGICAL_W, LOGICAL_H, sampleDemoStrokes, type Stroke } from '@/lib/canvas';
import { EmptyBox, ErrorBox, Loading, SourceBadge } from '@/components/ui';

export default function LessonPage({ params }: { params: { id: string } }) {
  const [lesson, setLesson] = useState<any>(null);
  const [numericId, setNumericId] = useState<number | null>(null);
  const [exercises, setExercises] = useState<any[]>([]);
  const [fromApi, setFromApi] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'guided' | 'assisted' | 'independent'>('guided');
  const [playing, setPlaying] = useState(false);
  const [replayPct, setReplayPct] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [done, setDone] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    (async () => {
      try {
        const data: any = await api(`/lessons/${params.id}`);
        if (data && (data.title || data.name)) {
          const norm = normalizeLesson(data);
          setLesson(norm); setNumericId(typeof data.id === 'number' ? data.id : null); setFromApi(true);
          api<any[]>(`/lessons/${params.id}/exercises`).then(ex => { if (Array.isArray(ex)) setExercises(ex); }).catch(() => {});
        } else setLesson(findLesson(params.id) || null);
      } catch { setLesson(findLesson(params.id) || null); }
      setLoading(false);
      try { const s = JSON.parse(localStorage.getItem('drawpath_completed') || '[]'); setDone(s.includes(params.id)); } catch {}
    })();
    return () => cancelAnimationFrame(rafRef.current);
  }, [params.id]);

  const demoStrokes: Stroke[] = sampleDemoStrokes();
  const totalPoints = demoStrokes.reduce((a, s) => a + s.points.length, 0);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas || !lesson) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    const upto = new Map<string, number>();
    let remaining = Math.floor(totalPoints * replayPct);
    for (const s of demoStrokes) { const take = Math.min(s.points.length, remaining); upto.set(s.id, take); remaining -= take; if (remaining <= 0) break; }
    ctx.setTransform(canvas.width / LOGICAL_W, 0, 0, canvas.height / LOGICAL_H, 0, 0);
    renderAll(ctx, demoStrokes, [{ id: 'layer-1', name: 'Demo', visible: true, locked: false }], upto);
  }, [lesson, replayPct]); // eslint-disable-line

  useEffect(() => {
    if (!playing) return;
    let last = performance.now();
    const tick = (t: number) => {
      const dt = (t - last) / 1000; last = t;
      setReplayPct(p => {
        const next = p + dt * 0.08 * speed;
        if (next >= 1) { setPlaying(false); return 1; }
        return next;
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [playing, speed]);

  function markDone() {
    try {
      const s: string[] = JSON.parse(localStorage.getItem('drawpath_completed') || '[]');
      if (!s.includes(params.id)) { s.push(params.id); localStorage.setItem('drawpath_completed', JSON.stringify(s)); }
    } catch {}
    if (numericId) api('/progress', { method: 'POST', body: JSON.stringify({ lesson_id: numericId, status: 'completed', progress_pct: 100 }) }).catch(() => {});
    setDone(true);
  }

  if (loading) return <div className="mx-auto max-w-5xl px-4"><Loading label="Đang tải bài học…" /></div>;
  if (!lesson) return <div className="mx-auto max-w-5xl px-4 py-10"><ErrorBox message={`Không tìm thấy bài học “${params.id}” trên máy chủ và trong chương trình mẫu.`} onRetry={() => location.reload()} /><p className="mt-4"><Link href="/roadmap" className="font-semibold text-terracotta">← Quay lại lộ trình</Link></p></div>;

  const nxt = lesson?.nextLessonId ? (findLesson(lesson.nextLessonId) || { id: lesson.nextLessonId, title: 'Bài tiếp theo' }) : nextLesson(params.id);
  const steps: string[] = lesson.steps || [];
  const rubric: any[] = lesson.rubric || [];
  const objectives: string[] = lesson.objectives || [];
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Link href="/roadmap" className="text-sm font-semibold text-terracotta">← Lộ trình</Link>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <h1 className="font-display text-3xl font-bold">{lesson.title}</h1><SourceBadge fromApi={fromApi} />
      </div>
      <p className="mt-2 text-graphite/75">{lesson.description || ''}</p>
      <p className="mt-1 text-sm text-graphite/60">Độ khó: {lesson.difficulty || '—'} · Thời lượng ước tính: {lesson.duration_minutes || '—'} phút</p>

      {objectives.length > 0 && (
        <section className="card mt-6" aria-labelledby="obj"><h2 id="obj" className="font-display text-xl font-bold">Mục tiêu bài học</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">{objectives.map((o, i) => <li key={i}>{o}</li>)}</ul></section>
      )}

      <section className="card mt-6" aria-labelledby="theory"><h2 id="theory" className="font-display text-xl font-bold">Lý thuyết</h2>
        <p className="mt-2 whitespace-pre-line text-sm leading-relaxed">{lesson.theory || 'Nội dung lý thuyết của bài học này đang được biên soạn. Hãy làm theo các bước thực hành bên dưới.'}</p></section>

      <section className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="card border-sage"><h3 className="font-bold text-sage">✓ Ví dụ đúng</h3><p className="mt-1 text-sm">{lesson.correctExample || 'Nét đều, đúng hướng, đúng tỉ lệ.'}</p></div>
        <div className="card border-terracotta/50"><h3 className="font-bold text-terracotta">✗ Ví dụ sai thường gặp</h3><p className="mt-1 text-sm">{lesson.wrongExample || 'Nét run, lệch hướng, sai tỉ lệ.'}</p></div>
      </section>

      <section className="card mt-6" aria-labelledby="steps"><h2 id="steps" className="font-display text-xl font-bold">Hướng dẫn từng bước</h2>
        {steps.length === 0 ? <EmptyBox title="Bài học chưa có bước hướng dẫn chi tiết." /> : (
          <ol className="mt-3 list-decimal space-y-2 pl-5">{steps.map((s, i) => <li key={i} className="text-sm leading-relaxed">{s}</li>)}</ol>)}</section>

      <section className="card mt-6" aria-labelledby="replay"><h2 id="replay" className="font-display text-xl font-bold">Minh họa nét vẽ (Stroke Replay)</h2>
        <p className="mt-1 text-sm text-graphite/60">Phát lại từng nét của hình mẫu: hình tròn và khung hộp. Đây là bản minh họa dựng hình, không phải bản ghi nét thật của họa sĩ.</p>
        <canvas ref={canvasRef} width={1200} height={800} className="mt-3 w-full rounded-xl border-2 border-graphite/15 bg-white" aria-label="Canvas phát lại nét vẽ mẫu" />
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button className="btn-primary !py-2" onClick={() => { if (replayPct >= 1) setReplayPct(0); setPlaying(!playing); }}>{playing ? '⏸ Tạm dừng' : '▶ Phát'}</button>
          <button className="btn-secondary !py-2" onClick={() => { setPlaying(false); setReplayPct(0); }}>↺ Phát lại từ đầu</button>
          <label className="text-sm">Tốc độ <select className="input !w-auto !py-1" value={speed} onChange={e => setSpeed(Number(e.target.value))} aria-label="Tốc độ phát lại"><option value={0.5}>0.5x</option><option value={1}>1x</option><option value={2}>2x</option></select></label>
          <input type="range" min={0} max={100} value={Math.round(replayPct * 100)} onChange={e => setReplayPct(Number(e.target.value) / 100)} className="flex-1" aria-label="Tua phát lại" />
          <span className="text-sm font-semibold">{Math.round(replayPct * 100)}%</span>
        </div>
        <div className="mt-2 flex gap-2">
          <button className="btn-ghost !border !border-graphite/20" onClick={() => setReplayPct(p => Math.max(0, p - 0.1))}>← Lùi 1 bước</button>
          <button className="btn-ghost !border !border-graphite/20" onClick={() => setReplayPct(p => Math.min(1, p + 0.1))}>Tiến 1 bước →</button>
        </div>
      </section>

      <section className="card mt-6" aria-labelledby="practice"><h2 id="practice" className="font-display text-xl font-bold">Thực hành</h2>
        <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Chế độ thực hành">
          {([['guided', 'Hướng dẫn từng bước'], ['assisted', 'Hỗ trợ một phần'], ['independent', 'Tự làm độc lập']] as const).map(([k, label]) => (
            <button key={k} onClick={() => setMode(k)} aria-pressed={mode === k} className={`rounded-full border-2 px-4 py-2 font-medium ${mode === k ? 'border-terracotta bg-terracotta text-white' : 'border-graphite/20 bg-white'}`}>{label}</button>
          ))}
        </div>
        <p className="mt-3 text-sm text-graphite/75">
          {mode === 'guided' && 'Chế độ hướng dẫn: bật hình mẫu và đường gợi ý trên bảng vẽ, làm theo từng bước.'}
          {mode === 'assisted' && 'Chế độ hỗ trợ: bạn tự vẽ, có lưới hướng dẫn và hình mẫu tham khảo bên cạnh.'}
          {mode === 'independent' && 'Chế độ độc lập: tự hoàn thành bài với ít gợi ý nhất, giống bài kiểm tra thật.'}
        </p>
        <p className="mt-2 text-sm"><strong>Bài tập:</strong> {lesson.exerciseTitle || `Bài luyện: ${lesson.title}`} — {lesson.exerciseInstructions || 'Vẽ theo các bước trong bài rồi nộp để AI chấm.'}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href={`/workspace/${params.id}?mode=${mode}`} className="btn-primary">Mở bảng vẽ để luyện bài này →</Link>
          <button className="btn-secondary" onClick={markDone}>{done ? '✓ Đã đánh dấu hoàn thành' : 'Đánh dấu đã hoàn thành bài'}</button>
        </div>
      </section>

      {exercises.length > 0 && (
        <section className="card mt-6" aria-labelledby="ex"><h2 id="ex" className="font-display text-xl font-bold">Bài tập của bài học</h2>
          <ul className="mt-3 space-y-2">{exercises.map((ex: any) => (
            <li key={ex.id || ex.exercise_id} className="rounded-xl border border-graphite/10 p-3 text-sm">
              <strong>{ex.title}</strong> — {ex.description || ''} <span className="chip ml-2">{ex.mode || ''}</span> <span className="chip">{ex.evaluation_type || ''}</span>
              <span className="ml-2 text-xs text-graphite/60">Rubric: {ex.rubric_version || '—'}</span>
            </li>))}</ul></section>
      )}
      {lesson.commonMistakes?.length > 0 && (
        <section className="card mt-6" aria-labelledby="cm"><h2 id="cm" className="font-display text-xl font-bold">Lỗi thường gặp</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">{lesson.commonMistakes.map((m: string, i: number) => <li key={i}>{m}</li>)}</ul>
          {lesson.passCondition && <p className="mt-2 text-sm"><strong>Điều kiện đạt:</strong> {lesson.passCondition}</p>}</section>
      )}

      {rubric.length > 0 && (
        <section className="card mt-6" aria-labelledby="rubric"><h2 id="rubric" className="font-display text-xl font-bold">Rubric đánh giá</h2>
          <ul className="mt-3 space-y-2">{rubric.map((r: any, i: number) => (
            <li key={i} className="flex justify-between gap-3 rounded-xl border border-graphite/10 p-3 text-sm"><span><strong>{r.name}</strong> — {r.description || ''}</span><span className="font-semibold">{r.weight}%</span></li>))}</ul>
          <p className="mt-2 text-xs text-graphite/60">Tổng trọng số phải bằng 100%. Tiêu chí không đánh giá được sẽ được ghi rõ, không tự cho điểm.</p></section>
      )}

      <div className="mt-8 flex flex-wrap justify-between gap-3">
        <Link href="/roadmap" className="btn-ghost">← Lộ trình</Link>
        {nxt && <Link href={`/lessons/${nxt.id}`} className="btn-primary">Bài tiếp theo: {nxt.title} →</Link>}
      </div>
    </div>
  );
}
