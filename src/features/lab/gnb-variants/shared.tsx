import { Menu, Moon, Search } from 'lucide-react';

export interface NavItem {
  href: string;
  label: string;
}

export interface GnbVariantProps {
  items: NavItem[];
  /** 활성 표시를 볼 수 있게 시안에서는 하나를 고정으로 켜둔다. */
  activeHref: string;
}

export interface GnbVariant {
  id: string;
  name: string;
  note: string;
  /**
   * bar 는 헤더 띠만 보여주면 되고, screen 은 페이지 전체 구조가 바뀌므로
   * 가짜 화면 안에 넣어야 배치가 읽힌다.
   */
  frame: 'bar' | 'screen';
  Component: (props: GnbVariantProps) => React.ReactNode;
}

/**
 * 검색과 테마는 생김새만 흉내 낸 껍데기다.
 * 실제 팔레트를 여러 개 띄우면 단축키가 서로 충돌한다.
 */
export function SearchTrigger({ full = false }: { full?: boolean }) {
  return (
    <span
      className={`flex h-9 items-center gap-2 rounded-lg border border-input px-3 text-14 text-muted-foreground ${
        full ? 'w-full' : ''
      }`}
    >
      <Search className="size-4 shrink-0" aria-hidden />
      <span className="truncate">{full ? '제목, 작성자, 태그로 검색' : '검색'}</span>
      <kbd className="ml-auto hidden h-5 shrink-0 items-center rounded border border-border bg-muted px-1 font-mono text-14 sm:inline-flex">
        ⌘K
      </kbd>
    </span>
  );
}

export function ThemeTrigger() {
  return (
    <span className="flex size-9 shrink-0 items-center justify-center rounded-md text-muted-foreground">
      <Moon className="size-4" aria-hidden />
    </span>
  );
}

export function MenuTrigger() {
  return (
    <span className="flex size-9 shrink-0 items-center justify-center rounded-md text-muted-foreground">
      <Menu className="size-4" aria-hidden />
    </span>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={`shrink-0 font-semibold tracking-tight ${className ?? 'text-16'}`}>
      Frontend Archive
    </span>
  );
}

export function NavLinks({
  items,
  activeHref,
  className,
  itemClassName,
}: GnbVariantProps & { className?: string; itemClassName?: string }) {
  return (
    <nav className={className ?? 'flex items-center gap-5 text-14'}>
      {items.map(({ href, label }) => (
        <span
          key={href}
          className={`${itemClassName ?? ''} ${
            href === activeHref ? 'font-medium text-brand' : 'text-muted-foreground'
          }`}
        >
          {label}
        </span>
      ))}
    </nav>
  );
}

/** 배치를 가늠할 수 있게 깔아두는 가짜 본문 */
export function MockContent({ className }: { className?: string }) {
  return (
    <div className={`flex flex-col gap-3 p-6 ${className ?? ''}`} aria-hidden>
      <span className="h-5 w-2/5 rounded bg-muted" />
      <div className="grid grid-cols-3 gap-3">
        <span className="h-16 rounded-lg bg-muted" />
        <span className="h-16 rounded-lg bg-muted" />
        <span className="h-16 rounded-lg bg-muted" />
      </div>
    </div>
  );
}
