import ogJson from '../../../content/og.json';
import { ogCacheSchema, type OgEntry } from './og-schema';

/**
 * content/og.json 은 sync-og 가 아티클 링크에서 수집한 메타 스냅샷이다.
 * 원본 og:image 는 서명·만료가 붙어 있어 쓰지 않고, public/og 에 받아둔 사본을 쓴다.
 */
function loadOgCache(): Map<string, OgEntry> {
  const result = ogCacheSchema.safeParse(ogJson);
  if (!result.success) {
    throw new Error(
      `content/og.json 형식이 올바르지 않습니다. pnpm sync:og 로 다시 생성하세요.\n${result.error.message}`,
    );
  }
  return new Map(result.data.entries.map((entry) => [entry.url, entry]));
}

const ogByUrl = loadOgCache();

export function getOg(url: string): OgEntry | undefined {
  const entry = ogByUrl.get(url);
  return entry?.ok ? entry : undefined;
}

/** 링크의 표시용 도메인 (www 제거) */
export function getHostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}
