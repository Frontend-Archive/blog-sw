'use client';

import { useCallback, useSyncExternalStore } from 'react';
import { CountUp } from '@/components/home/count-up';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** 빌드 시각. 서버 렌더에서 쓰는 기준값이다. */
const BUILD_TIME = Date.now();

function daysBetween(from: string, now: number): number {
  const start = new Date(`${from}T00:00:00Z`).getTime();
  return Math.max(1, Math.floor((now - start) / MS_PER_DAY) + 1);
}

/** 구독할 외부 소스가 없다. 날짜는 상호작용으로 바뀌지 않는다. */
function subscribe(): () => void {
  return () => {};
}

interface DaysSinceProps {
  /** 기준일 (YYYY-MM-DD) */
  from: string;
  delayMs?: number;
}

/**
 * 기준일로부터 오늘까지의 일수.
 *
 * 정적으로 굳은 빌드 시점이 아니라 보는 사람 기준의 숫자를 보여준다.
 * 렌더 중에 Date.now() 를 부르면 순수하지 않으므로 useSyncExternalStore 로 감싼다.
 */
export function DaysSince({ from, delayMs }: DaysSinceProps) {
  const getSnapshot = useCallback(() => daysBetween(from, Date.now()), [from]);
  const getServerSnapshot = useCallback(() => daysBetween(from, BUILD_TIME), [from]);

  const days = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return <CountUp value={days} delayMs={delayMs} />;
}
