import type { ArticleCardData } from '@/lib/archive/view';
import type { ArticleFilter } from './types';

/** 검색어는 공백으로 쪼개 모두 포함(AND)해야 통과시킨다. */
export function filterArticles(
  articles: ArticleCardData[],
  filter: ArticleFilter,
): ArticleCardData[] {
  const terms = filter.query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return articles;

  return articles.filter((article) => terms.every((term) => article.searchText.includes(term)));
}
