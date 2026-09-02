import { ArrowUpRight, RefreshCw } from 'lucide-react';
import { ARCHIVE_REPO_SLUG, ARCHIVE_REPO_URL } from '@/lib/archive/config';
import { archives, articles } from '@/lib/archive/source';
import { formatArchiveDate } from '@/lib/format';

/** GitHub 마크. lucide 에는 브랜드 로고가 없어 공식 SVG 경로를 직접 넣는다. */
function GithubMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden className={className}>
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.42 7.42 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  );
}

export function SiteFooter() {
  const latest = archives[0];

  return (
    <footer className="mt-auto border-t border-border/60">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-12 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-3">
          <p className="text-16 font-semibold tracking-tight">Frontend Archive</p>
          <p className="text-14 text-muted-foreground">
            스터디 {archives.length}회차 · 아티클 {articles.length}개
          </p>
        </div>

        <div className="flex flex-col items-start gap-3 sm:items-end">
          <a
            href={ARCHIVE_REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-2 rounded-lg border border-border/70 px-4 py-2 text-14 transition-colors hover:border-brand/50 hover:bg-accent"
          >
            <GithubMark className="size-4" />
            {ARCHIVE_REPO_SLUG}
            <ArrowUpRight
              className="size-4 text-muted-foreground transition-transform group-hover:translate-x-px group-hover:-translate-y-px"
              aria-hidden
            />
          </a>

          {latest ? (
            <p className="inline-flex items-center gap-2 text-14 text-muted-foreground">
              <RefreshCw className="size-4" aria-hidden />
              <span className="sr-only">최근 업데이트</span>
              <time dateTime={latest.date} className="tabular-nums">
                {formatArchiveDate(latest.date)}
              </time>
            </p>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
