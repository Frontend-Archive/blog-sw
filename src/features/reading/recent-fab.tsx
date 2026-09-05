'use client';

import { History } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useVisits } from './storage';

/**
 * 최근 읽은 글로 가는 버튼.
 *
 * 상단 내비에는 두지 않는다. 읽은 글이 없는 사람에게는 있으나 마나 한 항목이라
 * 기록이 생긴 뒤에만 화면 구석에 나타나게 한다.
 *
 * 모바일에서는 하단 바가 한 칸을 내주므로 이 버튼은 나오지 않는다.
 */
export function RecentFab() {
  const { entries } = useVisits();
  const pathname = usePathname();

  if (entries.length === 0 || pathname === '/recent') return null;

  return (
    <Link
      href="/recent"
      aria-label={`최근 읽은 글 ${entries.length}편`}
      className="fixed right-6 bottom-6 z-50 hidden size-12 items-center justify-center rounded-full border border-border/70 bg-card text-foreground shadow-lg transition-colors hover:border-brand/40 hover:text-brand md:flex"
    >
      <History className="size-5" aria-hidden />
    </Link>
  );
}
