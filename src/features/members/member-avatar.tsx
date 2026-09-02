import Image from 'next/image';
import { avatarPath } from '@/lib/archive/members-config';

/** 이름에서 유도한 고정 색. 같은 사람은 항상 같은 색을 갖는다. */
const TONES = [
  'from-sky-400 to-indigo-500',
  'from-amber-400 to-rose-500',
  'from-emerald-400 to-teal-500',
  'from-violet-400 to-fuchsia-500',
] as const;

function pickTone(seed: string): string {
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) % 2147483647;
  }
  return TONES[hash % TONES.length] ?? TONES[0];
}

interface MemberAvatarProps {
  author: string;
  size?: number;
  className?: string;
}

/**
 * GitHub 아이디가 설정돼 있으면 빌드 때 받아둔 사진을, 없으면 이름 첫 글자를 쓴다.
 * 한국 이름은 첫 글자가 성이라 두 번째 글자를 쓴다.
 */
export function MemberAvatar({ author, size = 56, className }: MemberAvatarProps) {
  const src = avatarPath(author);
  const initial = author.slice(1, 2) || author.slice(0, 1);

  if (src) {
    return (
      <Image
        src={src}
        alt=""
        width={size}
        height={size}
        className={`shrink-0 rounded-full object-cover ring-1 ring-border/60 ${className ?? ''}`}
      />
    );
  }

  return (
    <span
      aria-hidden
      style={{ width: size, height: size, fontSize: Math.round(size * 0.36) }}
      className={`flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br font-semibold text-white ${pickTone(author)} ${className ?? ''}`}
    >
      {initial}
    </span>
  );
}
