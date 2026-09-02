import type { Metadata } from 'next';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { tagCounts } from '@/lib/archive/taxonomy';
import { toSlug } from '@/lib/archive/taxonomy';

export const metadata: Metadata = {
  title: '태그',
  description: '스터디 아티클에 붙은 전체 태그 목록',
};

export default function TagsPage() {
  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 pb-24">
      <header className="border-b border-border/60 pt-16 pb-10">
        <h1 className="text-3xl font-semibold tracking-tight">태그</h1>
        <p className="mt-3 text-sm text-muted-foreground">{tagCounts.length}개의 주제</p>
      </header>

      <ul className="flex flex-wrap gap-2 pt-10">
        {tagCounts.map(({ tag, count }) => (
          <li key={tag}>
            <Link href={`/tags/${toSlug(tag)}`}>
              <Badge
                variant="secondary"
                className="gap-1.5 px-3 py-1 text-sm font-normal transition-colors hover:bg-foreground hover:text-background"
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
