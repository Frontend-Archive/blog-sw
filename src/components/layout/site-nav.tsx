'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/', label: '아티클' },
  { href: '/timeline', label: '타임라인' },
  { href: '/tags', label: '태그' },
  { href: '/members', label: '멤버' },
  { href: '/submit', label: '글 등록' },
  // 카드 시안 비교용 임시 항목. 디자인이 정해지면 함께 지운다.
  { href: '/lab', label: 'Lab' },
] as const;

export function SiteNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1 text-sm">
      {NAV_ITEMS.map(({ href, label }) => {
        const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'rounded-md px-2.5 py-1.5 transition-colors',
              isActive
                ? 'font-medium text-foreground'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
