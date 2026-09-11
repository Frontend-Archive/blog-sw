/**
 * archive 레포의 archives/*.md 를 내려받아 content/archive.json 으로 굳힌다.
 *
 * - 빌드 전(prebuild)에 실행되어 항상 최신 데이터로 빌드되게 한다.
 * - 네트워크나 GitHub API 가 실패해도 기존 캐시가 있으면 경고만 남기고 통과시킨다.
 *   아카이브가 잠시 안 읽힌다고 배포까지 무너지면 안 되기 때문이다.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { ARCHIVE_CACHE_PATH, ARCHIVE_REPO, ARCHIVE_REPO_SLUG } from '@/lib/archive/config';
import { fetchArchiveFiles } from '@/lib/archive/github';
import { parseArchives } from '@/lib/archive/parse';
import { archiveCacheSchema, type ArchiveCache } from '@/lib/archive/cache-schema';

const cacheFile = resolve(process.cwd(), ARCHIVE_CACHE_PATH);

async function readExistingCache(): Promise<ArchiveCache | null> {
  try {
    const raw = await readFile(cacheFile, 'utf8');
    return archiveCacheSchema.parse(JSON.parse(raw));
  } catch {
    return null;
  }
}

async function main(): Promise<void> {
  let remote;
  try {
    remote = await fetchArchiveFiles();
  } catch (error) {
    const existing = await readExistingCache();
    if (existing) {
      console.warn(
        `[sync-archive] 원격 조회 실패, 기존 캐시를 유지합니다 (${existing.archives.length}개 회차)\n` +
          `  원인: ${error instanceof Error ? error.message : String(error)}`,
      );
      return;
    }
    throw error;
  }

  const archives = parseArchives(remote.files);
  const commit = remote.sha.slice(0, 7);
  const cache: ArchiveCache = archiveCacheSchema.parse({
    syncedAt: new Date().toISOString(),
    source: `${ARCHIVE_REPO_SLUG}@${ARCHIVE_REPO.ref} (${commit})`,
    archives,
  });

  await mkdir(dirname(cacheFile), { recursive: true });
  await writeFile(cacheFile, `${JSON.stringify(cache, null, 2)}\n`, 'utf8');

  const filled = archives.reduce(
    (total, archive) => total + archive.articles.filter((a) => a.url !== '').length,
    0,
  );
  console.log(
    `[sync-archive] ${ARCHIVE_REPO_SLUG}@${commit} → ${ARCHIVE_CACHE_PATH} ` +
      `(회차 ${archives.length}개, 아티클 ${filled}개)`,
  );
}

main().catch((error: unknown) => {
  console.error('[sync-archive] 실패:', error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
