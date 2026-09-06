import type { Metadata } from 'next';
import { Geist, Noto_Sans_KR } from 'next/font/google';
import { SiteBottomNav } from '@/components/layout/site-bottom-nav';
import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { ThemeProvider } from '@/components/layout/theme-provider';
import { CommandPaletteProvider } from '@/features/command-palette/command-palette-provider';
import { RecentFab } from '@/features/reading/recent-fab';
import { buildCommandPaletteData } from '@/lib/archive/command-data';
import { GOOGLE_SITE_VERIFICATION, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/site';
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
  // 하위 페이지가 상대 경로로 적은 canonical·og:image 를 절대 주소로 편다.
  metadataBase: new URL(SITE_URL),
  // 하위 페이지는 제목만 적고 뒤에 사이트 이름이 붙는다.
  title: { default: SITE_NAME, template: `%s · ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  verification: { google: GOOGLE_SITE_VERIFICATION },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    locale: 'ko_KR',
  },
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="ko"
      className={`${geist.variable} ${notoSansKr.variable} antialiased`}
      suppressHydrationWarning
    >
      {/* 하단 바가 본문 끝을 덮지 않게 그만큼 아래를 비운다. */}
      <body className="flex min-h-dvh flex-col bg-background pb-[calc(var(--bottom-nav-height)+2rem)] font-sans text-foreground md:pb-0">
        <ThemeProvider>
          {/* 상단 검색 버튼과 하단 바가 같은 팔레트를 열어야 해서 위에서 감싼다. */}
          <CommandPaletteProvider data={buildCommandPaletteData()}>
            <SiteHeader />
            {/* 본문이 최소 한 화면을 차지하게 해서, 스크롤 맨 위에서는 푸터가 보이지 않는다. */}
            <div className="flex min-h-[calc(100dvh-var(--header-height))] flex-col">
              {children}
            </div>
            <SiteFooter />
            <SiteBottomNav />
            <RecentFab />
          </CommandPaletteProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
