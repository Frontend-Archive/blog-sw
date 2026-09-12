'use client';

import { useRef, type CSSProperties, type PointerEvent, type ReactNode } from 'react';

/** 화면 폭을 따라가되 너무 작아지거나 커지지 않게 묶는다 */
const HUGE: CSSProperties = { fontSize: 'clamp(6rem, 22vw, 13rem)', lineHeight: 1 };

/** 글자마다 다르게 기울어야 겹쳐 보이지 않는다. 가운데는 반대로 움직인다 */
const DEPTHS = [40, -70, 55];

const GLYPH =
  'inline-block transition-transform duration-300 ease-out motion-reduce:transform-none!';

interface StatusScreenProps {
  /** 큰 글자들. 하나만 둘 수도, 셋을 늘어놓을 수도 있다 */
  glyphs: ReactNode[];
  title: string;
  /** 제목 아래 한 줄. 없는 주소나 오류 코드처럼 짚어 줄 값 */
  note?: ReactNode;
  actions: ReactNode;
}

/**
 * 404·오류 화면의 공통 틀.
 *
 * 큰 글자 셋이 커서를 따라 조금씩 다르게 기운다. 커서 위치는 상태가 아니라 CSS
 * 변수로 넘긴다. 움직일 때마다 다시 그리지 않는다.
 */
export function StatusScreen({ glyphs, title, note, actions }: StatusScreenProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = (event: PointerEvent<HTMLDivElement>) => {
    const element = ref.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    element.style.setProperty('--tx', ((event.clientX - rect.left) / rect.width - 0.5).toFixed(3));
    element.style.setProperty('--ty', ((event.clientY - rect.top) / rect.height - 0.5).toFixed(3));
  };

  const depth = (amount: number): CSSProperties => ({
    transform: `translate3d(calc(var(--tx, 0) * ${amount}px), calc(var(--ty, 0) * ${amount}px), 0) rotate(calc(var(--tx, 0) * ${amount / 5}deg))`,
  });

  return (
    <div ref={ref} onPointerMove={handleMove} className="w-full">
      <section className="flex min-h-[calc(100dvh-var(--header-height)-8rem)] flex-col items-center justify-center gap-8 py-16 text-center">
        <p
          aria-hidden
          className="flex items-center gap-[0.05em] font-bold tracking-tighter"
          style={HUGE}
        >
          {glyphs.map((glyph, index) => (
            <span key={index} className={GLYPH} style={depth(DEPTHS[index % DEPTHS.length] ?? 0)}>
              {glyph}
            </span>
          ))}
        </p>
        <div className="flex flex-col gap-2">
          <h1 className="text-24 font-semibold tracking-tight">{title}</h1>
          {note ? <p className="font-mono text-14 text-muted-foreground">{note}</p> : null}
        </div>
        <div className="flex flex-wrap justify-center gap-3">{actions}</div>
      </section>
    </div>
  );
}
