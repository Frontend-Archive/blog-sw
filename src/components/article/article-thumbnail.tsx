import Image from 'next/image';
import type { OgImage } from '@/lib/archive/og-schema';
import { cn } from '@/lib/utils';

/** 썸네일이 없는 링크를 위한 대체 배경. 같은 글은 항상 같은 색이 나오도록 문자열에서 유도한다. */
const FALLBACK_GRADIENTS = [
  'from-sky-200 to-indigo-200 dark:from-sky-900 dark:to-indigo-950',
  'from-amber-200 to-rose-200 dark:from-amber-900 dark:to-rose-950',
  'from-emerald-200 to-teal-200 dark:from-emerald-900 dark:to-teal-950',
  'from-violet-200 to-fuchsia-200 dark:from-violet-900 dark:to-fuchsia-950',
  'from-slate-200 to-zinc-300 dark:from-slate-800 dark:to-zinc-900',
] as const;

function pickGradient(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) % 2147483647;
  }
  const index = hash % FALLBACK_GRADIENTS.length;
  return FALLBACK_GRADIENTS[index] ?? FALLBACK_GRADIENTS[0];
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
        className={cn(
          'flex items-center justify-center bg-gradient-to-br',
          pickGradient(seed),
          className,
        )}
      >
        {fallbackLabel ? (
          <span className="px-4 text-center text-14 font-medium text-balance text-foreground/60">
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
