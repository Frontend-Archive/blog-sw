import { ArticleThumbnail } from '@/components/article/article-thumbnail';
import { formatArchiveDate } from '@/lib/format';
import type { CardVariantProps } from '../types';

/**
 * 02. 원본 비율 유지 (메이슨리)
 * 지금까지의 시안은 전부 썸네일을 특정 비율로 잘랐다. 여기서는 자르지 않는다.
 */
export function NaturalRatioCard({ article }: CardVariantProps) {
  return (
    <article className="group relative mb-5 flex break-inside-avoid flex-col overflow-hidden rounded-xl border border-border/70 bg-card">
      <div className="overflow-hidden bg-muted">
        <ArticleThumbnail
          image={article.image}
          title={article.title}
          fallbackLabel={article.tags[0] ?? article.hostname}
          seed={article.url}
          className={
            article.image
              ? 'h-auto w-full transition-transform duration-500 group-hover:scale-[1.02]'
              : 'aspect-[4/3] w-full'
          }
        />
      </div>
      <div className="flex flex-col gap-2 p-4">
        <h3 className="text-sm leading-snug font-semibold text-balance">
          <a
            href={article.url}
            target="_blank"
            rel="noreferrer"
            className="after:absolute after:inset-0"
          >
            {article.title}
          </a>
        </h3>
        <p className="text-xs text-muted-foreground">
          {article.author} · {article.archiveId}회차
          {article.readingMinutes ? ` · ${article.readingMinutes}분` : ''}
        </p>
      </div>
    </article>
  );
}

/** 03. 썸네일을 오른쪽에 두는 형태. 제목이 먼저 읽힌다. */
export function ThumbRightCard({ article }: CardVariantProps) {
  return (
    <article className="group relative flex items-start gap-4 border-b border-border/60 py-5">
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <h3 className="leading-snug font-semibold text-balance">
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
          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {article.description}
          </p>
        ) : null}
        <p className="mt-1 text-xs text-muted-foreground">
          {article.author} · {formatArchiveDate(article.archiveDate)}
        </p>
      </div>
      <div className="size-20 shrink-0 overflow-hidden rounded-lg bg-muted sm:size-24">
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

/** 04. 오른쪽 위 모서리를 잘라내고 그 자리에 회차를 놓는다. */
export function CutCornerCard({ article }: CardVariantProps) {
  return (
    <article className="group relative">
      <span className="absolute top-2 right-0 z-10 text-xs font-semibold text-muted-foreground tabular-nums">
        {String(article.archiveId).padStart(2, '0')}
      </span>
      <div
        className="flex flex-col overflow-hidden border border-border/70 bg-card transition-colors group-hover:border-foreground/30"
        style={{
          clipPath: 'polygon(0 0, calc(100% - 2rem) 0, 100% 2rem, 100% 100%, 0 100%)',
          borderRadius: '0.25rem',
        }}
      >
        <div className="aspect-[16/9] overflow-hidden bg-muted">
          <ArticleThumbnail
            image={article.image}
            title={article.title}
            fallbackLabel={article.tags[0] ?? article.hostname}
            seed={article.url}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-1 flex-col gap-2 p-4">
          <h3 className="text-sm leading-snug font-semibold text-balance">
            <a
              href={article.url}
              target="_blank"
              rel="noreferrer"
              className="after:absolute after:inset-0"
            >
              <span className="line-clamp-2">{article.title}</span>
            </a>
          </h3>
          <p className="mt-auto text-xs text-muted-foreground">{article.author}</p>
        </div>
      </div>
    </article>
  );
}

/** 05. 세로로 긴 스토리. 상단 세그먼트가 회차 진행을 나타낸다. */
export function StoryCard({ article, index }: CardVariantProps) {
  const segments = 6;

  return (
    <article className="group relative aspect-[9/14] overflow-hidden rounded-2xl bg-muted">
      <ArticleThumbnail
        image={article.image}
        title={article.title}
        fallbackLabel={article.tags[0] ?? article.hostname}
        seed={article.url}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/40" />

      <div className="absolute inset-x-3 top-3 flex gap-1">
        {Array.from({ length: segments }, (_, segment) => (
          <span
            key={segment}
            className={`h-0.5 flex-1 rounded-full ${segment <= index ? 'bg-white' : 'bg-white/30'}`}
            aria-hidden
          />
        ))}
      </div>

      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-4">
        <span className="text-[11px] text-white/70">
          {article.author} · {article.archiveId}회차
        </span>
        <h3 className="text-sm leading-snug font-semibold text-balance text-white">
          <a
            href={article.url}
            target="_blank"
            rel="noreferrer"
            className="after:absolute after:inset-0"
          >
            <span className="line-clamp-4">{article.title}</span>
          </a>
        </h3>
      </div>
    </article>
  );
}
