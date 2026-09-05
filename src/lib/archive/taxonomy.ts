import { memberById, memberIds, requireMember } from './members-config';
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

/**
 * archive 에 등장한 이름이 전부 멤버 명부에 있는지 여기서 한 번에 확인한다.
 * 하나라도 빠지면 빌드가 멈춘다.
 */
for (const author of authors) requireMember(author);

export function getTagBySlug(slug: string): string | undefined {
  return tagBySlug.get(slug);
}

/** 주소의 멤버 id 로 지금 쓰는 이름을 찾는다. */
export function getAuthorBySlug(slug: string): string | undefined {
  return memberById(slug)?.name;
}

export const tagSlugs = [...tagBySlug.keys()];
export const authorSlugs = memberIds;

export function articlesByTag(tag: string): ArchiveArticle[] {
  return articles.filter((article) => article.tags.includes(tag));
}

/** 이름이 바뀌어도 같은 사람의 글이 이어지도록 멤버 id 로 견준다. */
export function articlesByAuthor(author: string): ArchiveArticle[] {
  const id = requireMember(author).id;
  return articles.filter((article) => requireMember(article.author).id === id);
}

/**
 * 아티클 상세 경로에 쓰는 식별자. 회차 안에서 작성자는 유일하므로
 * "회차-멤버id" 조합이면 충분하다. 제목이나 이름이 바뀌어도 주소가 그대로 남는다.
 */
export function articleSlug(article: { archiveId: number; author: string }): string {
  return `${article.archiveId}-${requireMember(article.author).id}`;
}

export const articleSlugs = articles.map(articleSlug);

export function getArticleBySlug(slug: string): ArchiveArticle | undefined {
  return articles.find((article) => articleSlug(article) === slug);
}

/** 같은 태그를 하나라도 공유하는 다른 글. 겹치는 태그가 많은 순으로 준다. */
export function relatedByTag(target: ArchiveArticle, limit: number): ArchiveArticle[] {
  return articles
    .filter((article) => article.key !== target.key)
    .map((article) => ({
      article,
      shared: article.tags.filter((tag) => target.tags.includes(tag)).length,
    }))
    .filter((item) => item.shared > 0)
    .sort((a, b) => b.shared - a.shared || b.article.archiveId - a.article.archiveId)
    .slice(0, limit)
    .map((item) => item.article);
}
