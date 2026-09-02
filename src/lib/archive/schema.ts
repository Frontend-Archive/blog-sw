import { z } from 'zod';

/**
 * archives/YYYYMM.md 의 frontmatter 스키마.
 * 원본 정의: https://github.com/Frontend-Archive/archive#타입
 */

export const MEETING_TYPES = ['on-line', 'off-line'] as const;

export const meetingTypeSchema = z.enum(MEETING_TYPES);

/**
 * 미작성 항목은 title / url / tags 를 함께 비운다는 규칙이 있어
 * 세 필드 모두 빈 값을 허용한다. 채워진 항목인지는 isFilledArticle 로 판별한다.
 */
export const articleSchema = z.object({
  author: z.string().min(1),
  title: z.string(),
  url: z.union([z.url(), z.literal('')]),
  tags: z.array(z.string()),
});

export const archiveSchema = z.object({
  id: z.int().positive(),
  date: z.iso.date(),
  title: z.string().min(1),
  type: meetingTypeSchema,
  articles: z.array(articleSchema).min(1),
});

export type MeetingType = z.infer<typeof meetingTypeSchema>;
export type Article = z.infer<typeof articleSchema>;
export type Archive = z.infer<typeof archiveSchema>;

/** title 과 url 이 모두 채워진 아티클 */
export type FilledArticle = Article & { title: string; url: string };

export function isFilledArticle(article: Article): article is FilledArticle {
  return article.title.trim().length > 0 && article.url.trim().length > 0;
}
