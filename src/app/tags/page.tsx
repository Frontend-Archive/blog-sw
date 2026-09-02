import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHeader } from '@/components/layout/page-header';
import { articles } from '@/lib/archive/source';
import { tagCounts, toSlug } from '@/lib/archive/taxonomy';

export const metadata: Metadata = {
  title: '태그',
  description: '스터디 아티클에 붙은 전체 태그 목록',
};

export default function TagsPage() {
  const max = tagCounts[0]?.count ?? 1;

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 pb-32">
      <PageHeader
        title="태그"
        description={`아티클 ${articles.length}개에 ${tagCounts.length}개의 주제가 붙어 있습니다. 어떤 주제를 자주 다뤘는지 막대 길이로 보입니다.`}
      />

      <ul className="grid gap-x-12 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
        {tagCounts.map(({ tag, count }) => (
          <li key={tag}>
            <Link
              href={`/tags/${toSlug(tag)}`}
              className="group flex items-center gap-4 rounded-lg px-3 py-2 transition-colors hover:bg-accent"
            >
              <span className="max-w-[60%] shrink-0 truncate text-14 transition-colors group-hover:text-brand">
                {tag}
              </span>

              {/* 비중 막대. 가장 많은 태그를 기준으로 상대 길이를 준다. */}
              <span
                className="h-1 min-w-8 flex-1 overflow-hidden rounded-full bg-border"
                aria-hidden
              >
                <span
                  className="block h-full rounded-full bg-brand/70 transition-colors group-hover:bg-brand"
                  style={{ width: `${Math.round((count / max) * 100)}%` }}
                />
              </span>

              <span className="w-4 shrink-0 text-right text-14 text-muted-foreground tabular-nums">
                {count}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
