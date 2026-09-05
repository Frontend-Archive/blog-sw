'use client';

import { useCallback, useSyncExternalStore } from 'react';

/** 무엇을 언제 봤는지. 최근 본 글과 목록의 읽음 표시가 이 하나를 나눠 쓴다. */
export const VISITS_KEY = 'fa:visits';

/** 이만큼만 남긴다. 이보다 오래된 글은 읽음 표시도 함께 풀린다. */
export const VISIT_LIMIT = 100;

export interface VisitEntry {
  key: string;
  /** 본 날짜. 로컬 기준 YYYY-MM-DD */
  at: string;
}

/**
 * 브라우저에만 남는 기록.
 *
 * 아카이브에는 로그인이 없으니 "내가 뭘 언제 봤는지"는 서버가 알 수 없다.
 * localStorage 는 React 바깥의 저장소라 useSyncExternalStore 로 읽고,
 * 값이 없거나 못 읽어도 화면이 깨지지 않게 한다.
 *
 * 최근 본 글과 읽음 표시를 따로 저장했더니 한쪽을 지워도 다른 쪽이 남았다.
 * 사용자에게는 같은 "내가 본 것"이라 저장소도 하나로 둔다.
 */
const EMPTY: VisitEntry[] = [];
const cache = new Map<string, VisitEntry[]>();
const listeners = new Set<() => void>();

function subscribe(notify: () => void) {
  listeners.add(notify);
  window.addEventListener('storage', notify);
  return () => {
    listeners.delete(notify);
    window.removeEventListener('storage', notify);
  };
}

/** 로컬 시간대 기준 오늘 날짜. toISOString 은 UTC 라 자정 무렵에 하루가 밀린다. */
export function localDay(date = new Date()): string {
  const shifted = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return shifted.toISOString().slice(0, 10);
}

/** 같은 값이면 같은 배열을 돌려줘야 렌더가 멈춘다. */
function read(name: string): VisitEntry[] {
  const cached = cache.get(name);
  if (cached) return cached;

  let value = EMPTY;
  try {
    const raw = window.localStorage.getItem(name);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (Array.isArray(parsed)) {
      value = parsed.flatMap((item): VisitEntry[] => {
        if (item && typeof item === 'object' && 'key' in item) {
          const key = item.key;
          const at = 'at' in item ? item.at : '';
          if (typeof key === 'string') return [{ key, at: typeof at === 'string' ? at : '' }];
        }
        return [];
      });
    }
  } catch {
    value = EMPTY;
  }

  cache.set(name, value.length > 0 ? value : EMPTY);
  return cache.get(name) ?? EMPTY;
}

export function useVisits(name = VISITS_KEY, limit = VISIT_LIMIT) {
  const entries = useSyncExternalStore(
    subscribe,
    () => read(name),
    () => EMPTY,
  );

  const save = useCallback(
    (next: VisitEntry[]) => {
      cache.set(name, next);
      try {
        window.localStorage.setItem(name, JSON.stringify(next));
      } catch {
        // 시크릿 모드처럼 쓰기가 막힌 곳에서는 이번 세션에서만 유지된다.
      }
      for (const notify of listeners) notify();
    },
    [name],
  );

  const record = useCallback(
    (key: string) => {
      const current = read(name);
      const today = localDay();
      if (current[0]?.key === key && current[0].at === today) return;
      save([{ key, at: today }, ...current.filter((item) => item.key !== key)].slice(0, limit));
    },
    [limit, name, save],
  );

  const clear = useCallback(() => save([]), [save]);

  return { entries, record, clear };
}
