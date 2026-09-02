import type { ArticleCardData } from '@/lib/archive/view';
import type { ArticleFilter } from './types';

/**
 * 검색어는 공백으로 쪼개 모두 포함(AND)해야 통과시킨다.
 * 태그·작성자·회차는 선택된 것 중 하나라도 맞으면(OR) 통과시킨다.
 */
export function filterArticles(
  articles: ArticleCardData[],
  filter: ArticleFilter,
): ArticleCardData[] {
  const terms = filter.query.trim().toLowerCase().split(/\s+/).filter(Boolean);

  return articles.filter((article) => {
    if (!terms.every((term) => article.searchText.includes(term))) return false;
    if (filter.tags.length > 0 && !filter.tags.some((tag) => article.tags.includes(tag))) {
      return false;
    }
    if (filter.authors.length > 0 && !filter.authors.includes(article.author)) return false;
    if (filter.archiveIds.length > 0 && !filter.archiveIds.includes(article.archiveId)) {
      return false;
    }
    return true;
  });
}
