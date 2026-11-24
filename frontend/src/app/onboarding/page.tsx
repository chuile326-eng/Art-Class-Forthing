'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { api } from '@/lib/api';
import { MODULES } from '@/lib/curriculum';

const QUESTIONS = [
  { q: 'Đường nào là đường thẳng?', options: ['Đường cong lượn', 'Đường nối hai điểm ngắn nhất, không cong', 'Đường zigzag', 'Đường tròn'], answer: 1 },
  { q: 'Ellipse dùng để vẽ gì?', options: ['Chỉ để trang trí', 'Miệng chai, đáy trụ và vật tròn trong phối cảnh', 'Chỉ vẽ mặt trời', 'Không dùng trong vẽ'], answer: 1 },
  { q: 'Điểm tụ trong phối cảnh là gì?', options: ['Điểm sáng nhất', 'Nơi các đường song song hội tụ trên đường chân trời', 'Điểm giữa bức tranh', 'Điểm đặt bút đầu tiên'], answer: 1 },
  { q: 'Bóng lõi (core shadow) là gì?', options: ['Bóng vật hắt xuống đất', 'Vùng tối nhất trên chính vật thể', 'Vùng sáng nhất', 'Bóng của người vẽ'], answer: 1 },
  { q: 'Trước khi vẽ chi tiết, nên làm gì trước?', options: ['Vẽ chi tiết ngay', 'Dựng khung bao và tỉ lệ tổng thể', 'Tô màu trước', 'Vẽ nền trước'], answer: 1 },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [goal, setGoal] = useState('Học vẽ cơ bản từ đầu');
  const [level, setLevel] = useState('Chưa từng vẽ');
  const [medium, setMedium] = useState('paper');
  const [minutes, setMinutes] = useState(30);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [score, setScore] = useState<number | null>(null);
  const [saving, setSaving] = useState(false); const [note, setNote] = useState('');
  const recommendation = score === null ? null : score >= 4 ? MODULES[2] : score >= 2 ? MODULES[1] : MODULES[0];
  async function save() {
    setSaving(true); setNote('');
    const payload = { goal, level, medium, practice_minutes_per_day: minutes, placement_score: score };
    // Backend có PUT /users/me/profile {goal, self_level, medium, minutes_per_day}.
    try { await api('/users/me/profile', { method: 'PUT', body: JSON.stringify({ goal, self_level: level, medium, minutes_per_day: minutes }) }); setNote('Đã lưu lựa chọn của bạn lên máy chủ.'); }
    catch { localStorage.setItem('drawpath_onboarding', JSON.stringify(payload)); setNote('Máy chủ chưa lưu được (cần đăng nhập) — lựa chọn của bạn đã được lưu trên trình duyệt này.'); }
    setSaving(false);
  }
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-display text-3xl font-bold">Thiết lập hành trình học của bạn</h1>
      <p className="mt-2 text-graphite/70">Chọn mục tiêu và trình độ — hệ thống gợi ý điểm bắt đầu phù hợp. Bài kiểm tra đầu vào là tùy chọn, không quyết định toàn bộ năng lực của bạn.</p>
      <div className="card mt-6 space-y-5">
        <div><label className="label" htmlFor="goal">Mục tiêu học tập</label>
          <select id="goal" className="input" value={goal} onChange={e => setGoal(e.target.value)}>
            <option>Học vẽ cơ bản từ đầu</option><option>Vẽ chân dung</option><option>Vẽ anime/manga</option><option>Vẽ phong cảnh</option><option>Digital painting</option><option>Cải thiện kỹ năng hiện có</option>
          </select></div>
        <div><label className="label" htmlFor="level">Trình độ tự đánh giá</label>
          <select id="level" className="input" value={level} onChange={e => setLevel(e.target.value)}>
            <option>Chưa từng vẽ</option><option>Mới bắt đầu</option><option>Cơ bản</option><option>Trung bình</option><option>Nâng cao</option>
          </select></div>
        <div><label className="label">Phương thức vẽ</label>
          <div className="flex gap-3">
            <button type="button" className={`btn-secondary ${medium === 'paper' ? '!bg-terracotta !text-white !border-terracotta' : ''}`} onClick={() => setMedium('paper')}>✎ Trên giấy</button>
            <button type="button" className={`btn-secondary ${medium === 'digital' ? '!bg-terracotta !text-white !border-terracotta' : ''}`} onClick={() => setMedium('digital')}>▣ Digital</button>
            <button type="button" className={`btn-secondary ${medium === 'both' ? '!bg-terracotta !text-white !border-terracotta' : ''}`} onClick={() => setMedium('both')}>Cả hai</button>
          </div></div>
        <div><label className="label" htmlFor="minutes">Thời gian luyện tập mỗi ngày: {minutes} phút</label>
          <input id="minutes" type="range" min={10} max={120} step={5} value={minutes} onChange={e => setMinutes(Number(e.target.value))} className="w-full" /></div>
      </div>

      <h2 className="mt-8 font-display text-2xl font-bold">Bài kiểm tra đầu vào (tùy chọn — 5 câu)</h2>
      <div className="mt-4 space-y-4">
        {QUESTIONS.map((q, i) => (
          <div key={i} className="card">
            <p className="font-semibold">{i + 1}. {q.q}</p>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {q.options.map((o, j) => (
                <button key={j} type="button" onClick={() => setAnswers({ ...answers, [i]: j })} className={`rounded-xl border-2 px-3 py-2 text-left text-sm ${answers[i] === j ? 'border-terracotta bg-coral/10 font-semibold' : 'border-graphite/15 bg-white'}`}>{o}</button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <button className="btn-primary" onClick={() => { const s = QUESTIONS.reduce((a, q, i) => a + (answers[i] === q.answer ? 1 : 0), 0); setScore(s); }}>Chấm bài kiểm tra</button>
        <button className="btn-secondary" onClick={save} disabled={saving}>{saving ? 'Đang lưu…' : 'Lưu và bắt đầu học'}</button>
      </div>
      {score !== null && recommendation && (
        <div className="card mt-4 border-sage" role="status">
          <p className="font-semibold">Kết quả: {score}/5 câu đúng.</p>
          <p className="mt-1 text-sm text-graphite/75">Điểm bắt đầu gợi ý: <strong>{recommendation.name}</strong> — {recommendation.description} Đây chỉ là gợi ý; bạn có thể học bất kỳ bài nào trong lộ trình.</p>
          <Link href={`/lessons/${recommendation.lessons[0].id}`} className="btn-primary mt-3">Bắt đầu bài đầu tiên →</Link>
        </div>
      )}
      {note && <p className="mt-3 text-sm" role="status">{note}</p>}
      <p className="mt-4"><Link href="/roadmap" className="font-semibold text-terracotta">Xem toàn bộ lộ trình →</Link></p>
    </div>
  );
}
