import Link from 'next/link';
import { ArticleThumbnail } from '@/components/article/article-thumbnail';
import { articleSlug, toSlug } from '@/lib/archive/taxonomy';
import type { ArticleCardData } from '@/lib/archive/view';

interface ArticleAsideProps {
  /** 겹치는 태그가 많은 순 */
  topic: ArticleCardData[];
  /** 주제 묶음이 어떤 태그로 걸렸는지. 묶음 이름을 이걸로 대신한다. */
  topicTags: string[];
  /** 같은 사람이 쓴 다른 글 */
  author: ArticleCardData[];
}

/**
 * 상세 페이지 우측 추천.
 *
 * 테두리 없이 56px 정사각 썸네일과 제목만 눕힌다. 본문 옆에 나란히 서는
 * 자리라 카드처럼 경계를 두르면 본문과 무게가 비슷해져 시선을 나눠 갖는다.
 */
function Row({ article }: { article: ArticleCardData }) {
  return (
    <li>
      <Link
        href={`/articles/${articleSlug(article)}`}
        className="group flex items-start gap-3 py-3"
      >
        <span className="block aspect-square w-14 shrink-0 overflow-hidden rounded-lg bg-muted">
          <ArticleThumbnail
            image={article.image}
            title={article.title}
            fallbackLabel=""
            seed={article.url}
            className="h-full w-full object-cover"
          />
        </span>
        <span className="flex min-w-0 flex-col gap-0.5">
          <span className="line-clamp-2 text-14 leading-normal transition-colors group-hover:text-brand">
            {article.title}
          </span>
          <span className="text-14 text-muted-foreground">{article.author}</span>
        </span>
      </Link>
    </li>
  );
}

/**
 * 주제 묶음의 이름.
 *
 * "비슷한 주제"라고만 하면 무엇이 비슷한지 알 수 없다. 실제로 걸린 태그를
 * 그대로 내걸어 무엇으로 묶였는지 말하고, 누르면 그 태그의 전체 목록으로 간다.
 *
 * 태그 뒤에 조사는 붙이지 않는다. 받침이 없는 태그(라이브러리, Sentry)에서
 * "을/를" 이 어긋나는데, 영문 태그는 읽는 소리를 알아야 해서 규칙이 완전하지 않다.
 */
function TopicLabel({ tags }: { tags: string[] }) {
  if (tags.length === 0) return <h2 className="text-14 text-muted-foreground">비슷한 주제</h2>;

  return (
    <h2 className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-14 text-muted-foreground">
      {tags.map((tag) => (
        <Link
          key={tag}
          href={`/tags/${toSlug(tag)}`}
          className="transition-colors hover:text-brand"
        >
          #{tag}
        </Link>
      ))}
      <span>다른 글</span>
    </h2>
  );
}

export function ArticleAside({ topic, topicTags, author }: ArticleAsideProps) {
  if (topic.length === 0 && author.length === 0) return null;

  return (
    <div className="flex flex-col gap-8">
      {topic.length > 0 ? (
        <section className="flex flex-col gap-3">
          <TopicLabel tags={topicTags} />
          <ul className="flex flex-col">
            {topic.map((item) => (
              <Row key={item.key} article={item} />
            ))}
          </ul>
        </section>
      ) : null}

      {author.length > 0 ? (
        <section className="flex flex-col gap-3">
          <h2 className="text-14 text-muted-foreground">작성자의 다른 글</h2>
          <ul className="flex flex-col">
            {author.map((item) => (
              <Row key={item.key} article={item} />
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
