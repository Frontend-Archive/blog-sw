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

export function TimelineEntry({ archive }: TimelineEntryProps) {
  return (
    <li className="group relative pb-12 pl-8 last:pb-0">
      {/* 회차를 잇는 세로선. 마지막 항목에서는 아래로 흘러내리지 않게 감춘다. */}
      <span
        className="absolute top-2 bottom-0 left-[5px] w-px bg-foreground/15 group-last:hidden"
        aria-hidden
      />
      <span
        className="absolute top-1.5 left-0 size-[11px] rounded-full border-2 border-background bg-foreground"
        aria-hidden
      />

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <time dateTime={archive.date} className="text-sm font-medium tabular-nums">
          {formatArchiveDate(archive.date)}
        </time>
        <Badge variant="secondary" className="font-normal">
          {archive.type === 'off-line' ? '오프라인' : '온라인'}
        </Badge>
        <Link
          href={`/archives/${archive.id}`}
          className="ml-auto inline-flex items-center gap-0.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          {archive.title}
          <ChevronRight className="size-3.5" aria-hidden />
        </Link>
      </div>

      <ul className="mt-4 flex flex-col gap-3">
        {archive.articles.map((article) =>
          isFilledArticle(article) ? (
            <li
              key={article.author}
              className="group border-l-2 border-border/60 pl-4 transition-colors hover:border-foreground/40"
            >
              <a
                href={article.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-start gap-1.5 text-sm leading-snug font-medium"
              >
                {article.title}
                <ArrowUpRight
                  className="mt-0.5 size-3.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-60"
                  aria-hidden
                />
              </a>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                <span>{article.author}</span>
                {article.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/tags/${toSlug(tag)}`}
                    className="transition-colors hover:text-foreground"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </li>
          ) : (
            <li
              key={article.author}
              className="border-l-2 border-dashed border-border/40 pl-4 text-sm text-muted-foreground"
            >
              <span className="inline-flex items-center gap-1.5">
                <PenLine className="size-3.5" aria-hidden />
                {article.author} · 작성 예정
              </span>
            </li>
          ),
        )}
      </ul>
    </li>
  );
}
