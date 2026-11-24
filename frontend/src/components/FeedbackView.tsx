'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api, API_URL } from '@/lib/api';
import { EmptyBox, ErrorBox, Loading, ProgressBar } from '@/components/ui';

export function FeedbackView({ submissionId }: { submissionId: string }) {
  const [sub, setSub] = useState<any>(null);
  const [assessment, setAssessment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAnn, setShowAnn] = useState(true);
  const [annOpacity, setAnnOpacity] = useState(0.85);
  const [selected, setSelected] = useState<any>(null);
  const [tab, setTab] = useState<'original' | 'annotated' | 'compare'>('annotated');
  useEffect(() => {
    (async () => {
      try {
        // Backend: GET /submissions/{sid} -> {id, exercise_id, project_id, status,
        //   assessments:[assessment_id,...], versions:[...]} (không kèm ảnh).
        const s: any = await api(`/submissions/${submissionId}`);
        setSub(s);
        const aids: number[] = Array.isArray(s?.assessments) ? s.assessments : [];
        if (aids.length) {
          try { const a: any = await api(`/assessments/${aids[aids.length - 1]}`); setAssessment(a); } catch {}
        }
        // Corrections endpoint: GET /submissions/{sid}/corrections
        try { const c: any = await api(`/submissions/${submissionId}/corrections`); if (c) setAssessment((prev: any) => prev || c); } catch {}
      } catch (e: any) { setError(e.message); }
      setLoading(false);
    })();
  }, [submissionId]);
  if (loading) return <div className="mx-auto max-w-5xl px-4"><Loading label="Đang tải kết quả chấm bài…" /></div>;
  if (error) return <div className="mx-auto max-w-5xl px-4 py-10"><ErrorBox message={error} onRetry={() => location.reload()} /><p className="mt-4"><Link href="/dashboard" className="font-semibold text-terracotta">← Về bảng học tập</Link></p></div>;
  if (!sub) return <div className="mx-auto max-w-5xl px-4 py-10"><EmptyBox title="Không tìm thấy bài nộp này." /></div>;
  const score = assessment?.overall_score ?? assessment?.score ?? null;
  const criteria: any[] = assessment?.criterion_results || assessment?.criteria || [];
  // AnnotationOut: {kind, x, y, x2, y2, label, error_type, severity, fix} — x,y chuẩn hóa 0..1.
  const annotations: any[] = (assessment?.annotations || []).map((a: any) => ({
    ...a,
    xPct: a.x <= 1 ? a.x * 100 : a.x,
    yPct: a.y <= 1 ? a.y * 100 : a.y,
    label: a.label || a.error_type || a.kind || 'Lỗi',
    explanation: a.fix || a.label || '',
  }));
  const corrections: any[] = assessment?.corrections || [];
  const img = sub.image_url || sub.original_url || sub.processed_image_url || null;
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Link href="/dashboard" className="text-sm font-semibold text-terracotta">← Bảng học tập</Link>
      <h1 className="mt-2 font-display text-3xl font-bold">Kết quả chấm bài #{String(submissionId).slice(0, 12)}</h1>
      <p className="mt-1 text-sm text-graphite/60">Trạng thái: {sub.status || 'đang xử lý'} · {sub.created_at ? new Date(sub.created_at).toLocaleString('vi-VN') : ''}</p>
      {!assessment && <div className="card mt-6"><p className="font-semibold">Bài đang được chấm hoặc chưa có kết quả.</p><p className="mt-1 text-sm text-graphite/70">Nếu bài vừa nộp, hãy tải lại trang sau ít phút. Trạng thái job sẽ được cập nhật khi AI hoàn tất.</p><button className="btn-secondary mt-3" onClick={() => location.reload()}>Tải lại</button></div>}
      {assessment && (
        <>
          <section className="card mt-6" aria-labelledby="score">
            <h2 id="score" className="font-display text-xl font-bold">Điểm tổng</h2>
            {score !== null ? <><p className="mt-2 font-display text-5xl font-bold text-terracotta">{score}<span className="text-2xl text-graphite/50">/100</span></p><ProgressBar value={score} label="Điểm tổng" /><p className="mt-2 text-sm text-graphite/60">Mức tin cậy: {assessment.confidence || 'chưa ghi rõ'} · Phiên bản rubric: {assessment.rubric_version || '—'} · Model: {assessment.model_version || '—'}</p></>
              : <p className="mt-2 text-sm">Bài này chưa đủ dữ liệu để chấm điểm tổng — xem nhận xét từng tiêu chí bên dưới.</p>}
            {criteria.length > 0 && <ul className="mt-4 space-y-3">{criteria.map((c: any, i: number) => (
              <li key={i}><div className="flex justify-between text-sm"><span><strong>{c.name}</strong> {c.feedback ? `— ${c.feedback}` : ''}</span><span className="font-semibold">{c.score ?? '—'}/{c.max_score || 100}</span></div><ProgressBar value={c.score ?? 0} /></li>))}</ul>}
          </section>

          <section className="card mt-6" aria-labelledby="artwork">
            <h2 id="artwork" className="font-display text-xl font-bold">Bài vẽ &amp; chú thích lỗi</h2>
            <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Chế độ xem">
              {([['original', 'Bản gốc'], ['annotated', 'Chú thích lỗi'], ['compare', 'So sánh']] as const).map(([k, label]) => (
                <button key={k} onClick={() => setTab(k)} aria-pressed={tab === k} className={`rounded-full border-2 px-4 py-1.5 font-medium ${tab === k ? 'border-terracotta bg-terracotta text-white' : 'border-graphite/20 bg-white'}`}>{label}</button>))}
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={showAnn} onChange={e => setShowAnn(e.target.checked)} /> Hiện chú thích</label>
              <label className="text-sm">Độ mờ chú thích <input type="range" min={20} max={100} value={annOpacity * 100} onChange={e => setAnnOpacity(Number(e.target.value) / 100)} /></label>
            </div>
            <div className="relative mt-3 overflow-hidden rounded-xl border-2 border-graphite/15 bg-white" style={{ minHeight: 240 }}>
              {img ? <img src={img} alt="Bài vẽ đã nộp" className="w-full" /> : <div className="flex h-60 flex-col items-center justify-center gap-3 bg-paper p-6 text-center text-sm text-graphite/60"><p>Bài nộp qua canvas được lưu dưới dạng dữ liệu nét (project #{sub.project_id || '—'}), backend không trả kèm ảnh trong chi tiết bài nộp.</p>{sub.project_id && <button className="btn-secondary !py-2 text-sm" onClick={async () => { const token = localStorage.getItem('drawpath_token'); const res = await fetch(`${API_URL}/drawing/projects/${sub.project_id}/export`, { headers: token ? { Authorization: `Bearer ${token}` } : {} }); if (res.ok) { const blob = await res.blob(); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `submission-${submissionId}.png`; a.click(); } else alert('Không tải được ảnh bài vẽ từ máy chủ.'); }}>Tải ảnh bài vẽ (PNG từ máy chủ)</button>}</div>}
              {showAnn && tab !== 'original' && annotations.map((a: any, i: number) => (
                <button key={i} onClick={() => setSelected(a)} className="absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-terracotta font-bold text-white shadow" style={{ left: `${a.xPct}%`, top: `${a.yPct}%`, opacity: annOpacity }} aria-label={`Lỗi: ${a.label}`}>{i + 1}</button>
              ))}
            </div>
            {selected && <div className="mt-3 rounded-xl bg-coral/10 p-4" role="status"><p className="font-semibold">{selected.label}</p><p className="text-sm">{selected.explanation || selected.description || ''}</p><p className="text-xs text-graphite/60">Loại: {selected.kind || selected.type || '—'} · Mức độ: {selected.severity || '—'}</p></div>}
            {annotations.length === 0 && <p className="mt-2 text-sm text-graphite/60">Chưa có chú thích vị trí lỗi cho bài này.</p>}
            {tab === 'compare' && <p className="mt-2 text-sm text-graphite/60">So sánh: bản gốc ở trên là bản bạn đã nộp — bản gốc không bao giờ bị AI ghi đè. Hãy nộp lại bản sửa để xem hai phiên bản cạnh nhau trong lịch sử nộp bài.</p>}
          </section>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <section className="card border-sage" aria-labelledby="str"><h2 id="str" className="font-display text-xl font-bold">Điểm mạnh</h2>
              {(assessment.strengths || []).length ? <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">{assessment.strengths.map((s: string, i: number) => <li key={i}>{s}</li>)}</ul> : <p className="mt-2 text-sm text-graphite/60">Chưa có nhận xét điểm mạnh.</p>}</section>
            <section className="card border-terracotta/50" aria-labelledby="weak"><h2 id="weak" className="font-display text-xl font-bold">Cần cải thiện</h2>
              {(assessment.weaknesses || []).length ? <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">{assessment.weaknesses.map((s: string, i: number) => <li key={i}>{s}</li>)}</ul> : <p className="mt-2 text-sm text-graphite/60">Chưa có nhận xét cần cải thiện.</p>}</section>
          </div>

          <section className="card mt-6" aria-labelledby="corr"><h2 id="corr" className="font-display text-xl font-bold">Hướng dẫn sửa</h2>
            {corrections.length ? <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm">{corrections.map((c: any, i: number) => <li key={i}>{typeof c === 'string' ? c : <><strong>{c.title || `Bước ${i + 1}`}</strong> — {c.description || c.fix || ''}</>}</li>)}</ol> : <p className="mt-2 text-sm text-graphite/60">Chưa có hướng dẫn sửa chi tiết cho bài này.</p>}
            {(assessment.recommendations || []).length > 0 && <><h3 className="mt-4 font-bold">Bài luyện tiếp theo</h3><ul className="mt-1 list-disc pl-5 text-sm">{assessment.recommendations.map((r: string, i: number) => <li key={i}>{r}</li>)}</ul></>}
          </section>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/workspace" className="btn-primary">Sửa lại trên bảng vẽ →</Link>
            <Link href="/roadmap" className="btn-secondary">Quay lại lộ trình</Link>
          </div>
        </>
      )}
    </div>
  );
}
