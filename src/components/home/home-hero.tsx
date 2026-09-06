import type { ReactNode } from 'react';
import { CountUp } from '@/components/home/count-up';
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
  // 항목마다 조금씩 늦게 시작해 왼쪽부터 차례로 올라가게 한다.
  const STAGGER_MS = 80;
  const stats: Stat[] = [
    { label: '회차', value: <CountUp value={archiveCount} delayMs={0} /> },
    { label: '아티클', value: <CountUp value={articleCount} delayMs={STAGGER_MS} /> },
    { label: '멤버', value: <CountUp value={memberCount} delayMs={STAGGER_MS * 2} /> },
    {
      label: '읽을거리',
      value: <CountUp value={readingMinutes} delayMs={STAGGER_MS * 3} />,
      suffix: '분',
    },
    ...(firstDate
      ? [
          {
            label: '시작한 지',
            value: <DaysSince from={firstDate} delayMs={STAGGER_MS * 4} />,
            suffix: '일째',
          },
        ]
      : []),
  ];

  return (
    <section className="relative isolate pt-20 pb-16">
      {/*
        제목 뒤에 깔리는 포인트 색 헤일로. 크게 흐려서 색만 남기고 형태는 지운다.
        어두운 바탕에서만 색이 은은하게 살고, 흰 바탕에서는 얼룩처럼 보여 다크에서만 켠다.
      */}
      <span
        aria-hidden
        className="animate-halo-bloom pointer-events-none absolute top-12 -left-6 hidden h-40 w-2/5 rounded-full bg-gradient-to-br from-brand/55 via-brand/32 to-transparent blur-3xl dark:block"
      />

      <h1 className="relative max-w-2xl text-36 leading-tight font-semibold tracking-tight sm:text-48">
        Frontend Archive
      </h1>

      <p className="mt-6 max-w-3xl text-16 leading-relaxed text-muted-foreground">
        3~5년차 주니어 개발자들이 실무에서 겪은 문제와 푼 과정, 얻은 인사이트를 남깁니다.
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
