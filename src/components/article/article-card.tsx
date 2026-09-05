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
 *
 * 모바일에서는 카드를 걷고 목록 줄로 바꾼다. 64px 썸네일을 왼쪽에 두고
 * 테두리와 배경을 없앤다. 한 줄에 한 장씩 세우면 16:10 썸네일이 화면 절반을
 * 먹어 한 화면에 카드가 하나밖에 안 들어온다. 요약과 읽는 시간도 이때는 뺀다.
 * 같은 마크업을 반응형으로만 갈라 두 벌을 그리지 않는다.
 */
export function ArticleCard({ article, priority = false }: ArticleCardProps) {
  const leadTag = article.tags[0];

  return (
    <article className="group relative flex w-full min-w-0 gap-4 overflow-hidden rounded-xl transition-colors md:flex-col md:gap-0 md:border md:border-border/70 md:bg-card md:hover:border-brand/40">
      <div
        data-thumb
        className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-muted md:aspect-[16/10] md:size-auto md:w-full md:rounded-none"
      >
        <ArticleThumbnail
          image={article.image}
          title={article.title}
          fallbackLabel={leadTag ?? article.hostname}
          seed={article.url}
          priority={priority}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col md:p-6">
        {/* 썸네일 안에 두면 읽음 표시의 filter 가 만드는 쌓임 맥락에 갇혀,
            카드 전체를 덮는 제목 링크에 가려 눌리지 않는다. article 을 기준으로
            띄워 썸네일 왼쪽 위에 얹는다.

            64px 썸네일 위에는 올릴 자리가 없어 모바일에서는 아예 뺀다. */}
        {leadTag ? (
          <Link
            href={`/tags/${toSlug(leadTag)}`}
            className="absolute top-3 left-3 z-10 hidden rounded-full bg-background/85 px-3 py-1 text-12 font-medium backdrop-blur transition-colors hover:bg-background md:block"
          >
            {leadTag}
          </Link>
        ) : null}

        {/* 카드는 외부 원문이 아니라 상세 페이지로 보낸다. 발췌를 먼저 보여주고
            거기서 원문으로 이어가게 하기 위해서다. */}
        <h3 className="text-18 leading-snug font-semibold">
          <Link
            href={`/articles/${articleSlug(article)}`}
            className="after:absolute after:inset-0 focus-visible:outline-none"
          >
            {/* 좁은 칸에서 단어를 통째로 넘기면 오른쪽이 크게 빈다. */}
            <span className="line-clamp-2 break-all md:break-keep">{article.title}</span>
          </Link>
        </h3>

        {article.description ? (
          <p className="mt-3 line-clamp-2 text-14 leading-relaxed text-muted-foreground max-md:hidden">
            {article.description}
          </p>
        ) : null}

        {/* 카드 전체를 덮는 제목 링크 위에 놓아야 눌린다.

            mt-auto 는 md 부터만. 세로 카드에서는 제목 길이가 달라도 메타가 카드
            바닥에 나란히 서야 하지만, 가로 줄에서는 썸네일 높이만큼 늘어난 칸의
            바닥으로 밀려 제목과 벌어진다. */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 pt-2 text-14 text-muted-foreground md:mt-auto md:pt-6">
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
            <span className="flex items-center gap-2 max-md:hidden">
              <span aria-hidden>·</span>
              <span>{article.readingMinutes}분</span>
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
}
