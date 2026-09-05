import Link from 'next/link';
import { ArticleThumbnail } from '@/components/article/article-thumbnail';
import { memberId } from '@/lib/archive/members-config';
import { articleSlug, toSlug } from '@/lib/archive/taxonomy';
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
    <article className="group relative flex w-full flex-col overflow-hidden rounded-xl border border-border/70 bg-card transition-colors hover:border-brand/40">
      <div data-thumb className="relative aspect-[16/10] overflow-hidden bg-muted">
        <ArticleThumbnail
          image={article.image}
          title={article.title}
          fallbackLabel={leadTag ?? article.hostname}
          seed={article.url}
          priority={priority}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>

      {/* 썸네일 안에 두면 읽음 표시의 filter 가 만드는 쌓임 맥락에 갇혀,
          카드 전체를 덮는 제목 링크에 가려 눌리지 않는다. */}
      {leadTag ? (
        <Link
          href={`/tags/${toSlug(leadTag)}`}
          className="absolute top-3 left-3 z-10 rounded-full bg-background/85 px-3 py-1 text-12 font-medium backdrop-blur transition-colors hover:bg-background"
        >
          {leadTag}
        </Link>
      ) : null}

      <div className="flex flex-1 flex-col p-6">
        {/* 카드는 외부 원문이 아니라 상세 페이지로 보낸다. 발췌를 먼저 보여주고
            거기서 원문으로 이어가게 하기 위해서다. */}
        <h3 className="text-18 leading-snug font-semibold">
          <Link
            href={`/articles/${articleSlug(article)}`}
            className="after:absolute after:inset-0 focus-visible:outline-none"
          >
            <span className="line-clamp-2">{article.title}</span>
          </Link>
        </h3>

        {article.description ? (
          <p className="mt-3 line-clamp-2 text-14 leading-relaxed text-muted-foreground">
            {article.description}
          </p>
        ) : null}

        {/* 카드 전체를 덮는 제목 링크 위에 놓아야 눌린다. */}
        <div className="mt-auto flex items-center gap-2 pt-6 text-14 text-muted-foreground">
          <Link
            href={`/members/${memberId(article.author) ?? ''}`}
            className="relative z-10 font-medium text-foreground/80 transition-colors hover:text-brand"
          >
            {article.author}
          </Link>
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
