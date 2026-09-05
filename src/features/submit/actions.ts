'use server';

import {
  ArchiveDispatchError,
  dispatchToArchive,
  isDispatchConfigured,
  type ArchiveDispatchPayload,
} from '@/lib/archive/dispatch';
import { MEMBERS } from '@/lib/archive/members-config';
import { nextArchiveId } from '@/lib/archive/model';
import { archives, articles } from '@/lib/archive/source';
import { auth } from '@/lib/auth';
import { isAuthConfigured } from '@/lib/auth/members';
import {
  editArchiveSchema,
  newArchiveSchema,
  type ArticleEditInput,
  type PendingSubmission,
  type SubmitResult,
} from './schema';

function fail(message: string, fieldErrors?: Record<string, string[]>): SubmitResult {
  return { ok: false, message, fieldErrors };
}

/** zod 이슈를 폼 입력 이름별 오류 메시지로 모은다. */
function toFieldErrors(
  issues: { path: PropertyKey[]; message: string }[],
): Record<string, string[]> {
  const fieldErrors: Record<string, string[]> = {};
  for (const issue of issues) {
    const key = issue.path.map(String).join('.') || 'form';
    fieldErrors[key] = [...(fieldErrors[key] ?? []), issue.message];
  }
  return fieldErrors;
}

/**
 * 회차 편집 폼은 사람 수만큼 입력이 늘어난다.
 *
 * FormData 는 평면이라 이름을 `title__<멤버id>` 로 두고 여기서 다시 묶는다.
 * 멤버 명부를 기준으로 도니 폼에 없는 이름이 끼어들 수 없다.
 */
function collectArticles(formData: FormData): unknown[] {
  return MEMBERS.map((member) => ({
    author: member.name,
    title: formData.get(`title__${member.id}`) ?? '',
    url: formData.get(`url__${member.id}`) ?? '',
    tags: formData.get(`tags__${member.id}`) ?? '',
  }));
}

/**
 * 한 사람 자리는 통째로 비어 있거나 통째로 채워져 있어야 한다.
 *
 * 셋 다 비면 아직 안 쓴 자리로 보고 그냥 넘긴다. 하나라도 손댔으면 나머지도
 * 채우게 한다. 제목만 있고 링크가 없는 글은 아카이브에서 쓸모가 없다.
 */
function findIncomplete(list: ArticleEditInput[]): Record<string, string[]> | undefined {
  const errors: Record<string, string[]> = {};

  for (const item of list) {
    const member = MEMBERS.find((entry) => entry.name === item.author);
    if (!member) continue;
    if (!item.title && !item.url && item.tags.length === 0) continue;

    if (!item.title) errors[`title__${member.id}`] = ['제목을 넣어 주세요.'];
    if (!item.url) errors[`url__${member.id}`] = ['링크를 넣어 주세요.'];
    if (item.tags.length === 0) errors[`tags__${member.id}`] = ['태그를 하나 이상 넣어 주세요.'];
  }

  return Object.keys(errors).length > 0 ? errors : undefined;
}

/**
 * 폼 입력을 검증하고 archive 레포로 변경 요청을 보낸다.
 *
 * 회차 편집은 남의 글까지 손댈 수 있다. 스터디 멤버 넷이 함께 쓰는 아카이브라
 * 서로 고쳐 주는 편이 낫다고 보고 열어 두되, 누가 요청했는지는 남긴다.
 */
export async function submitArticle(
  _previous: SubmitResult | null,
  formData: FormData,
): Promise<SubmitResult> {
  const session = isAuthConfigured ? await auth() : null;
  const author = session?.user?.author;
  const requestedBy = session?.user?.githubLogin ?? '';
  if (!author) {
    return fail('스터디 멤버만 등록할 수 있습니다. 다시 로그인해 주세요.');
  }
  if (!isDispatchConfigured) {
    return fail('GITHUB_TOKEN 이 설정되지 않아 archive 에 반영할 수 없습니다.');
  }

  const mode = formData.get('mode');

  if (mode === 'edit-archive') {
    const parsed = editArchiveSchema.safeParse({
      mode,
      archiveId: formData.get('archiveId'),
      date: formData.get('date'),
      type: formData.get('type'),
      articles: collectArticles(formData),
    });
    if (!parsed.success) {
      return fail('입력을 다시 확인해 주세요.', toFieldErrors(parsed.error.issues));
    }

    const input = parsed.data;
    const target = archives.find((archive) => archive.id === input.archiveId);
    if (!target) {
      return fail(`${input.archiveId}회차를 찾지 못했습니다.`);
    }

    const incomplete = findIncomplete(input.articles);
    if (incomplete) {
      return fail('빠진 항목이 있습니다. 자리를 비워 두려면 셋 다 비워 주세요.', incomplete);
    }

    // 이미 배포에 들어있는 링크는 반영 확인의 기준이 될 수 없다.
    const added = input.articles.find(
      (item) => item.url && !articles.some((existing) => existing.url === item.url),
    );

    return send({ ...input, requestedBy }, `${input.archiveId}회차 수정을 요청했습니다.`, {
      fileName: target.fileName,
      archiveId: input.archiveId,
      url: added?.url,
    });
  }

  const parsed = newArchiveSchema.safeParse({
    mode,
    date: formData.get('date'),
    type: formData.get('type'),
    articles: collectArticles(formData),
  });
  if (!parsed.success) {
    return fail('입력을 다시 확인해 주세요.', toFieldErrors(parsed.error.issues));
  }

  const input = parsed.data;
  const yearMonth = input.date.slice(0, 7).replace('-', '');
  if (archives.some((archive) => archive.fileName === `${yearMonth}.md`)) {
    return fail(`${input.date} 이 속한 달의 회차가 이미 있습니다.`, {
      date: ['이미 존재하는 회차입니다.'],
    });
  }

  // 만들면서 채워도 되고 다 비워도 되지만, 한 사람 안에서 반쪽만 채우는 건 막는다.
  const incomplete = findIncomplete(input.articles);
  if (incomplete) {
    return fail('빠진 항목이 있습니다. 자리를 비워 두려면 셋 다 비워 주세요.', incomplete);
  }

  const filled = input.articles.find((item) => item.url);

  return send({ ...input, requestedBy }, '새 회차 생성을 요청했습니다.', {
    fileName: `${yearMonth}.md`,
    archiveId: nextArchiveId(archives),
    url: filled?.url,
  });
}

async function send(
  payload: ArchiveDispatchPayload,
  message: string,
  pending: PendingSubmission,
): Promise<SubmitResult> {
  try {
    await dispatchToArchive(payload);
    return { ok: true, message, pending };
  } catch (error) {
    if (error instanceof ArchiveDispatchError) {
      return fail(error.message);
    }
    console.error('[submit] archive dispatch 실패', error);
    return fail('archive 에 반영을 요청하지 못했습니다. 잠시 후 다시 시도해 주세요.');
  }
}
