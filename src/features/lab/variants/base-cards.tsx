import { ArticleCard } from '@/components/article/article-card';
import type { CardVariantProps } from '../types';

/** 01. 현재 홈에서 쓰는 기본형 */
export function StandardCard({ article }: CardVariantProps) {
  return <ArticleCard article={article} />;
}

/** 02. 번호를 크게 세운 인덱스형 */
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
