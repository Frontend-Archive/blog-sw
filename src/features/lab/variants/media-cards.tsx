import { ArticleThumbnail } from '@/components/article/article-thumbnail';
import { formatArchiveDate } from '@/lib/format';
import type { CardVariantProps } from '../types';

/** 03. 썸네일을 원형으로 도려내 왼쪽 위에 겹친다. */
export function StampCard({ article }: CardVariantProps) {
  return (
    <article className="group relative mt-8 flex flex-col rounded-2xl border border-border/70 bg-card px-6 pt-14 pb-6 transition-colors hover:border-brand/40">
      <div className="absolute -top-8 left-6 size-16 overflow-hidden rounded-full bg-muted ring-4 ring-background">
        <ArticleThumbnail
          image={article.image}
          title={article.title}
          fallbackLabel=""
          seed={article.url}
          className="h-full w-full object-cover"
        />
      </div>
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
        <p className="mt-3 line-clamp-2 text-14 leading-relaxed text-muted-foreground">
          {article.description}
        </p>
      ) : null}
      <p className="mt-auto pt-5 text-14 text-muted-foreground">
        {article.author} · {article.archiveId}회차
      </p>
    </article>
  );
}

/** 04. 썸네일이 카드 왼쪽 전체를 차지하고 텍스트가 오른쪽에 붙는 와이드형 */
export function BannerCard({ article }: CardVariantProps) {
  return (
    <article className="group relative flex overflow-hidden rounded-xl bg-card ring-1 ring-border/70 transition-shadow hover:shadow-lg">
      <div className="w-40 shrink-0 overflow-hidden bg-muted sm:w-56">
        <ArticleThumbnail
          image={article.image}
          title={article.title}
          fallbackLabel={article.tags[0] ?? ''}
          seed={article.url}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-2 p-6">
        <span className="text-14 font-medium text-brand">
          {article.tags[0] ?? article.hostname}
        </span>
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
        <p className="text-14 text-muted-foreground">
          {article.author} · {formatArchiveDate(article.archiveDate)}
        </p>
      </div>
    </article>
  );
}

/** 05. 썸네일을 배경으로 깔고 카드를 세로로 길게. 호버하면 요약이 올라온다. */
export function RevealCard({ article }: CardVariantProps) {
  return (
    <article className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-muted">
      <ArticleThumbnail
        image={article.image}
        title={article.title}
        fallbackLabel={article.tags[0] ?? article.hostname}
        seed={article.url}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6">
        <h3 className="text-18 leading-snug font-semibold text-balance text-white">
          <a
            href={article.url}
            target="_blank"
            rel="noreferrer"
            className="after:absolute after:inset-0"
          >
            <span className="line-clamp-3">{article.title}</span>
          </a>
        </h3>
        <p className="mt-3 text-14 text-white/70">
          {article.author} · {article.archiveId}회차
        </p>
        {article.description ? (
          <p className="mt-3 line-clamp-3 text-14 leading-relaxed text-white/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            {article.description}
          </p>
        ) : null}
      </div>
    </article>
  );
}

/** 06. 썸네일 위에 회차를 큼직하게 겹쳐 놓는 형태 */
export function NumberOverlayCard({ article }: CardVariantProps) {
  return (
    <article className="group relative flex flex-col">
      <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-muted">
        <ArticleThumbnail
          image={article.image}
          title={article.title}
          fallbackLabel={article.tags[0] ?? ''}
          seed={article.url}
          className="h-full w-full object-cover"
        />
        <span
          className="absolute -bottom-4 left-4 text-48 leading-none font-bold text-background tabular-nums drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]"
          aria-hidden
        >
          {String(article.archiveId).padStart(2, '0')}
        </span>
      </div>
      <div className="mt-6 flex flex-col gap-2 pl-4">
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
        <p className="text-14 text-muted-foreground">{article.author}</p>
      </div>
    </article>
  );
}
