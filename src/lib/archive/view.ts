import type { ArchiveArticle } from './model';
import { getHostname, getOg } from './og';
import type { OgImage } from './og-schema';

/**
 * 카드가 그리는 데 필요한 값만 모은 뷰모델.
 *
 * 카드가 og.json 을 직접 참조하면 클라이언트 컴포넌트에서 쓸 때
 * 전체 OG 캐시가 번들에 딸려 들어간다. 서버에서 필요한 필드만 뽑아 넘긴다.
 */
export interface ArticleCardData {
  key: string;
  title: string;
  url: string;
  author: string;
  tags: string[];
  archiveId: number;
  archiveDate: string;
  hostname: string;
  description?: string;
  image?: OgImage;
  favicon?: string;
  readingMinutes?: number;
  /** 검색용으로 미리 이어붙여 소문자로 정규화한 문자열 */
  searchText: string;
}

export function toArticleCardData(article: ArchiveArticle): ArticleCardData {
  const og = getOg(article.url);
  const hostname = getHostname(article.url);

  return {
    key: article.key,
    title: article.title,
    url: article.url,
    author: article.author,
    tags: article.tags,
    archiveId: article.archiveId,
    archiveDate: article.archiveDate,
    hostname,
    description: og?.description,
    image: og?.image,
    favicon: og?.favicon,
    readingMinutes: og?.readingMinutes,
    searchText: [article.title, article.author, ...article.tags, hostname, og?.description ?? '']
      .join(' ')
      .toLowerCase(),
  };
}

export function toArticleCardList(articles: ArchiveArticle[]): ArticleCardData[] {
  return articles.map(toArticleCardData);
}
