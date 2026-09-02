import { ArticleThumbnail } from '@/components/article/article-thumbnail';
import { formatArchiveDate } from '@/lib/format';
import type { CardVariantProps } from '../types';

/** 07. 썸네일과 본문을 카드 안에서 위아래로 겹치지 않게 띄운 액자형 */
export function MattedCard({ article }: CardVariantProps) {
  return (
    <article className="group relative flex flex-col rounded-2xl bg-muted/60 p-3 transition-colors hover:bg-muted">
      <div className="aspect-[16/10] overflow-hidden rounded-xl bg-background">
        <ArticleThumbnail
          image={article.image}
          title={article.title}
          fallbackLabel={article.tags[0] ?? ''}
          seed={article.url}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="mt-3 flex flex-1 flex-col gap-2 rounded-xl bg-background p-5">
        <h3 className="text-16 leading-snug font-semibold text-balance">
          <a
            href={article.url}
            target="_blank"
            rel="noreferrer"
            className="after:absolute after:inset-0"
          >
            <span className="line-clamp-2">{article.title}</span>
          </a>
        </h3>
        <p className="mt-auto text-14 text-muted-foreground">
          {article.author} · {article.archiveId}회차
        </p>
      </div>
    </article>
  );
}

/** 08. 왼쪽에 굵은 색 막대를 세운 목록형 */
export function SidebarCard({ article }: CardVariantProps) {
  return (
    <article className="group relative flex gap-5 rounded-r-xl border-l-4 border-brand/70 bg-card py-5 pr-5 pl-6 transition-colors hover:border-brand">
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <p className="text-14 text-muted-foreground">
          {article.author} · {formatArchiveDate(article.archiveDate)}
        </p>
        <h3 className="text-18 leading-snug font-semibold text-balance">
          <a
            href={article.url}
            target="_blank"
            rel="noreferrer"
            className="after:absolute after:inset-0"
          >
            <span className="line-clamp-2">{article.title}</span>
          </a>
        </h3>
        {article.description ? (
          <p className="line-clamp-2 text-14 leading-relaxed text-muted-foreground">
            {article.description}
          </p>
        ) : null}
      </div>
      <div className="aspect-square w-24 shrink-0 overflow-hidden rounded-lg bg-muted sm:w-28">
        <ArticleThumbnail
          image={article.image}
          title={article.title}
          fallbackLabel=""
          seed={article.url}
          className="h-full w-full object-cover"
        />
      </div>
    </article>
  );
}

/** 09. 썸네일을 위쪽에 좁게 잘라 띠처럼 쓰는 형태 */
export function StripCard({ article }: CardVariantProps) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-border/70 bg-card">
      <div className="aspect-[5/1] overflow-hidden bg-muted">
        <ArticleThumbnail
          image={article.image}
          title={article.title}
          fallbackLabel={article.tags[0] ?? ''}
          seed={article.url}
          className="h-full w-full object-cover object-center"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="text-16 leading-snug font-semibold text-balance">
          <a
            href={article.url}
            target="_blank"
            rel="noreferrer"
            className="after:absolute after:inset-0"
          >
            <span className="line-clamp-2">{article.title}</span>
          </a>
        </h3>
        {article.description ? (
          <p className="line-clamp-3 text-14 leading-relaxed text-muted-foreground">
            {article.description}
          </p>
        ) : null}
        <p className="mt-auto pt-3 text-14 text-muted-foreground">
          {article.author} · {article.archiveId}회차
        </p>
      </div>
    </article>
  );
}

/** 10. 썸네일을 카드 오른쪽 위로 살짝 빼내 겹치는 형태 */
export function PeekCard({ article }: CardVariantProps) {
  return (
    <article className="group relative mt-6 mr-4 flex flex-col rounded-2xl border border-border/70 bg-card p-6 pt-8 transition-colors hover:border-brand/40">
      <div className="absolute -top-6 -right-4 aspect-[4/3] w-32 overflow-hidden rounded-xl bg-muted shadow-lg ring-4 ring-background transition-transform duration-300 group-hover:-translate-y-1">
        <ArticleThumbnail
          image={article.image}
          title={article.title}
          fallbackLabel=""
          seed={article.url}
          className="h-full w-full object-cover"
        />
      </div>
      <span className="text-14 text-muted-foreground tabular-nums">{article.archiveId}회차</span>
      <h3 className="mt-3 max-w-[70%] text-16 leading-snug font-semibold text-balance">
        <a
          href={article.url}
          target="_blank"
          rel="noreferrer"
          className="after:absolute after:inset-0"
        >
          <span className="line-clamp-3">{article.title}</span>
        </a>
      </h3>
      <p className="mt-auto pt-6 text-14 text-muted-foreground">{article.author}</p>
    </article>
  );
}
