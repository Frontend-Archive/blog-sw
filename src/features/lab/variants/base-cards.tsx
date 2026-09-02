import { ArticleThumbnail } from '@/components/article/article-thumbnail';
import type { CardVariantProps } from '../types';

/** 01. 현재 홈에서 쓰는 기본형 */
export function StandardCard({ article }: CardVariantProps) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-border/70 bg-card transition-colors hover:border-foreground/25">
      <div className="aspect-[1.91/1] overflow-hidden bg-muted">
        <ArticleThumbnail
          image={article.image}
          title={article.title}
          fallbackLabel={article.tags[0] ?? article.hostname}
          seed={article.url}
          className="h-full w-full transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center gap-2 text-14 text-muted-foreground">
          <span className="font-medium text-foreground/80">{article.author}</span>
          <span aria-hidden>·</span>
          <span>{article.archiveId}회차</span>
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
          <p className="line-clamp-2 text-14 leading-relaxed text-muted-foreground">
            {article.description}
          </p>
        ) : null}
        <div className="mt-auto flex items-center gap-2 pt-2 text-14 text-muted-foreground">
          <span className="truncate">{article.hostname}</span>
          {article.readingMinutes ? <span>· {article.readingMinutes}분</span> : null}
        </div>
      </div>
    </article>
  );
}

/** 08. 번호를 크게 세운 인덱스형 */
export function IndexedCard({ article, index }: CardVariantProps) {
  return (
    <article className="group relative flex gap-5 border-b border-border/60 py-6">
      <span className="w-10 shrink-0 text-24 font-semibold text-muted-foreground/40 tabular-nums transition-colors group-hover:text-foreground/60">
        {String(index + 1).padStart(2, '0')}
      </span>
      <div className="flex min-w-0 flex-col gap-2">
        <h3 className="leading-snug font-semibold text-balance">
          <a
            href={article.url}
            target="_blank"
            rel="noreferrer"
            className="after:absolute after:inset-0"
          >
            {article.title}
          </a>
        </h3>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-14 text-muted-foreground">
          <span>{article.author}</span>
          <span aria-hidden>·</span>
          <span>{article.hostname}</span>
          {article.tags.map((tag) => (
            <span key={tag}>#{tag}</span>
          ))}
        </div>
      </div>
    </article>
  );
}
