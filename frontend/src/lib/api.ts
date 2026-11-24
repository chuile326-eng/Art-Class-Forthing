export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
// Backend routers are mounted at the root (no /api/v1 prefix): /auth, /modules,
// /lessons, /drawing/projects, /submissions, /tutor/chat, /progress, /admin/...
// If NEXT_PUBLIC_API_URL is set to a host with a different prefix, use it as-is.
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'DrawPath AI';

export interface ApiError { message: string; status?: number }
export interface User { id: string | number; email: string; username?: string; full_name?: string; name?: string; role?: string; avatar_url?: string; }
export interface Module { id: string | number; title?: string; name?: string; description?: string; order?: number; difficulty?: string; lessons?: Lesson[]; lesson_count?: number; }
export interface Lesson { id: string | number; module_id?: string | number; title: string; description?: string; difficulty?: string; duration_minutes?: number; objectives?: string[]; steps?: string[]; rubric?: RubricCriterion[]; prerequisites?: string[]; }
export interface RubricCriterion { id?: string; name: string; description?: string; weight: number; max_score?: number }
export interface Exercise { id: string | number; lesson_id?: string | number; title: string; description?: string; instructions?: string; rubric?: RubricCriterion[] }
export interface Submission { id: string | number; exercise_id?: string | number; lesson_id?: string | number; status?: string; image_url?: string; created_at?: string; }
export interface Assessment { id?: string | number; submission_id?: string | number; overall_score?: number; score?: number; criterion_results?: { name: string; score: number; max_score?: number; feedback?: string }[]; strengths?: string[]; weaknesses?: string[]; corrections?: { title: string; description: string; x?: number; y?: number }[]; annotations?: { id?: string; type: string; x: number; y: number; label: string; severity?: string; explanation?: string }[]; confidence?: string; }
export interface Progress { overall_progress?: number; completed_lessons?: number; total_lessons?: number; skills?: { name: string; level: number; status: string }[]; [k: string]: any }
export interface Recommendation { lesson_id?: string | number; lesson?: Lesson; title?: string; reason?: string; }

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('drawpath_token');
}
export function setToken(t: string | null) { if (t) localStorage.setItem('drawpath_token', t); else localStorage.removeItem('drawpath_token'); }
export function isLoggedIn() { return typeof window !== 'undefined' && !!localStorage.getItem('drawpath_token'); }
export function isGuest() { return typeof window !== 'undefined' && localStorage.getItem('drawpath_guest') === '1'; }
export function logout() { localStorage.removeItem('drawpath_token'); localStorage.removeItem('drawpath_user'); localStorage.removeItem('drawpath_guest'); }

export async function api<T = any>(path: string, opts: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = { 'Content-Type': 'application/json', ...(opts.headers as Record<string, string> || {}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, { ...opts, headers });
  } catch (e: any) {
    throw new Error(`Không kết nối được máy chủ API (${API_URL}). Hãy kiểm tra backend đang chạy. Chi tiết: ${e?.message || e}`);
  }
  const text = await res.text();
  let data: any = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!res.ok) {
    const msg = data?.detail || data?.message || (typeof data === 'string' ? data : '') || `Lỗi ${res.status}`;
    throw new Error(typeof msg === 'string' ? msg : JSON.stringify(msg));
  }
  return data as T;
}
export async function apiForm<T = any>(path: string, form: FormData): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  let res: Response;
  try { res = await fetch(`${API_URL}${path}`, { method: 'POST', headers, body: form }); }
  catch (e: any) { throw new Error(`Không kết nối được máy chủ API. ${e?.message || ''}`); }
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.detail || data?.message || `Lỗi ${res.status}`);
  return data as T;
}
export function getStoredUser(): User | null {
  try { const s = localStorage.getItem('drawpath_user'); return s ? JSON.parse(s) : null; } catch { return null; }
}
export function currentUserName(): string {
  const u = typeof window !== 'undefined' ? getStoredUser() : null;
  return u?.full_name || u?.name || u?.username || u?.email || 'Bạn học';
}
export function displayName(u: any): string { return u?.full_name || u?.name || u?.username || u?.email || '—'; }

// --- Normalizers: backend field names -> frontend field names ---
// LessonOut: {id (int), lesson_id (slug), title, description, objectives,
//   difficulty ('beginner'|'intermediate'|'advanced'), estimated_minutes,
//   prerequisites, theory, steps, common_mistakes, pass_condition,
//   next_lesson_id, status}
export function normalizeLesson(raw: any): any {
  if (!raw) return raw;
  const join = (v: any) => Array.isArray(v) ? v.join('\n') : (v || '');
  return {
    ...raw,
    id: raw.lesson_id || raw.id,
    numericId: raw.id,
    title: raw.title,
    description: raw.description || '',
    difficulty: raw.difficulty === 'beginner' ? 'Cơ bản' : raw.difficulty === 'intermediate' ? 'Trung bình' : raw.difficulty === 'advanced' ? 'Nâng cao' : (raw.difficulty || ''),
    duration_minutes: raw.estimated_minutes ?? raw.duration_minutes,
    theory: raw.theory || '',
    steps: raw.steps || [],
    correctExample: join(raw.correct_examples),
    wrongExample: join(raw.wrong_examples),
    objectives: raw.objectives || [],
    prerequisites: raw.prerequisites || [],
    commonMistakes: raw.common_mistakes || [],
    passCondition: raw.pass_condition || '',
    nextLessonId: raw.next_lesson_id || null,
    status: raw.status || '',
  };
}
export function normalizeModule(raw: any): any {
  if (!raw) return raw;
  return { ...raw, id: raw.code || raw.id, title: raw.title || raw.name, lessons: (raw.lessons || []).map(normalizeLesson) };
}
export const MASTERY_PCT: Record<string, number> = { not_started: 0, learning: 30, needs_practice: 50, proficient: 75, mastered: 100 };
export const MASTERY_LABEL: Record<string, string> = { not_started: 'Chưa bắt đầu', learning: 'Đang học', needs_practice: 'Cần luyện thêm', proficient: 'Thành thạo', mastered: 'Đã làm chủ' };
