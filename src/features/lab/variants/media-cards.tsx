import { ArrowUpRight, Clock } from 'lucide-react';
import Image from 'next/image';
import { ArticleThumbnail } from '@/components/article/article-thumbnail';
import { formatArchiveDate } from '@/lib/format';
import type { CardVariantProps } from '../types';

/** 02. 썸네일 위로 텍스트 블록이 겹쳐 올라오는 형태 */
export function OverlapCard({ article }: CardVariantProps) {
  return (
    <article className="group relative flex flex-col">
      <div className="aspect-[16/10] overflow-hidden rounded-xl bg-muted">
        <ArticleThumbnail
          image={article.image}
          title={article.title}
          fallbackLabel={article.tags[0] ?? article.hostname}
          seed={article.url}
          className="h-full w-full transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="mx-4 -mt-8 flex flex-1 flex-col gap-2 rounded-xl border border-border/60 bg-card p-4 shadow-sm transition-shadow group-hover:shadow-md">
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
          <span className="font-medium text-foreground/80">{article.author}</span>
          <span aria-hidden>·</span>
          <span>{article.archiveId}회차</span>
          {article.readingMinutes ? (
            <span className="ml-auto">{article.readingMinutes}분</span>
          ) : null}
        </div>
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
      </div>
    </article>
  );
}

/** 03. 세로로 긴 썸네일을 왼쪽에 세우는 형태 */
export function VerticalThumbCard({ article }: CardVariantProps) {
  return (
    <article className="group relative flex gap-4 rounded-xl p-2 transition-colors hover:bg-accent/50">
      <div className="aspect-[3/4] w-24 shrink-0 overflow-hidden rounded-lg bg-muted">
        <ArticleThumbnail
          image={article.image}
          title={article.title}
          fallbackLabel={article.tags[0] ?? ''}
          seed={article.url}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex min-w-0 flex-col gap-1.5 py-1">
        <span className="text-[11px] tracking-wide text-muted-foreground uppercase">
          {article.tags[0] ?? article.hostname}
        </span>
        <h3 className="leading-snug font-semibold text-balance">
          <a
            href={article.url}
            target="_blank"
            rel="noreferrer"
            className="after:absolute after:inset-0"
          >
            <span className="line-clamp-3">{article.title}</span>
          </a>
        </h3>
        <div className="mt-auto flex items-center gap-2 text-xs text-muted-foreground">
          <span>{article.author}</span>
          <span aria-hidden>·</span>
          <time dateTime={article.archiveDate}>{formatArchiveDate(article.archiveDate)}</time>
        </div>
      </div>
    </article>
  );
}

/** 04. 사진에 여백 프레임을 두른 폴라로이드 */
export function PolaroidCard({ article }: CardVariantProps) {
  return (
    <article className="group relative flex flex-col rounded-sm bg-card p-3 pb-4 shadow-md ring-1 ring-border/50 transition-transform duration-300 hover:-rotate-1 hover:shadow-xl">
      <div className="aspect-square overflow-hidden bg-muted">
        <ArticleThumbnail
          image={article.image}
          title={article.title}
          fallbackLabel={article.tags[0] ?? article.hostname}
          seed={article.url}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1.5 pt-4">
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
          {article.author} · {article.archiveId}회차
        </p>
      </div>
    </article>
  );
}

/** 05. 절취선이 있는 티켓 */
export function TicketCard({ article }: CardVariantProps) {
  return (
    <article className="group relative flex overflow-hidden rounded-xl border border-border/70 bg-card transition-colors hover:border-foreground/30">
      <div className="w-32 shrink-0 overflow-hidden bg-muted">
        <ArticleThumbnail
          image={article.image}
          title={article.title}
          fallbackLabel={article.tags[0] ?? ''}
          seed={article.url}
          className="h-full w-full object-cover"
        />
      </div>

      {/* 절취선. 위아래 반원 노치로 티켓 느낌을 낸다. */}
      <div className="relative shrink-0">
        <span
          className="absolute -top-1.5 -left-1.5 size-3 rounded-full bg-background"
          aria-hidden
        />
        <span
          className="absolute -bottom-1.5 -left-1.5 size-3 rounded-full bg-background"
          aria-hidden
        />
        <span className="block h-full border-l border-dashed border-border" aria-hidden />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5 p-4">
        <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
          <span>NO.{String(article.archiveId).padStart(2, '0')}</span>
          {article.readingMinutes ? (
            <span className="ml-auto inline-flex items-center gap-1">
              <Clock className="size-3" aria-hidden />
              {article.readingMinutes}분
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
            <span className="line-clamp-2">{article.title}</span>
          </a>
        </h3>
        <div className="mt-auto flex items-center gap-2 text-xs text-muted-foreground">
          {article.favicon ? (
            <Image
              src={article.favicon}
              alt=""
              width={14}
              height={14}
              className="size-3.5 rounded-sm"
            />
          ) : null}
          <span className="truncate">{article.author}</span>
          <ArrowUpRight
            className="ml-auto size-3.5 opacity-0 transition-opacity group-hover:opacity-100"
            aria-hidden
          />
        </div>
      </div>
    </article>
  );
}
