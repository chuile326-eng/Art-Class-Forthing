'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api, getStoredUser } from '@/lib/api';
import { EmptyBox, ErrorBox, Loading } from '@/components/ui';

type Tab = 'overview' | 'users' | 'curriculum' | 'jobs' | 'audit';
const TABS: [Tab, string][] = [['overview', 'Tổng quan'], ['users', 'Người dùng'], ['curriculum', 'Chương trình học'], ['jobs', 'AI Jobs'], ['audit', 'Nhật ký kiểm tra']];

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('overview');
  const [role, setRole] = useState<string | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [modules, setModules] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [overview, setOverview] = useState<any>(null);
  const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  const [newLesson, setNewLesson] = useState({ module_code: 'M00', lesson_id: '', title: '', description: '', theory: '', difficulty: 'beginner', estimated_minutes: 30 });
  const [msg, setMsg] = useState('');
  useEffect(() => {
    const u = getStoredUser(); setRole(u?.role || null);
    (async () => {
      try {
        // Backend admin: GET /admin/overview, /admin/users, /admin/ai-jobs, /admin/audit-logs.
        // Curriculum list comes from public GET /modules (ModuleOut has nested lessons).
        const [ov, us, ms, js, lg] = await Promise.allSettled([api<any>('/admin/overview'), api<any>('/admin/users'), api<any>('/modules'), api<any>('/admin/ai-jobs'), api<any>('/admin/audit-logs')]);
        if (ov.status === 'fulfilled') setOverview(ov.value);
        if (us.status === 'fulfilled') setUsers(Array.isArray(us.value) ? us.value : us.value?.items || []);
        if (ms.status === 'fulfilled') setModules(Array.isArray(ms.value) ? ms.value : ms.value?.items || []);
        if (js.status === 'fulfilled') setJobs(Array.isArray(js.value) ? js.value : js.value?.items || []);
        if (lg.status === 'fulfilled') setLogs(Array.isArray(lg.value) ? lg.value : lg.value?.items || []);
        if ([ov, us, js, lg].every(r => r.status === 'rejected')) setError('Không tải được dữ liệu quản trị. Bạn cần quyền admin/instructor và backend đang chạy.');
      } catch (e: any) { setError(e.message); }
      setLoading(false);
    })();
  }, []);
  const allowed = role === 'admin' || role === 'instructor';
  if (loading) return <div className="mx-auto max-w-7xl px-4"><Loading label="Đang tải trang quản trị…" /></div>;
  if (!allowed) return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <ErrorBox message="Trang quản trị chỉ dành cho tài khoản có vai trò admin hoặc instructor. Tài khoản hiện tại không có quyền này." />
      <p className="mt-4 text-sm text-graphite/70">Vai trò hiện tại: {role || 'chưa đăng nhập / khách'}. Nếu bạn là quản trị viên, hãy đăng nhập bằng tài khoản admin.</p>
      <Link href="/auth/login" className="btn-primary mt-4">Đăng nhập tài khoản admin</Link>
    </div>
  );
  async function createLesson(e: React.FormEvent) {
    e.preventDefault(); setMsg('');
    try {
      // Backend: POST /admin/lessons {module_code, lesson_id, title, description, theory, difficulty, estimated_minutes} -> draft.
      const created: any = await api('/admin/lessons', { method: 'POST', body: JSON.stringify(newLesson) });
      setMsg(`Đã tạo bài học ${created?.lesson_id || newLesson.lesson_id} ở trạng thái draft.`);
      setNewLesson({ ...newLesson, lesson_id: '', title: '', description: '', theory: '' });
    } catch (e: any) { setMsg(`Không tạo được bài học: ${e.message}`); }
  }
  async function setLessonStatus(lessonId: string, status: string) {
    // Allowed: draft -> in-review/archived; in-review -> published/draft; published -> archived; archived -> draft.
    // Publish requires theory >= 50 words.
    try { const r: any = await api(`/admin/lessons/${lessonId}/status`, { method: 'PUT', body: JSON.stringify({ status }) }); setMsg(`Đã chuyển bài ${lessonId} sang trạng thái ${r?.status || status}.`); }
    catch (e: any) { setMsg(`Không đổi trạng thái được: ${e.message}`); }
  }
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="font-display text-3xl font-bold">Quản trị</h1>
      <p className="mt-1 text-graphite/70">Vai trò: {role} · Chỉ tài khoản admin/instructor mới thấy trang này.</p>
      {error && <div className="mt-4"><ErrorBox message={error} /></div>}
      {msg && <p className="mt-3 rounded-xl bg-sage/20 p-3 text-sm" role="status">{msg}</p>}
      <div className="mt-6 flex flex-wrap gap-2" role="tablist" aria-label="Mục quản trị">
        {TABS.map(([k, label]) => <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={`rounded-full border-2 px-4 py-2 font-medium ${tab === k ? 'border-terracotta bg-terracotta text-white' : 'border-graphite/20 bg-ivory'}`}>{label}</button>)}
      </div>
      {tab === 'overview' && (
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          {[['Người dùng', overview?.users ?? users.length], ['Bài học', overview?.lessons ?? '—'], ['Bài nộp', overview?.submissions ?? '—'], ['AI Jobs', jobs.length]].map(([l, v]) => (
            <div key={l as string} className="card"><p className="text-sm text-graphite/60">{l}</p><p className="font-display text-4xl font-bold">{v as number | string}</p></div>))}
        </div>)}
      {tab === 'users' && (
        <section className="card mt-6"><h2 className="font-display text-xl font-bold">Người dùng</h2>
          {users.length === 0 ? <div className="mt-3"><EmptyBox title="Chưa tải được danh sách người dùng." /></div> : (
            <ul className="mt-3 space-y-2">{users.map((u: any) => (
              <li key={u.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-graphite/10 p-3 text-sm">
                <span>{u.full_name || u.name || u.email} — {u.email}</span>
                <span className="flex items-center gap-2"><span className="chip">{u.role || 'learner'}</span>
                  <select aria-label={`Đổi vai trò cho ${u.email}`} defaultValue={u.role || 'learner'} onChange={async e => { try { await api(`/admin/users/${u.id}/role`, { method: 'PUT', body: JSON.stringify({ role: e.target.value }) }); setMsg(`Đã đổi vai trò của ${u.email} thành ${e.target.value}.`); } catch (err: any) { setMsg(`Không đổi được vai trò: ${err.message}`); } }}>
                    <option value="learner">learner</option><option value="instructor">instructor</option><option value="admin">admin</option>
                  </select></span></li>))}</ul>)}
        </section>)}
      {tab === 'curriculum' && (
        <section className="card mt-6"><h2 className="font-display text-xl font-bold">Chương trình học — tạo bài học mới</h2>
          <form onSubmit={createLesson} className="mt-4 grid gap-3 md:grid-cols-2">
            <div><label className="label" htmlFor="mc">Module</label><select id="mc" className="input" value={newLesson.module_code} onChange={e => setNewLesson({ ...newLesson, module_code: e.target.value })}>{modules.map((m: any) => <option key={m.id} value={m.code}>{m.code} — {m.title}</option>)}</select></div>
            <div><label className="label" htmlFor="lid">Mã bài (lesson_id, VD: L00-06)</label><input id="lid" className="input" value={newLesson.lesson_id} onChange={e => setNewLesson({ ...newLesson, lesson_id: e.target.value })} required /></div>
            <div><label className="label" htmlFor="lt">Tiêu đề</label><input id="lt" className="input" value={newLesson.title} onChange={e => setNewLesson({ ...newLesson, title: e.target.value })} required /></div>
            <div><label className="label" htmlFor="ld">Mô tả</label><input id="ld" className="input" value={newLesson.description} onChange={e => setNewLesson({ ...newLesson, description: e.target.value })} /></div>
            <div className="md:col-span-2"><label className="label" htmlFor="lth">Lý thuyết (cần ≥ 50 từ mới xuất bản được)</label><textarea id="lth" className="input" rows={3} value={newLesson.theory} onChange={e => setNewLesson({ ...newLesson, theory: e.target.value })} /></div>
            <div><label className="label" htmlFor="ldf">Độ khó</label><select id="ldf" className="input" value={newLesson.difficulty} onChange={e => setNewLesson({ ...newLesson, difficulty: e.target.value })}><option value="beginner">beginner</option><option value="intermediate">intermediate</option><option value="advanced">advanced</option></select></div>
            <div><label className="label" htmlFor="lem">Thời lượng (phút)</label><input id="lem" type="number" className="input" value={newLesson.estimated_minutes} onChange={e => setNewLesson({ ...newLesson, estimated_minutes: Number(e.target.value) })} /></div>
            <button className="btn-primary md:col-span-2">+ Tạo bài học (trạng thái draft)</button>
          </form>
          <p className="mt-2 text-xs text-graphite/60">Quy trình xuất bản: draft → in-review → published → archived. Bài học do AI tạo chưa được rà soát sẽ không tự động xuất bản.</p>
          <h3 className="mt-6 font-bold">Bài học hiện có (từ GET /modules)</h3>
          {modules.length === 0 ? <div className="mt-3"><EmptyBox title="Chưa có module nào từ máy chủ." /></div> : (
            <ul className="mt-3 space-y-2">{modules.flatMap((m: any) => (m.lessons || []).map((l: any) => (
              <li key={l.lesson_id || l.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-graphite/10 p-3 text-sm">
                <span><strong>{l.lesson_id}</strong> — {l.title} <span className="chip ml-1">{l.status || '—'}</span></span>
                <span className="flex gap-2">
                  <button className="btn-secondary !px-3 !py-1 text-xs" onClick={() => setLessonStatus(l.lesson_id, 'in-review')}>Gửi duyệt</button>
                  <button className="btn-secondary !px-3 !py-1 text-xs" onClick={() => setLessonStatus(l.lesson_id, 'published')}>Xuất bản</button>
                  <button className="btn-secondary !px-3 !py-1 text-xs" onClick={() => setLessonStatus(l.lesson_id, 'archived')}>Lưu trữ</button>
                </span></li>)))}</ul>)}
        </section>)}
      {tab === 'jobs' && (
        <section className="card mt-6"><h2 className="font-display text-xl font-bold">AI Jobs</h2>
          {jobs.length === 0 ? <div className="mt-3"><EmptyBox title="Không có AI job nào đang chạy hoặc đã lưu." /></div> : (
            <ul className="mt-3 space-y-2">{jobs.map((j: any) => <li key={j.job_id || j.id} className="flex justify-between rounded-xl border border-graphite/10 p-3 text-sm"><span>Job {j.job_id || j.id} · {j.kind || ''} · {j.provider || ''} {j.model || ''}</span><span className="chip">{j.status || j.state || '—'}</span></li>)}</ul>)}
        </section>)}
      {tab === 'audit' && (
        <section className="card mt-6"><h2 className="font-display text-xl font-bold">Nhật ký kiểm tra (Audit Logs)</h2>
          {logs.length === 0 ? <div className="mt-3"><EmptyBox title="Chưa có nhật ký nào." /></div> : (
            <ul className="mt-3 space-y-2">{logs.map((l: any, i: number) => <li key={i} className="rounded-xl border border-graphite/10 p-3 text-sm">{l.created_at ? new Date(l.created_at).toLocaleString('vi-VN') : ''} — {l.action || l.event} — {l.entity || ''} #{l.entity_id || ''} — user {l.user_id || ''}</li>)}</ul>)}
        </section>)}
    </div>
  );
}
