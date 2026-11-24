import Link from 'next/link';
export default function Footer() {
  return (
    <footer className="mt-16 border-t-2 border-graphite/10 bg-graphite text-ivory">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-4">
        <div>
          <p className="font-display text-2xl font-bold">DrawPath <span className="text-coral">AI</span></p>
          <p className="mt-2 text-sm text-ivory/70">Nền tảng học vẽ từ cơ bản đến nâng cao, tích hợp gia sư AI. Học — Quan sát — Thực hành — Phân tích — Sửa — Tiến bộ — Thành thạo.</p>
        </div>
        <div><p className="font-semibold">Học tập</p><ul className="mt-2 space-y-1 text-sm text-ivory/70"><li><Link href="/roadmap">Lộ trình học</Link></li><li><Link href="/dashboard">Bảng học tập</Link></li><li><Link href="/workspace">Bảng vẽ</Link></li></ul></div>
        <div><p className="font-semibold">Tài khoản</p><ul className="mt-2 space-y-1 text-sm text-ivory/70"><li><Link href="/auth/register">Đăng ký</Link></li><li><Link href="/auth/login">Đăng nhập</Link></li><li><Link href="/settings">Cài đặt &amp; quyền riêng tư</Link></li></ul></div>
        <div><p className="font-semibold">Lưu ý</p><p className="mt-2 text-sm text-ivory/70">Bài vẽ của bạn mặc định riêng tư. AI là gia sư hỗ trợ, không thay thế tư duy của người học. Nội dung mẫu được ghi nhãn rõ ràng khi chưa kết nối máy chủ.</p></div>
      </div>
      <div className="border-t border-ivory/10 py-4 text-center text-xs text-ivory/50">© 2026 DrawPath AI — Art-Class-Forthing.</div>
    </footer>
  );
}
