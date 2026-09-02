import { ArticleCard } from '@/components/article/article-card';
import type { ArchiveArticle } from '@/lib/archive/model';

interface ArticleGridProps {
  articles: ArchiveArticle[];
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
      <p className="rounded-xl border border-dashed border-border/60 px-6 py-16 text-center text-sm text-muted-foreground">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((article, index) => (
        <ArticleCard key={article.key} article={article} priority={index < priorityCount} />
      ))}
    </div>
  );
}
