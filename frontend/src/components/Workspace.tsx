'use client';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { api, API_URL, isLoggedIn, normalizeLesson } from '@/lib/api';
import { findLesson } from '@/lib/curriculum';
import { LOGICAL_W, LOGICAL_H, renderAll, strokesToDataURL, newLayer, newStrokeId, sampleDemoStrokes, type Layer, type Stroke } from '@/lib/canvas';

type Tool = 'pencil' | 'brush' | 'eraser';

// Backend contract (verified against backend/app/routers/drawing_router.py):
// POST /drawing/projects {title, lesson_id:int|null, canvas_width, canvas_height} -> {id,...} (creates "Layer 1")
// GET  /drawing/projects/{pid} -> {layers:[{id,name,visible,locked}], strokes:[{id,layer_id,tool,color,width,points:[{x,y} 0..1]}]}
// POST /drawing/projects/{pid}/strokes {layer_id, tool, color, width, opacity, points:[{x,y} normalised 0..1]}
// POST /drawing/projects/{pid}/layers {name} -> {id,name}
// GET  /drawing/projects/{pid}/export -> PNG file
// POST /submissions {exercise_id:int, project_id:int, source_type:'canvas'} -> {id,status}
// POST /submissions/{sid}/assess -> AssessmentOut

export default function WorkspaceClient({ lessonId, mode }: { lessonId?: string; mode?: string }) {
  const lesson = lessonId ? findLesson(lessonId) : undefined;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [layers, setLayers] = useState<Layer[]>([{ id: 'layer-1', name: 'Lớp 1', visible: true, locked: false }]);
  const [activeLayer, setActiveLayer] = useState('layer-1');
  const [tool, setTool] = useState<Tool>('pencil');
  const [color, setColor] = useState('#242424');
  const [size, setSize] = useState(4);
  const [opacity, setOpacity] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [guidelines, setGuidelines] = useState(true);
  const [refImg, setRefImg] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState('Chưa có thay đổi');
  const [projectId, setProjectId] = useState<number | null>(null);
  const [lessonNumId, setLessonNumId] = useState<number | null>(null);
  const [exerciseNumId, setExerciseNumId] = useState<number | null>(null);
  const [lessonTitle, setLessonTitle] = useState<string>(lesson?.title || 'Bài vẽ tự do');
  const [msg, setMsg] = useState(''); const [err, setErr] = useState('');
  const [undoStack, setUndoStack] = useState<Stroke[][]>([]);
  const [redoStack, setRedoStack] = useState<Stroke[][]>([]);
  const drawingRef = useRef<Stroke | null>(null);
  const panningRef = useRef<{ x: number; y: number } | null>(null);
  const [spacePan, setSpacePan] = useState(false);
  const [replaying, setReplaying] = useState(false);
  const [replayPct, setReplayPct] = useState(1);
  const [replaySpeed, setReplaySpeed] = useState(1);
  const [tutorQ, setTutorQ] = useState(''); const [tutorA, setTutorA] = useState(''); const [tutorLoading, setTutorLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  const layerMapRef = useRef<Record<string, number>>({ 'layer-1': 0 }); // local layer id -> backend numeric layer id (0 = default Layer 1)
  const projectIdRef = useRef<number | null>(null);
  projectIdRef.current = projectId;

  const totalPoints = strokes.reduce((a, s) => a + s.points.length, 0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = '#FFFCF7'; ctx.fillRect(0, 0, LOGICAL_W, LOGICAL_H);
    if (guidelines) {
      ctx.strokeStyle = 'rgba(36,36,36,0.08)'; ctx.lineWidth = 1;
      for (let x = 0; x <= LOGICAL_W; x += 100) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, LOGICAL_H); ctx.stroke(); }
      for (let y = 0; y <= LOGICAL_H; y += 100) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(LOGICAL_W, y); ctx.stroke(); }
    }
    const upto = new Map<string, number>();
    if (replaying) {
      let rem = Math.floor(totalPoints * replayPct);
      for (const s of strokes) { const t = Math.min(s.points.length, rem); upto.set(s.id, t); rem -= t; if (rem <= 0) break; }
    }
    renderAll(ctx, strokes, layers, replaying ? upto : undefined);
  }, [strokes, layers, guidelines, replaying, replayPct, totalPoints]);

  useEffect(() => { draw(); }, [draw]);

  // Resolve lesson numeric id + first exercise (needed by backend project/submission APIs)
  useEffect(() => {
    if (!lessonId) return;
    api<any>(`/lessons/${lessonId}`).then(d => {
      const n = normalizeLesson(d); setLessonTitle(n.title || lessonTitle); setLessonNumId(typeof d.id === 'number' ? d.id : null);
      return api<any[]>(`/lessons/${lessonId}/exercises`);
    }).then(ex => { if (Array.isArray(ex) && ex.length && typeof ex[0].id === 'number') setExerciseNumId(ex[0].id); }).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId]);

  // Load draft: backend project if we have a stored project id, else local draft
  useEffect(() => {
    (async () => {
      const key = `drawpath_draft_${lessonId || 'free'}`;
      const storedPid = Number(localStorage.getItem(`drawpath_project_${lessonId || 'free'}`) || '') || null;
      if (storedPid && isLoggedIn()) {
        try {
          const p: any = await api(`/drawing/projects/${storedPid}`);
          setProjectId(p.id); projectIdRef.current = p.id;
          if (Array.isArray(p.layers) && p.layers.length) {
            const ls: Layer[] = p.layers.map((l: any) => ({ id: `bl-${l.id}`, name: l.name, visible: l.visible !== false, locked: !!l.locked }));
            setLayers(ls); setActiveLayer(ls[0].id);
            layerMapRef.current = Object.fromEntries(p.layers.map((l: any) => [`bl-${l.id}`, l.id]));
          }
          if (Array.isArray(p.strokes) && p.strokes.length) {
            setStrokes(p.strokes.map((s: any) => ({
              id: `bs-${s.id}`, layerId: `bl-${s.layer_id}`, tool: s.tool === 'eraser' ? 'eraser' : s.tool === 'brush' ? 'brush' : 'pencil',
              color: s.color || '#242424', width: s.width || 3, opacity: 1,
              points: (s.points || []).map((pt: any) => ({ x: (pt.x ?? 0) * LOGICAL_W, y: (pt.y ?? 0) * LOGICAL_H, p: pt.p ?? 0.5 })),
              createdAt: Date.now(),
            })));
          }
          setSaveStatus('Đã tải dự án từ máy chủ ✓');
          return;
        } catch { /* fall through to local draft */ }
      }
      try {
        const local = localStorage.getItem(key);
        if (local) { const d = JSON.parse(local); if (d.strokes) setStrokes(d.strokes); if (d.layers) { setLayers(d.layers); setActiveLayer(d.layers[0]?.id || 'layer-1'); } setSaveStatus('Đã khôi phục bản nháp trên trình duyệt này'); }
      } catch {}
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId]);

  // Autosave (debounced 2s): always to localStorage; backend title touch if project exists.
  useEffect(() => {
    if (strokes.length === 0 && layers.length <= 1) return;
    setSaveStatus('Đang lưu…');
    const t = setTimeout(async () => {
      try { localStorage.setItem(`drawpath_draft_${lessonId || 'free'}`, JSON.stringify({ lesson_id: lessonId || null, title: lessonTitle, strokes, layers })); } catch {}
      if (projectIdRef.current && isLoggedIn()) {
        try { await api(`/drawing/projects/${projectIdRef.current}`, { method: 'PUT', body: JSON.stringify({ title: lessonTitle }) }); setSaveStatus('Đã lưu (nháp trình duyệt + máy chủ) ✓'); }
        catch { setSaveStatus('Đã lưu trên trình duyệt này (máy chủ chưa lưu được)'); }
      } else setSaveStatus(isLoggedIn() ? 'Đã lưu trên trình duyệt này — sẽ tạo dự án trên máy chủ khi bạn vẽ nét đầu tiên' : 'Đã lưu trên trình duyệt này (đăng nhập để lưu lên máy chủ)');
    }, 2000);
    return () => clearTimeout(t);
  }, [strokes, layers, lessonTitle, lessonId]);

  useEffect(() => {
    if (!replaying) return;
    let raf = 0; let last = performance.now();
    const tick = (t: number) => {
      const dt = (t - last) / 1000; last = t;
      setReplayPct(p => { const n = p + dt * 0.06 * replaySpeed; if (n >= 1) { setReplaying(false); return 1; } return n; });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [replaying, replaySpeed]);

  async function ensureProject(): Promise<number | null> {
    if (projectIdRef.current) return projectIdRef.current;
    if (!isLoggedIn()) return null;
    try {
      const created: any = await api('/drawing/projects', { method: 'POST', body: JSON.stringify({ title: lessonTitle, lesson_id: lessonNumId, canvas_width: LOGICAL_W, canvas_height: LOGICAL_H }) });
      if (created?.id) {
        setProjectId(created.id); projectIdRef.current = created.id;
        localStorage.setItem(`drawpath_project_${lessonId || 'free'}`, String(created.id));
        return created.id;
      }
    } catch (e: any) { setSaveStatus(`Không tạo được dự án trên máy chủ: ${e.message}`); }
    return null;
  }

  async function syncStroke(s: Stroke) {
    if (!isLoggedIn() || s.points.length === 0) return;
    const pid = await ensureProject(); if (!pid) return;
    try {
      await api(`/drawing/projects/${pid}/strokes`, { method: 'POST', body: JSON.stringify({
        layer_id: layerMapRef.current[s.layerId] || null,
        tool: s.tool, color: s.tool === 'eraser' ? '#242424' : s.color, width: s.width, opacity: s.opacity,
        points: s.points.map(p => ({ x: Math.max(0, Math.min(1, p.x / LOGICAL_W)), y: Math.max(0, Math.min(1, p.y / LOGICAL_H)) })),
      }) });
    } catch { setSaveStatus('Nét đã lưu trên trình duyệt; đồng bộ lên máy chủ thất bại — sẽ thử lại ở nét sau.'); }
  }

  function toLogical(e: React.PointerEvent): { x: number; y: number; p: number } {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: ((e.clientX - rect.left) / rect.width) * LOGICAL_W, y: ((e.clientY - rect.top) / rect.height) * LOGICAL_H, p: e.pressure && e.pressure > 0 ? e.pressure : 0.5 };
  }
  function onPointerDown(e: React.PointerEvent) {
    if (spacePan || e.button === 1) { panningRef.current = { x: e.clientX, y: e.clientY }; (e.target as HTMLElement).setPointerCapture(e.pointerId); return; }
    const layer = layers.find(l => l.id === activeLayer);
    if (layer?.locked) { setErr('Lớp đang bị khóa — mở khóa trước khi vẽ.'); return; }
    setErr('');
    const pt = toLogical(e);
    const s: Stroke = { id: newStrokeId(), layerId: activeLayer, tool, color: tool === 'eraser' ? '#000000' : color, width: tool === 'brush' ? size * 2 : size, opacity, points: [pt], createdAt: Date.now() };
    drawingRef.current = s;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }
  function onPointerMove(e: React.PointerEvent) {
    if (panningRef.current) { const dx = e.clientX - panningRef.current.x, dy = e.clientY - panningRef.current.y; setPan(p => ({ x: p.x + dx, y: p.y + dy })); panningRef.current = { x: e.clientX, y: e.clientY }; return; }
    const s = drawingRef.current; if (!s) return;
    s.points.push(toLogical(e));
    setStrokes(prev => { const without = prev.filter(x => x.id !== s.id); return [...without, { ...s, points: [...s.points] }]; });
  }
  function onPointerUp() {
    if (panningRef.current) { panningRef.current = null; return; }
    const s = drawingRef.current; drawingRef.current = null;
    if (s && s.points.length > 0) { setUndoStack(u => [...u, strokes]); setRedoStack([]); void syncStroke(s); }
  }
  function undo() { setUndoStack(u => { if (!u.length) return u; const prev = u[u.length - 1]; setRedoStack(r => [...r, strokes]); setStrokes(prev); return u.slice(0, -1); }); }
  function redo() { setRedoStack(r => { if (!r.length) return r; const next = r[r.length - 1]; setUndoStack(u => [...u, strokes]); setStrokes(next); return r.slice(0, -1); }); }
  function clearCanvas() { if (!confirm('Xóa toàn bộ nét trên canvas? Hành động này có thể hoàn tác bằng Undo.')) return; setUndoStack(u => [...u, strokes]); setStrokes([]); }
  async function exportPNG() {
    if (projectIdRef.current && isLoggedIn()) {
      try {
        const token = localStorage.getItem('drawpath_token');
        const res = await fetch(`${API_URL}/drawing/projects/${projectIdRef.current}/export`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
        if (res.ok) { const blob = await res.blob(); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `drawpath-${lessonId || 'free'}-${Date.now()}.png`; a.click(); setMsg('Đã xuất file PNG từ máy chủ.'); return; }
      } catch {}
    }
    const url = strokesToDataURL(strokes, layers);
    const a = document.createElement('a'); a.href = url; a.download = `drawpath-${lessonId || 'free'}-${Date.now()}.png`; a.click();
    setMsg('Đã xuất file PNG.');
  }
  async function addLayer() {
    const l = newLayer(`Lớp ${layers.length + 1}`);
    setLayers([...layers, l]); setActiveLayer(l.id);
    if (isLoggedIn()) {
      const pid = await ensureProject();
      if (pid) {
        try { const created: any = await api(`/drawing/projects/${pid}/layers`, { method: 'POST', body: JSON.stringify({ name: l.name }) }); if (created?.id) layerMapRef.current[l.id] = created.id; }
        catch { /* layer stays local-only; strokes still sync to default layer */ }
      }
    }
  }
  function moveLayer(id: string, dir: -1 | 1) {
    const i = layers.findIndex(l => l.id === id); const j = i + dir; if (j < 0 || j >= layers.length) return;
    const next = [...layers]; [next[i], next[j]] = [next[j], next[i]]; setLayers(next);
  }
  function loadDemo() { setUndoStack(u => [...u, strokes]); setStrokes(sampleDemoStrokes()); setMsg('Đã tải nét mẫu (hình tròn + khung hộp) để xem phát lại.'); }

  async function submitForAssessment() {
    setSubmitStatus('Đang nộp bài…'); setErr('');
    try {
      if (!isLoggedIn()) throw new Error('Bạn cần đăng nhập để nộp bài chấm AI.');
      if (!exerciseNumId) throw new Error('Bài học này chưa có bài tập trên máy chủ (không tìm thấy exercise) nên chưa nộp được. Hãy thử bài học khác hoặc liên hệ quản trị viên.');
      const pid = await ensureProject();
      if (!pid) throw new Error('Không tạo được dự án vẽ trên máy chủ.');
      const sub: any = await api('/submissions', { method: 'POST', body: JSON.stringify({ exercise_id: exerciseNumId, project_id: pid, source_type: 'canvas' }) });
      const id = sub?.id;
      if (!id) throw new Error('Máy chủ không trả về mã bài nộp.');
      try { await api(`/submissions/${id}/assess`, { method: 'POST', body: JSON.stringify({}) }); } catch (e: any) { /* assessment may run async; submission page shows status */ }
      window.location.href = `/submissions/${id}`;
    } catch (e: any) { setErr(`Nộp bài thất bại: ${e.message}`); setSubmitStatus(''); }
  }

  async function askTutor() {
    if (!tutorQ.trim()) return;
    setTutorLoading(true); setTutorA('');
    try {
      const data: any = await api('/tutor/chat', { method: 'POST', body: JSON.stringify({ message: tutorQ, lesson_id: lessonNumId, submission_id: null }) });
      setTutorA(data?.reply || data?.answer || data?.message || 'Gia sư AI chưa trả lời được.');
    } catch (e: any) { setTutorA(`Không kết nối được gia sư AI: ${e.message}`); }
    setTutorLoading(false);
  }

  const activeLocked = layers.find(l => l.id === activeLayer)?.locked;
  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">Bảng vẽ — {lessonTitle}</h1>
          <p className="text-sm text-graphite/60">{mode ? `Chế độ: ${mode === 'guided' ? 'Hướng dẫn' : mode === 'assisted' ? 'Hỗ trợ' : 'Độc lập'} · ` : ''}Tọa độ nét lưu theo không gian logic {LOGICAL_W}×{LOGICAL_H}, không phụ thuộc mức zoom. {saveStatus}</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary !py-2" onClick={exportPNG}>⬇ Xuất PNG</button>
          <button className="btn-primary !py-2" onClick={submitForAssessment} disabled={strokes.length === 0 || !!submitStatus}>{submitStatus || 'Nộp bài để AI chấm'}</button>
        </div>
      </div>
      {err && <div className="mt-3 rounded-xl bg-coral/15 p-3 text-sm" role="alert">{err}</div>}
      {msg && <div className="mt-3 rounded-xl bg-sage/20 p-3 text-sm" role="status">{msg}</div>}
      {lessonId && <p className="mt-3"><Link href={`/lessons/${lessonId}`} className="font-semibold text-terracotta">← Quay lại bài học</Link></p>}

      <div className="mt-4 grid gap-4 lg:grid-cols-[220px_1fr_300px]">
        <aside className="card h-fit" aria-label="Công cụ vẽ">
          <h2 className="font-bold">Công cụ</h2>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {([['pencil', '✏ Bút chì'], ['brush', '🖌 Cọ'], ['eraser', '⌫ Tẩy']] as [Tool, string][]).map(([t, label]) => (
              <button key={t} onClick={() => setTool(t)} aria-pressed={tool === t} className={`rounded-xl border-2 px-2 py-2 text-sm font-medium ${tool === t ? 'border-terracotta bg-coral/15' : 'border-graphite/15 bg-white'}`}>{label}</button>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <button className="btn-secondary flex-1 !px-2 !py-1.5 text-sm" onClick={undo} disabled={undoStack.length === 0}>↩ Undo</button>
            <button className="btn-secondary flex-1 !px-2 !py-1.5 text-sm" onClick={redo} disabled={redoStack.length === 0}>↪ Redo</button>
          </div>
          <button className="btn-ghost mt-2 w-full !border !border-graphite/20" onClick={clearCanvas}>Xóa toàn bộ canvas</button>
          <div className="mt-4 space-y-3">
            <div><label className="label" htmlFor="color">Màu</label><div className="flex items-center gap-2"><input id="color" type="color" value={color} onChange={e => setColor(e.target.value)} className="h-10 w-12 cursor-pointer" /><span className="text-sm">{color}</span></div>
              <div className="mt-2 flex flex-wrap gap-1">{['#242424', '#D56B46', '#EF8B73', '#8C9B85', '#A59ACB', '#2B6CB0', '#C53030', '#D69E2E'].map(c => (<button key={c} aria-label={`Màu ${c}`} onClick={() => setColor(c)} className="h-7 w-7 rounded-full border-2 border-graphite/20" style={{ background: c }} />))}</div></div>
            <div><label className="label" htmlFor="size">Cỡ cọ: {size}px</label><input id="size" type="range" min={1} max={40} value={size} onChange={e => setSize(Number(e.target.value))} className="w-full" /></div>
            <div><label className="label" htmlFor="opacity">Độ mờ: {Math.round(opacity * 100)}%</label><input id="opacity" type="range" min={10} max={100} value={opacity * 100} onChange={e => setOpacity(Number(e.target.value) / 100)} className="w-full" /></div>
            <div><label className="label" htmlFor="zoom">Zoom: {Math.round(zoom * 100)}%</label><input id="zoom" type="range" min={50} max={200} value={zoom * 100} onChange={e => setZoom(Number(e.target.value) / 100)} className="w-full" />
              <div className="mt-1 flex gap-2"><button className="btn-ghost !border !border-graphite/20 !py-1 text-sm" onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}>Vừa màn hình</button><button className="btn-ghost !border !border-graphite/20 !py-1 text-sm" onClick={() => setSpacePan(!spacePan)} aria-pressed={spacePan}>{spacePan ? '✋ Đang kéo (bật)' : '✋ Kéo canvas'}</button></div></div>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={guidelines} onChange={e => setGuidelines(e.target.checked)} /> Hiện lưới hướng dẫn</label>
            {activeLocked && <p className="text-sm text-terracotta">Lớp đang vẽ đang bị khóa.</p>}
          </div>
          <div className="mt-4 border-t border-graphite/10 pt-3">
            <h3 className="font-bold">Phát lại nét vẽ</h3>
            <div className="mt-2 flex gap-2">
              <button className="btn-primary flex-1 !py-1.5 text-sm" onClick={() => { if (replayPct >= 1) setReplayPct(0); setReplaying(!replaying); }}>{replaying ? '⏸ Dừng' : '▶ Phát lại'}</button>
              <button className="btn-secondary !py-1.5 text-sm" onClick={loadDemo}>Tải nét mẫu</button>
            </div>
            <input type="range" min={0} max={100} value={Math.round(replayPct * 100)} onChange={e => { setReplaying(false); setReplayPct(Number(e.target.value) / 100); }} className="mt-2 w-full" aria-label="Tua phát lại nét vẽ" />
            <div className="flex items-center gap-2 text-sm"><span>Tốc độ</span><select className="input !w-auto !py-1" value={replaySpeed} onChange={e => setReplaySpeed(Number(e.target.value))}><option value={0.5}>0.5x</option><option value={1}>1x</option><option value={2}>2x</option></select><span>{strokes.length} nét · {totalPoints} điểm</span></div>
          </div>
        </aside>

        <div className="overflow-auto rounded-2xl border-2 border-graphite/15 bg-white p-2" style={{ maxHeight: '80vh' }}>
          <div style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: '0 0', width: 'fit-content' }}>
            <canvas
              ref={canvasRef} width={LOGICAL_W} height={LOGICAL_H}
              className="block max-w-none touch-none rounded-xl border border-graphite/10 bg-ivory"
              style={{ cursor: spacePan ? 'grab' : 'crosshair' }}
              onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerLeave={onPointerUp}
              aria-label="Bảng vẽ — dùng chuột, cảm ứng hoặc bút stylus để vẽ"
            />
          </div>
          <p className="mt-2 px-1 text-xs text-graphite/60">Mẹo: giữ nút giữa chuột hoặc bật “Kéo canvas” để di chuyển khung nhìn. Bút stylus có hỗ trợ lực nhấn sẽ cho nét đậm nhạt theo lực tay.</p>
        </div>

        <aside className="space-y-4">
          <section className="card" aria-labelledby="layers-h"><h2 id="layers-h" className="font-bold">Lớp vẽ</h2>
            <ul className="mt-2 space-y-2">
              {layers.map((l, i) => (
                <li key={l.id} className={`rounded-xl border-2 p-2 ${activeLayer === l.id ? 'border-terracotta bg-coral/10' : 'border-graphite/10'}`}>
                  <button className="w-full text-left font-medium" onClick={() => setActiveLayer(l.id)}>{l.name} {activeLayer === l.id ? '(đang vẽ)' : ''}</button>
                  <div className="mt-1 flex flex-wrap gap-1 text-xs">
                    <button className="rounded border px-2 py-0.5" onClick={() => setLayers(layers.map(x => x.id === l.id ? { ...x, visible: !x.visible } : x))}>{l.visible ? '👁 Hiện' : 'Ẩn'}</button>
                    <button className="rounded border px-2 py-0.5" onClick={() => setLayers(layers.map(x => x.id === l.id ? { ...x, locked: !x.locked } : x))}>{l.locked ? '🔒 Khóa' : '🔓 Mở'}</button>
                    <button className="rounded border px-2 py-0.5" onClick={() => moveLayer(l.id, -1)} disabled={i === 0}>↑</button>
                    <button className="rounded border px-2 py-0.5" onClick={() => moveLayer(l.id, 1)} disabled={i === layers.length - 1}>↓</button>
                    <button className="rounded border px-2 py-0.5" onClick={() => { const n = prompt('Tên lớp mới:', l.name); if (n) setLayers(layers.map(x => x.id === l.id ? { ...x, name: n } : x)); }}>Đổi tên</button>
                    <button className="rounded border px-2 py-0.5 text-terracotta" disabled={layers.length <= 1} onClick={() => { if (!confirm(`Xóa lớp “${l.name}” và các nét trên lớp đó?`)) return; setLayers(layers.filter(x => x.id !== l.id)); setStrokes(strokes.filter(s => s.layerId !== l.id)); if (activeLayer === l.id) setActiveLayer(layers.find(x => x.id !== l.id)?.id || ''); }}>Xóa</button>
                  </div>
                </li>
              ))}
            </ul>
            <button className="btn-secondary mt-3 w-full !py-2 text-sm" onClick={addLayer}>+ Thêm lớp</button>
          </section>

          <section className="card" aria-labelledby="ref-h"><h2 id="ref-h" className="font-bold">Ảnh tham khảo</h2>
            <label className="mt-2 block text-sm">Tải ảnh tham khảo lên <input type="file" accept="image/*" className="mt-1 block w-full text-sm" onChange={e => { const f = e.target.files?.[0]; if (f) setRefImg(URL.createObjectURL(f)); }} /></label>
            {refImg ? <><img src={refImg} alt="Ảnh tham khảo do bạn tải lên" className="mt-2 max-h-48 w-full rounded-xl border object-contain" /><button className="btn-ghost mt-2 text-sm" onClick={() => setRefImg(null)}>Gỡ ảnh tham khảo</button></> : <p className="mt-2 text-sm text-graphite/60">Chưa có ảnh tham khảo. Bạn có thể tải ảnh mẫu hoặc ảnh chụp bài trên giấy lên để đối chiếu khi vẽ.</p>}
            <p className="mt-2 text-xs text-graphite/60">Lưu ý: backend hiện chưa có endpoint nộp bài bằng ảnh tải lên (SubmissionIn chỉ nhận exercise_id + project_id) — nộp bài qua canvas là đường đã kiểm chứng.</p>
          </section>

          <section className="card" aria-labelledby="tutor-h"><h2 id="tutor-h" className="font-bold">Gia sư AI</h2>
            <p className="mt-1 text-sm text-graphite/60">Hỏi về bài đang vẽ — gia sư trả lời theo ngữ cảnh bài học.</p>
            <div className="mt-2 flex gap-2"><input className="input" value={tutorQ} onChange={e => setTutorQ(e.target.value)} placeholder="VD: Khối hộp này bị méo ở đâu?" aria-label="Câu hỏi cho gia sư AI" onKeyDown={e => { if (e.key === 'Enter') askTutor(); }} /><button className="btn-primary !px-3" onClick={askTutor} disabled={tutorLoading}>{tutorLoading ? '…' : 'Hỏi'}</button></div>
            {tutorA && <p className="mt-2 whitespace-pre-line text-sm">{tutorA}</p>}
            {!tutorA && <div className="mt-2 flex flex-wrap gap-1">{['Đường nào cần sửa trước?', 'Làm sao luyện ellipse hiệu quả?', 'Giải thích phối cảnh một điểm tụ.'].map(q => <button key={q} className="rounded-full border px-2 py-1 text-xs" onClick={() => setTutorQ(q)}>{q}</button>)}</div>}
          </section>
        </aside>
      </div>
    </div>
  );
}
