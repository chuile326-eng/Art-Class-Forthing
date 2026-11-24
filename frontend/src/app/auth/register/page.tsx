'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { api, setToken } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState(''); const [username, setUsername] = useState(''); const [email, setEmail] = useState(''); const [password, setPassword] = useState('');
  const [error, setError] = useState(''); const [loading, setLoading] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setError('');
    if (password.length < 8) { setError('Mật khẩu cần ít nhất 8 ký tự.'); return; }
    if (username.trim().length < 3) { setError('Tên đăng nhập cần ít nhất 3 ký tự.'); return; }
    setLoading(true);
    try {
      // Backend: POST /auth/register {email, username, password, role} -> UserOut (không trả token).
      await api('/auth/register', { method: 'POST', body: JSON.stringify({ email, username: username.trim(), password, role: 'learner' }) });
      // Đăng nhập ngay để lấy token.
      const data: any = await api('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
      const token = data?.access_token || data?.token;
      if (token) { setToken(token); try { const me: any = await api('/auth/me'); localStorage.setItem('drawpath_user', JSON.stringify(me)); } catch {} if (name.trim()) { try { await api('/users/me/profile', { method: 'PUT', body: JSON.stringify({ display_name: name.trim() }) }); } catch {} } router.push('/onboarding'); }
      else router.push('/auth/login');
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  }
  return (
    <div className="mx-auto max-w-md px-4 py-14">
      <h1 className="font-display text-3xl font-bold">Tạo tài khoản</h1>
      <p className="mt-2 text-graphite/70">Bắt đầu hành trình học vẽ của bạn — miễn phí.</p>
      <form onSubmit={submit} className="card mt-6 space-y-4">
        {error && <div className="rounded-xl bg-coral/15 p-3 text-sm" role="alert">{error}</div>}
        <div><label className="label" htmlFor="name">Họ tên hiển thị</label><input id="name" className="input" value={name} onChange={e => setName(e.target.value)} autoComplete="name" /></div>
        <div><label className="label" htmlFor="username">Tên đăng nhập (tối thiểu 3 ký tự, dùng để đăng nhập cùng email)</label><input id="username" className="input" required value={username} onChange={e => setUsername(e.target.value)} autoComplete="username" /></div>
        <div><label className="label" htmlFor="email">Email</label><input id="email" className="input" type="email" required value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" /></div>
        <div><label className="label" htmlFor="password">Mật khẩu (tối thiểu 8 ký tự)</label><input id="password" className="input" type="password" required value={password} onChange={e => setPassword(e.target.value)} autoComplete="new-password" /></div>
        <button className="btn-primary w-full" disabled={loading}>{loading ? 'Đang tạo tài khoản…' : 'Đăng ký'}</button>
        <p className="text-center text-sm">Đã có tài khoản? <Link href="/auth/login" className="font-semibold text-terracotta">Đăng nhập</Link></p>
      </form>
    </div>
  );
}
