import Image from 'next/image';
import type { OgImage } from '@/lib/archive/og-schema';
import { cn } from '@/lib/utils';

/**
 * 썸네일이 없는 링크를 위한 대체 배경.
 *
 * 청록에서 파랑까지 차가운 쪽에서만 고른다. 포인트 색(264)을 품으면서도
 * 폭이 있어 카드끼리 구분이 되고, 색이 제각각일 때처럼 목록이 시끄럽지 않다.
 * 같은 글은 항상 같은 색이 나오도록 문자열에서 유도한다.
 */
const FALLBACK_HUES = [200, 220, 240, 260, 280] as const;

function pickHue(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) % 2147483647;
  }
  return FALLBACK_HUES[hash % FALLBACK_HUES.length] ?? FALLBACK_HUES[0];
}

/** 밝기와 채도는 테마 변수를 따르고, 색상만 글마다 달리한다. */
function fallbackBackground(seed: string): string {
  const hue = pickHue(seed);
  const from = `oklch(var(--thumb-l-from) var(--thumb-c) ${hue})`;
  const to = `oklch(var(--thumb-l-to) var(--thumb-c) ${hue + 24})`;
  return `linear-gradient(135deg, ${from}, ${to})`;
}

interface ArticleThumbnailProps {
  image: OgImage | undefined;
  title: string;
  /** 대체 배경 위에 얹을 짧은 라벨. 보통 첫 번째 태그를 넘긴다. */
  fallbackLabel?: string;
  seed: string;
  className?: string;
  priority?: boolean;
}

export function ArticleThumbnail({
  image,
  title,
  fallbackLabel,
  seed,
  className,
  priority = false,
}: ArticleThumbnailProps) {
  if (!image) {
    return (
      <div
        aria-hidden
        style={{ backgroundImage: fallbackBackground(seed) }}
        className={cn('flex items-center justify-center', className)}
      >
        {fallbackLabel ? (
          <span className="px-4 text-center text-16 font-medium text-balance text-foreground/75">
            {fallbackLabel}
          </span>
        ) : null}
      </div>
    );
  }

  return (
    <Image
      src={image.src}
      alt={title}
      width={image.width}
      height={image.height}
      priority={priority}
      sizes="(max-width: 768px) 100vw, 400px"
      className={cn('object-cover', className)}
    />
  );
}
