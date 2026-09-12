'use client';

import Link from 'next/link';
import type { CSSProperties } from 'react';
import { BrandMark } from '@/components/icons/brand-mark';
import { Button } from '@/components/ui/button';
import './status.css';

type VarStyle = CSSProperties & Record<`--${string}`, string>;

/** 마크를 세로로 가르는 금. 위는 조금 왼쪽, 아래는 조금 오른쪽으로 비뚤다 */
const CLIP = {
  left: 'polygon(0 0, 53% 0, 44% 46%, 50% 100%, 0 100%)',
  right: 'polygon(53% 0, 100% 0, 100% 100%, 50% 100%, 44% 46%)',
} as const;

/** 갈라진 틈에서 떨어져 나와 사라지는 조각 */
const CHIPS = [
  { size: 9, left: 46, top: 38, dx: '-120%', dy: '180%', dr: '-40deg', delay: 0 },
  { size: 6, left: 52, top: 55, dx: '160%', dy: '220%', dr: '55deg', delay: 0.06 },
  { size: 5, left: 49, top: 68, dx: '-90%', dy: '260%', dr: '25deg', delay: 0.12 },
] as const;

/**
 * 오류 화면.
 *
 * 사이트 마크가 잠깐 흔들리다 반으로 갈라졌다 다시 붙기를 되풀이한다. 404 와 같은
 * 자리·같은 크기지만 커서를 따라가지 않고 저 혼자 깨진다.
 *
 * 두 조각은 같은 마크를 그린 뒤 금 모양대로 오려 낸 것이다. 움직임 줄이기를 켜면
 * 갈라진 모습만 보여 준다.
 *
 * 서버 오류는 내용 대신 digest 만 넘어오니 그 값을 보여 줘서 로그와 맞춰 볼 수 있게 한다.
 */
export function ErrorView({ digest, onRetry }: { digest?: string; onRetry: () => void }) {
  const half = (side: 'left' | 'right') => (
    <span
      className={`absolute inset-0 status-crack-${side}`}
      style={{ clipPath: CLIP[side] }}
      aria-hidden
    >
      <BrandMark idPrefix={`error-${side}`} className="size-full" />
    </span>
  );

  return (
    <section className="flex min-h-[calc(100dvh-var(--header-height)-8rem)] flex-col items-center justify-center gap-8 py-16 text-center">
      <span
        aria-hidden
        className="status-shake relative block"
        style={{ width: 'clamp(8rem, 26vw, 13rem)', aspectRatio: '1' }}
      >
        {half('left')}
        {half('right')}
        {CHIPS.map((chip) => {
          const style: VarStyle = {
            left: `${chip.left}%`,
            top: `${chip.top}%`,
            width: `${chip.size}%`,
            height: `${chip.size}%`,
            '--status-dx': chip.dx,
            '--status-dy': chip.dy,
            '--status-dr': chip.dr,
            '--status-delay': `${chip.delay}s`,
          };
          return (
            <span
              key={chip.top}
              style={style}
              className="status-chip absolute rounded-[2px] bg-foreground/40"
            />
          );
        })}
      </span>

      <div className="flex flex-col gap-2">
        <h1 className="text-24 font-semibold tracking-tight">이 페이지를 그리지 못했습니다</h1>
        <p className="text-16 text-muted-foreground">잠시 후 다시 시도해 주세요.</p>
        {digest ? <p className="font-mono text-14 text-muted-foreground">digest {digest}</p> : null}
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <Button size="lg" onClick={onRetry}>
          다시 시도
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/">전체 아티클 보기</Link>
        </Button>
      </div>
    </section>
  );
}
