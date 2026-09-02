'use server';

import { auth } from '@/lib/auth';
import { isAuthConfigured } from '@/lib/auth/members';
import { findOpenSlots } from '@/lib/archive/model';
import { archives } from '@/lib/archive/source';
import {
  ArchiveDispatchError,
  dispatchToArchive,
  isDispatchConfigured,
  type ArchiveDispatchPayload,
} from '@/lib/archive/dispatch';
import { submissionSchema, type SubmissionInput, type SubmitResult } from './schema';

function fail(message: string, fieldErrors?: Record<string, string[]>): SubmitResult {
  return { ok: false, message, fieldErrors };
}

/** zod 이슈를 폼 입력 이름별 오류 메시지로 모은다. */
function toFieldErrors(
  issues: { path: PropertyKey[]; message: string }[],
): Record<string, string[]> {
  const fieldErrors: Record<string, string[]> = {};
  for (const issue of issues) {
    const key = String(issue.path[0] ?? 'form');
    fieldErrors[key] = [...(fieldErrors[key] ?? []), issue.message];
  }
  return fieldErrors;
}

/**
 * 폼 입력을 검증하고 archive 레포로 변경 요청을 보낸다.
 *
 * 폼에서 넘어온 author 는 믿지 않는다. 세션에서 다시 읽어 본인 자리인지 확인한다.
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

  const parsed = submissionSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return fail('입력을 다시 확인해 주세요.', toFieldErrors(parsed.error.issues));
  }

  const input: SubmissionInput = parsed.data;

  if (input.mode === 'fill-slot') {
    const openSlots = findOpenSlots(archives, author);
    if (!openSlots.some((slot) => slot.archiveId === input.archiveId)) {
      return fail(`${input.archiveId}회차에는 ${author} 님이 채울 빈 자리가 없습니다.`);
    }
    return send(
      {
        mode: 'fill-slot',
        author,
        archiveId: input.archiveId,
        title: input.title,
        url: input.url,
        tags: input.tags,
        requestedBy,
      },
      `${input.archiveId}회차에 등록을 요청했습니다. 반영까지 1~2분 걸립니다.`,
    );
  }

  const yearMonth = input.date.slice(0, 7).replace('-', '');
  if (archives.some((archive) => archive.fileName === `${yearMonth}.md`)) {
    return fail(`${input.date} 이 속한 달의 회차가 이미 있습니다.`, {
      date: ['이미 존재하는 회차입니다.'],
    });
  }

  return send(
    { mode: 'new-archive', date: input.date, type: input.type, requestedBy },
    '새 회차 생성을 요청했습니다. 반영까지 1~2분 걸립니다.',
  );
}

async function send(payload: ArchiveDispatchPayload, message: string): Promise<SubmitResult> {
  try {
    await dispatchToArchive(payload);
    return { ok: true, message };
  } catch (error) {
    if (error instanceof ArchiveDispatchError) {
      return fail(error.message);
    }
    console.error('[submit] archive dispatch 실패', error);
    return fail('archive 에 반영을 요청하지 못했습니다. 잠시 후 다시 시도해 주세요.');
  }
}
