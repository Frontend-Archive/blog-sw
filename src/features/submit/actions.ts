'use server';

import { auth } from '@/lib/auth';
import { isAuthConfigured } from '@/lib/auth/members';
import { findOpenSlots } from '@/lib/archive/model';
import { archives } from '@/lib/archive/source';
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

/** 로그인한 사용자의 archive author 이름. 멤버가 아니면 undefined */
async function currentAuthor(): Promise<string | undefined> {
  if (!isAuthConfigured) return undefined;
  const session = await auth();
  return session?.user?.author;
}

/**
 * 폼 입력을 검증하고 누가 무엇을 바꾸려는지까지 확정한다.
 * 실제 archive 레포 반영은 다음 단계에서 붙는다.
 */
export async function submitArticle(
  _previous: SubmitResult | null,
  formData: FormData,
): Promise<SubmitResult> {
  const author = await currentAuthor();
  if (!author) {
    return fail('스터디 멤버만 등록할 수 있습니다. 다시 로그인해 주세요.');
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
    return { ok: true, message: `${input.archiveId}회차에 등록할 준비가 되었습니다.` };
  }

  const yearMonth = input.date.slice(0, 7).replace('-', '');
  if (archives.some((archive) => archive.fileName === `${yearMonth}.md`)) {
    return fail(`${input.date} 이 속한 달의 회차가 이미 있습니다.`, {
      date: ['이미 존재하는 회차입니다.'],
    });
  }
  return { ok: true, message: '새 회차를 만들 준비가 되었습니다.' };
}
