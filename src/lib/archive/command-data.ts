import { collectAuthors, type ArchiveArticle } from './model';
import { archives, articles } from './source';
import { getHostname } from './og';
import { tagCounts, toSlug } from './taxonomy';

/** 커맨드 팔레트가 클라이언트로 들고 가는 최소 데이터 */
export interface CommandArticle {
  key: string;
  title: string;
  author: string;
  url: string;
  hostname: string;
  archiveId: number;
  archiveDate: string;
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
  return {
    key: article.key,
    title: article.title,
    author: article.author,
    url: article.url,
    hostname,
    archiveId: article.archiveId,
    archiveDate: article.archiveDate,
    searchText: [article.title, article.author, ...article.tags, hostname].join(' ').toLowerCase(),
  };
}

export function buildCommandPaletteData(): CommandPaletteData {
  return {
    articles: articles.map(toCommandArticle),
    tags: tagCounts.map(({ tag, count }) => ({ tag, slug: toSlug(tag), count })),
    members: collectAuthors(archives).map((author) => ({ author, slug: toSlug(author) })),
    archives: archives.map(({ id, title, date }) => ({ id, title, date })),
  };
}
