import Link from 'next/link';
import { ArticleThumbnail } from '@/components/article/article-thumbnail';
import { memberId } from '@/lib/archive/members-config';
import { articleSlug, toSlug } from '@/lib/archive/taxonomy';
import type { ArticleCardData } from '@/lib/archive/view';

interface ArticleAsideProps {
  /** 겹치는 태그가 많은 순 */
  topic: ArticleCardData[];
  /** 주제 묶음이 어떤 태그로 걸렸는지. 묶음 이름을 이걸로 대신한다. */
  topicTags: string[];
  /** 같은 사람이 쓴 다른 글 */
  author: ArticleCardData[];
  /** 그 사람 이름. 묶음 이름을 이걸로 대신한다. */
  authorName: string;
}

/**
 * 상세 페이지 우측 추천.
 *
 * 테두리 없이 56px 정사각 썸네일과 제목만 눕힌다. 본문 옆에 나란히 서는
 * 자리라 카드처럼 경계를 두르면 본문과 무게가 비슷해져 시선을 나눠 갖는다.
 *
 * 링크 안에 링크를 넣을 수 없어서, 제목 링크를 줄 전체로 늘리고 작성자만
 * 그 위에 올린다. 아티클 카드도 같은 방식이다.
 *
 * 호버 색은 줄이 아니라 제목 링크에 건다. 작성자 위에서는 제목 링크가 가려져
 * 호버가 잡히지 않으니, 누르면 어디로 가는지 한 곳만 켜진다.
 */
function Row({ article }: { article: ArticleCardData }) {
  return (
    <li className="relative">
      <div className="flex items-start gap-3 py-3">
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
          <Link
            href={`/articles/${articleSlug(article)}`}
            className="transition-colors after:absolute after:inset-0 hover:text-brand focus-visible:outline-none"
          >
            <span className="line-clamp-2 text-14 leading-normal">{article.title}</span>
          </Link>
          <span className="text-14 text-muted-foreground">
            <Link
              href={`/members/${memberId(article.author) ?? ''}`}
              className="relative z-10 transition-colors hover:text-brand"
            >
              {article.author}
            </Link>
          </span>
        </span>
      </div>
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
      ))}{' '}
      <span>다른 글</span>
    </h2>
  );
}

export function ArticleAside({ topic, topicTags, author, authorName }: ArticleAsideProps) {
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
          {/* '작성자' 라고만 하면 누구인지 다시 위로 올라가 확인해야 한다.
              이름을 그대로 내걸고, 누르면 그 사람의 글 전체로 간다. */}
          <h2 className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-14 text-muted-foreground">
            <Link
              href={`/members/${memberId(authorName) ?? ''}`}
              className="transition-colors hover:text-brand"
            >
              {authorName}
            </Link>
            <span>의 다른 글</span>
          </h2>
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
