import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { MemberAvatar } from '@/features/members/member-avatar';
import type { ParsedArchive } from '@/lib/archive/parse';
import { isFilledArticle } from '@/lib/archive/schema';
import { displayName, memberId } from '@/lib/archive/members-config';
import { articleSlug } from '@/lib/archive/taxonomy';
import { formatArchiveDate } from '@/lib/format';

interface TimelineEntryProps {
  archive: ParsedArchive;
}

/**
 * 한 회차의 정보 계층
 *   (16 날짜 + 12 뱃지) 회차 머리 → 16 제목 + 14 작성자
 *
 * 아직 안 채워진 자리와 태그는 여기서 보여주지 않는다. 타임라인은 실제로 나눈 글의
 * 흐름만 훑는 화면이고, 나머지는 회차 상세와 태그 화면이 맡는다.
 */
export function TimelineEntry({ archive }: TimelineEntryProps) {
  const articles = archive.articles.filter(isFilledArticle);

  return (
    <li className="group relative pb-12 pl-8 last:pb-0">
      {/* 회차를 잇는 세로선. 마지막 항목에서는 아래로 흘러내리지 않게 감춘다. */}
      <span
        className="absolute top-3 bottom-0 left-2 w-px bg-foreground/15 group-last:hidden"
        aria-hidden
      />
      <span
        className="absolute top-2 left-1 size-2 rounded-full bg-brand ring-4 ring-background"
        aria-hidden
      />

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <time dateTime={archive.date} className="text-16 font-semibold tabular-nums">
          {formatArchiveDate(archive.date)}
        </time>
        <Badge variant="secondary" className="font-normal">
          {archive.type === 'off-line' ? '오프라인' : '온라인'}
        </Badge>

        {/* 그 회차 참여자를 머리에 모은다. 글줄마다 아바타를 반복하지 않아 목록이 조용하다. */}
        <span className="flex items-center -space-x-2">
          {articles.map((article) => (
            <span key={article.author} className="rounded-full ring-2 ring-background">
              <MemberAvatar author={article.author} size={20} />
            </span>
          ))}
        </span>

        <Link
          href={`/archives/${archive.id}`}
          className="ml-auto inline-flex items-center gap-1 text-14 text-muted-foreground transition-colors hover:text-brand"
        >
          {archive.title}
          <ChevronRight className="size-4" aria-hidden />
        </Link>
      </div>

      <ul className="mt-4 flex flex-col gap-3">
        {articles.map((article) => (
          <li
            key={article.author}
            className="border-l-2 border-border/60 pl-4 transition-colors hover:border-brand/60"
          >
            {/* 작성자를 제목 바로 뒤에 붙여 한 문장처럼 읽히게 한다. */}
            <p className="flex flex-wrap items-baseline gap-x-2">
              <Link
                href={`/articles/${articleSlug({ archiveId: archive.id, author: article.author })}`}
                className="text-16 leading-snug font-medium transition-colors hover:text-brand"
              >
                {article.title}
              </Link>
              <Link
                href={`/members/${memberId(article.author) ?? ''}`}
                className="text-14 text-muted-foreground transition-colors hover:text-brand"
              >
                {displayName(article.author)}
              </Link>
            </p>
          </li>
        ))}
      </ul>
    </li>
  );
}
