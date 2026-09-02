import { EMPTY_FILTER, type ArticleFilter } from './types';

/**
 * 필터 상태와 쿼리스트링을 서로 옮긴다.
 * 값이 비면 파라미터 자체를 빼서 공유된 URL 이 깔끔하게 남도록 한다.
 */

const QUERY_PARAM = 'q';

export function parseFilterFromParams(params: URLSearchParams): ArticleFilter {
  return {
    ...EMPTY_FILTER,
    query: params.get(QUERY_PARAM)?.trim() ?? '',
  };
}

export function serializeFilterToQuery(filter: ArticleFilter): string {
  const params = new URLSearchParams();
  const query = filter.query.trim();
  if (query) params.set(QUERY_PARAM, query);
  return params.toString();
}
