'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useVisits } from './storage';

/**
 * 읽은 카드의 썸네일에서 색을 빼고 오른쪽 위에 표시를 남긴다.
 *
 * 글자는 건드리지 않아 제목을 다시 읽는 데 지장이 없고, 아직 색이 남은 카드가
 * 눈에 먼저 든다. 손이 닿으면 색은 돌아오되 읽음 표시는 남는다. 색이 살아났다고
 * 안 읽은 글로 보이면 곤란하다.
 *
 * 카드 자체를 클라이언트로 돌리면 taxonomy 를 타고 아카이브 전체가 번들에
 * 딸려 온다. 그래서 겉만 감싸고 카드는 서버에서 그린 것을 그대로 받는다.
 *
 * 기록은 브라우저에만 있어 첫 렌더에는 색이 그대로고, 화면에 뜬 뒤에 빠진다.
 */
export function ReadDim({
  articleKey,
  children,
}: {
  articleKey: string;
  children: React.ReactNode;
}) {
  const { entries } = useVisits();
  const read = entries.some((entry) => entry.key === articleKey);

  return (
    <div
      className={cn(
        'group/read relative flex [&_[data-thumb]]:transition-[filter] [&_[data-thumb]]:duration-500',
        read && '[&_[data-thumb]]:grayscale hover:[&_[data-thumb]]:grayscale-0',
      )}
    >
      {children}
      {read ? (
        <span className="pointer-events-none absolute top-3 right-3 z-10 inline-flex items-center gap-1 rounded-full bg-background/85 px-3 py-1 text-12 font-medium backdrop-blur">
          <Check className="size-3.5" aria-hidden />
          읽음
        </span>
      ) : null}
    </div>
  );
}
