import type { Metadata } from 'next';
import { Be_Vietnam_Pro, Playfair_Display } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const body = Be_Vietnam_Pro({ subsets: ['vietnamese', 'latin'], weight: ['400', '500', '600', '700'], variable: '--font-body' });
const display = Playfair_Display({ subsets: ['vietnamese', 'latin'], weight: ['600', '700', '800'], variable: '--font-display' });

export const metadata: Metadata = {
  title: 'DrawPath AI — Học vẽ từ cơ bản đến nâng cao',
  description: 'Nền tảng học vẽ tích hợp gia sư AI: lộ trình rõ ràng, bảng vẽ tương tác, chấm bài và hướng dẫn sửa từng lỗi.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${body.variable} ${display.variable}`}>
      <body className="font-sans min-h-screen bg-paper text-graphite antialiased">
        <Header />
        <main className="min-h-[70vh]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
