import Link from 'next/link';
import { ArticleThumbnail } from '@/components/article/article-thumbnail';
import { toSlug } from '@/lib/archive/taxonomy';
import type { ArticleCardData } from '@/lib/archive/view';

interface ArticleCardProps {
  article: ArticleCardData;
  priority?: boolean;
}

/**
 * 카드는 세 덩어리로만 읽힌다.
 *   썸네일(대표 태그 얹음) → 18 제목 → 14 요약 → 14 한 줄 메타
 *
 * 파비콘·시계·화살표 아이콘과 날짜, 태그 나열을 걷어냈다. 작은 요소가 많으면
 * 카드마다 높이가 들쭉날쭉해지고 시선이 제목에 닿지 않는다.
 */
export function ArticleCard({ article, priority = false }: ArticleCardProps) {
  const leadTag = article.tags[0];

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-border/70 bg-card transition-colors hover:border-brand/40">
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <ArticleThumbnail
          image={article.image}
          title={article.title}
          fallbackLabel={leadTag ?? article.hostname}
          seed={article.url}
          priority={priority}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        {leadTag ? (
          <Link
            href={`/tags/${toSlug(leadTag)}`}
            className="absolute top-3 left-3 z-10 rounded-full bg-background/85 px-2 py-1 text-12 font-medium backdrop-blur transition-colors hover:bg-background"
          >
            {leadTag}
          </Link>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-18 leading-snug font-semibold text-balance">
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
          <p className="mt-3 line-clamp-2 text-14 leading-relaxed text-muted-foreground">
            {article.description}
          </p>
        ) : null}

        <div className="mt-auto flex items-center gap-2 pt-6 text-14 text-muted-foreground">
          <span className="font-medium text-foreground/80">{article.author}</span>
          <span aria-hidden>·</span>
          <Link
            href={`/archives/${article.archiveId}`}
            className="relative z-10 transition-colors hover:text-brand"
          >
            {article.archiveId}회차
          </Link>
          {article.readingMinutes ? (
            <>
              <span aria-hidden>·</span>
              <span>{article.readingMinutes}분</span>
            </>
          ) : null}
        </div>
      </div>
    </article>
  );
}
