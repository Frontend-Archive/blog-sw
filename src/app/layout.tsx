import type { Metadata } from 'next';
import { Geist, Noto_Sans_KR } from 'next/font/google';
import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { ThemeProvider } from '@/components/layout/theme-provider';
import './globals.css';

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
  display: 'swap',
});

const notoSansKr = Noto_Sans_KR({
  // 태그 클라우드가 굵기 4단계를 쓴다. 없는 무게를 지정하면 브라우저가
  // 가짜 볼드를 만들어 한글이 뭉개진다.
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto-kr',
  display: 'swap',
  preload: false,
});

export const metadata: Metadata = {
  title: 'Frontend Archive',
  description: '스터디 회차별 아티클 아카이브',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="ko"
      className={`${geist.variable} ${notoSansKr.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-dvh flex-col bg-background font-sans text-foreground">
        <ThemeProvider>
          <SiteHeader />
          {/* 본문이 최소 한 화면을 차지하게 해서, 스크롤 맨 위에서는 푸터가 보이지 않는다. */}
          <div className="flex min-h-[calc(100dvh-var(--header-height))] flex-col">{children}</div>
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
