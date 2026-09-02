import Link from 'next/link';

export interface TagCloudItem {
  tag: string;
  slug: string;
  count: number;
}

/**
 * 16px 부터 24px 까지 2px 씩, 굵기와 색도 함께 올라간다.
 * 가장 작은 단계만 muted 로 눌러 배경처럼 물러나게 한다.
 */
const LEVELS = [
  { size: 16, className: 'font-normal text-muted-foreground' },
  { size: 18, className: 'font-normal' },
  { size: 20, className: 'font-medium' },
  { size: 22, className: 'font-semibold' },
  { size: 24, className: 'font-bold' },
] as const;

/** 가장 적은 태그를 0, 가장 많은 태그를 마지막 단계로 정규화한다. */
function levelOf(count: number, max: number): number {
  if (max <= 1) return 0;
  return Math.round(((count - 1) / (max - 1)) * (LEVELS.length - 1));
}

export function TagCloud({ tags }: { tags: TagCloudItem[] }) {
  const max = tags.reduce((highest, item) => Math.max(highest, item.count), 1);

  // 개수가 많은 태그가 가운데로 오도록 앞뒤로 번갈아 담는다.
  const arranged: TagCloudItem[] = [];
  tags.forEach((item, index) => {
    if (index % 2 === 0) arranged.push(item);
    else arranged.unshift(item);
  });

  return (
    <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4 px-4 py-8">
      {arranged.map((item) => {
        const level = levelOf(item.count, max);
        const { size, className } = LEVELS[level] ?? LEVELS[0];

        return (
          <li key={item.slug}>
            <Link
              href={`/tags/${item.slug}`}
              title={`글 ${item.count}개`}
              style={{ fontSize: `${size}px` }}
              className={`inline-block leading-tight transition-colors hover:text-brand ${className}`}
            >
              {item.tag}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
