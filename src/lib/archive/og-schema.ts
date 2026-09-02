import { z } from 'zod';

export const ogImageSchema = z.object({
  /** public 기준 경로 (예: /og/ab12cd.jpg) */
  src: z.string().startsWith('/og/'),
  width: z.int().positive(),
  height: z.int().positive(),
});

export const ogEntrySchema = z.object({
  url: z.url(),
  /** 크롤링 성공 여부. 실패해도 엔트리는 남겨 원인을 추적한다. */
  ok: z.boolean(),
  status: z.int().nullable(),
  error: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  siteName: z.string().optional(),
  image: ogImageSchema.optional(),
  favicon: z.string().startsWith('/og/').optional(),
  /** 본문 추출이 충분할 때만 채워지는 예상 읽는 시간(분) */
  readingMinutes: z.int().positive().optional(),
  fetchedAt: z.iso.datetime(),
});

export const ogCacheSchema = z.object({
  entries: z.array(ogEntrySchema),
});

export type OgImage = z.infer<typeof ogImageSchema>;
export type OgEntry = z.infer<typeof ogEntrySchema>;
export type OgCache = z.infer<typeof ogCacheSchema>;
