'use client';

import { useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { ArticleGrid } from '@/components/article/article-grid';
import { useVisits } from '@/features/reading/storage';
import type { ArticleCardData } from '@/lib/archive/view';
import { FilterBar } from './filter-bar';
import { filterArticles } from './filter-articles';
import { FilterStoreProvider, useFilterStore } from './store';
import { useFilterUrlSync } from './use-filter-url-sync';

interface ArticleExplorerProps {
  articles: ArticleCardData[];
}

function ExplorerBody({ articles }: ArticleExplorerProps) {
  const filter = useFilterStore(
    useShallow((state) => ({ query: state.query, unreadOnly: state.unreadOnly })),
  );
  const hydrate = useFilterStore((state) => state.hydrate);

  useFilterUrlSync(filter, hydrate);

  // 읽음 여부는 브라우저 기록에만 있다. SSG 첫 렌더에는 비어 있다가 채워진다.
  const { entries } = useVisits();
  const readKeys = useMemo(() => new Set(entries.map((entry) => entry.key)), [entries]);

  const filtered = useMemo(
    () => filterArticles(articles, filter, readKeys),
    [articles, filter, readKeys],
  );

  return (
    <div className="flex flex-col gap-6">
      <FilterBar />
      <ArticleGrid
        articles={filtered}
        emptyMessage="조건에 맞는 아티클이 없습니다. 검색어를 지워보세요."
      />
    </div>
  );
}

export function ArticleExplorer(props: ArticleExplorerProps) {
  return (
    <FilterStoreProvider>
      <ExplorerBody {...props} />
    </FilterStoreProvider>
  );
}
