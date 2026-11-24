'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getStoredUser, isLoggedIn, logout, currentUserName } from '@/lib/api';

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const [menu, setMenu] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => { setUser(getStoredUser()); }, [pathname]);
  const logged = isLoggedIn() || !!user;
  const links = [
    { href: '/roadmap', label: 'Lộ trình' },
    { href: '/dashboard', label: 'Bảng học tập' },
    { href: '/workspace', label: 'Bảng vẽ' },
    { href: '/portfolio', label: 'Portfolio' },
  ];
  return (
    <header className="sticky top-0 z-40 border-b-2 border-graphite/10 bg-ivory/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2" aria-label="DrawPath AI - Trang chủ">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-terracotta text-xl font-bold text-white" aria-hidden>✎</span>
          <span className="font-display text-2xl font-bold">DrawPath <span className="text-terracotta">AI</span></span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex" aria-label="Điều hướng chính">
          {links.map(l => (
            <Link key={l.href} href={l.href} className={`rounded-full px-4 py-2 font-medium hover:bg-paper ${pathname?.startsWith(l.href) ? 'bg-paper font-semibold text-terracotta' : ''}`}>{l.label}</Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {logged ? (
            <>
              <span className="hidden text-sm font-medium sm:block">Xin chào, {currentUserName()}</span>
              <Link href="/settings" className="btn-ghost">Cài đặt</Link>
              <button className="btn-secondary !px-4 !py-2" onClick={() => { logout(); setUser(null); router.push('/'); }}>Đăng xuất</button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="btn-ghost">Đăng nhập</Link>
              <Link href="/auth/register" className="btn-primary !px-4 !py-2">Bắt đầu học</Link>
            </>
          )}
          <button className="rounded-full border-2 border-graphite/20 p-2 md:hidden" aria-label="Mở menu" aria-expanded={menu} onClick={() => setMenu(!menu)}>☰</button>
        </div>
      </div>
      {menu && (
        <nav className="border-t border-graphite/10 bg-ivory px-4 py-2 md:hidden" aria-label="Menu di động">
          {links.map(l => (<Link key={l.href} href={l.href} onClick={() => setMenu(false)} className="block rounded-lg px-3 py-2 font-medium hover:bg-paper">{l.label}</Link>))}
          <Link href="/admin" onClick={() => setMenu(false)} className="block rounded-lg px-3 py-2 font-medium hover:bg-paper">Quản trị</Link>
        </nav>
      )}
    </header>
  );
}
