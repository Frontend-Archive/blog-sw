import { FlaskConical } from 'lucide-react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/layout/page-header';
import { GNB_VARIANTS } from '@/features/lab/gnb-variants';
import type { NavItem } from '@/features/lab/gnb-variants/shared';

export const metadata: Metadata = {
  title: 'GNB UI 시안',
  description: '상단 내비게이션 표현 방식을 나란히 비교하는 임시 페이지',
  robots: { index: false, follow: false },
};

const ITEMS: NavItem[] = [
  { href: '/', label: '아티클' },
  { href: '/timeline', label: '타임라인' },
  { href: '/tags', label: '태그' },
  { href: '/members', label: '멤버' },
  { href: '/submit', label: '글 등록' },
];

export default function LabGnbPage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 pb-32">
      <PageHeader
        title="GNB UI 시안"
        description={`상단 내비게이션을 ${GNB_VARIANTS.length}가지 배치로 그렸습니다. 색이나 모양이 아니라 요소를 어디에 놓느냐가 기준입니다. 화면 구조가 바뀌는 시안(드로어·사이드 레일·하단 바)은 가짜 화면 안에 넣었습니다.`}
        eyebrow={
          <span className="inline-flex items-center gap-1 text-14 font-medium tracking-wide text-muted-foreground uppercase">
            <FlaskConical className="size-4" aria-hidden />
            임시 페이지
          </span>
        }
      >
        <nav className="mt-6 flex flex-wrap gap-2">
          {GNB_VARIANTS.map((variant) => (
            <a
              key={variant.id}
              href={`#${variant.id}`}
              className="rounded-md border border-border/70 px-3 py-1 text-14 transition-colors hover:bg-accent"
            >
              {variant.name}
            </a>
          ))}
        </nav>
      </PageHeader>

      <div className="flex flex-col gap-16">
        {GNB_VARIANTS.map(({ id, name, note, frame, Component }) => (
          <section key={id} id={id} className="scroll-mt-24">
            <header className="mb-4 flex flex-col gap-1">
              <h2 className="font-semibold tracking-tight">{name}</h2>
              <p className="text-14 text-muted-foreground">{note}</p>
            </header>
            <div
              className={`overflow-hidden rounded-xl border border-border/70 bg-background ${
                frame === 'screen' ? 'h-72' : ''
              }`}
            >
              <Component items={ITEMS} activeHref="/timeline" />
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
