import { ArrowUpRight } from 'lucide-react';
import { ArticleThumbnail } from '@/components/article/article-thumbnail';
import { formatArchiveDate } from '@/lib/format';
import type { CardVariantProps } from '../types';

/** 06. 썸네일을 꽉 채우고 하단에 반투명 정보 바를 얹은 형태 */
export function GlassCard({ article }: CardVariantProps) {
  return (
    <article className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-muted">
      <ArticleThumbnail
        image={article.image}
        title={article.title}
        fallbackLabel={article.tags[0] ?? article.hostname}
        seed={article.url}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 border-t border-white/10 bg-background/75 p-4 backdrop-blur-md">
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
        <p className="text-xs text-muted-foreground">
          {article.author} · {article.archiveId}회차
          {article.readingMinutes ? ` · ${article.readingMinutes}분` : ''}
        </p>
      </div>
    </article>
  );
}

/** 07. 작은 썸네일을 붙인 촘촘한 행 */
export function MiniRowCard({ article }: CardVariantProps) {
  return (
    <article className="group relative flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-accent">
      <div className="size-11 shrink-0 overflow-hidden rounded-md bg-muted">
        <ArticleThumbnail
          image={article.image}
          title={article.title}
          fallbackLabel=""
          seed={article.url}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-medium">
          <a
            href={article.url}
            target="_blank"
            rel="noreferrer"
            className="after:absolute after:inset-0"
          >
            {article.title}
          </a>
        </h3>
        <p className="truncate text-xs text-muted-foreground">
          {article.author} · {article.hostname}
        </p>
      </div>
      <span className="hidden w-14 shrink-0 text-right text-xs text-muted-foreground tabular-nums sm:inline">
        {article.readingMinutes ? `${article.readingMinutes}분` : '—'}
      </span>
      <ArrowUpRight
        className="size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
        aria-hidden
      />
    </article>
  );
}

/** 09. 뒤에 카드가 겹쳐 쌓인 것처럼 보이는 형태 */
export function StackCard({ article }: CardVariantProps) {
  return (
    <div className="relative pb-3">
      <span
        className="absolute inset-x-4 bottom-0 h-full rounded-xl border border-border/50 bg-card/60"
        aria-hidden
      />
      <span
        className="absolute inset-x-2 bottom-1.5 h-full rounded-xl border border-border/60 bg-card/80"
        aria-hidden
      />
      <article className="group relative flex flex-col overflow-hidden rounded-xl border border-border/70 bg-card transition-transform duration-300 hover:-translate-y-1">
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
          <p className="mt-auto text-xs text-muted-foreground">
            {article.author} · {formatArchiveDate(article.archiveDate)}
          </p>
        </div>
      </article>
    </div>
  );
}

/** 10. 카드 안을 썸네일과 텍스트로 좌우 분할 */
export function SplitCard({ article }: CardVariantProps) {
  return (
    <article className="group relative grid grid-cols-5 overflow-hidden rounded-xl border border-border/70 bg-card transition-colors hover:border-foreground/25">
      <div className="col-span-2 bg-muted">
        <ArticleThumbnail
          image={article.image}
          title={article.title}
          fallbackLabel={article.tags[0] ?? ''}
          seed={article.url}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="col-span-3 flex min-w-0 flex-col gap-2 p-4">
        <div className="flex flex-wrap gap-1">
          {(article.tags.length > 0 ? article.tags.slice(0, 2) : [article.hostname]).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-foreground/15 px-2 py-0.5 text-[10px] text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
        <h3 className="text-sm leading-snug font-semibold text-balance">
          <a
            href={article.url}
            target="_blank"
            rel="noreferrer"
            className="after:absolute after:inset-0"
          >
            <span className="line-clamp-3">{article.title}</span>
          </a>
        </h3>
        <p className="mt-auto text-xs text-muted-foreground">
          {article.author} · {article.archiveId}회차
        </p>
      </div>
    </article>
  );
}
