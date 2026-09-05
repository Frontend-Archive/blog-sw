import { ArticleCard } from '@/components/article/article-card';
import { ReadDim } from '@/features/reading/read-dim';
import type { ArticleCardData } from '@/lib/archive/view';

interface ArticleGridProps {
  articles: ArticleCardData[];
  /** 위쪽 몇 장의 썸네일을 우선 로드할지 */
  priorityCount?: number;
  emptyMessage?: string;
}

export function ArticleGrid({
  articles,
  priorityCount = 3,
  emptyMessage = '아직 등록된 아티클이 없습니다.',
}: ArticleGridProps) {
  if (articles.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border/60 px-6 py-16 text-center text-14 text-muted-foreground">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="grid gap-7 md:grid-cols-2 md:gap-5 lg:grid-cols-3">
      {articles.map((article, index) => (
        <ReadDim key={article.key} articleKey={article.key}>
          <ArticleCard article={article} priority={index < priorityCount} />
        </ReadDim>
      ))}
    </div>
  );
}
