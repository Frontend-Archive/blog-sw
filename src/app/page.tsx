import { ArticleGrid } from '@/components/article/article-grid';
import { HomeHero } from '@/components/home/home-hero';
import { collectAuthors } from '@/lib/archive/model';
import { archives, articles } from '@/lib/archive/source';

export default function Home() {
  const latest = archives[0];

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 pb-24">
      <HomeHero
        archiveCount={archives.length}
        articleCount={articles.length}
        memberCount={collectAuthors(archives).length}
        latestDate={latest?.date}
      />

      <section className="pt-12">
        <h2 className="sr-only">아티클 목록</h2>
        <ArticleGrid articles={articles} />
      </section>
    </main>
  );
}
