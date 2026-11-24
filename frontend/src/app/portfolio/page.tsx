'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { EmptyBox, ErrorBox, Loading } from '@/components/ui';

export default function PortfolioPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  useEffect(() => {
    api<any>('/portfolio').then(d => setItems(Array.isArray(d) ? d : d?.items || [])).catch((e: any) => setError(e.message)).finally(() => setLoading(false));
  }, []);
  async function removeItem(id: any) {
    if (!confirm('Xóa tác phẩm này khỏi portfolio?')) return;
    try { await api(`/portfolio/${id}`, { method: 'DELETE' }); setItems(items.filter(i => i.id !== id)); }
    catch (e: any) { alert(`Không xóa được: ${e.message}`); }
  }
  if (loading) return <div className="mx-auto max-w-7xl px-4"><Loading label="Đang tải portfolio…" /></div>;
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="font-display text-3xl font-bold">Portfolio của bạn</h1>
      <p className="mt-1 text-graphite/70">Các tác phẩm bạn đã lưu. Mặc định riêng tư — chỉ bạn xem được.</p>
      {error && <div className="mt-4"><ErrorBox message={error} onRetry={() => location.reload()} /></div>}
      {items.length === 0 ? <div className="mt-6"><EmptyBox title="Portfolio của bạn đang trống."><p>Hoàn thành một bài luyện và lưu tác phẩm để thấy nó ở đây.</p><Link href="/workspace" className="btn-primary mt-3 inline-flex">Mở bảng vẽ</Link></EmptyBox></div> : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it: any) => (
            <article key={it.id} className="card">
              {it.image_url ? <img src={it.image_url} alt={it.title || 'Tác phẩm'} className="h-48 w-full rounded-xl border object-cover" /> : <div className="flex h-48 items-center justify-center rounded-xl border bg-paper text-graphite/50">Không có ảnh xem trước</div>}
              <h2 className="mt-3 font-bold">{it.title || 'Tác phẩm chưa đặt tên'}</h2>
              <p className="text-sm text-graphite/60">{it.created_at ? new Date(it.created_at).toLocaleDateString('vi-VN') : ''} {it.lesson_title ? `· ${it.lesson_title}` : ''}</p>
              <div className="mt-3 flex gap-2">
                {it.image_url && <a className="btn-secondary !px-3 !py-1.5 text-sm" href={it.image_url} download>Tải xuống</a>}
                {it.submission_id && <Link className="btn-ghost !border !border-graphite/20 !py-1.5 text-sm" href={`/submissions/${it.submission_id}`}>Xem đánh giá</Link>}
                <button className="btn-ghost !py-1.5 text-sm text-terracotta" onClick={() => removeItem(it.id)}>Xóa</button>
              </div>
            </article>
          ))}
        </div>)}
    </div>
  );
}
