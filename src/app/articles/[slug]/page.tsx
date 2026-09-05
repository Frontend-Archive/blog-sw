import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArticleAside } from '@/components/article/article-aside';
import { ArticleDetailHeader } from '@/components/article/article-detail-header';
import { ArticleSourceLink } from '@/components/article/article-source-link';
import { ArticleTags } from '@/components/article/article-tags';
import { RecordVisit } from '@/features/reading/record-visit';
import { ArticleThumbnail } from '@/components/article/article-thumbnail';
import { getHostname, getOg } from '@/lib/archive/og';
import {
  articlesByAuthor,
  articleSlugs,
  getArticleBySlug,
  relatedByTag,
} from '@/lib/archive/taxonomy';
import { toArticleCardList } from '@/lib/archive/view';
import { formatArchiveDate } from '@/lib/format';

/** 사이드 추천을 묶음마다 몇 개까지 보여줄지 */
const ASIDE_LIMIT = 3;

export function generateStaticParams(): { slug: string }[] {
  return articleSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<'/articles/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(decodeURIComponent(slug));
  if (!article) return {};

  const og = getOg(article.url);

  return {
    title: article.title,
    description:
      og?.description ??
      `${article.author} · 스터디 ${article.archiveId}회차 (${formatArchiveDate(article.archiveDate)})`,
  };
}

export default async function ArticleDetailPage({ params }: PageProps<'/articles/[slug]'>) {
  const { slug } = await params;
  const article = getArticleBySlug(decodeURIComponent(slug));
  if (!article) notFound();

  const og = getOg(article.url);
  const excerpt = og?.excerpt ?? [];
  const topic = toArticleCardList(relatedByTag(article, ASIDE_LIMIT));
  // 무엇으로 묶였는지 사이드에 그대로 내걸기 위해 겹친 태그를 모은다.
  const topicTags = [
    ...new Set(topic.flatMap((item) => item.tags.filter((tag) => article.tags.includes(tag)))),
  ];
  const byAuthor = toArticleCardList(
    articlesByAuthor(article.author)
      .filter((item) => item.key !== article.key)
      .sort((a, b) => b.archiveDate.localeCompare(a.archiveDate))
      .slice(0, ASIDE_LIMIT),
  );

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 pb-32">
      <RecordVisit articleKey={article.key} />
      <ArticleDetailHeader article={article} />

      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <article className="flex flex-col gap-6">
          {og?.image ? (
            <div className="aspect-[1.91/1] overflow-hidden rounded-xl bg-muted">
              <ArticleThumbnail
                image={og.image}
                title={article.title}
                fallbackLabel=""
                seed={article.url}
                priority
                className="h-full w-full object-cover"
              />
            </div>
          ) : null}

          {/* 발췌를 못 가져온 글도 같은 세로선 안에 둔다. 선이 있고 없고가
              글마다 달라지면 목록에서 넘어올 때 본문 시작점이 흔들린다. */}
          <blockquote className="flex flex-col gap-4 border-l-2 border-brand/50 pl-6">
            {excerpt.length > 0 ? (
              excerpt.map((paragraph) => (
                <p key={paragraph.slice(0, 24)} className="text-16 leading-relaxed">
                  {paragraph}
                </p>
              ))
            ) : (
              <p className="text-16 leading-relaxed text-muted-foreground">
                {og?.description ??
                  '이 글은 본문을 미리 가져올 수 없어 원문에서 바로 확인해야 합니다.'}
              </p>
            )}
          </blockquote>

          <ArticleTags tags={article.tags} />

          <div className="mt-6">
            <ArticleSourceLink
              url={article.url}
              hostname={getHostname(article.url)}
              favicon={og?.favicon}
              readingMinutes={og?.readingMinutes}
            />
          </div>
        </article>

        <aside>
          <ArticleAside topic={topic} topicTags={topicTags} author={byAuthor} />
        </aside>
      </div>
    </main>
  );
}
