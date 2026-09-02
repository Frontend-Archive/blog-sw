import cacheJson from '../../../content/archive.json';
import { archiveCacheSchema, type ArchiveCache } from './cache-schema';
import { toArticles, type ArchiveArticle } from './model';
import type { ParsedArchive } from './parse';

/**
 * content/archive.json 을 앱의 단일 데이터 소스로 삼는다.
 * 이 파일은 prebuild 단계의 sync-archive 가 archive 레포에서 생성하며,
 * 레포에도 커밋되어 있어 네트워크 없이도 빌드가 된다.
 */
function loadCache(): ArchiveCache {
  const result = archiveCacheSchema.safeParse(cacheJson);
  if (!result.success) {
    throw new Error(
      `content/archive.json 형식이 올바르지 않습니다. pnpm sync 로 다시 생성하세요.\n${result.error.message}`,
    );
  }
  return result.data;
}

const cache = loadCache();

/** 최신 회차가 앞에 오도록 정렬된 전체 회차 */
export const archives: ParsedArchive[] = cache.archives.slice().sort((a, b) => b.id - a.id);

/** 채워진 아티클만 최신순으로 평탄화한 목록 */
export const articles: ArchiveArticle[] = toArticles(archives);

export const syncedAt = cache.syncedAt;

export function getArchiveById(id: number): ParsedArchive | undefined {
  return archives.find((archive) => archive.id === id);
}
