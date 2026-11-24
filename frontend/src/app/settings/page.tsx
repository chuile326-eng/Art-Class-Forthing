'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, getStoredUser, logout } from '@/lib/api';

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState(''); const [goal, setGoal] = useState(''); const [bio, setBio] = useState('');
  const [theme, setTheme] = useState('light'); const [lang, setLang] = useState('vi');
  const [msg, setMsg] = useState(''); const [err, setErr] = useState('');
  useEffect(() => {
    const u = getStoredUser(); setUser(u);
    api<any>('/users/me/profile').then(p => { setName(p.display_name || ''); setGoal(p.goal || ''); setBio(p.bio || ''); }).catch(() => { setName(u?.username || ''); });
  }, []);
  async function saveProfile(e: React.FormEvent) {
    e.preventDefault(); setMsg(''); setErr('');
    try { await api('/users/me/profile', { method: 'PUT', body: JSON.stringify({ display_name: name, goal, bio }) }); setMsg('Đã lưu hồ sơ.'); }
    catch (e: any) { setErr(`Không lưu được hồ sơ: ${e.message}`); }
  }
  async function exportData() {
    setMsg(''); setErr('');
    try {
      const profile: any = await api('/users/me/profile').catch(() => null);
      const progress: any = await api('/progress').catch(() => null);
      const data = { exported_at: new Date().toISOString(), user: getStoredUser(), profile, progress, local_drafts: Object.keys(localStorage).filter(k => k.startsWith('drawpath_')) };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'drawpath-data-export.json'; a.click();
      setMsg('Đã tải file xuất dữ liệu (hồ sơ, tiến độ và danh sách bản nháp trên trình duyệt này). Backend chưa có endpoint xuất toàn bộ dữ liệu máy chủ.');
    } catch (e: any) { setErr(`Xuất dữ liệu thất bại: ${e.message}`); }
  }
  async function requestDelete() {
    if (!confirm('Gửi yêu cầu xóa tài khoản và toàn bộ dữ liệu của bạn?')) return;
    setMsg('Backend chưa có endpoint yêu cầu xóa tài khoản. Yêu cầu của bạn chưa được gửi — hãy liên hệ quản trị viên (admin@drawpath.app) để được xóa tài khoản.');
  }
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-display text-3xl font-bold">Cài đặt</h1>
      <form onSubmit={saveProfile} className="card mt-6 space-y-4">
        <h2 className="font-display text-xl font-bold">Hồ sơ</h2>
        {msg && <div className="rounded-xl bg-sage/20 p-3 text-sm" role="status">{msg}</div>}
        {err && <div className="rounded-xl bg-coral/15 p-3 text-sm" role="alert">{err}</div>}
        <div><label className="label" htmlFor="name">Tên hiển thị</label><input id="name" className="input" value={name} onChange={e => setName(e.target.value)} /></div>
        <div><label className="label" htmlFor="goal">Mục tiêu học tập</label><input id="goal" className="input" value={goal} onChange={e => setGoal(e.target.value)} placeholder="VD: Học vẽ cơ bản từ đầu" /></div>
        <div><label className="label" htmlFor="bio">Giới thiệu ngắn</label><textarea id="bio" className="input" rows={3} value={bio} onChange={e => setBio(e.target.value)} /></div>
        <div><label className="label">Email</label><input className="input" value={user?.email || ''} disabled /></div>
        <div><label className="label">Vai trò</label><input className="input" value={user?.role || 'learner'} disabled /></div>
        <button className="btn-primary">Lưu hồ sơ</button>
      </form>
      <section className="card mt-6 space-y-4">
        <h2 className="font-display text-xl font-bold">Giao diện &amp; ngôn ngữ</h2>
        <div><label className="label" htmlFor="theme">Giao diện</label>
          <select id="theme" className="input" value={theme} onChange={e => { setTheme(e.target.value); document.documentElement.dataset.theme = e.target.value; }}>
            <option value="light">Sáng — giấy ấm</option><option value="dark">Tối (đang phát triển — một số trang vẫn dùng giao diện sáng)</option>
          </select></div>
        <div><label className="label" htmlFor="lang">Ngôn ngữ</label>
          <select id="lang" className="input" value={lang} onChange={e => setLang(e.target.value)}>
            <option value="vi">Tiếng Việt (mặc định)</option><option value="en">English — chưa hỗ trợ đầy đủ, đang phát triển</option>
          </select>
          <p className="mt-1 text-xs text-graphite/60">Kiến trúc hỗ trợ đa ngôn ngữ trong tương lai; hiện tại giao diện chính là tiếng Việt.</p></div>
      </section>
      <section className="card mt-6 space-y-3">
        <h2 className="font-display text-xl font-bold">Quyền riêng tư &amp; dữ liệu</h2>
        <p className="text-sm text-graphite/70">Bài vẽ của bạn mặc định riêng tư. Bạn có thể xuất toàn bộ dữ liệu của mình hoặc gửi yêu cầu xóa tài khoản.</p>
        <div className="flex flex-wrap gap-3">
          <button className="btn-secondary" onClick={exportData}>Xuất dữ liệu của tôi (JSON)</button>
          <button className="btn-secondary !border-terracotta !text-terracotta" onClick={requestDelete}>Yêu cầu xóa tài khoản &amp; dữ liệu</button>
        </div>
      </section>
      <button className="btn-ghost mt-6 text-terracotta" onClick={() => { logout(); router.push('/'); }}>Đăng xuất khỏi tất cả</button>
    </div>
  );
}
