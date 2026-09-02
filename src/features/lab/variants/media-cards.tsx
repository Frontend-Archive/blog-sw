import { ArticleThumbnail } from '@/components/article/article-thumbnail';
import { formatArchiveDate } from '@/lib/format';
import type { CardVariantProps } from '../types';

/** 03. 썸네일을 브라우저 창 목업 안에 넣는다. 링크가 웹페이지라는 걸 그대로 보여준다. */
export function BrowserFrameCard({ article }: CardVariantProps) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-border/70 bg-card">
      <div className="flex items-center gap-2 border-b border-border/60 bg-muted/60 px-3 py-2">
        <span className="flex gap-1" aria-hidden>
          <span className="size-2 rounded-full bg-foreground/20" />
          <span className="size-2 rounded-full bg-foreground/20" />
          <span className="size-2 rounded-full bg-foreground/20" />
        </span>
        <span className="min-w-0 flex-1 truncate rounded bg-background/70 px-2 py-1 text-center text-12 text-muted-foreground">
          {article.hostname}
        </span>
      </div>
      <div className="aspect-[16/10] overflow-hidden bg-muted">
        <ArticleThumbnail
          image={article.image}
          title={article.title}
          fallbackLabel={article.tags[0] ?? ''}
          seed={article.url}
          className="h-full w-full object-cover object-top"
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
        <p className="mt-auto text-14 text-muted-foreground">
          {article.author} · {article.archiveId}회차
        </p>
      </div>
    </article>
  );
}

/** 04. 홀·짝이 썸네일 좌우를 번갈아 차지한다. */
export function ZigzagCard({ article, index }: CardVariantProps) {
  const flipped = index % 2 === 1;

  return (
    <article
      className={`group relative flex items-center gap-8 py-6 ${flipped ? 'flex-row-reverse' : ''}`}
    >
      <div className="aspect-[16/10] w-2/5 shrink-0 overflow-hidden rounded-xl bg-muted">
        <ArticleThumbnail
          image={article.image}
          title={article.title}
          fallbackLabel={article.tags[0] ?? ''}
          seed={article.url}
          className="h-full w-full object-cover"
        />
      </div>
      <div className={`flex min-w-0 flex-col gap-3 ${flipped ? 'text-right' : ''}`}>
        <p className="text-14 text-muted-foreground">
          {article.author} · {formatArchiveDate(article.archiveDate)}
        </p>
        <h3 className="text-20 leading-snug font-semibold text-balance">
          <a
            href={article.url}
            target="_blank"
            rel="noreferrer"
            className="after:absolute after:inset-0"
          >
            {article.title}
          </a>
        </h3>
        {article.description ? (
          <p className="line-clamp-2 text-14 leading-relaxed text-muted-foreground">
            {article.description}
          </p>
        ) : null}
      </div>
    </article>
  );
}

/** 05. 오른쪽 아래 모서리가 접힌 종이 */
export function PageCurlCard({ article }: CardVariantProps) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-border/70 bg-card">
      <div className="aspect-[16/10] overflow-hidden bg-muted">
        <ArticleThumbnail
          image={article.image}
          title={article.title}
          fallbackLabel={article.tags[0] ?? ''}
          seed={article.url}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5 pb-10">
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

      {/* 접힌 모서리. 삼각형 두 장을 겹쳐 종이가 말린 것처럼 보이게 한다. */}
      <span
        className="absolute right-0 bottom-0 size-10 bg-muted transition-all group-hover:size-12"
        style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }}
        aria-hidden
      />
      <span
        className="absolute right-2 bottom-2 text-14 font-semibold text-muted-foreground tabular-nums"
        aria-hidden
      >
        {article.archiveId}
      </span>
    </article>
  );
}

/** 06. 썸네일에 색을 덮어두고 호버하면 원래 색이 드러난다. */
export function DuotoneCard({ article }: CardVariantProps) {
  return (
    <article className="group relative flex flex-col gap-4">
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted">
        <ArticleThumbnail
          image={article.image}
          title={article.title}
          fallbackLabel={article.tags[0] ?? ''}
          seed={article.url}
          className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
        />
        <span
          className="absolute inset-0 bg-brand/35 mix-blend-color transition-opacity duration-500 group-hover:opacity-0"
          aria-hidden
        />
      </div>
      <div className="flex flex-col gap-2">
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
        <p className="text-14 text-muted-foreground">
          {article.author} · {article.archiveId}회차
        </p>
      </div>
    </article>
  );
}
