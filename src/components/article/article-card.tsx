import { ArrowUpRight, Clock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { ArticleThumbnail } from '@/components/article/article-thumbnail';
import { Badge } from '@/components/ui/badge';
import { toSlug } from '@/lib/archive/taxonomy';
import type { ArticleCardData } from '@/lib/archive/view';
import { formatArchiveDate } from '@/lib/format';

interface ArticleCardProps {
  article: ArticleCardData;
  priority?: boolean;
}

/**
 * 카드 안의 정보 계층
 *   12 메타(작성자·회차·날짜) → 18 제목 → 14 요약 → 12 태그·출처
 * 제목만 크고 굵게 두고 나머지는 muted 로 눌러 시선이 제목에 먼저 닿게 한다.
 */
export function ArticleCard({ article, priority = false }: ArticleCardProps) {
  const { hostname } = article;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-border/70 bg-card transition-colors hover:border-brand/50">
      <div className="aspect-[1.91/1] overflow-hidden bg-muted">
        <ArticleThumbnail
          image={article.image}
          title={article.title}
          fallbackLabel={article.tags[0] ?? hostname}
          seed={article.url}
          priority={priority}
          className="h-full w-full transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2 text-12 text-muted-foreground">
          <span className="font-medium text-foreground/70">{article.author}</span>
          <span aria-hidden>·</span>
          <Link
            href={`/archives/${article.archiveId}`}
            className="relative z-10 transition-colors hover:text-foreground"
          >
            {article.archiveId}회차
          </Link>
          <span aria-hidden>·</span>
          <time dateTime={article.archiveDate}>{formatArchiveDate(article.archiveDate)}</time>
        </div>

        <h3 className="mt-2 text-18 leading-snug font-semibold text-balance">
          <a
            href={article.url}
            target="_blank"
            rel="noreferrer"
            className="after:absolute after:inset-0 focus-visible:outline-none"
          >
            <span className="line-clamp-2">{article.title}</span>
          </a>
        </h3>

        {article.description ? (
          <p className="mt-2 line-clamp-2 text-14 leading-relaxed text-muted-foreground">
            {article.description}
          </p>
        ) : null}

        {article.tags.length > 0 ? (
          <ul className="mt-4 flex flex-wrap gap-1">
            {article.tags.map((tag) => (
              <li key={tag}>
                <Link href={`/tags/${toSlug(tag)}`} className="relative z-10">
                  <Badge
                    variant="secondary"
                    className="font-normal transition-colors hover:bg-foreground hover:text-background"
                  >
                    {tag}
                  </Badge>
                </Link>
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-auto flex items-center gap-2 pt-4 text-12 text-muted-foreground">
          {article.favicon ? (
            <Image
              src={article.favicon}
              alt=""
              width={14}
              height={14}
              className="size-4 rounded-sm"
            />
          ) : null}
          <span className="truncate">{hostname}</span>
          {article.readingMinutes ? (
            <>
              <span aria-hidden>·</span>
              <span className="inline-flex shrink-0 items-center gap-1">
                <Clock className="size-3" aria-hidden />
                {article.readingMinutes}분
              </span>
            </>
          ) : null}
          <ArrowUpRight
            className="ml-auto size-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
            aria-hidden
          />
        </div>
      </div>
    </article>
  );
}
