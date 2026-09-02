'use client';

import { Search, X } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useFilterStore } from './store';
import { countActiveFilters } from './types';

interface FilterBarProps {
  authors: string[];
  archiveIds: number[];
  tags: string[];
  resultCount: number;
  totalCount: number;
}

interface ChipRowProps {
  label: string;
  children: React.ReactNode;
}

function ChipRow({ label, children }: ChipRowProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="w-12 shrink-0 text-xs text-muted-foreground">{label}</span>
      {children}
    </div>
  );
}

interface ChipProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function Chip({ active, onClick, children }: ChipProps) {
  return (
    <button type="button" onClick={onClick} aria-pressed={active}>
      <Badge
        variant={active ? 'default' : 'secondary'}
        className={cn('cursor-pointer font-normal transition-colors', !active && 'hover:bg-accent')}
      >
        {children}
      </Badge>
    </button>
  );
}

export function FilterBar({ authors, archiveIds, tags, resultCount, totalCount }: FilterBarProps) {
  const filter = useFilterStore(
    useShallow((state) => ({
      query: state.query,
      tags: state.tags,
      authors: state.authors,
      archiveIds: state.archiveIds,
    })),
  );
  const setQuery = useFilterStore((state) => state.setQuery);
  const toggleTag = useFilterStore((state) => state.toggleTag);
  const toggleAuthor = useFilterStore((state) => state.toggleAuthor);
  const toggleArchiveId = useFilterStore((state) => state.toggleArchiveId);
  const reset = useFilterStore((state) => state.reset);

  const activeCount = countActiveFilters(filter);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          type="search"
          value={filter.query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="제목, 작성자, 태그로 검색"
          aria-label="아티클 검색"
          className="pl-9"
        />
      </div>

      <ChipRow label="회차">
        {archiveIds.map((id) => (
          <Chip
            key={id}
            active={filter.archiveIds.includes(id)}
            onClick={() => toggleArchiveId(id)}
          >
            {id}회차
          </Chip>
        ))}
      </ChipRow>

      <ChipRow label="멤버">
        {authors.map((author) => (
          <Chip
            key={author}
            active={filter.authors.includes(author)}
            onClick={() => toggleAuthor(author)}
          >
            {author}
          </Chip>
        ))}
      </ChipRow>

      <ChipRow label="태그">
        {tags.map((tag) => (
          <Chip key={tag} active={filter.tags.includes(tag)} onClick={() => toggleTag(tag)}>
            {tag}
          </Chip>
        ))}
      </ChipRow>

      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span aria-live="polite">
          {activeCount > 0 ? `${resultCount}개 / 전체 ${totalCount}개` : `전체 ${totalCount}개`}
        </span>
        {activeCount > 0 ? (
          <Button variant="ghost" size="sm" onClick={reset} className="h-7 gap-1 px-2 text-xs">
            <X className="size-3" aria-hidden />
            초기화
          </Button>
        ) : null}
      </div>
    </div>
  );
}
