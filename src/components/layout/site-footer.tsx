import { GithubMark } from '@/components/icons/github-mark';
import { ARCHIVE_REPO_SLUG, ARCHIVE_REPO_URL } from '@/lib/archive/config';

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border/60">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-6 py-8">
        <p className="text-16 font-semibold tracking-tight">Frontend Archive</p>

        <a
          href={ARCHIVE_REPO_URL}
          target="_blank"
          rel="noreferrer"
          aria-label={`${ARCHIVE_REPO_SLUG} 저장소 열기`}
          title={ARCHIVE_REPO_SLUG}
          className="flex size-9 items-center justify-center rounded-lg border border-border/70 text-muted-foreground transition-colors hover:border-brand/50 hover:bg-accent hover:text-foreground"
        >
          <GithubMark className="size-4" />
        </a>
      </div>
    </footer>
  );
}
