import { ArrowUpRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { DaysSince } from '@/components/home/days-since';
import { ARCHIVE_REPO_SLUG, ARCHIVE_REPO_URL } from '@/lib/archive/config';
import { formatArchiveDate } from '@/lib/format';

interface HomeHeroProps {
  archiveCount: number;
  articleCount: number;
  memberCount: number;
  readingMinutes: number;
  firstDate: string | undefined;
  latestDate: string | undefined;
}

interface Stat {
  label: string;
  value: ReactNode;
  suffix?: string;
}

export function HomeHero({
  archiveCount,
  articleCount,
  memberCount,
  readingMinutes,
  firstDate,
  latestDate,
}: HomeHeroProps) {
  const stats: Stat[] = [
    { label: '회차', value: archiveCount },
    { label: '아티클', value: articleCount },
    { label: '멤버', value: memberCount },
    { label: '읽을거리', value: readingMinutes.toLocaleString('ko-KR'), suffix: '분' },
    ...(firstDate
      ? [{ label: '시작한 지', value: <DaysSince from={firstDate} />, suffix: '일째' }]
      : []),
  ];

  return (
    <section className="border-b border-border/60 pt-16 pb-12">
      <p className="text-14 font-medium text-muted-foreground">Frontend Archive</p>
      <h1 className="mt-3 max-w-2xl text-36 leading-tight font-semibold tracking-tight text-balance sm:text-48">
        읽고, 쓰고, 나눈 것들을 모아둔 곳
      </h1>
      <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">
        프론트엔드 스터디에서 회차마다 각자 쓴 글을 모읍니다. 원문은 각자의 블로그에 있고, 여기서는
        찾아보기 쉽게 정리합니다.
      </p>

      <div className="mt-8 flex flex-wrap items-end gap-x-10 gap-y-4">
        <dl className="flex flex-wrap gap-x-8 gap-y-4">
          {stats.map(({ label, value, suffix }) => (
            <div key={label}>
              <dt className="text-14 text-muted-foreground">{label}</dt>
              <dd className="mt-1 text-24 font-semibold tabular-nums">
                {value}
                {suffix ? (
                  <span className="ml-1 text-14 font-normal text-muted-foreground">{suffix}</span>
                ) : null}
              </dd>
            </div>
          ))}
        </dl>

        {latestDate ? (
          <p className="text-14 text-muted-foreground">
            최근 업데이트 {formatArchiveDate(latestDate)}
          </p>
        ) : null}
      </div>

      <a
        href={ARCHIVE_REPO_URL}
        target="_blank"
        rel="noreferrer"
        className="mt-6 inline-flex items-center gap-1 text-14 text-muted-foreground transition-colors hover:text-foreground"
      >
        원본 데이터 {ARCHIVE_REPO_SLUG}
        <ArrowUpRight className="size-3" aria-hidden />
      </a>
    </section>
  );
}
