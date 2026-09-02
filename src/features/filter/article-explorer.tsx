'use client';

import { useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { ArticleGrid } from '@/components/article/article-grid';
import type { ArticleCardData } from '@/lib/archive/view';
import { FilterBar } from './filter-bar';
import { filterArticles } from './filter-articles';
import { FilterStoreProvider, useFilterStore } from './store';
import { useFilterUrlSync } from './use-filter-url-sync';

interface ArticleExplorerProps {
  articles: ArticleCardData[];
}

function ExplorerBody({ articles }: ArticleExplorerProps) {
  const filter = useFilterStore(useShallow((state) => ({ query: state.query })));
  const hydrate = useFilterStore((state) => state.hydrate);

  useFilterUrlSync(filter, hydrate);

  const filtered = useMemo(() => filterArticles(articles, filter), [articles, filter]);

  return (
    <div className="flex flex-col gap-6">
      <FilterBar resultCount={filtered.length} totalCount={articles.length} />
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
