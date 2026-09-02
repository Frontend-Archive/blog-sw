import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { toSlug } from '@/lib/archive/taxonomy';
import type { ArticleCardData } from '@/lib/archive/view';

/** 이름에서 유도한 고정 색. 같은 사람은 항상 같은 색을 갖는다. */
const AVATAR_TONES = [
  'from-sky-400 to-indigo-500',
  'from-amber-400 to-rose-500',
  'from-emerald-400 to-teal-500',
  'from-violet-400 to-fuchsia-500',
] as const;

function pickTone(seed: string): string {
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) % 2147483647;
  }
  return AVATAR_TONES[hash % AVATAR_TONES.length] ?? AVATAR_TONES[0];
}

export interface MemberProfile {
  author: string;
  slug: string;
  articleCount: number;
  emptyCount: number;
  topTags: { tag: string; count: number }[];
  recent: ArticleCardData[];
}

export function MemberCard({ profile }: { profile: MemberProfile }) {
  const { author, slug, articleCount, topTags, recent } = profile;

  return (
    <article className="flex flex-col gap-6 rounded-2xl border border-border/70 bg-card p-6 transition-colors hover:border-brand/40">
      <div className="flex items-center gap-4">
        <span
          className={`flex size-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-20 font-semibold text-white ${pickTone(author)}`}
          aria-hidden
        >
          {author.slice(1, 2) || author.slice(0, 1)}
        </span>
        <div className="flex min-w-0 flex-col gap-1">
          <Link
            href={`/members/${slug}`}
            className="text-18 font-semibold tracking-tight transition-colors hover:text-brand"
          >
            {author}
          </Link>
          <p className="text-14 text-muted-foreground tabular-nums">아티클 {articleCount}개</p>
        </div>
      </div>

      {topTags.length > 0 ? (
        <ul className="flex flex-wrap gap-2">
          {topTags.map(({ tag }) => (
            <li key={tag}>
              <Link href={`/tags/${toSlug(tag)}`}>
                <Badge variant="secondary" className="font-normal">
                  {tag}
                </Badge>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}

      {recent.length > 0 ? (
        <div className="flex flex-col gap-3 border-t border-border/60 pt-5">
          <p className="text-14 font-medium tracking-wide text-muted-foreground uppercase">
            최근 글
          </p>
          <ul className="flex flex-col gap-3">
            {recent.map((article) => (
              <li key={article.key}>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group/link flex items-start gap-2 text-14 leading-snug"
                >
                  <span className="line-clamp-2 transition-colors group-hover/link:text-brand">
                    {article.title}
                  </span>
                  <ArrowUpRight
                    className="mt-1 size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover/link:opacity-100"
                    aria-hidden
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <Link
        href={`/members/${slug}`}
        className="mt-auto inline-flex items-center gap-1 text-14 text-muted-foreground transition-colors hover:text-brand"
      >
        전체 보기
        <ArrowUpRight className="size-4" aria-hidden />
      </Link>
    </article>
  );
}
