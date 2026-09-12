import { ArticleCard } from '@/components/article/article-card';
import { ReadDim } from '@/features/reading/read-dim';
import type { ArticleCardData } from '@/lib/archive/view';

interface ArticleGridProps {
  articles: ArticleCardData[];
  /** 위쪽 몇 장의 썸네일을 우선 로드할지 */
  priorityCount?: number;
  emptyMessage?: string;
}

/**
 * 아티클 카드 목록.
 *
 * 카드 제목이 h3 라 바로 위에 h2 가 있어야 계층이 끊기지 않는다. 화면에는 페이지
 * 제목이 이미 있으니 목록 제목은 보이지 않게 두고, 목록을 쓰는 모든 곳에 여기서
 * 한 번에 붙인다.
 */
export function ArticleGrid({
  articles,
  priorityCount = 3,
  emptyMessage = '아직 등록된 아티클이 없습니다.',
}: ArticleGridProps) {
  return (
    <section>
      <h2 className="sr-only">아티클 목록</h2>
      {articles.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border/60 px-6 py-16 text-center text-14 text-muted-foreground">
          {emptyMessage}
        </p>
      ) : (
        <div className="grid gap-7 md:grid-cols-2 md:gap-5 lg:grid-cols-3">
          {articles.map((article, index) => (
            <ReadDim key={article.key} articleKey={article.key}>
              <ArticleCard article={article} priority={index < priorityCount} />
            </ReadDim>
          ))}
        </div>
      )}
    </section>
  );
}
