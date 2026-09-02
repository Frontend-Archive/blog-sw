import { ArrowUpRight, Clock } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { formatArchiveDate } from '@/lib/format';
import type { CardVariantProps } from '../types';

/** 06. 썸네일 없는 미니멀 텍스트 */
export function MinimalCard({ article }: CardVariantProps) {
  return (
    <article className="group relative flex flex-col gap-2 border-t border-border/70 py-6">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className="font-medium text-foreground/80">{article.author}</span>
        <span aria-hidden>·</span>
        <time dateTime={article.archiveDate}>{formatArchiveDate(article.archiveDate)}</time>
      </div>
      <h3 className="text-lg leading-snug font-semibold text-balance">
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
        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {article.description}
        </p>
      ) : null}
      <div className="flex flex-wrap gap-1.5 pt-1">
        {article.tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="font-normal">
            {tag}
          </Badge>
        ))}
      </div>
    </article>
  );
}

/** 07. 표처럼 촘촘한 행 */
export function RowCard({ article }: CardVariantProps) {
  return (
    <article className="group relative flex items-center gap-4 rounded-lg px-3 py-3 transition-colors hover:bg-accent">
      <span className="w-10 shrink-0 text-xs text-muted-foreground tabular-nums">
        {article.archiveId}회차
      </span>
      <h3 className="min-w-0 flex-1 truncate text-sm font-medium">
        <a
          href={article.url}
          target="_blank"
          rel="noreferrer"
          className="after:absolute after:inset-0"
        >
          {article.title}
        </a>
      </h3>
      <span className="hidden shrink-0 text-xs text-muted-foreground sm:inline">
        {article.author}
      </span>
      <span className="hidden w-16 shrink-0 text-right text-xs text-muted-foreground tabular-nums md:inline">
        {article.readingMinutes ? `${article.readingMinutes}분` : '—'}
      </span>
      <ArrowUpRight
        className="size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
        aria-hidden
      />
    </article>
  );
}

/** 08. 번호를 크게 세운 인덱스형 */
export function IndexedCard({ article, index }: CardVariantProps) {
  return (
    <article className="group relative flex gap-5 border-b border-border/60 py-6">
      <span className="w-10 shrink-0 text-2xl font-semibold text-muted-foreground/40 tabular-nums transition-colors group-hover:text-foreground/60">
        {String(index + 1).padStart(2, '0')}
      </span>
      <div className="flex min-w-0 flex-col gap-1.5">
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
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
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

/** 09. 모노스페이스 메타를 강조한 터미널 풍 */
export function MonoCard({ article }: CardVariantProps) {
  return (
    <article className="group relative flex flex-col gap-3 rounded-lg border border-border/70 bg-muted/30 p-4 transition-colors hover:border-foreground/30">
      <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
        <span className="rounded bg-foreground/10 px-1.5 py-0.5">#{article.archiveId}</span>
        <span className="truncate">{article.hostname}</span>
        {article.readingMinutes ? (
          <span className="ml-auto inline-flex shrink-0 items-center gap-1">
            <Clock className="size-3" aria-hidden />
            {String(article.readingMinutes).padStart(2, '0')}m
          </span>
        ) : null}
      </div>
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
      <div className="flex flex-wrap gap-1 font-mono text-[11px] text-muted-foreground">
        <span>{article.author}</span>
        {article.tags.map((tag) => (
          <span key={tag} className="before:mr-1 before:content-['/']">
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}

/** 10. 태그를 위로 올린 스티커 풍 */
export function StickerCard({ article }: CardVariantProps) {
  return (
    <article className="group relative flex flex-col gap-3 rounded-2xl border-2 border-foreground/10 p-5 transition-colors hover:border-foreground/40">
      <div className="flex flex-wrap gap-1.5">
        {article.tags.length > 0 ? (
          article.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-foreground/15 px-2.5 py-0.5 text-[11px]"
            >
              {tag}
            </span>
          ))
        ) : (
          <span className="rounded-full border border-foreground/15 px-2.5 py-0.5 text-[11px]">
            {article.hostname}
          </span>
        )}
      </div>
      <h3 className="text-base leading-snug font-semibold text-balance">
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
        <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {article.description}
        </p>
      ) : null}
      <div className="mt-auto flex items-center gap-2 border-t border-border/60 pt-3 text-xs text-muted-foreground">
        {article.favicon ? (
          <Image
            src={article.favicon}
            alt=""
            width={14}
            height={14}
            className="size-3.5 rounded-sm"
          />
        ) : null}
        <span>{article.author}</span>
        <span aria-hidden>·</span>
        <span>{article.archiveId}회차</span>
      </div>
    </article>
  );
}
