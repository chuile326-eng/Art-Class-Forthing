'use client';
import Link from 'next/link';
import { useState } from 'react';
import { api } from '@/lib/api';

export default function ForgotPage() {
  const [email, setEmail] = useState(''); const [msg, setMsg] = useState(''); const [error, setError] = useState('');
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setError(''); setMsg('');
    try {
      await api('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) });
      setMsg('Nếu email tồn tại và hệ thống đã cấu hình gửi mail, bạn sẽ nhận được liên kết đặt lại mật khẩu.');
    } catch (err: any) {
      // Honest: backend may not have email configured.
      setError(`Không gửi được yêu cầu đặt lại mật khẩu: ${err.message}. Nếu máy chủ chưa cấu hình gửi email, tính năng này chưa khả dụng — hãy liên hệ quản trị viên để đặt lại mật khẩu.`);
    }
  }
  return (
    <div className="mx-auto max-w-md px-4 py-14">
      <h1 className="font-display text-3xl font-bold">Quên mật khẩu</h1>
      <p className="mt-2 text-graphite/70">Nhập email tài khoản của bạn. Lưu ý: tính năng gửi email chỉ hoạt động khi máy chủ đã cấu hình dịch vụ gửi mail.</p>
      <form onSubmit={submit} className="card mt-6 space-y-4">
        {msg && <div className="rounded-xl bg-sage/20 p-3 text-sm" role="status">{msg}</div>}
        {error && <div className="rounded-xl bg-coral/15 p-3 text-sm" role="alert">{error}</div>}
        <div><label className="label" htmlFor="email">Email</label><input id="email" className="input" type="email" required value={email} onChange={e => setEmail(e.target.value)} /></div>
        <button className="btn-primary w-full">Gửi liên kết đặt lại</button>
        <p className="text-center text-sm"><Link href="/auth/login" className="font-semibold text-terracotta">Quay lại đăng nhập</Link></p>
      </form>
    </div>
  );
}
