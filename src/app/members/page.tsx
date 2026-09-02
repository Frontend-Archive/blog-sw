import type { Metadata } from 'next';
import { PageHeader } from '@/components/layout/page-header';
import { MemberCard, type MemberProfile } from '@/features/members/member-card';
import { collectTags, findOpenSlots } from '@/lib/archive/model';
import { archives } from '@/lib/archive/source';
import { articlesByAuthor, authors, toSlug } from '@/lib/archive/taxonomy';
import { toArticleCardList } from '@/lib/archive/view';

export const metadata: Metadata = {
  title: '멤버',
  description: '스터디 멤버별 아티클 모아보기',
};

/** 프로필 카드에 미리 보여줄 최근 글 수 */
const RECENT_LIMIT = 3;

export default function MembersPage() {
  const profiles: MemberProfile[] = authors.map((author) => {
    const own = articlesByAuthor(author);
    return {
      author,
      slug: toSlug(author),
      articleCount: own.length,
      emptyCount: findOpenSlots(archives, author).length,
      topTags: collectTags(own).slice(0, 3),
      recent: toArticleCardList(own.slice(0, RECENT_LIMIT)),
    };
  });

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 pb-32">
      <PageHeader
        title="멤버"
        description={`${authors.length}명이 회차마다 각자 쓴 글을 나눕니다. 이름을 누르면 그 사람의 글만 모아 봅니다.`}
      />

      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {profiles.map((profile) => (
          <li key={profile.slug} className="flex">
            <MemberCard profile={profile} />
          </li>
        ))}
      </ul>
    </main>
  );
}
