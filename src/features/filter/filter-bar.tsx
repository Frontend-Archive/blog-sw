'use client';

import { Search, X } from 'lucide-react';
import { useFilterStore } from './store';

interface FilterBarProps {
  resultCount: number;
  totalCount: number;
}

/**
 * 결과 수는 검색 중일 때만 보여준다. 평소에는 히어로의 통계가 같은 숫자를
 * 이미 말하고 있어서, 입력창 밑에 상시로 두면 군더더기가 된다.
 */
export function FilterBar({ resultCount, totalCount }: FilterBarProps) {
  const query = useFilterStore((state) => state.query);
  const setQuery = useFilterStore((state) => state.setQuery);
  const reset = useFilterStore((state) => state.reset);

  const hasQuery = query.trim().length > 0;

  return (
    <div>
      <div className="relative">
        <Search
          className="pointer-events-none absolute top-1/2 left-5 size-5 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="제목, 작성자, 태그로 검색"
          aria-label="아티클 검색"
          className="h-14 w-full rounded-2xl border border-input bg-transparent pr-14 pl-14 text-16 transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-brand [&::-webkit-search-cancel-button]:hidden"
        />
        {hasQuery ? (
          <button
            type="button"
            onClick={reset}
            aria-label="검색어 지우기"
            className="absolute top-1/2 right-4 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <X className="size-4" aria-hidden />
          </button>
        ) : null}
      </div>

      <p className="h-6 pt-2 text-14 text-muted-foreground" aria-live="polite">
        {hasQuery ? `${totalCount}개 중 ${resultCount}개` : ''}
      </p>
    </div>
  );
}
