import type { Metadata } from 'next';
import { PageHeader } from '@/components/layout/page-header';
import { TagCloud } from '@/features/tags/tag-cloud';
import { articles } from '@/lib/archive/source';
import { tagCounts, toSlug } from '@/lib/archive/taxonomy';
import { pageMetadata } from '@/lib/metadata';

export const metadata: Metadata = pageMetadata({
  title: '태그',
  description: '스터디 아티클에 붙은 전체 태그 목록',
  path: '/tags',
});

export default function TagsPage() {
  const tags = tagCounts.map(({ tag, count }) => ({ tag, count, slug: toSlug(tag) }));

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 pb-32">
      <PageHeader
        title="태그"
        description={`아티클 ${articles.length}개에 ${tags.length}개의 주제가 붙어 있습니다. 크고 굵을수록 자주 다룬 주제입니다.`}
      />

      <TagCloud tags={tags} />
    </main>
  );
}
