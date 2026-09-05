import { displayName, requireMember } from './members-config';
import { collectAuthors, type ArchiveArticle } from './model';
import { archives, articles } from './source';
import { getHostname } from './og';
import { articleSlug, tagCounts, toSlug } from './taxonomy';

/** 커맨드 팔레트가 클라이언트로 들고 가는 최소 데이터 */
export interface CommandArticle {
  key: string;
  title: string;
  author: string;
  url: string;
  hostname: string;
  archiveId: number;
  archiveDate: string;
  /** 상세 페이지 경로용 식별자 */
  slug: string;
  searchText: string;
}

export interface CommandTag {
  tag: string;
  slug: string;
  count: number;
}

export interface CommandMember {
  author: string;
  slug: string;
}

export interface CommandArchive {
  id: number;
  title: string;
  date: string;
}

export interface CommandPaletteData {
  articles: CommandArticle[];
  tags: CommandTag[];
  members: CommandMember[];
  archives: CommandArchive[];
}

function toCommandArticle(article: ArchiveArticle): CommandArticle {
  const hostname = getHostname(article.url);
  // archive 에 옛 이름으로 남아 있어도 팔레트에는 지금 이름으로 보인다.
  const author = displayName(article.author);
  return {
    key: article.key,
    title: article.title,
    author,
    url: article.url,
    hostname,
    archiveId: article.archiveId,
    archiveDate: article.archiveDate,
    slug: articleSlug(article),
    searchText: [article.title, author, article.author, ...article.tags, hostname]
      .join(' ')
      .toLowerCase(),
  };
}

export function buildCommandPaletteData(): CommandPaletteData {
  return {
    articles: articles.map(toCommandArticle),
    tags: tagCounts.map(({ tag, count }) => ({ tag, slug: toSlug(tag), count })),
    members: collectAuthors(archives).map((author) => ({ author, slug: requireMember(author).id })),
    archives: archives.map(({ id, title, date }) => ({ id, title, date })),
  };
}
