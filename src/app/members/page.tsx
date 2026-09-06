import type { Metadata } from 'next';
import { PageHeader } from '@/components/layout/page-header';
import { MemberRow, type MemberProfile } from '@/features/members/member-row';
import { collectTags } from '@/lib/archive/model';
import { memberId } from '@/lib/archive/members-config';
import { articlesByAuthor, authors } from '@/lib/archive/taxonomy';
import { toArticleCardList } from '@/lib/archive/view';
import { pageMetadata } from '@/lib/metadata';

export const metadata: Metadata = pageMetadata({
  title: '멤버',
  description: '스터디 멤버별 아티클 모아보기',
  path: '/members',
});

/** 미리 보여줄 최근 글 수 */
const RECENT_LIMIT = 3;

export default function MembersPage() {
  const profiles: MemberProfile[] = authors.map((author) => {
    const own = articlesByAuthor(author);
    return {
      author,
      slug: memberId(author) ?? '',
      topTags: collectTags(own)
        .slice(0, 3)
        .map((item) => item.tag),
      recent: toArticleCardList(own.slice(0, RECENT_LIMIT)),
    };
  });

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 pb-32">
      <PageHeader
        title="멤버"
        description={`${authors.length}명이 회차마다 각자 쓴 글을 나눕니다. 이름을 누르면 그 사람의 글만 모아 봅니다.`}
      />

      <div>
        {profiles.map((profile) => (
          <MemberRow key={profile.slug} profile={profile} />
        ))}
      </div>
    </main>
  );
}
