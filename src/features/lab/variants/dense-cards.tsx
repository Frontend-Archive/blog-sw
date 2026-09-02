import { Quote } from 'lucide-react';
import { ArticleThumbnail } from '@/components/article/article-thumbnail';
import type { CardVariantProps } from '../types';

/** 07. 필름 스트립. 썸네일 위아래에 퍼포레이션을 둔다. */
export function FilmStripCard({ article }: CardVariantProps) {
  const holes = Array.from({ length: 8 }, (_, index) => index);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-lg bg-foreground/90">
      <span className="flex justify-around px-2 py-2" aria-hidden>
        {holes.map((hole) => (
          <span key={hole} className="h-2 w-3 rounded-xs bg-background/70" />
        ))}
      </span>
      <div className="aspect-[16/10] overflow-hidden bg-muted">
        <ArticleThumbnail
          image={article.image}
          title={article.title}
          fallbackLabel={article.tags[0] ?? ''}
          seed={article.url}
          className="h-full w-full object-cover"
        />
      </div>
      <span className="flex justify-around px-2 py-2" aria-hidden>
        {holes.map((hole) => (
          <span key={hole} className="h-2 w-3 rounded-xs bg-background/70" />
        ))}
      </span>
      <div className="flex flex-1 flex-col gap-2 bg-card p-5">
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

/** 08. 원형 썸네일에 가운데 정렬. 사람이 쓴 글이라는 인상이 강해진다. */
export function CircleCard({ article }: CardVariantProps) {
  return (
    <article className="group relative flex flex-col items-center gap-4 rounded-xl border border-border/70 p-6 text-center transition-colors hover:border-brand/40">
      <div className="size-24 overflow-hidden rounded-full bg-muted ring-1 ring-border/60">
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
      <p className="mt-auto text-14 text-muted-foreground">
        {article.author} · {article.archiveId}회차
      </p>
    </article>
  );
}

/** 09. 회차마다 다른 색 띠를 위에 얹는다. 목록에서 회차가 색으로 구분된다. */
const ARCHIVE_BARS = [
  'bg-sky-500',
  'bg-violet-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-teal-500',
] as const;

export function ColorBarCard({ article }: CardVariantProps) {
  const bar = ARCHIVE_BARS[article.archiveId % ARCHIVE_BARS.length] ?? ARCHIVE_BARS[0];

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-border/70 bg-card">
      <span className={`h-1 w-full ${bar}`} aria-hidden />
      <div className="aspect-[16/9] overflow-hidden bg-muted">
        <ArticleThumbnail
          image={article.image}
          title={article.title}
          fallbackLabel={article.tags[0] ?? ''}
          seed={article.url}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <span className="text-14 font-medium text-muted-foreground">
          {article.archiveId}회차 · {article.author}
        </span>
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
      </div>
    </article>
  );
}

/** 10. 요약을 인용문처럼 앞세우고 썸네일은 배경으로 흐리게 깐다. */
export function QuoteCard({ article }: CardVariantProps) {
  return (
    <article className="group relative flex min-h-56 flex-col justify-between overflow-hidden rounded-xl border border-border/70 p-6">
      <ArticleThumbnail
        image={article.image}
        title=""
        fallbackLabel=""
        seed={article.url}
        className="absolute inset-0 h-full w-full object-cover opacity-10 blur-[2px] transition-opacity duration-500 group-hover:opacity-20"
      />
      <div className="relative flex flex-col gap-3">
        <Quote className="size-6 text-brand" aria-hidden />
        <p className="line-clamp-3 text-16 leading-relaxed text-foreground/80">
          {article.description ?? article.title}
        </p>
      </div>
      <div className="relative mt-6">
        <h3 className="text-14 leading-snug font-semibold text-balance">
          <a
            href={article.url}
            target="_blank"
            rel="noreferrer"
            className="after:absolute after:inset-0"
          >
            <span className="line-clamp-2">{article.title}</span>
          </a>
        </h3>
        <p className="mt-1 text-14 text-muted-foreground">
          {article.author} · {article.archiveId}회차
        </p>
      </div>
    </article>
  );
}
