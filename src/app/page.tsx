import { HomeHero } from '@/components/home/home-hero';
import { ArticleExplorer } from '@/features/filter/article-explorer';
import { collectAuthors } from '@/lib/archive/model';
import { archives, articles } from '@/lib/archive/source';
import { tagCounts } from '@/lib/archive/taxonomy';
import { toArticleCardList } from '@/lib/archive/view';

/** 필터 바에 인라인으로 노출할 태그 수. 나머지는 /tags 에서 본다. */
const INLINE_TAG_LIMIT = 12;

export default function Home() {
  const latest = archives[0];
  const cards = toArticleCardList(articles);
  const authors = collectAuthors(archives);
  const archiveIds = archives.map((archive) => archive.id);
  const tags = tagCounts.slice(0, INLINE_TAG_LIMIT).map((item) => item.tag);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 pb-24">
      <HomeHero
        archiveCount={archives.length}
        articleCount={articles.length}
        memberCount={authors.length}
        latestDate={latest?.date}
      />

      <section className="pt-12">
        <h2 className="sr-only">아티클 목록</h2>
        <ArticleExplorer articles={cards} authors={authors} archiveIds={archiveIds} tags={tags} />
      </section>
    </main>
  );
}
