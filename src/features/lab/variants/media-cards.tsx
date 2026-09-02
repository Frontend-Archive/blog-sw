import { ArrowUpRight, Clock } from 'lucide-react';
import Image from 'next/image';
import { ArticleThumbnail } from '@/components/article/article-thumbnail';
import { Badge } from '@/components/ui/badge';
import { formatArchiveDate } from '@/lib/format';
import type { CardVariantProps } from '../types';

/** 01. 현재 운영 중인 기본형 */
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
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-medium text-foreground/80">{article.author}</span>
          <span aria-hidden>·</span>
          <span>{article.archiveId}회차</span>
        </div>
        <h3 className="text-base leading-snug font-semibold text-balance">
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
        <div className="mt-auto flex items-center gap-2 pt-2 text-xs text-muted-foreground">
          <span className="truncate">{article.hostname}</span>
          {article.readingMinutes ? <span>· {article.readingMinutes}분</span> : null}
        </div>
      </div>
    </article>
  );
}

/** 02. 썸네일 위에 텍스트를 얹는 오버레이형 */
export function OverlayCard({ article }: CardVariantProps) {
  return (
    <article className="group relative aspect-[4/5] overflow-hidden rounded-xl bg-muted">
      <ArticleThumbnail
        image={article.image}
        title={article.title}
        fallbackLabel={article.tags[0] ?? article.hostname}
        seed={article.url}
        className="absolute inset-0 h-full w-full transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-5">
        <span className="text-xs text-white/70">
          {article.author} · {article.archiveId}회차
        </span>
        <h3 className="text-base leading-snug font-semibold text-balance text-white">
          <a
            href={article.url}
            target="_blank"
            rel="noreferrer"
            className="after:absolute after:inset-0"
          >
            <span className="line-clamp-3">{article.title}</span>
          </a>
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {article.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="rounded bg-white/15 px-2 py-0.5 text-[11px] text-white/90">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

/** 03. 썸네일 좌측, 텍스트 우측인 가로형 */
export function HorizontalCard({ article }: CardVariantProps) {
  return (
    <article className="group relative flex gap-5 rounded-xl border border-border/70 p-4 transition-colors hover:bg-accent/40">
      <div className="aspect-square w-28 shrink-0 overflow-hidden rounded-lg bg-muted sm:w-36">
        <ArticleThumbnail
          image={article.image}
          title={article.title}
          fallbackLabel={article.tags[0] ?? ''}
          seed={article.url}
          className="h-full w-full"
        />
      </div>
      <div className="flex min-w-0 flex-col gap-2 py-1">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-medium text-foreground/80">{article.author}</span>
          <span aria-hidden>·</span>
          <time dateTime={article.archiveDate}>{formatArchiveDate(article.archiveDate)}</time>
        </div>
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
          <p className="line-clamp-2 text-sm text-muted-foreground">{article.description}</p>
        ) : null}
        <div className="mt-auto flex flex-wrap gap-1.5">
          {article.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="font-normal">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </article>
  );
}

/** 04. 매거진 — 큰 썸네일 아래 큰 제목 */
export function MagazineCard({ article }: CardVariantProps) {
  return (
    <article className="group relative flex flex-col gap-4">
      <div className="aspect-[3/2] overflow-hidden rounded-2xl bg-muted">
        <ArticleThumbnail
          image={article.image}
          title={article.title}
          fallbackLabel={article.tags[0] ?? article.hostname}
          seed={article.url}
          className="h-full w-full transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-[11px] tracking-wide text-muted-foreground uppercase">
          <span>{article.tags[0] ?? article.hostname}</span>
          {article.readingMinutes ? <span>· {article.readingMinutes} MIN</span> : null}
        </div>
        <h3 className="text-xl leading-tight font-semibold tracking-tight text-balance">
          <a
            href={article.url}
            target="_blank"
            rel="noreferrer"
            className="after:absolute after:inset-0"
          >
            {article.title}
          </a>
        </h3>
        <p className="text-sm text-muted-foreground">
          {article.author} · {article.archiveId}회차
        </p>
      </div>
    </article>
  );
}

/** 05. 회차 뱃지를 썸네일 위에 올린 형태 */
export function BadgedCard({ article }: CardVariantProps) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl bg-card shadow-sm ring-1 ring-border/60 transition-shadow hover:shadow-lg">
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <ArticleThumbnail
          image={article.image}
          title={article.title}
          fallbackLabel={article.tags[0] ?? ''}
          seed={article.url}
          className="h-full w-full"
        />
        <span className="absolute top-3 left-3 rounded-full bg-background/90 px-2.5 py-1 text-[11px] font-medium backdrop-blur">
          {article.archiveId}회차
        </span>
        {article.readingMinutes ? (
          <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-background/90 px-2.5 py-1 text-[11px] backdrop-blur">
            <Clock className="size-3" aria-hidden />
            {article.readingMinutes}분
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
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
        <div className="mt-auto flex items-center gap-2 pt-2 text-xs text-muted-foreground">
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
          <ArrowUpRight
            className="ml-auto size-4 opacity-0 transition-opacity group-hover:opacity-100"
            aria-hidden
          />
        </div>
      </div>
    </article>
  );
}
