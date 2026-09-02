import { ARCHIVE_REPO_SLUG, ARCHIVE_REPO_URL } from '@/lib/archive/config';
import { archives } from '@/lib/archive/source';
import { formatArchiveDate } from '@/lib/format';

export function SiteFooter() {
  const latest = archives[0];

  return (
    <footer className="mt-auto border-t border-border/60">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-6 py-10 text-14 text-muted-foreground">
        <a
          href={ARCHIVE_REPO_URL}
          target="_blank"
          rel="noreferrer"
          className="underline-offset-4 transition-colors hover:text-brand hover:underline"
        >
          원본 데이터 {ARCHIVE_REPO_SLUG}
        </a>
        {latest ? <span>최근 업데이트 {formatArchiveDate(latest.date)}</span> : null}
      </div>
    </footer>
  );
}
