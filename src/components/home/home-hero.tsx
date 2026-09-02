import { ArrowUpRight } from 'lucide-react';
import { ARCHIVE_REPO_SLUG, ARCHIVE_REPO_URL } from '@/lib/archive/config';
import { formatArchiveDate } from '@/lib/format';

interface HomeHeroProps {
  archiveCount: number;
  articleCount: number;
  memberCount: number;
  latestDate: string | undefined;
}

export function HomeHero({ archiveCount, articleCount, memberCount, latestDate }: HomeHeroProps) {
  const stats = [
    { label: '회차', value: archiveCount },
    { label: '아티클', value: articleCount },
    { label: '멤버', value: memberCount },
  ];

  return (
    <section className="border-b border-border/60 pt-16 pb-12">
      <p className="text-sm font-medium text-muted-foreground">Frontend Archive</p>
      <h1 className="mt-3 max-w-2xl text-4xl leading-tight font-semibold tracking-tight text-balance sm:text-5xl">
        읽고, 쓰고, 나눈 것들을 모아둔 곳
      </h1>
      <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">
        프론트엔드 스터디에서 회차마다 각자 쓴 글을 모읍니다. 원문은 각자의 블로그에 있고, 여기서는
        찾아보기 쉽게 정리합니다.
      </p>

      <div className="mt-8 flex flex-wrap items-end gap-x-10 gap-y-4">
        <dl className="flex gap-8">
          {stats.map(({ label, value }) => (
            <div key={label}>
              <dt className="text-xs text-muted-foreground">{label}</dt>
              <dd className="mt-1 text-2xl font-semibold tabular-nums">{value}</dd>
            </div>
          ))}
        </dl>

        {latestDate ? (
          <p className="text-xs text-muted-foreground">
            최근 업데이트 {formatArchiveDate(latestDate)}
          </p>
        ) : null}
      </div>

      <a
        href={ARCHIVE_REPO_URL}
        target="_blank"
        rel="noreferrer"
        className="mt-6 inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        원본 데이터 {ARCHIVE_REPO_SLUG}
        <ArrowUpRight className="size-3" aria-hidden />
      </a>
    </section>
  );
}
