'use client';

import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFilterStore } from './store';

interface FilterBarProps {
  resultCount: number;
  totalCount: number;
}

export function FilterBar({ resultCount, totalCount }: FilterBarProps) {
  const query = useFilterStore((state) => state.query);
  const setQuery = useFilterStore((state) => state.setQuery);
  const reset = useFilterStore((state) => state.reset);

  const hasQuery = query.trim().length > 0;

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <Search
          className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="제목, 작성자, 태그로 검색"
          aria-label="아티클 검색"
          className="h-14 w-full rounded-xl border border-input bg-transparent pr-12 pl-12 text-16 transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 [&::-webkit-search-cancel-button]:hidden"
        />
        {hasQuery ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={reset}
            aria-label="검색어 지우기"
            className="absolute top-1/2 right-2 -translate-y-1/2"
          >
            <X className="size-4" aria-hidden />
          </Button>
        ) : null}
      </div>

      <p className="text-14 text-muted-foreground" aria-live="polite">
        {hasQuery ? `${resultCount}개 / 전체 ${totalCount}개` : `전체 ${totalCount}개`}
      </p>
    </div>
  );
}
