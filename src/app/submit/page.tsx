import { TriangleAlert } from 'lucide-react';
import type { Metadata } from 'next';
import { SignInButton, SignOutButton } from '@/components/auth/sign-in-button';
import { PageHeader } from '@/components/layout/page-header';
import { SubmitForm } from '@/features/submit/submit-form';
import type { EditableArchive, EditableSlot } from '@/features/submit/types';
import { MEMBERS } from '@/lib/archive/members-config';
import { archives } from '@/lib/archive/source';
import { auth } from '@/lib/auth';
import { isAuthConfigured } from '@/lib/auth/members';

export const metadata: Metadata = {
  title: '글 관리',
  description: '스터디 멤버가 아카이브에 글을 등록합니다.',
  robots: { index: false, follow: false },
};

/** 세션을 읽어야 하므로 정적으로 굳히지 않는다. 나머지 페이지는 그대로 SSG 다. */
export const dynamic = 'force-dynamic';

function Notice({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 rounded-xl border border-dashed border-border/70 p-5 text-14 text-muted-foreground">
      <TriangleAlert className="mt-1 size-4 shrink-0" aria-hidden />
      <div className="leading-relaxed">{children}</div>
    </div>
  );
}

/**
 * 회차를 폼이 쓰기 좋은 모양으로 편다.
 *
 * 자리는 명부 순서로 고정한다. 회차마다 참여자가 달라도 같은 순서로 놓여야
 * 회차를 바꿔 가며 볼 때 시선이 흔들리지 않는다.
 */
function toEditable(): EditableArchive[] {
  return archives.map((archive) => ({
    id: archive.id,
    title: archive.title,
    date: archive.date,
    type: archive.type,
    slots: MEMBERS.map((member) => {
      const article = archive.articles.find((item) => item.author === member.name);
      return {
        memberId: member.id,
        author: member.name,
        title: article?.title ?? '',
        url: article?.url ?? '',
        tags: (article?.tags ?? []).join(', '),
      };
    }),
  }));
}

/** 새 회차에 놓일 빈 자리. 수정 폼과 같은 순서·같은 모양이어야 한다. */
function emptySlots(): EditableSlot[] {
  return MEMBERS.map((member) => ({
    memberId: member.id,
    author: member.name,
    title: '',
    url: '',
    tags: '',
  }));
}

export default async function SubmitPage() {
  // 설정 전에 auth() 를 부르면 Auth.js 가 MissingSecret 으로 던진다.
  const session = isAuthConfigured ? await auth() : null;
  const author = session?.user?.author;

  const missingEnv = [
    isAuthConfigured ? null : 'AUTH_SECRET, AUTH_GITHUB_ID, AUTH_GITHUB_SECRET',
  ].filter((value) => value !== null);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 pb-24">
      <PageHeader
        title="글 관리"
        description="여기서 요청한 변경은 archive 레포의 마크다운에 그대로 커밋되고, 그 커밋이 다시 이 사이트를 재배포합니다."
      />

      <section className="flex flex-col gap-6">
        {missingEnv.length > 0 ? (
          <Notice>
            아직 설정되지 않은 환경변수가 있습니다 — <code>{missingEnv.join(', ')}</code>.
            <br />
            <code>.env.example</code> 을 참고해 채워 주세요.
          </Notice>
        ) : null}

        {author ? (
          <>
            <div className="flex items-center justify-between gap-4">
              <p className="text-14">
                <span className="font-medium">{author}</span>
                <span className="text-muted-foreground"> 님으로 로그인했습니다.</span>
              </p>
              <SignOutButton />
            </div>
            <SubmitForm archives={toEditable()} emptySlots={emptySlots()} />
          </>
        ) : (
          <>
            <p className="text-16 leading-relaxed text-muted-foreground">
              스터디 멤버만 등록할 수 있습니다. GitHub 계정으로 본인을 확인합니다.
            </p>
            {isAuthConfigured ? (
              <div>
                <SignInButton />
              </div>
            ) : null}
          </>
        )}
      </section>
    </main>
  );
}
