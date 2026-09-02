import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArticleCard } from '@/components/article/article-card';
import { PageHeader } from '@/components/layout/page-header';
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

  // archives 는 id 내림차순이라 이전 회차가 뒤에 온다.
  const index = archives.findIndex((item) => item.id === archive.id);
  const newer = archives[index - 1];
  const older = archives[index + 1];

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 pb-24">
      <PageHeader
        title={archive.title}
        description={`이 회차에 나눈 글 ${articles.length}개입니다.`}
        back={{ href: '/', label: '전체 아티클' }}
        eyebrow={
          <>
            <Badge variant="secondary">{archive.type === 'off-line' ? '오프라인' : '온라인'}</Badge>
            <time dateTime={archive.date} className="text-14 text-muted-foreground tabular-nums">
              {formatArchiveDate(archive.date)}
            </time>
          </>
        }
      />

      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article, articleIndex) => (
          <ArticleCard key={article.key} article={article} priority={articleIndex < 3} />
        ))}
      </section>

      <nav className="mt-16 flex items-center justify-between border-t border-border/60 pt-6 text-14">
        {older ? (
          <Link
            href={`/archives/${older.id}`}
            className="inline-flex items-center gap-1 text-muted-foreground transition-colors hover:text-brand"
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
