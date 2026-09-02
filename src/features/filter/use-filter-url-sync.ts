'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { isEmptyFilter, type ArticleFilter } from './types';
import { parseFilterFromParams, serializeFilterToQuery } from './url';

/**
 * 필터 상태와 쿼리스트링을 양방향으로 잇는다.
 *
 * useSearchParams 는 쓰지 않는다. 정적으로 사전 렌더된 페이지에서 이 훅을 쓰면
 * Suspense 경계가 폴백에 머물러, 필터가 담긴 URL 로 들어왔을 때 목록이
 * 걸러지지 않는 문제가 있었다. 대신 마운트 직후 location 을 한 번 읽는다.
 *
 * 쓰기는 router.replace 가 아니라 history.replaceState 로 한다. Next 가 지원하는
 * 방식이고, 타이핑마다 라우터를 거치지 않아 리렌더가 생기지 않는다.
 */
export function useFilterUrlSync(
  filter: ArticleFilter,
  hydrate: (filter: ArticleFilter) => void,
): void {
  const pathname = usePathname();
  const query = serializeFilterToQuery(filter);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      const fromUrl = parseFilterFromParams(new URLSearchParams(window.location.search));
      if (!isEmptyFilter(fromUrl)) hydrate(fromUrl);
      // 첫 커밋에서는 URL 을 건드리지 않는다. 아직 상태가 비어 있어 파라미터가 날아간다.
      return;
    }

    const next = query ? `${pathname}?${query}` : pathname;
    if (`${window.location.pathname}${window.location.search}` !== next) {
      window.history.replaceState(null, '', next);
    }
  }, [hydrate, pathname, query]);
}
