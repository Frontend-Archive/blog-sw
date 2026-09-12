'use client';

import Link from 'next/link';
import { useState, type MouseEvent } from 'react';
import { memberId } from '@/lib/archive/members-config';
import { TagCloud, type TagCloudItem } from './tag-cloud';

export interface TagPreviewArticle {
  key: string;
  title: string;
  href: string;
  author: string;
  archiveId: number;
  /** 태그 이름 */
  tags: string[];
}

interface TagPreviewProps {
  /** 많이 쓰인 순 */
  tags: TagCloudItem[];
  /** 최신 순 */
  articles: TagPreviewArticle[];
}

/** 패널에 걸어 둘 글 수. 더 보고 싶으면 태그 페이지로 간다 */
const PREVIEW_COUNT = 4;

/** href 에서 태그 주소를 꺼낸다. 한글 주소는 인코딩돼 올 수 있다. */
function slugFromTarget(target: EventTarget): string | undefined {
  if (!(target instanceof Element)) return undefined;
  const href = target.closest('a[href^="/tags/"]')?.getAttribute('href');
  if (!href) return undefined;
  try {
    return decodeURIComponent(href.slice('/tags/'.length));
  } catch {
    return href.slice('/tags/'.length);
  }
}

/**
 * 줄 전체가 상세로 가는 링크다.
 *
 * 링크 안에 링크를 넣을 수 없어서, 제목 링크를 줄 전체로 늘리고 작성자와 회차만
 * 그 위에 올린다. 최근 읽은 글·아티클 카드도 같은 방식이다.
 */
function ArticleLine({ article }: { article: TagPreviewArticle }) {
  return (
    <li className="relative flex flex-col gap-0.5">
      <Link
        href={article.href}
        className="line-clamp-2 text-16 leading-normal transition-colors after:absolute after:inset-0 hover:text-brand focus-visible:outline-none"
      >
        {article.title}
      </Link>
      <span className="text-14 text-muted-foreground">
        <Link
          href={`/members/${memberId(article.author) ?? ''}`}
          className="relative z-10 transition-colors hover:text-brand"
        >
          {article.author}
        </Link>
        {' · '}
        <Link
          href={`/archives/${article.archiveId}`}
          className="relative z-10 transition-colors hover:text-brand"
        >
          {article.archiveId}회차
        </Link>
      </span>
    </li>
  );
}

const PANEL =
  'flex flex-col gap-7 rounded-xl border border-border/70 bg-card p-6 lg:sticky lg:top-[calc(var(--header-height)+2rem)]';

/** 마우스처럼 올려놓을 수 있는 기기인지. 손가락만 있는 기기는 호버가 없다 */
function canHover() {
  return window.matchMedia('(hover: hover)').matches;
}

/**
 * 태그 구름과 미리보기 패널.
 *
 * 구름 컴포넌트는 그대로 두고 감싼 칸에서 포인터·포커스를 받아 지금 가리키는 태그를
 * 잡는다. 마우스는 올리기만 하면 패널이 바뀌고, 누르면 그 태그 페이지로 간다.
 *
 * 호버가 없는 기기에서는 첫 누름이 패널을 바꾸고, 같은 태그를 한 번 더 눌러야 이동한다.
 * 안 그러면 패널이 늘 첫 태그에 붙박여 있게 된다.
 */
export function TagPreview({ tags, articles }: TagPreviewProps) {
  const [slug, setSlug] = useState<string | null>(tags[0]?.slug ?? null);
  const known = (next: string | undefined) =>
    next && tags.some((item) => item.slug === next) ? next : undefined;

  const point = (event: { target: EventTarget }) => {
    const next = known(slugFromTarget(event.target));
    if (next) setSlug(next);
  };
  const hover = (event: { target: EventTarget }) => {
    if (canHover()) point(event);
  };
  const pick = (event: MouseEvent<HTMLDivElement>) => {
    const next = known(slugFromTarget(event.target));
    if (!next || next === slug || canHover()) return;
    event.preventDefault();
    setSlug(next);
  };
  const active = tags.find((item) => item.slug === slug);

  return (
    <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <div onPointerOver={hover} onFocus={point} onClick={pick}>
        <TagCloud tags={tags} activeSlugs={active ? [active.slug] : []} />
      </div>
      {active ? (
        <aside className={PANEL}>
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h2 className="text-24 font-semibold tracking-tight">#{active.tag}</h2>
            <p className="text-14 text-muted-foreground">{active.count}편</p>
          </div>
          <ul className="flex flex-col gap-4">
            {articles
              .filter((article) => article.tags.includes(active.tag))
              .slice(0, PREVIEW_COUNT)
              .map((article) => (
                <ArticleLine key={article.key} article={article} />
              ))}
          </ul>
          <Link
            href={`/tags/${active.slug}`}
            className="text-14 text-muted-foreground transition-colors hover:text-brand"
          >
            전체 보기 →
          </Link>
        </aside>
      ) : null}
    </div>
  );
}
