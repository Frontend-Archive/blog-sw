import { FlaskConical } from 'lucide-react';
import type { Metadata } from 'next';
import { DesignTokens } from '@/features/lab/design-tokens';
import { LabSection } from '@/features/lab/lab-section';
import { CARD_VARIANTS } from '@/features/lab/variants';
import { articles } from '@/lib/archive/source';
import { toArticleCardList } from '@/lib/archive/view';

export const metadata: Metadata = {
  title: '카드 UI 시안',
  description: '아티클 카드 디자인 시안을 나란히 비교하는 임시 페이지',
  robots: { index: false, follow: false },
};

/** 시안마다 보여줄 표본 수. 배치 차이를 보려면 여러 장이 필요하다. */
const SAMPLE_SIZE = 6;

export default function LabPage() {
  // 썸네일 있는 것, 없는 것, 노션처럼 읽는 시간이 빠진 것을 고루 섞는다.
  const all = toArticleCardList(articles);
  const withImage = all.filter((article) => article.image);
  const withoutImage = all.filter((article) => !article.image);
  const samples = [...withImage.slice(0, SAMPLE_SIZE - withoutImage.length), ...withoutImage].slice(
    0,
    SAMPLE_SIZE,
  );

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 pb-32">
      <header className="border-b border-border/60 pt-16 pb-8">
        <p className="inline-flex items-center gap-1 text-12 font-medium tracking-wide text-muted-foreground uppercase">
          <FlaskConical className="size-4" aria-hidden />
          임시 페이지
        </p>
        <h1 className="mt-3 text-30 font-semibold tracking-tight">카드 UI 시안</h1>
        <p className="mt-4 max-w-xl text-16 leading-relaxed text-muted-foreground">
          같은 아티클 {samples.length}개를 {CARD_VARIANTS.length}가지 카드로 그렸습니다. 썸네일이
          없는 링크와 읽는 시간이 빠진 링크를 일부러 섞어, 데이터가 부실할 때 어떻게 보이는지까지
          비교할 수 있게 했습니다.
        </p>

        <nav className="mt-6 flex flex-wrap gap-2">
          <a
            href="#tokens"
            className="rounded-md border border-border/70 px-3 py-1 text-14 transition-colors hover:bg-accent"
          >
            00 · 디자인 토큰
          </a>
          {CARD_VARIANTS.map((variant) => (
            <a
              key={variant.id}
              href={`#${variant.id}`}
              className="rounded-md border border-border/70 px-3 py-1 text-14 transition-colors hover:bg-accent"
            >
              {variant.name}
            </a>
          ))}
        </nav>
      </header>

      <div className="flex flex-col gap-20 pt-12">
        <DesignTokens />
        {CARD_VARIANTS.map((variant) => (
          <LabSection key={variant.id} variant={variant} articles={samples} />
        ))}
      </div>
    </main>
  );
}
