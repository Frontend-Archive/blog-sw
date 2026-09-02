import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHeader } from '@/components/layout/page-header';
import { Badge } from '@/components/ui/badge';
import { articles } from '@/lib/archive/source';
import { tagCounts, toSlug } from '@/lib/archive/taxonomy';

export const metadata: Metadata = {
  title: '태그',
  description: '스터디 아티클에 붙은 전체 태그 목록',
};

export default function TagsPage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 pb-32">
      <PageHeader
        title="태그"
        description={`아티클 ${articles.length}개에 ${tagCounts.length}개의 주제가 붙어 있습니다. 태그를 누르면 같은 주제의 글만 모아 봅니다.`}
      />

      {/* 카드 안의 태그는 12px 라벨이지만, 여기서는 칩 자체가 이 페이지의 주
          내비게이션이라 한 단계 키우고 여백도 넓힌다. */}
      <ul className="flex flex-wrap gap-2">
        {tagCounts.map(({ tag, count }) => (
          <li key={tag}>
            <Link href={`/tags/${toSlug(tag)}`}>
              <Badge
                variant="secondary"
                className="gap-2 px-3 py-1 text-14 font-normal transition-colors hover:bg-brand hover:text-brand-foreground"
              >
                {tag}
                <span className="text-muted-foreground/80 tabular-nums">{count}</span>
              </Badge>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
