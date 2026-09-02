import type { ParsedArchive } from './parse';
import { isFilledArticle, type Article, type MeetingType } from './schema';

/** 회차 정보를 붙여 평탄화한 아티클. 목록/카드의 기본 단위다. */
export interface ArchiveArticle extends Article {
  /** 회차 안에서 안정적인 식별자 (회차당 author 는 유일) */
  key: string;
  archiveId: number;
  archiveDate: string;
  meetingType: MeetingType;
}

/** 채워진 아티클만 회차 정보와 함께 평탄화한다. 최신 회차가 앞에 온다. */
export function toArticles(archives: ParsedArchive[]): ArchiveArticle[] {
  return archives
    .slice()
    .sort((a, b) => b.id - a.id)
    .flatMap((archive) =>
      archive.articles.filter(isFilledArticle).map((article) => ({
        ...article,
        key: `${archive.id}-${article.author}`,
        archiveId: archive.id,
        archiveDate: archive.date,
        meetingType: archive.type,
      })),
    );
}

/** 아직 채워지지 않은 슬롯 수 */
export function countEmptySlots(archives: ParsedArchive[]): number {
  return archives.reduce(
    (total, archive) => total + archive.articles.filter((a) => !isFilledArticle(a)).length,
    0,
  );
}

/** 등장 횟수 내림차순 태그 목록 */
export function collectTags(articles: ArchiveArticle[]): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const article of articles) {
    for (const tag of article.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, 'ko'));
}

/** 회차 전체에 등장하는 작성자 목록. 원본 articles 순서를 유지한다. */
export function collectAuthors(archives: ParsedArchive[]): string[] {
  const authors: string[] = [];
  for (const archive of archives) {
    for (const article of archive.articles) {
      if (!authors.includes(article.author)) {
        authors.push(article.author);
      }
    }
  }
  return authors;
}

/** 해당 작성자가 아직 채우지 않은 자리 */
export interface OpenSlot {
  archiveId: number;
  archiveTitle: string;
  date: string;
}

export function findOpenSlots(archives: ParsedArchive[], author: string): OpenSlot[] {
  return archives
    .filter((archive) =>
      archive.articles.some((article) => article.author === author && !isFilledArticle(article)),
    )
    .map((archive) => ({
      archiveId: archive.id,
      archiveTitle: archive.title,
      date: archive.date,
    }));
}

/** 다음 회차 번호 */
export function nextArchiveId(archives: ParsedArchive[]): number {
  return archives.reduce((max, archive) => Math.max(max, archive.id), 0) + 1;
}
