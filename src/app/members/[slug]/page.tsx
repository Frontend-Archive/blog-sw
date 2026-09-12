import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArticleGrid } from '@/components/article/article-grid';
import { PageHeader } from '@/components/layout/page-header';
import { articlesByAuthor, authorSlugs, getAuthorBySlug } from '@/lib/archive/taxonomy';
import { toArticleCardList } from '@/lib/archive/view';
import { pageMetadata } from '@/lib/metadata';

export function generateStaticParams(): { slug: string }[] {
  return authorSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<'/members/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const author = getAuthorBySlug(decodeURIComponent(slug));
  if (!author) return {};

  return pageMetadata({
    title: `${author}의 아티클`,
    description: `${author} 님이 스터디에서 공유한 아티클 ${articlesByAuthor(author).length}개`,
    path: `/members/${slug}`,
  });
}

export default async function MemberDetailPage({ params }: PageProps<'/members/[slug]'>) {
  const { slug } = await params;
  const author = getAuthorBySlug(decodeURIComponent(slug));
  if (!author) notFound();

  const cards = toArticleCardList(articlesByAuthor(author));

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 pb-32">
      <PageHeader
        title={author}
        description={`${author} 님이 스터디에서 공유한 글 ${cards.length}개입니다.`}
        back={{ href: '/members', label: '전체 멤버' }}
      />

      <ArticleGrid articles={cards} />
    </main>
  );
}
