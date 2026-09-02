import { ArticleCard } from '@/components/article/article-card';
import { archives, articles } from '@/lib/archive/source';

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Frontend Archive</h1>
      <p className="mt-3 text-muted-foreground">
        스터디 {archives.length}회차 · 아티클 {articles.length}개
      </p>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article, index) => (
          <ArticleCard key={article.key} article={article} priority={index < 3} />
        ))}
      </div>
    </main>
  );
}
