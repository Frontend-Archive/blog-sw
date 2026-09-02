import type { Metadata } from 'next';
import { PageHeader } from '@/components/layout/page-header';
import { TimelineEntry } from '@/components/timeline/timeline-entry';
import { archives, articles } from '@/lib/archive/source';
import { formatArchiveDate } from '@/lib/format';

export const metadata: Metadata = {
  title: '타임라인',
  description: '스터디가 회차마다 어떤 주제를 다뤘는지 시간순으로 정리한 기록',
};

export default function TimelinePage() {
  const first = archives.at(-1);
  const latest = archives[0];

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 pb-32">
      <PageHeader
        title="타임라인"
        description={
          first && latest
            ? `${formatArchiveDate(first.date)}부터 ${formatArchiveDate(latest.date)}까지 ${archives.length}회차, ${articles.length}개의 글을 나눴습니다.`
            : undefined
        }
      />

      <ol>
        {archives.map((archive) => (
          <TimelineEntry key={archive.id} archive={archive} />
        ))}
      </ol>
    </main>
  );
}
