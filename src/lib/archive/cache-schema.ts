import { z } from 'zod';
import { archiveSchema } from './schema';

export const cachedArchiveSchema = archiveSchema.extend({
  fileName: z.string().min(1),
  summary: z.string(),
});

export const archiveCacheSchema = z.object({
  /** 마지막 동기화 시각 (ISO 8601) */
  syncedAt: z.iso.datetime(),
  /** 동기화한 원본. "owner/name@ref (커밋 앞 7자리)" 형태 */
  source: z.string().min(1),
  archives: z.array(cachedArchiveSchema),
});

export type ArchiveCache = z.infer<typeof archiveCacheSchema>;
