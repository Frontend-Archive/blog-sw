import { HomeHero } from '@/components/home/home-hero';
import { ArticleExplorer } from '@/features/filter/article-explorer';
import { collectAuthors } from '@/lib/archive/model';
import { archives, articles } from '@/lib/archive/source';
import { toArticleCardList } from '@/lib/archive/view';

export default function Home() {
  const first = archives.at(-1);
  const cards = toArticleCardList(articles);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 pb-32">
      <HomeHero
        archiveCount={archives.length}
        articleCount={articles.length}
        memberCount={collectAuthors(archives).length}
        readingMinutes={cards.reduce((total, card) => total + (card.readingMinutes ?? 0), 0)}
        firstDate={first?.date}
      />

      <section>
        <h2 className="sr-only">아티클 목록</h2>
        <ArticleExplorer articles={cards} />
      </section>
    </main>
  );
}
