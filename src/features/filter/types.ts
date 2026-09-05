export interface ArticleFilter {
  query: string;
  /** 아직 안 읽은 글만 남긴다. 무엇을 읽었는지는 브라우저 기록에서 온다. */
  unreadOnly: boolean;
}

export const EMPTY_FILTER: ArticleFilter = {
  query: '',
  unreadOnly: false,
};

export function isEmptyFilter(filter: ArticleFilter): boolean {
  return filter.query.trim() === '' && !filter.unreadOnly;
}
