import { collectAuthors, collectTags, type ArchiveArticle } from './model';
import { archives, articles } from './source';

/**
 * 한글 태그를 URL 세그먼트로 만든다.
 *
 * 한글은 퍼센트 인코딩되어 그대로 쓸 수 있으므로 로마자로 옮기지 않는다.
 * 공백만 하이픈으로 바꾸고 경로에서 문제가 되는 문자를 걷어낸다.
 */
export function toSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[/\\?#[\]@!$&'()*+,;=%.]/g, '')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '');
}

function buildSlugMap(values: string[], kind: string): Map<string, string> {
  const bySlug = new Map<string, string>();
  for (const value of values) {
    const slug = toSlug(value);
    if (!slug) {
      throw new Error(`${kind} "${value}" 의 슬러그가 비었습니다.`);
    }
    const existing = bySlug.get(slug);
    if (existing && existing !== value) {
      throw new Error(`${kind} 슬러그가 충돌합니다: "${existing}" 와 "${value}" 가 모두 ${slug}`);
    }
    bySlug.set(slug, value);
  }
  return bySlug;
}

export const tagCounts = collectTags(articles);

const tagBySlug = buildSlugMap(
  tagCounts.map((item) => item.tag),
  '태그',
);

export const authors = collectAuthors(archives);

const authorBySlug = buildSlugMap(authors, '작성자');

export function getTagBySlug(slug: string): string | undefined {
  return tagBySlug.get(slug);
}

export function getAuthorBySlug(slug: string): string | undefined {
  return authorBySlug.get(slug);
}

export const tagSlugs = [...tagBySlug.keys()];
export const authorSlugs = [...authorBySlug.keys()];

export function articlesByTag(tag: string): ArchiveArticle[] {
  return articles.filter((article) => article.tags.includes(tag));
}

export function articlesByAuthor(author: string): ArchiveArticle[] {
  return articles.filter((article) => article.author === author);
}
