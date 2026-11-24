'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';

export function Loading({ label = 'Đang tải…' }: { label?: string }) {
  return <div className="py-10 text-center" role="status"><p className="text-lg">✎ {label}</p><p className="mt-1 text-sm text-graphite/60">Vui lòng chờ trong giây lát.</p></div>;
}
export function ErrorBox({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="rounded-2xl border-2 border-terracotta/40 bg-coral/10 p-5" role="alert">
      <p className="font-semibold">Không tải được dữ liệu</p>
      <p className="mt-1 text-sm">{message}</p>
      {onRetry && <button className="btn-primary mt-3 !py-2" onClick={onRetry}>Thử lại</button>}
    </div>
  );
}
export function EmptyBox({ title, children }: { title: string; children?: ReactNode }) {
  return <div className="rounded-2xl border-2 border-dashed border-graphite/25 bg-ivory p-6 text-center"><p className="font-semibold">{title}</p>{children && <div className="mt-2 text-sm text-graphite/70">{children}</div>}</div>;
}
export function SourceBadge({ fromApi }: { fromApi: boolean }) {
  return fromApi
    ? <span className="chip bg-sage/30">Dữ liệu từ máy chủ</span>
    : <span className="chip bg-lavender/30">Nội dung mẫu offline — chưa kết nối máy chủ</span>;
}
export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [prev, setPrev] = useState<Element | null>(null);
  useEffect(() => {
    if (!open) return;
    setPrev(document.activeElement);
    ref.current?.querySelector<HTMLElement>('button, [href], input, select, textarea, [tabindex]')?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('keydown', onKey); (prev as HTMLElement)?.focus?.(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-graphite/50 p-4" role="dialog" aria-modal="true" aria-label={title} onClick={onClose}>
      <div ref={ref} className="w-full max-w-lg rounded-2xl bg-ivory p-6 shadow-soft" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between"><h2 className="font-display text-xl font-bold">{title}</h2><button onClick={onClose} aria-label="Đóng" className="rounded-full border-2 border-graphite/20 px-3 py-1">✕</button></div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
export function ProgressBar({ value, label }: { value: number; label?: string }) {
  const v = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div>
      {label && <div className="mb-1 flex justify-between text-sm"><span>{label}</span><span className="font-semibold">{v}%</span></div>}
      <div className="h-3 overflow-hidden rounded-full bg-graphite/10" role="progressbar" aria-valuenow={v} aria-valuemin={0} aria-valuemax={100} aria-label={label || 'Tiến độ'}>
        <div className="h-full rounded-full bg-terracotta" style={{ width: `${v}%` }} />
      </div>
    </div>
  );
}
