import type { Metadata } from 'next';
import { Noto_Sans_KR } from 'next/font/google';
import './globals.css';
import Providers from '@/components/providers';
import { Toaster } from '@/components/ui/sonner';

const notoSansKr = Noto_Sans_KR({
  variable: '--font-noto-sans-kr',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: '바리스타 커뮤니티',
  description: '내 주변 바리스타와 커피 愛호가를 연결하는 지역 커뮤니티',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${notoSansKr.variable} antialiased`}>
        <Providers>{children}</Providers>
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
