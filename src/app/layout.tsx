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
  weight: ['400', '500', '700'],
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
      className={`${geist.variable} ${notoSansKr.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        <ThemeProvider>
          <SiteHeader />
          {children}
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
