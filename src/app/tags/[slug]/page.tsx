import { ChevronLeft } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArticleGrid } from '@/components/article/article-grid';
import { articlesByTag, getTagBySlug, tagSlugs } from '@/lib/archive/taxonomy';
import { toArticleCardList } from '@/lib/archive/view';

export function generateStaticParams(): { slug: string }[] {
  return tagSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<'/tags/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const tag = getTagBySlug(decodeURIComponent(slug));
  if (!tag) return {};

  return {
    title: `${tag} 태그`,
    description: `${tag} 주제로 정리한 스터디 아티클 ${articlesByTag(tag).length}개`,
  };
}

export default async function TagDetailPage({ params }: PageProps<'/tags/[slug]'>) {
  const { slug } = await params;
  const tag = getTagBySlug(decodeURIComponent(slug));
  if (!tag) notFound();

  const articles = articlesByTag(tag);
  const cards = toArticleCardList(articles);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 pb-24">
      <nav className="pt-12">
        <Link
          href="/tags"
          className="inline-flex items-center gap-1 text-14 text-muted-foreground transition-colors hover:text-brand"
        >
          <ChevronLeft className="size-4" aria-hidden />
          전체 태그
        </Link>
      </nav>

      <header className="border-b border-border/60 pt-8 pb-8">
        <h1 className="text-30 font-semibold tracking-tight sm:text-36">{tag}</h1>
        <p className="mt-2 text-14 text-muted-foreground">아티클 {articles.length}개</p>
      </header>

      <section className="pt-8">
        <ArticleGrid articles={cards} />
      </section>
    </main>
  );
}
