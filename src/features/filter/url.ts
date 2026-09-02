import { EMPTY_FILTER, type ArticleFilter } from './types';

/**
 * 필터 상태와 쿼리스트링을 서로 옮긴다.
 * 값이 비면 파라미터 자체를 빼서 공유된 URL 이 깔끔하게 남도록 한다.
 */

const PARAM = {
  query: 'q',
  tags: 'tag',
  authors: 'author',
  archiveIds: 'archive',
} as const;

function splitList(value: string | null): string[] {
  if (!value) return [];
  return value
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

export function parseFilterFromParams(params: URLSearchParams): ArticleFilter {
  const archiveIds = splitList(params.get(PARAM.archiveIds))
    .map(Number)
    .filter((id) => Number.isInteger(id) && id > 0);

  return {
    ...EMPTY_FILTER,
    query: params.get(PARAM.query)?.trim() ?? '',
    tags: splitList(params.get(PARAM.tags)),
    authors: splitList(params.get(PARAM.authors)),
    archiveIds,
  };
}

export function serializeFilterToQuery(filter: ArticleFilter): string {
  const params = new URLSearchParams();
  const query = filter.query.trim();
  if (query) params.set(PARAM.query, query);
  if (filter.tags.length > 0) params.set(PARAM.tags, filter.tags.join(','));
  if (filter.authors.length > 0) params.set(PARAM.authors, filter.authors.join(','));
  if (filter.archiveIds.length > 0) {
    params.set(PARAM.archiveIds, [...filter.archiveIds].sort((a, b) => a - b).join(','));
  }
  return params.toString();
}
