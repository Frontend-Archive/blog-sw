import type { ReactNode } from 'react';
import { DaysSince } from '@/components/home/days-since';

interface HomeHeroProps {
  archiveCount: number;
  articleCount: number;
  memberCount: number;
  readingMinutes: number;
  firstDate: string | undefined;
}

interface Stat {
  label: string;
  value: ReactNode;
  suffix?: string;
}

/**
 * 구분선을 두지 않는다. 선 하나 긋는 것보다 여백으로 나누는 편이 조용하고,
 * 아래의 검색창이 이미 시각적인 경계 역할을 한다.
 */
export function HomeHero({
  archiveCount,
  articleCount,
  memberCount,
  readingMinutes,
  firstDate,
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
    <section className="pt-20 pb-16">
      <h1 className="max-w-2xl text-36 leading-tight font-semibold tracking-tight text-balance sm:text-48">
        읽고, 쓰고, 나눈 것들을 모아둔 곳
      </h1>

      <p className="mt-6 max-w-xl text-16 leading-relaxed text-muted-foreground">
        프론트엔드 스터디에서 회차마다 각자 쓴 글을 모읍니다. 원문은 각자의 블로그에 있고, 여기서는
        찾아보기 쉽게 정리합니다.
      </p>

      <dl className="mt-12 flex flex-wrap gap-x-12 gap-y-6">
        {stats.map(({ label, value, suffix }) => (
          <div key={label}>
            <dt className="text-14 text-muted-foreground">{label}</dt>
            <dd className="mt-2 text-24 leading-none font-semibold tabular-nums">
              {value}
              {suffix ? (
                <span className="ml-1 text-14 font-normal text-muted-foreground">{suffix}</span>
              ) : null}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
