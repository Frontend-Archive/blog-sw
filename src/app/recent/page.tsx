import type { Metadata } from 'next';
import { PageHeader } from '@/components/layout/page-header';
import { RecentList } from '@/features/reading/recent-list';
import { articles } from '@/lib/archive/source';
import { toArticleCardList } from '@/lib/archive/view';

export const metadata: Metadata = {
  title: '최근 본 글',
  description: '이 브라우저에서 최근에 연 아티클',
  robots: { index: false, follow: false },
};

export default function RecentPage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 pb-32">
      <PageHeader
        title="최근 본 글"
        description="이 브라우저에만 남는 기록입니다. 가장 최근에 연 글이 맨 위에 옵니다."
      />

      <RecentList all={toArticleCardList(articles)} />
    </main>
  );
}
