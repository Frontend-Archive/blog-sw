'use client';

import Link from 'next/link';
import { ArticleThumbnail } from '@/components/article/article-thumbnail';
import { articleSlug } from '@/lib/archive/taxonomy';
import type { ArticleCardData } from '@/lib/archive/view';
import { formatArchiveDate } from '@/lib/format';
import { localDay, useVisits } from './storage';

/** 어제까지는 말로, 그 앞은 날짜로 쓴다. 최근 이틀만 사람 말이면 충분하다. */
function dayLabel(day: string): string {
  if (!day) return '날짜를 모르는 기록';
  const today = localDay();
  if (day === today) return '오늘';
  if (day === localDay(new Date(Date.now() - 86400000))) return '어제';
  return formatArchiveDate(day);
}

function Row({ article }: { article: ArticleCardData }) {
  return (
    <li className="border-b border-border/50 last:border-b-0">
      <Link
        href={`/articles/${articleSlug(article)}`}
        className="group flex items-start gap-4 py-4"
      >
        <span className="block aspect-square w-14 shrink-0 overflow-hidden rounded-lg bg-muted">
          <ArticleThumbnail
            image={article.image}
            title={article.title}
            fallbackLabel=""
            seed={article.url}
            className="h-full w-full object-cover"
          />
        </span>
        <span className="flex min-w-0 flex-col gap-1">
          <span className="line-clamp-2 text-16 leading-normal transition-colors group-hover:text-brand">
            {article.title}
          </span>
          <span className="text-14 text-muted-foreground">
            {article.author} · {article.archiveId}회차
          </span>
        </span>
      </Link>
    </li>
  );
}

/**
 * 최근 읽은 글.
 *
 * 저장된 것은 키와 본 날짜뿐이라 글 정보는 서버에서 받은 전체 목록에서 찾아 붙인다.
 * 순서는 저장된 순서를 그대로 따르고, 본 날짜가 바뀌는 지점에서만 끊어 준다.
 */
export function RecentList({ all }: { all: ArticleCardData[] }) {
  const { entries, clear } = useVisits();

  const days: { day: string; articles: ArticleCardData[] }[] = [];
  for (const entry of entries) {
    const article = all.find((item) => item.key === entry.key);
    if (!article) continue;
    const last = days.at(-1);
    if (last && last.day === entry.at) last.articles.push(article);
    else days.push({ day: entry.at, articles: [article] });
  }

  if (days.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border/60 px-6 py-16 text-center text-14 text-muted-foreground">
        아직 읽은 글이 없습니다. 아티클을 열면 여기에 쌓입니다.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={clear}
          className="cursor-pointer text-14 text-muted-foreground transition-colors hover:text-brand"
        >
          기록 지우기
        </button>
      </div>

      {days.map((group) => (
        <section key={`${group.day}-${group.articles[0]?.key}`} className="flex flex-col gap-3">
          <h2 className="text-14 text-muted-foreground">{dayLabel(group.day)}</h2>
          <ul className="flex flex-col">
            {group.articles.map((article) => (
              <Row key={article.key} article={article} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
