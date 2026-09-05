import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { MemberAvatar } from '@/features/members/member-avatar';
import type { ArchiveArticle } from '@/lib/archive/model';
import { memberId } from '@/lib/archive/members-config';
import { formatArchiveDate } from '@/lib/format';

interface ArticleDetailHeaderProps {
  article: ArchiveArticle;
}

/**
 * 경로로 열고, 가는 선 아래에 작성자와 날짜를 둔다.
 * 회차는 브레드크럼이, 분량은 본문 끝 원문 카드가 이미 말하므로 여기서는 뺀다.
 * 제목 행간은 1.5 로 둔다. 한글 두 줄 제목이 뭉치지 않는 지점이다.
 */
export function ArticleDetailHeader({ article }: ArticleDetailHeaderProps) {
  return (
    <header className="flex flex-col gap-5 pt-12 pb-8">
      <nav className="flex flex-wrap items-center gap-1 text-14 text-muted-foreground">
        <Link href="/" className="transition-colors hover:text-brand">
          아티클
        </Link>
        <ChevronRight className="size-4" aria-hidden />
        <Link
          href={`/archives/${article.archiveId}`}
          className="transition-colors hover:text-brand"
        >
          스터디 {article.archiveId}회차
        </Link>
      </nav>

      <h1 className="text-24 leading-normal font-semibold tracking-tight">{article.title}</h1>

      <div className="flex flex-wrap items-center gap-4 border-t border-border/60 pt-5">
        <Link
          href={`/members/${memberId(article.author) ?? ''}`}
          className="group inline-flex w-fit items-center gap-2"
        >
          <MemberAvatar author={article.author} size={32} />
          <span className="text-14 font-medium transition-colors group-hover:text-brand">
            {article.author}
          </span>
        </Link>

        <div className="flex flex-wrap items-center gap-2 text-14 text-muted-foreground">
          <time dateTime={article.archiveDate} className="tabular-nums">
            {formatArchiveDate(article.archiveDate)}
          </time>
        </div>
      </div>
    </header>
  );
}
