import { CalendarClock, FileText, History, Tag, Users, type LucideIcon } from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

/** 상단 내비. 사이트 전체 구조를 그대로 편다. */
export const NAV_ITEMS: NavItem[] = [
  { href: '/', label: '아티클', icon: FileText },
  { href: '/timeline', label: '타임라인', icon: CalendarClock },
  { href: '/tags', label: '태그', icon: Tag },
  { href: '/members', label: '멤버', icon: Users },
];

/**
 * 모바일 하단 바.
 *
 * 다섯 칸이 넘어가면 글자가 뭉개져서 자주 쓰는 것만 남긴다. 데스크톱에서
 * 화면 구석 버튼이던 '기록'이 여기서는 한 칸을 차지한다.
 */
export const BOTTOM_NAV_ITEMS: NavItem[] = [
  { href: '/', label: '아티클', icon: FileText },
  { href: '/tags', label: '태그', icon: Tag },
  { href: '/recent', label: '기록', icon: History },
];

/** '/' 만 정확히 맞춰 본다. 나머지는 하위 경로까지 같은 항목으로 본다. */
export function isNavActive(pathname: string, href: string): boolean {
  return href === '/' ? pathname === '/' : pathname.startsWith(href);
}
