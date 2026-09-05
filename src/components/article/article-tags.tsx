import Link from 'next/link';
import { toSlug } from '@/lib/archive/taxonomy';

/** 태그 줄. 해시를 붙여 나란히 흘린다. */
export function ArticleTags({ tags }: { tags: string[] }) {
  if (tags.length === 0) return null;
  return (
    <ul className="flex flex-wrap items-center gap-3">
      {tags.map((tag) => (
        <li key={tag}>
          <Link
            href={`/tags/${toSlug(tag)}`}
            className="text-14 text-muted-foreground transition-colors hover:text-brand"
          >
            #{tag}
          </Link>
        </li>
      ))}
    </ul>
  );
}
