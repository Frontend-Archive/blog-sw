import { cn } from '@/lib/utils';

interface BrandMarkProps {
  className?: string;
  /** 한 화면에 여러 번 놓여도 그라데이션 id 가 겹치지 않게 한다. */
  idPrefix?: string;
}

/**
 * 파비콘과 같은 마크. 판 위에 접힌 A 를 올린 형태다.
 *
 * 색은 globals.css 의 --mark-* 토큰을 따라 테마에 맞춰 뒤집힌다. 판이 밝아지면
 * A 도 같이 어두워져야 대비가 유지되므로 판과 글리프 색을 한 벌로 묶었다.
 * stop-color 는 속성으로는 var() 를 읽지 못해 인라인 스타일로 넘긴다.
 */
export function BrandMark({ className, idPrefix = 'bm' }: BrandMarkProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={cn('block', className)}
    >
      <defs>
        <linearGradient id={`${idPrefix}-plate`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" style={{ stopColor: 'var(--mark-plate-from)' }} />
          <stop offset="55%" style={{ stopColor: 'var(--mark-plate-mid)' }} />
          <stop offset="100%" style={{ stopColor: 'var(--mark-plate-to)' }} />
        </linearGradient>
        <linearGradient id={`${idPrefix}-l`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" style={{ stopColor: 'var(--mark-face-left-from)' }} />
          <stop offset="100%" style={{ stopColor: 'var(--mark-face-left-to)' }} />
        </linearGradient>
        <linearGradient id={`${idPrefix}-r`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" style={{ stopColor: 'var(--mark-face-right-from)' }} />
          <stop offset="100%" style={{ stopColor: 'var(--mark-face-right-to)' }} />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="7" fill={`url(#${idPrefix}-plate)`} />
      <g transform="translate(16 16) scale(0.64) translate(-16 -16)">
        <path d="M16 3 4 29h6.5L16 15z" fill={`url(#${idPrefix}-l)`} />
        <path d="M16 3l12 26h-6.5L16 15z" fill={`url(#${idPrefix}-r)`} />
        <path d="M11 22h10l2.2 5H8.8z" style={{ fill: 'var(--mark-bar)' }} opacity="0.95" />
      </g>
    </svg>
  );
}
