// Logical-coordinate stroke engine.
// Strokes live in logical space (LOGICAL_W x LOGICAL_H) independent of
// zoom/pan/display size, so save/load/replay/export stay consistent.
export const LOGICAL_W = 1200;
export const LOGICAL_H = 800;

export interface Pt { x: number; y: number; p?: number }
export interface Stroke {
  id: string; layerId: string; tool: 'pencil' | 'brush' | 'eraser';
  color: string; width: number; opacity: number; points: Pt[]; createdAt: number;
}
export interface Layer { id: string; name: string; visible: boolean; locked: boolean }

export function newLayer(name: string): Layer { return { id: `layer-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, name, visible: true, locked: false }; }
export function newStrokeId(): string { return `stroke-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`; }

export function drawStroke(ctx: CanvasRenderingContext2D, s: Stroke, upto?: number) {
  const pts = upto !== undefined ? s.points.slice(0, upto) : s.points;
  if (pts.length === 0) return;
  ctx.save();
  ctx.globalAlpha = s.opacity;
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  if (s.tool === 'eraser') ctx.globalCompositeOperation = 'destination-out';
  else ctx.globalCompositeOperation = 'source-over';
  ctx.strokeStyle = s.color;
  ctx.beginPath();
  if (pts.length === 1) {
    ctx.lineWidth = s.width;
    ctx.moveTo(pts[0].x, pts[0].y); ctx.lineTo(pts[0].x + 0.01, pts[0].y + 0.01);
  } else {
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      ctx.lineWidth = Math.max(0.5, s.width * (p.p && p.p > 0 ? 0.5 + p.p : 1));
      if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
    }
  }
  ctx.stroke();
  ctx.restore();
}

export function renderAll(ctx: CanvasRenderingContext2D, strokes: Stroke[], layers: Layer[], replayUpto?: Map<string, number>) {
  ctx.clearRect(0, 0, LOGICAL_W, LOGICAL_H);
  for (const layer of layers) {
    if (!layer.visible) continue;
    for (const s of strokes.filter(s => s.layerId === layer.id)) {
      const upto = replayUpto?.get(s.id);
      drawStroke(ctx, s, upto);
    }
  }
}

export function strokesToDataURL(strokes: Stroke[], layers: Layer[]): string {
  const c = document.createElement('canvas');
  c.width = LOGICAL_W; c.height = LOGICAL_H;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#FFFCF7'; ctx.fillRect(0, 0, LOGICAL_W, LOGICAL_H);
  renderAll(ctx, strokes, layers);
  return c.toDataURL('image/png');
}

export function sampleDemoStrokes(): Stroke[] {
  // A simple demo: circle + box outline, used for stroke replay demo.
  const circle: Pt[] = [];
  for (let a = 0; a <= Math.PI * 2 + 0.01; a += 0.15) circle.push({ x: 600 + Math.cos(a) * 140, y: 350 + Math.sin(a) * 140 });
  const box: Pt[] = [{ x: 380, y: 560 }, { x: 820, y: 560 }, { x: 820, y: 700 }, { x: 380, y: 700 }, { x: 380, y: 560 }];
  return [
    { id: 'demo-1', layerId: 'layer-1', tool: 'pencil', color: '#242424', width: 3, opacity: 1, points: circle, createdAt: 1 },
    { id: 'demo-2', layerId: 'layer-1', tool: 'pencil', color: '#D56B46', width: 3, opacity: 1, points: box, createdAt: 2 },
  ];
}
