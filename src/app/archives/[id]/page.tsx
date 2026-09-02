import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArticleCard } from '@/components/article/article-card';
import { EmptySlotCard } from '@/components/article/empty-slot-card';
import { Badge } from '@/components/ui/badge';
import { toArticles } from '@/lib/archive/model';
import { toArticleCardList } from '@/lib/archive/view';
import { archives, getArchiveById } from '@/lib/archive/source';
import { isFilledArticle } from '@/lib/archive/schema';
import { formatArchiveDate } from '@/lib/format';

export function generateStaticParams(): { id: string }[] {
  return archives.map((archive) => ({ id: String(archive.id) }));
}

function parseId(raw: string): number | null {
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function generateMetadata({ params }: PageProps<'/archives/[id]'>): Promise<Metadata> {
  const { id } = await params;
  const parsed = parseId(id);
  const archive = parsed === null ? undefined : getArchiveById(parsed);
  if (!archive) return {};

  const titles = archive.articles.filter(isFilledArticle).map((article) => article.title);

  return {
    title: archive.title,
    description: `${formatArchiveDate(archive.date)} · ${titles.length}개 아티클 — ${titles.join(', ')}`,
  };
}

export default async function ArchiveDetailPage({ params }: PageProps<'/archives/[id]'>) {
  const { id } = await params;
  const parsed = parseId(id);
  const archive = parsed === null ? undefined : getArchiveById(parsed);
  if (!archive) notFound();

  const articles = toArticleCardList(toArticles([archive]));
  const emptyAuthors = archive.articles
    .filter((article) => !isFilledArticle(article))
    .map((article) => article.author);

  // archives 는 id 내림차순이라 이전 회차가 뒤에 온다.
  const index = archives.findIndex((item) => item.id === archive.id);
  const newer = archives[index - 1];
  const older = archives[index + 1];

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 pb-24">
      <nav className="pt-12">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-12 text-muted-foreground transition-colors hover:text-brand"
        >
          <ChevronLeft className="size-4" aria-hidden />
          전체 아티클
        </Link>
      </nav>

      <header className="border-b border-border/60 pt-8 pb-8">
        <div className="flex items-center gap-3">
          <Badge variant="secondary">{archive.type === 'off-line' ? '오프라인' : '온라인'}</Badge>
          <time dateTime={archive.date} className="text-12 text-muted-foreground">
            {formatArchiveDate(archive.date)}
          </time>
        </div>
        <h1 className="mt-3 text-30 font-semibold tracking-tight sm:text-36">{archive.title}</h1>
        <p className="mt-2 text-12 text-muted-foreground">
          아티클 {articles.length}개
          {emptyAuthors.length > 0 ? ` · 작성 예정 ${emptyAuthors.length}개` : ''}
        </p>
      </header>

      <section className="grid gap-5 pt-8 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article, articleIndex) => (
          <ArticleCard key={article.key} article={article} priority={articleIndex < 3} />
        ))}
        {emptyAuthors.map((author) => (
          <EmptySlotCard key={author} author={author} />
        ))}
      </section>

      <nav className="mt-16 flex items-center justify-between border-t border-border/60 pt-6 text-14">
        {older ? (
          <Link
            href={`/archives/${older.id}`}
            className="inline-flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
          >
            <ChevronLeft className="size-4" aria-hidden />
            {older.title}
          </Link>
        ) : (
          <span />
        )}
        {newer ? (
          <Link
            href={`/archives/${newer.id}`}
            className="inline-flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
          >
            {newer.title}
            <ChevronRight className="size-4" aria-hidden />
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </main>
  );
}
