import 'server-only';
import { ARCHIVE_REPO, ARCHIVE_REPO_SLUG } from './config';

/**
 * archive 레포로 repository_dispatch 를 보낸다.
 *
 * 마크다운을 여기서 직접 고치지 않는 이유는, archive 레포에 작은따옴표·항목 사이 빈 줄·
 * frontmatter 정렬 플러그인 같은 고유 포맷 규칙이 있기 때문이다. 그 규칙은 그 레포의
 * prettier 설정이 알고 있으므로, 파일 수정은 그쪽 워크플로에 맡기고 여기서는
 * 무엇을 바꿀지만 넘긴다.
 */

export const ADD_ARTICLE_EVENT = 'add-article';

export type ArchiveDispatchPayload =
  | {
      /** 회차 하나를 통째로 다시 쓴다. 빈 자리는 title 과 url 이 빈 문자열로 온다. */
      mode: 'edit-archive';
      archiveId: number;
      date: string;
      type: 'on-line' | 'off-line';
      articles: { author: string; title: string; url: string; tags: string[] }[];
      requestedBy: string;
    }
  | {
      /** 회차를 새로 만든다. 글은 만들면서 채워도 되고 전부 비어 있어도 된다. */
      mode: 'new-archive';
      date: string;
      type: 'on-line' | 'off-line';
      articles: { author: string; title: string; url: string; tags: string[] }[];
      requestedBy: string;
    };

export const isDispatchConfigured = Boolean(process.env.GITHUB_TOKEN);

export class ArchiveDispatchError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = 'ArchiveDispatchError';
  }
}

export async function dispatchToArchive(payload: ArchiveDispatchPayload): Promise<void> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new ArchiveDispatchError('GITHUB_TOKEN 이 설정되지 않아 archive 에 반영할 수 없습니다.');
  }

  const { owner, name } = ARCHIVE_REPO;
  const response = await fetch(`https://api.github.com/repos/${owner}/${name}/dispatches`, {
    method: 'POST',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'frontend-archive-blog',
    },
    body: JSON.stringify({ event_type: ADD_ARTICLE_EVENT, client_payload: payload }),
    cache: 'no-store',
  });

  // 성공 시 204 No Content 를 준다.
  if (response.status === 204) return;

  const detail = await response.text().catch(() => '');
  if (response.status === 404) {
    throw new ArchiveDispatchError(
      `${ARCHIVE_REPO_SLUG} 에 접근하지 못했습니다. 토큰에 repo 권한이 있는지 확인해 주세요.`,
      404,
    );
  }
  throw new ArchiveDispatchError(
    `archive 반영 요청이 실패했습니다 (${response.status}). ${detail.slice(0, 200)}`,
    response.status,
  );
}
