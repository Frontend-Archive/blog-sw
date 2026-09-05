import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';

interface ArticleSourceLinkProps {
  url: string;
  hostname: string;
  favicon?: string;
  readingMinutes?: number;
}

/**
 * 원문으로 나가는 블록.
 *
 * 상세 페이지의 다른 링크는 전부 사이트 안에서 도는데 이것만 밖으로 나간다.
 * 본문 폭을 다 쓰는 카드로 눕혀 두어야 태그나 추천 목록과 섞이지 않는다.
 */
export function ArticleSourceLink({
  url,
  hostname,
  favicon,
  readingMinutes,
}: ArticleSourceLinkProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="flex w-full items-center gap-4 rounded-xl border border-border/60 px-5 py-4 transition-colors hover:border-brand/60 hover:text-brand"
    >
      {favicon ? (
        <Image src={favicon} alt="" width={24} height={24} className="size-6 rounded" />
      ) : null}
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-16 font-medium">원문에서 이어서 읽기</span>
        <span className="truncate text-14 opacity-70">
          {hostname}
          {readingMinutes ? ` · ${readingMinutes}분` : ''}
        </span>
      </span>
      <ArrowUpRight className="size-5 shrink-0" aria-hidden />
    </a>
  );
}
