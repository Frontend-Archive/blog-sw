/**
 * 아티클 링크의 OG 메타와 썸네일을 수집해 content/og.json + public/og 로 굳힌다.
 *
 * 매 빌드마다 모든 링크를 다시 긁으면 느리고 외부 사이트에도 부담이므로,
 * 기존에 성공한 엔트리는 재사용하고 새로 추가된 링크만 크롤링한다.
 * 전체 갱신이 필요하면 OG_REFRESH=all 로 실행한다.
 */
import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { archiveCacheSchema } from '@/lib/archive/cache-schema';
import { ARCHIVE_CACHE_PATH } from '@/lib/archive/config';
import { isFilledArticle } from '@/lib/archive/schema';
import { ogCacheSchema, type OgCache, type OgEntry } from '@/lib/archive/og-schema';
import { crawlOg } from './lib/og-crawler';

const OG_CACHE_PATH = 'content/og.json';
const PUBLIC_OG_DIR = 'public/og';

const root = process.cwd();
const ogCacheFile = resolve(root, OG_CACHE_PATH);
const publicOgDir = resolve(root, PUBLIC_OG_DIR);

async function exists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function readOgCache(): Promise<Map<string, OgEntry>> {
  try {
    const raw = await readFile(ogCacheFile, 'utf8');
    const parsed = ogCacheSchema.parse(JSON.parse(raw));
    return new Map(parsed.entries.map((entry) => [entry.url, entry]));
  } catch {
    return new Map();
  }
}

/** 재사용 가능한 엔트리인지. 성공했고 참조하는 이미지 파일이 실제로 남아 있어야 한다. */
async function isReusable(entry: OgEntry | undefined): Promise<boolean> {
  if (!entry?.ok) return false;
  if (entry.image && !(await exists(join(root, 'public', entry.image.src)))) return false;
  if (entry.favicon && !(await exists(join(root, 'public', entry.favicon)))) return false;
  return true;
}

async function main(): Promise<void> {
  const archiveRaw = await readFile(resolve(root, ARCHIVE_CACHE_PATH), 'utf8');
  const { archives } = archiveCacheSchema.parse(JSON.parse(archiveRaw));

  const urls = [
    ...new Set(
      archives.flatMap((archive) =>
        archive.articles.filter(isFilledArticle).map((article) => article.url),
      ),
    ),
  ];

  const cached = await readOgCache();
  const forceAll = process.env.OG_REFRESH === 'all';
  await mkdir(publicOgDir, { recursive: true });

  const entries: OgEntry[] = [];
  let crawled = 0;
  let reused = 0;
  const failures: string[] = [];

  for (const url of urls) {
    const existing = cached.get(url);
    if (!forceAll && (await isReusable(existing)) && existing) {
      entries.push(existing);
      reused += 1;
      continue;
    }

    const entry = await crawlOg(url, publicOgDir);
    crawled += 1;
    entries.push(entry);
    if (!entry.ok) failures.push(`${url} — ${entry.error ?? entry.status}`);
  }

  const cache: OgCache = ogCacheSchema.parse({ entries });
  await mkdir(dirname(ogCacheFile), { recursive: true });
  await writeFile(ogCacheFile, `${JSON.stringify(cache, null, 2)}\n`, 'utf8');

  const withImage = entries.filter((entry) => entry.image).length;
  console.log(
    `[sync-og] 링크 ${urls.length}개 (신규 크롤링 ${crawled}, 재사용 ${reused}) · 썸네일 ${withImage}개`,
  );
  for (const failure of failures) {
    console.warn(`[sync-og] 실패: ${failure}`);
  }
}

main().catch((error: unknown) => {
  console.error('[sync-og] 실패:', error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
