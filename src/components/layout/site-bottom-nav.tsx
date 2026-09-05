'use client';

import { Search } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BOTTOM_NAV_ITEMS, isNavActive } from '@/components/layout/nav-items';
import { useCommandPalette } from '@/features/command-palette/command-palette-provider';
import { cn } from '@/lib/utils';

const ITEM = 'flex h-full flex-col items-center justify-center gap-1 px-4 text-12';

/**
 * 모바일 하단 내비.
 *
 * 좁은 화면에서는 상단에 로고·메뉴·검색·테마를 한 줄로 밀어 넣으면 어느 것도
 * 누르기 좋은 크기가 못 된다. 메뉴와 검색을 엄지가 닿는 아래로 내린다.
 *
 * 화면 폭을 다 쓰지 않고 띄운 알약으로 둔다. 바닥에 붙여 늘리면 항목 넷이
 * 멀찍이 흩어져 한 덩어리로 안 읽히고, 아래 끝 내용과도 딱 맞닿는다.
 */
export function SiteBottomNav() {
  const pathname = usePathname();
  const openPalette = useCommandPalette();

  return (
    <nav
      aria-label="주요 메뉴"
      className="fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+1rem)] z-40 flex justify-center px-4 md:hidden"
    >
      {/* 유리판. 배경을 반쯤 깔고 뒤를 흐리게 비춘다. 안쪽 위 1px 하이라이트가
          판의 두께를, 바깥 그림자가 떠 있는 높이를 만든다. 틴트만으로도 글자가
          읽히는 농도라 blur 를 못 쓰는 브라우저도 따로 손보지 않는다. */}
      <ul className="flex h-(--bottom-nav-height) items-stretch gap-5 rounded-full border border-border/50 bg-background/30 px-5 shadow-[0_8px_32px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-md backdrop-saturate-150">
        {BOTTOM_NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = isNavActive(pathname, href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  ITEM,
                  'transition-colors',
                  isActive ? 'font-medium text-brand' : 'text-muted-foreground',
                )}
              >
                <Icon className="size-5" aria-hidden />
                {label}
              </Link>
            </li>
          );
        })}

        {/* 검색은 어디로 가는 링크가 아니라 팔레트를 여는 동작이라 맨 끝에 둔다. */}
        <li>
          <button
            type="button"
            onClick={openPalette}
            className={cn(ITEM, 'text-muted-foreground transition-colors')}
          >
            <Search className="size-5" aria-hidden />
            검색
          </button>
        </li>
      </ul>
    </nav>
  );
}
