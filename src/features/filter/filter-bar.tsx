'use client';

import { Search, X } from 'lucide-react';
import { useFilterStore } from './store';
import { cn } from '@/lib/utils';

export function FilterBar() {
  const query = useFilterStore((state) => state.query);
  const setQuery = useFilterStore((state) => state.setQuery);
  const unreadOnly = useFilterStore((state) => state.unreadOnly);
  const toggleUnreadOnly = useFilterStore((state) => state.toggleUnreadOnly);

  const hasQuery = query.trim().length > 0;

  return (
    <div className="flex items-center justify-end gap-2">
      {/* 켜고 끄는 버튼이라 aria-pressed 로 상태를 남긴다. 링크가 아니다. */}
      <button
        type="button"
        onClick={toggleUnreadOnly}
        aria-pressed={unreadOnly}
        className={cn(
          'h-12 shrink-0 rounded-2xl border px-4 text-14 whitespace-nowrap transition-colors',
          unreadOnly
            ? 'border-brand bg-brand/10 text-brand'
            : 'border-input text-muted-foreground hover:text-foreground',
        )}
      >
        안 읽은 글만
      </button>

      <div className="relative min-w-0 flex-1 sm:w-80 sm:flex-none">
        <Search
          className="pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="제목, 작성자, 태그로 검색"
          aria-label="아티클 검색"
          className="h-12 w-full rounded-2xl border border-input bg-transparent pr-11 pl-11 text-16 transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-brand [&::-webkit-search-cancel-button]:hidden"
        />
        {hasQuery ? (
          // 입력창 안의 X 는 검색어만 지운다. 옆 버튼까지 꺼지면 왜 목록이
          // 늘어났는지 알 수 없다.
          <button
            type="button"
            onClick={() => setQuery('')}
            aria-label="검색어 지우기"
            className="absolute top-1/2 right-2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <X className="size-4" aria-hidden />
          </button>
        ) : null}
      </div>
    </div>
  );
}
