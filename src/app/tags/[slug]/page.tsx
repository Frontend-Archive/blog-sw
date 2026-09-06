import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArticleGrid } from '@/components/article/article-grid';
import { PageHeader } from '@/components/layout/page-header';
import { articlesByTag, getTagBySlug, tagSlugs, toSlug } from '@/lib/archive/taxonomy';
import { toArticleCardList } from '@/lib/archive/view';
import { pageMetadata } from '@/lib/metadata';

export function generateStaticParams(): { slug: string }[] {
  return tagSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<'/tags/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const tag = getTagBySlug(decodeURIComponent(slug));
  if (!tag) return {};

  return pageMetadata({
    title: `${tag} 태그`,
    description: `${tag} 주제로 정리한 스터디 아티클 ${articlesByTag(tag).length}개`,
    path: `/tags/${toSlug(tag)}`,
  });
}

export default async function TagDetailPage({ params }: PageProps<'/tags/[slug]'>) {
  const { slug } = await params;
  const tag = getTagBySlug(decodeURIComponent(slug));
  if (!tag) notFound();

  const articles = articlesByTag(tag);
  const cards = toArticleCardList(articles);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 pb-24">
      <PageHeader
        title={tag}
        description={`${tag} 주제로 정리한 글 ${articles.length}개입니다.`}
        back={{ href: '/tags', label: '전체 태그' }}
      />

      <section>
        <ArticleGrid articles={cards} />
      </section>
    </main>
  );
}
