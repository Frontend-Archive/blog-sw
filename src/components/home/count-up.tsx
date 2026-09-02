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
 * 서버 렌더와 첫 상태는 최종값이다. 자바스크립트가 없거나 애니메이션을 시작하지
 * 못하는 상황에서도 정확한 숫자가 보여야 하기 때문이다.
 *
 * 숨겨진 탭에서는 시작하지 않는다. requestAnimationFrame 이 멈춰 있어
 * 0 을 그린 채로 굳어버리기 때문이다. 탭이 보이는 순간 그때 시작한다.
 */
export function CountUp({ value, delayMs = 0 }: CountUpProps) {
  const [display, setDisplay] = useState(value);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let startedAt: number | null = null;

    const step = (now: number) => {
      startedAt ??= now;
      const elapsed = now - startedAt - delayMs;
      const progress = elapsed <= 0 ? 0 : Math.min(1, elapsed / DURATION_MS);
      setDisplay(Math.round(easeOut(progress) * value));
      if (progress < 1) frameRef.current = requestAnimationFrame(step);
    };

    const start = () => {
      frameRef.current = requestAnimationFrame(step);
    };

    if (document.visibilityState === 'visible') {
      start();
      return () => {
        if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      };
    }

    const startWhenVisible = () => {
      if (document.visibilityState !== 'visible') return;
      document.removeEventListener('visibilitychange', startWhenVisible);
      start();
    };
    document.addEventListener('visibilitychange', startWhenVisible);

    return () => {
      document.removeEventListener('visibilitychange', startWhenVisible);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [delayMs, value]);

  return <span suppressHydrationWarning>{display.toLocaleString('ko-KR')}</span>;
}
