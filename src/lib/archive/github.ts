import { z } from 'zod';
import { ARCHIVE_REPO } from './config';

const commitSchema = z.object({ sha: z.string().regex(/^[0-9a-f]{40}$/) });

const contentEntrySchema = z.object({
  name: z.string(),
  type: z.string(),
});

const contentListSchema = z.array(contentEntrySchema);

const ARCHIVE_FILE_NAME = /^\d{6}\.md$/;

function headers(): HeadersInit {
  const base: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'frontend-archive-blog',
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) {
    base.Authorization = `Bearer ${token}`;
  }
  return base;
}

async function requestJson(url: string): Promise<unknown> {
  const response = await fetch(url, { headers: headers(), cache: 'no-store' });
  if (!response.ok) {
    const rateLimitRemaining = response.headers.get('x-ratelimit-remaining');
    const hint =
      rateLimitRemaining === '0'
        ? ' (GitHub API rate limit 소진 — GITHUB_TOKEN 을 설정하세요)'
        : '';
    throw new Error(`GitHub API ${response.status} ${response.statusText}${hint}: ${url}`);
  }
  return response.json();
}

export interface RemoteArchiveFile {
  fileName: string;
  raw: string;
}

export interface RemoteArchive {
  /** 이번에 읽은 커밋. 빌드 로그와 캐시에 남겨 어느 시점의 내용인지 알 수 있게 한다 */
  sha: string;
  files: RemoteArchiveFile[];
}

/**
 * archive 레포의 archives/*.md 를 모두 내려받는다.
 *
 * 브랜치 이름이 아니라 커밋 SHA 로 고정해서 받는다. raw.githubusercontent.com 은
 * 브랜치 주소를 5분 동안 캐시해서, 커밋 직후 빌드가 방금 바뀐 파일의 옛 내용을
 * 받아 간 적이 있다. SHA 주소는 내용이 바뀌지 않으니 캐시돼 있어도 맞는 내용이다.
 * 브랜치의 최신 SHA 는 캐시를 타지 않는 API 로 먼저 알아낸다.
 */
export async function fetchArchiveFiles(): Promise<RemoteArchive> {
  const { owner, name, path, ref } = ARCHIVE_REPO;
  const api = `https://api.github.com/repos/${owner}/${name}`;

  const { sha } = commitSchema.parse(await requestJson(`${api}/commits/${ref}`));
  const entries = contentListSchema.parse(await requestJson(`${api}/contents/${path}?ref=${sha}`));

  const targets = entries.filter(
    (entry) => entry.type === 'file' && ARCHIVE_FILE_NAME.test(entry.name),
  );

  if (targets.length === 0) {
    throw new Error(`${owner}/${name}/${path} 에서 YYYYMM.md 파일을 찾지 못했습니다.`);
  }

  const files = await Promise.all(
    targets.map(async (entry) => {
      const url = `https://raw.githubusercontent.com/${owner}/${name}/${sha}/${path}/${entry.name}`;
      const response = await fetch(url, { headers: headers(), cache: 'no-store' });
      if (!response.ok) {
        throw new Error(`${entry.name} 다운로드 실패: ${response.status}`);
      }
      return { fileName: entry.name, raw: await response.text() };
    }),
  );

  return { sha, files };
}
