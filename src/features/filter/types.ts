export interface ArticleFilter {
  query: string;
}

export const EMPTY_FILTER: ArticleFilter = {
  query: '',
};

export function isEmptyFilter(filter: ArticleFilter): boolean {
  return filter.query.trim() === '';
}
