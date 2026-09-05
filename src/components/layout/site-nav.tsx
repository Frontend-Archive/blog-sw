'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { isNavActive, NAV_ITEMS } from '@/components/layout/nav-items';
import { cn } from '@/lib/utils';

/** 상단 내비. 모바일에서는 하단 바가 대신하므로 숨긴다. */
export function SiteNav() {
  const pathname = usePathname();

  return (
    <nav className="hidden items-center gap-1 text-14 md:flex">
      {NAV_ITEMS.map(({ href, label }) => {
        const isActive = isNavActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'rounded-md px-3 py-2 transition-colors',
              isActive ? 'font-medium text-brand' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
