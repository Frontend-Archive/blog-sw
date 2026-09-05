'use client';

import { useEffect } from 'react';
import { useVisits } from './storage';

/**
 * 상세 페이지를 열었다는 사실만 브라우저에 남긴다.
 *
 * 화면에는 아무것도 그리지 않는다. 최근 읽은 글과 목록의 읽음 표시가
 * 이 기록 하나를 나눠 쓴다.
 */
export function RecordVisit({ articleKey }: { articleKey: string }) {
  const { record } = useVisits();

  useEffect(() => {
    record(articleKey);
  }, [articleKey, record]);

  return null;
}
