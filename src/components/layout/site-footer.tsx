import Link from 'next/link';
import { ARCHIVE_REPO_SLUG, ARCHIVE_REPO_URL } from '@/lib/archive/config';
import { archives, articles } from '@/lib/archive/source';
import { collectAuthors } from '@/lib/archive/model';
import { formatArchiveDate } from '@/lib/format';

/** GitHub 마크. lucide 에는 브랜드 로고가 없어 공식 SVG 경로를 직접 넣는다. */
function GithubMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden className={className}>
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.42 7.42 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  );
}

const NAV = [
  { href: '/', label: '아티클' },
  { href: '/timeline', label: '타임라인' },
  { href: '/tags', label: '태그' },
  { href: '/members', label: '멤버' },
] as const;

export function SiteFooter() {
  const latest = archives[0];

  return (
    <footer className="mt-auto border-t border-border/60">
      <div className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="flex flex-col gap-12 sm:flex-row sm:justify-between">
          <div className="flex flex-col gap-4">
            <p className="text-18 font-semibold tracking-tight">Frontend Archive</p>
            <p className="max-w-sm text-14 leading-relaxed text-muted-foreground">
              프론트엔드 스터디 {archives.length}회차, {collectAuthors(archives).length}명이 나눈 글{' '}
              {articles.length}개를 모아둡니다.
            </p>
          </div>

          <nav className="flex flex-col gap-3">
            <p className="text-14 font-medium tracking-wide text-muted-foreground uppercase">
              바로가기
            </p>
            <ul className="flex flex-wrap gap-x-6 gap-y-2 sm:flex-col sm:gap-2">
              {NAV.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-14 text-muted-foreground transition-colors hover:text-brand"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border/60 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <a
            href={ARCHIVE_REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex w-fit items-center gap-3 rounded-full border border-border/70 py-2 pr-5 pl-2 transition-colors hover:border-brand/50"
          >
            <span className="flex size-8 items-center justify-center rounded-full bg-foreground text-background transition-colors group-hover:bg-brand group-hover:text-brand-foreground">
              <GithubMark className="size-4" />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-14 font-medium">{ARCHIVE_REPO_SLUG}</span>
              <span className="text-14 text-muted-foreground">원본 데이터 저장소</span>
            </span>
          </a>

          {latest ? (
            <p className="inline-flex items-center gap-2 text-14 text-muted-foreground">
              <span className="relative flex size-2" aria-hidden>
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-brand" />
              </span>
              마지막 업데이트
              <time dateTime={latest.date} className="font-medium text-foreground tabular-nums">
                {formatArchiveDate(latest.date)}
              </time>
            </p>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
