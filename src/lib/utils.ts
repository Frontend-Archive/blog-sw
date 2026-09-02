import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * 디자인 시스템의 타이포 사다리 (globals.css 의 --text-* 와 같은 목록).
 *
 * tailwind-merge 는 모르는 text-* 클래스를 "텍스트 색"으로 분류한다. 그대로 두면
 * text-12 뒤에 text-secondary-foreground 같은 색 클래스가 오는 순간 크기가 통째로
 * 지워진다. 실제로 뱃지와 버튼이 크기를 잃고 16px 로 떨어졌다.
 * 폰트 크기 그룹에 명시적으로 등록해 색으로 오인되지 않게 한다.
 */
const FONT_SIZES = Array.from({ length: 19 }, (_, index) => String(12 + index * 2));

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: FONT_SIZES }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
