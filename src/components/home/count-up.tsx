'use client';

import { useEffect, useRef, useState } from 'react';

const DURATION_MS = 900;
/** 끝으로 갈수록 감속. 숫자가 착지하는 느낌을 준다. */
const easeOut = (t: number) => 1 - (1 - t) ** 3;

interface CountUpProps {
  value: number;
  /** 시작이 늦을수록 항목이 차례로 올라간다. */
  delayMs?: number;
}

/**
 * 0 에서 value 까지 숫자를 올린다.
 *
 * 서버 렌더에서는 최종값을 그대로 내보내 자바스크립트가 없거나 느린 환경에서도
 * 정확한 숫자가 보이게 하고, 마운트 이후에만 애니메이션을 시작한다.
 * prefers-reduced-motion 이면 아예 움직이지 않는다.
 */
export function CountUp({ value, delayMs = 0 }: CountUpProps) {
  const [display, setDisplay] = useState(value);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // 지연은 setTimeout 이 아니라 진행도 계산으로 처리한다. 이펙트 본문에서
    // setState 를 부르지 않기 위해서이고, 첫 프레임이 곧 0 을 그린다.
    let startedAt: number | null = null;

    const step = (now: number) => {
      startedAt ??= now;
      const elapsed = now - startedAt - delayMs;
      const progress = elapsed <= 0 ? 0 : Math.min(1, elapsed / DURATION_MS);
      setDisplay(Math.round(easeOut(progress) * value));
      if (progress < 1) frameRef.current = requestAnimationFrame(step);
    };

    frameRef.current = requestAnimationFrame(step);

    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [delayMs, value]);

  return <span suppressHydrationWarning>{display.toLocaleString('ko-KR')}</span>;
}
