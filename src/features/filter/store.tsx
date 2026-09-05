'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import { useStore } from 'zustand';
import { createStore, type StoreApi } from 'zustand/vanilla';
import { EMPTY_FILTER, type ArticleFilter } from './types';

interface FilterActions {
  setQuery: (query: string) => void;
  toggleUnreadOnly: () => void;
  /** URL 에서 읽은 필터를 통째로 덮어쓴다. */
  hydrate: (filter: ArticleFilter) => void;
  reset: () => void;
}

export type FilterStore = ArticleFilter & FilterActions;

function createFilterStore(initial: ArticleFilter): StoreApi<FilterStore> {
  return createStore<FilterStore>()((set) => ({
    ...initial,
    setQuery: (query) => set({ query }),
    toggleUnreadOnly: () => set((state) => ({ unreadOnly: !state.unreadOnly })),
    hydrate: (filter) => set({ ...filter }),
    reset: () => set({ ...EMPTY_FILTER }),
  }));
}

const FilterStoreContext = createContext<StoreApi<FilterStore> | null>(null);

/**
 * 서버 렌더와 첫 클라이언트 렌더가 어긋나지 않도록 항상 빈 필터로 시작한다.
 * URL 에 담긴 필터는 마운트 직후 useFilterUrlSync 가 적용한다.
 */
export function FilterStoreProvider({ children }: { children: ReactNode }) {
  const [store] = useState(() => createFilterStore(EMPTY_FILTER));

  return <FilterStoreContext.Provider value={store}>{children}</FilterStoreContext.Provider>;
}

export function useFilterStore<T>(selector: (state: FilterStore) => T): T {
  const store = useContext(FilterStoreContext);
  if (!store) {
    throw new Error('useFilterStore 는 FilterStoreProvider 안에서만 쓸 수 있습니다.');
  }
  return useStore(store, selector);
}
