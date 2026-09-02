import type { Metadata } from 'next';
import { TimelineEntry } from '@/components/timeline/timeline-entry';
import { countEmptySlots } from '@/lib/archive/model';
import { archives, articles } from '@/lib/archive/source';
import { formatArchiveDate } from '@/lib/format';

export const metadata: Metadata = {
  title: '타임라인',
  description: '스터디가 회차마다 어떤 주제를 다뤘는지 시간순으로 정리한 기록',
};

export default function TimelinePage() {
  const first = archives.at(-1);
  const latest = archives[0];
  const emptyCount = countEmptySlots(archives);

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 pb-24">
      <header className="border-b border-border/60 pt-16 pb-10">
        <h1 className="text-30 font-semibold tracking-tight">타임라인</h1>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          {first && latest
            ? `${formatArchiveDate(first.date)}부터 ${formatArchiveDate(latest.date)}까지 `
            : ''}
          {archives.length}회차 동안 {articles.length}개의 글을 나눴습니다.
          {emptyCount > 0 ? ` ${emptyCount}자리는 아직 채워지는 중입니다.` : ''}
        </p>
      </header>

      <ol className="pt-12">
        {archives.map((archive) => (
          <TimelineEntry key={archive.id} archive={archive} />
        ))}
      </ol>
    </main>
  );
}
