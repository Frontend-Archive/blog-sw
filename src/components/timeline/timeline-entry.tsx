import { ArrowUpRight, ChevronRight, PenLine } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import type { ParsedArchive } from '@/lib/archive/parse';
import { isFilledArticle } from '@/lib/archive/schema';
import { toSlug } from '@/lib/archive/taxonomy';
import { formatArchiveDate } from '@/lib/format';

interface TimelineEntryProps {
  archive: ParsedArchive;
}

/**
 * 한 회차의 정보 계층
 *   (16 날짜 + 12 뱃지) 회차 머리 → 16 글 제목 → 12 작성자·태그
 */
export function TimelineEntry({ archive }: TimelineEntryProps) {
  return (
    <li className="group relative pb-12 pl-8 last:pb-0">
      {/* 회차를 잇는 세로선. 마지막 항목에서는 아래로 흘러내리지 않게 감춘다. */}
      <span
        className="absolute top-3 bottom-0 left-2 w-px bg-foreground/15 group-last:hidden"
        aria-hidden
      />
      <span
        className="absolute top-2 left-1 size-2 rounded-full bg-brand ring-4 ring-background"
        aria-hidden
      />

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <time dateTime={archive.date} className="text-16 font-semibold tabular-nums">
          {formatArchiveDate(archive.date)}
        </time>
        <Badge variant="secondary" className="font-normal">
          {archive.type === 'off-line' ? '오프라인' : '온라인'}
        </Badge>
        <Link
          href={`/archives/${archive.id}`}
          className="ml-auto inline-flex items-center gap-1 text-12 text-muted-foreground transition-colors hover:text-brand"
        >
          {archive.title}
          <ChevronRight className="size-4" aria-hidden />
        </Link>
      </div>

      <ul className="mt-4 flex flex-col gap-4">
        {archive.articles.map((article) =>
          isFilledArticle(article) ? (
            <li
              key={article.author}
              className="group/item border-l-2 border-border/60 pl-4 transition-colors hover:border-brand/60"
            >
              <a
                href={article.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-start gap-1 text-16 leading-snug font-medium"
              >
                {article.title}
                <ArrowUpRight
                  className="mt-1 size-4 shrink-0 opacity-0 transition-opacity group-hover/item:opacity-60"
                  aria-hidden
                />
              </a>
              <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-12 text-muted-foreground">
                <span>{article.author}</span>
                {article.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/tags/${toSlug(tag)}`}
                    className="transition-colors hover:text-brand"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </li>
          ) : (
            <li
              key={article.author}
              className="border-l-2 border-dashed border-border/40 pl-4 text-14 text-muted-foreground"
            >
              <span className="inline-flex items-center gap-1">
                <PenLine className="size-4" aria-hidden />
                {article.author} · 작성 예정
              </span>
            </li>
          ),
        )}
      </ul>
    </li>
  );
}
