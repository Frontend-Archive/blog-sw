import Image from 'next/image';
import { ArticleThumbnail } from '@/components/article/article-thumbnail';
import { formatArchiveDate } from '@/lib/format';
import type { CardVariantProps } from '../types';

/** 06. 썸네일과 텍스트 블록을 서로 어긋나게 놓는다. */
export function OffsetCard({ article }: CardVariantProps) {
  return (
    <article className="group relative pb-6 pl-6">
      <div className="aspect-[4/3] w-full overflow-hidden rounded-lg bg-muted">
        <ArticleThumbnail
          image={article.image}
          title={article.title}
          fallbackLabel={article.tags[0] ?? article.hostname}
          seed={article.url}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="-mt-10 -ml-6 w-[85%] rounded-lg border border-border/70 bg-background p-4 transition-transform duration-300 group-hover:-translate-y-1">
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
        <p className="mt-2 text-14 text-muted-foreground">
          {article.author} · {formatArchiveDate(article.archiveDate)}
        </p>
      </div>
    </article>
  );
}

/** 07. 상단에 탭이 달린 폴더 */
export function FolderCard({ article }: CardVariantProps) {
  const tab = article.tags[0] ?? article.hostname;

  return (
    <article className="group relative flex flex-col">
      <span className="w-fit max-w-[70%] truncate rounded-t-lg border border-b-0 border-border/70 bg-card px-3 py-1 text-14 text-muted-foreground">
        {tab}
      </span>
      <div className="flex flex-1 flex-col overflow-hidden rounded-tr-lg rounded-b-lg border border-border/70 bg-card transition-colors group-hover:border-foreground/30">
        <div className="aspect-[16/9] overflow-hidden bg-muted">
          <ArticleThumbnail
            image={article.image}
            title={article.title}
            fallbackLabel=""
            seed={article.url}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-1 flex-col gap-2 p-4">
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
          <p className="mt-auto text-14 text-muted-foreground">
            {article.author} · {article.archiveId}회차
          </p>
        </div>
      </div>
    </article>
  );
}

/** 09. 회차 번호를 배경 워터마크로 깔고 썸네일은 원형으로 작게 */
export function WatermarkCard({ article }: CardVariantProps) {
  return (
    <article className="group relative overflow-hidden rounded-xl border border-border/70 bg-card p-5 transition-colors hover:border-foreground/25">
      <span
        className="pointer-events-none absolute -top-4 -right-2 text-48 leading-none font-bold text-foreground/[0.04] tabular-nums transition-colors group-hover:text-foreground/[0.07]"
        aria-hidden
      >
        {String(article.archiveId).padStart(2, '0')}
      </span>

      <div className="relative flex flex-col gap-3">
        <div className="size-14 overflow-hidden rounded-full ring-2 ring-border/60">
          <ArticleThumbnail
            image={article.image}
            title={article.title}
            fallbackLabel=""
            seed={article.url}
            className="h-full w-full object-cover"
          />
        </div>
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
        {article.description ? (
          <p className="line-clamp-2 text-14 leading-relaxed text-muted-foreground">
            {article.description}
          </p>
        ) : null}
        <div className="flex items-center gap-2 text-14 text-muted-foreground">
          {article.favicon ? (
            <Image
              src={article.favicon}
              alt=""
              width={14}
              height={14}
              className="size-4 rounded-sm"
            />
          ) : null}
          <span>{article.author}</span>
        </div>
      </div>
    </article>
  );
}

/** 10. 책 표지처럼 세로로 세운 형태. 오른쪽에 책등 그림자를 준다. */
export function BookCoverCard({ article }: CardVariantProps) {
  return (
    <article className="group relative flex flex-col gap-3">
      <div className="relative aspect-[2/3] overflow-hidden rounded-l-sm rounded-r-md bg-muted shadow-lg transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-2xl">
        <ArticleThumbnail
          image={article.image}
          title={article.title}
          fallbackLabel={article.tags[0] ?? article.hostname}
          seed={article.url}
          className="h-full w-full object-cover"
        />
        {/* 책등: 왼쪽 가장자리에 어두운 띠 */}
        <span
          className="absolute inset-y-0 left-0 w-2 bg-gradient-to-r from-black/45 to-transparent"
          aria-hidden
        />
      </div>
      <div className="flex flex-col gap-1">
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
        <p className="text-14 text-muted-foreground">
          {article.author}
          {article.readingMinutes ? ` · ${article.readingMinutes}분` : ''}
        </p>
      </div>
    </article>
  );
}
