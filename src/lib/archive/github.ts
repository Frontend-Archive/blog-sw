import { z } from 'zod';
import { ARCHIVE_REPO } from './config';

const contentEntrySchema = z.object({
  name: z.string(),
  type: z.string(),
  download_url: z.url().nullable(),
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

/** archive 레포의 archives/*.md 를 모두 내려받는다. */
export async function fetchArchiveFiles(): Promise<RemoteArchiveFile[]> {
  const { owner, name, path, ref } = ARCHIVE_REPO;
  const listUrl = `https://api.github.com/repos/${owner}/${name}/contents/${path}?ref=${ref}`;
  const entries = contentListSchema.parse(await requestJson(listUrl));

  const targets = entries.filter(
    (entry) => entry.type === 'file' && ARCHIVE_FILE_NAME.test(entry.name),
  );

  if (targets.length === 0) {
    throw new Error(`${owner}/${name}/${path} 에서 YYYYMM.md 파일을 찾지 못했습니다.`);
  }

  return Promise.all(
    targets.map(async (entry) => {
      if (!entry.download_url) {
        throw new Error(`${entry.name} 의 download_url 이 없습니다.`);
      }
      const response = await fetch(entry.download_url, {
        headers: headers(),
        cache: 'no-store',
      });
      if (!response.ok) {
        throw new Error(`${entry.name} 다운로드 실패: ${response.status}`);
      }
      return { fileName: entry.name, raw: await response.text() };
    }),
  );
}
