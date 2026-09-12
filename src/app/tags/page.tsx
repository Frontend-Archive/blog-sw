import type { Metadata } from 'next';
import { PageHeader } from '@/components/layout/page-header';
import { TagPreview } from '@/features/tags/tag-preview';
import { displayName } from '@/lib/archive/members-config';
import { articles } from '@/lib/archive/source';
import { articleSlug, tagCounts, toSlug } from '@/lib/archive/taxonomy';
import { pageMetadata } from '@/lib/metadata';

/** 설명에 내걸 상위 태그 수. 검색 결과 문구에 실제 주제가 드러나게 한다. */
const TOP_TAGS = 5;

export const metadata: Metadata = pageMetadata({
  title: '태그',
  description: `${tagCounts
    .slice(0, TOP_TAGS)
    .map(({ tag }) => tag)
    .join(', ')} 등 ${tagCounts.length}개 주제로 정리한 스터디 아티클`,
  path: '/tags',
});

export default function TagsPage() {
  const tags = tagCounts.map(({ tag, count }) => ({ tag, count, slug: toSlug(tag) }));
  const previewArticles = articles.map((article) => ({
    key: article.key,
    title: article.title,
    href: `/articles/${articleSlug(article)}`,
    author: displayName(article.author),
    archiveId: article.archiveId,
    tags: article.tags,
  }));

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 pb-32">
      <PageHeader
        title="태그"
        description={`아티클 ${articles.length}개에 ${tags.length}개의 주제가 붙어 있습니다. 클수록 자주 다룬 주제입니다.`}
      />

      <TagPreview tags={tags} articles={previewArticles} />
    </main>
  );
}
