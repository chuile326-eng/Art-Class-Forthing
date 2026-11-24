'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { api, setToken } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState(''); const [password, setPassword] = useState('');
  const [error, setError] = useState(''); const [loading, setLoading] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const data: any = await api('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
      const token = data?.access_token || data?.token;
      if (!token) throw new Error('Máy chủ không trả về token đăng nhập.');
      setToken(token);
      if (data?.user) localStorage.setItem('drawpath_user', JSON.stringify(data.user));
      else { try { const me: any = await api('/auth/me'); localStorage.setItem('drawpath_user', JSON.stringify(me)); } catch {} }
      router.push('/dashboard');
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  }
  function guest() { localStorage.setItem('drawpath_guest', '1'); router.push('/roadmap'); }
  return (
    <div className="mx-auto max-w-md px-4 py-14">
      <h1 className="font-display text-3xl font-bold">Đăng nhập</h1>
      <p className="mt-2 text-graphite/70">Chào mừng bạn quay lại với DrawPath AI.</p>
      <form onSubmit={submit} className="card mt-6 space-y-4">
        {error && <div className="rounded-xl bg-coral/15 p-3 text-sm" role="alert">{error}</div>}
        <div><label className="label" htmlFor="email">Email</label><input id="email" className="input" type="email" required value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" /></div>
        <div><label className="label" htmlFor="password">Mật khẩu</label><input id="password" className="input" type="password" required value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" /></div>
        <button className="btn-primary w-full" disabled={loading}>{loading ? 'Đang đăng nhập…' : 'Đăng nhập'}</button>
        <p className="text-center text-sm"><Link href="/auth/forgot" className="font-semibold text-terracotta">Quên mật khẩu?</Link> · <Link href="/auth/register" className="font-semibold text-terracotta">Chưa có tài khoản? Đăng ký</Link></p>
      </form>
      <button className="btn-ghost mt-4 w-full" onClick={guest}>Tiếp tục với tư cách khách — chỉ xem bài giới thiệu và thử bảng vẽ, không lưu tiến độ</button>
    </div>
  );
}
