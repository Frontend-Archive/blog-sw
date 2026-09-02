import { ChevronLeft } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArticleGrid } from '@/components/article/article-grid';
import { collectTags } from '@/lib/archive/model';
import { toArticleCardList } from '@/lib/archive/view';
import { Badge } from '@/components/ui/badge';
import { articlesByAuthor, authorSlugs, getAuthorBySlug, toSlug } from '@/lib/archive/taxonomy';

export function generateStaticParams(): { slug: string }[] {
  return authorSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<'/members/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const author = getAuthorBySlug(decodeURIComponent(slug));
  if (!author) return {};

  return {
    title: `${author}의 아티클`,
    description: `${author}이(가) 스터디에서 공유한 아티클 ${articlesByAuthor(author).length}개`,
  };
}

export default async function MemberDetailPage({ params }: PageProps<'/members/[slug]'>) {
  const { slug } = await params;
  const author = getAuthorBySlug(decodeURIComponent(slug));
  if (!author) notFound();

  const articles = articlesByAuthor(author);
  const cards = toArticleCardList(articles);
  const topTags = collectTags(articles).slice(0, 8);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 pb-24">
      <nav className="pt-10">
        <Link
          href="/members"
          className="inline-flex items-center gap-1 text-14 text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="size-4" aria-hidden />
          전체 멤버
        </Link>
      </nav>

      <header className="border-b border-border/60 pt-8 pb-10">
        <h1 className="text-30 font-semibold tracking-tight sm:text-36">{author}</h1>
        <p className="mt-3 text-14 text-muted-foreground">아티클 {articles.length}개</p>
        {topTags.length > 0 ? (
          <ul className="mt-5 flex flex-wrap gap-2">
            {topTags.map(({ tag, count }) => (
              <li key={tag}>
                <Link href={`/tags/${toSlug(tag)}`}>
                  <Badge variant="secondary" className="gap-2 font-normal">
                    {tag}
                    <span className="text-muted-foreground/80 tabular-nums">{count}</span>
                  </Badge>
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </header>

      <section className="pt-10">
        <ArticleGrid articles={cards} />
      </section>
    </main>
  );
}
