import { ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { articlesByAuthor, authors, toSlug } from '@/lib/archive/taxonomy';

export const metadata: Metadata = {
  title: '멤버',
  description: '스터디 멤버별 아티클 모아보기',
};

export default function MembersPage() {
  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 pb-24">
      <header className="border-b border-border/60 pt-16 pb-10">
        <h1 className="text-3xl font-semibold tracking-tight">멤버</h1>
        <p className="mt-3 text-sm text-muted-foreground">{authors.length}명</p>
      </header>

      <ul className="grid gap-4 pt-10 sm:grid-cols-2">
        {authors.map((author) => {
          const count = articlesByAuthor(author).length;
          return (
            <li key={author}>
              <Link
                href={`/members/${toSlug(author)}`}
                className="group flex items-center justify-between rounded-xl border border-border/70 px-5 py-4 transition-colors hover:border-foreground/25"
              >
                <span>
                  <span className="font-medium">{author}</span>
                  <span className="ml-2 text-sm text-muted-foreground tabular-nums">
                    아티클 {count}개
                  </span>
                </span>
                <ArrowRight
                  className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
