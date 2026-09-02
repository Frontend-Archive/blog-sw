export interface ArticleFilter {
  query: string;
  tags: string[];
  authors: string[];
  archiveIds: number[];
}

export const EMPTY_FILTER: ArticleFilter = {
  query: '',
  tags: [],
  authors: [],
  archiveIds: [],
};

export function isEmptyFilter(filter: ArticleFilter): boolean {
  return (
    filter.query.trim() === '' &&
    filter.tags.length === 0 &&
    filter.authors.length === 0 &&
    filter.archiveIds.length === 0
  );
}

export function countActiveFilters(filter: ArticleFilter): number {
  return (
    (filter.query.trim() === '' ? 0 : 1) +
    filter.tags.length +
    filter.authors.length +
    filter.archiveIds.length
  );
}
