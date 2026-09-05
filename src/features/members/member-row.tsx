import { ArrowUpRight, Rss } from 'lucide-react';
import Link from 'next/link';
import { GithubMark } from '@/components/icons/github-mark';
import { MemberAvatar } from '@/features/members/member-avatar';
import { blogUrl, githubLogin, githubProfileUrl } from '@/lib/archive/members-config';
import { articleSlug, toSlug } from '@/lib/archive/taxonomy';
import type { ArticleCardData } from '@/lib/archive/view';

export interface MemberProfile {
  author: string;
  slug: string;
  topTags: string[];
  recent: ArticleCardData[];
}

export function MemberRow({ profile }: { profile: MemberProfile }) {
  const { author, slug, topTags, recent } = profile;
  const github = githubProfileUrl(author);
  const login = githubLogin(author);
  const blog = blogUrl(author);

  return (
    <article className="grid gap-8 border-t border-border/60 py-10 lg:grid-cols-[minmax(0,20rem)_1fr] lg:gap-16">
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <MemberAvatar author={author} size={40} />
          <div className="flex min-w-0 flex-col gap-1">
            <div className="flex items-center gap-4">
              <Link
                href={`/members/${slug}`}
                className="text-20 font-semibold tracking-tight transition-colors hover:text-brand"
              >
                {author}
              </Link>

              {/* 두 링크는 같은 계열이라 서로 붙이고, 이름과는 한 칸 떨어뜨린다.
                  버튼 안쪽 여백이 이미 6px 씩 있어 gap 을 주면 이름보다 멀어 보인다. */}
              <span className="-mr-1 flex items-center">
                {github ? (
                  <a
                    href={github}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${author} 님의 GitHub 프로필`}
                    title={login}
                    className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  >
                    <GithubMark className="size-4" />
                  </a>
                ) : null}
                {blog ? (
                  <a
                    href={blog}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${author} 님의 블로그`}
                    title={blog.replace(/^https?:\/\//, '')}
                    className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  >
                    <Rss className="size-4" aria-hidden />
                  </a>
                ) : null}
              </span>
            </div>
          </div>
        </div>

        {topTags.length > 0 ? (
          <p className="text-14 text-muted-foreground">
            {topTags.map((tag, index) => (
              <span key={tag}>
                {index > 0 ? ' · ' : ''}
                <Link href={`/tags/${toSlug(tag)}`} className="transition-colors hover:text-brand">
                  {tag}
                </Link>
              </span>
            ))}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-4">
        {recent.length > 0 ? (
          <ol className="flex flex-col">
            {recent.map((article, index) => (
              <li key={article.key}>
                <Link
                  href={`/articles/${articleSlug(article)}`}
                  className="group flex items-baseline gap-4 rounded-lg px-3 py-3 transition-colors hover:bg-accent"
                >
                  <span className="w-4 shrink-0 text-14 text-muted-foreground tabular-nums">
                    {index + 1}
                  </span>
                  <span className="min-w-0 flex-1 text-16 leading-snug font-medium transition-colors group-hover:text-brand">
                    {article.title}
                  </span>
                  <span className="shrink-0 text-14 text-muted-foreground tabular-nums">
                    {article.archiveId}회차
                  </span>
                  <ArrowUpRight
                    className="size-4 shrink-0 self-center text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                    aria-hidden
                  />
                </Link>
              </li>
            ))}
          </ol>
        ) : (
          <p className="px-3 py-3 text-14 text-muted-foreground">아직 등록한 글이 없습니다.</p>
        )}

        <Link
          href={`/members/${slug}`}
          className="inline-flex w-fit items-center gap-1 px-3 text-14 text-muted-foreground transition-colors hover:text-brand"
        >
          {author} 님의 글 전체 보기
          <ArrowUpRight className="size-4" aria-hidden />
        </Link>
      </div>
    </article>
  );
}
