import type { ArticleCardData } from '@/lib/archive/view';
import type { ArticleFilter } from './types';

/**
 * 검색어는 공백으로 쪼개 모두 포함(AND)해야 통과시킨다.
 *
 * 읽음 여부는 브라우저에만 있어서 여기서 직접 읽지 않고 읽은 글의 키를 받는다.
 * 순수 함수로 남겨 두면 서버·클라이언트 어디서든 같은 결과가 나온다.
 */
export function filterArticles(
  articles: ArticleCardData[],
  filter: ArticleFilter,
  readKeys: ReadonlySet<string>,
): ArticleCardData[] {
  const terms = filter.query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0 && !filter.unreadOnly) return articles;

  return articles.filter((article) => {
    if (filter.unreadOnly && readKeys.has(article.key)) return false;
    return terms.every((term) => article.searchText.includes(term));
  });
}
