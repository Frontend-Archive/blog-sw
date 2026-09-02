import { FileText, Hash, PenLine, Tag, Users } from 'lucide-react';
import {
  MockContent,
  NavLinks,
  SearchTrigger,
  ThemeTrigger,
  Wordmark,
  type GnbVariantProps,
} from './shared';

const ICONS = [FileText, Hash, Tag, Users, PenLine] as const;

/** 09. 사이드 레일 — 상단 바를 없애고 내비를 왼쪽 세로줄로 세운다 */
export function SideRailGnb({ items, activeHref }: GnbVariantProps) {
  return (
    <div className="flex h-full">
      <div className="flex w-52 shrink-0 flex-col gap-6 border-r border-border/60 p-6">
        <Wordmark />
        <nav className="flex flex-col gap-1 text-14">
          {items.map(({ href, label }, index) => {
            const Icon = ICONS[index % ICONS.length] ?? FileText;
            return (
              <span
                key={href}
                className={`inline-flex items-center gap-3 rounded-md px-3 py-2 ${
                  href === activeHref ? 'bg-accent font-medium text-brand' : 'text-muted-foreground'
                }`}
              >
                <Icon className="size-4" aria-hidden />
                {label}
              </span>
            );
          })}
        </nav>
        <span className="mt-auto flex items-center gap-2">
          <ThemeTrigger />
        </span>
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-14 items-center border-b border-border/60 px-6">
          <span className="w-64">
            <SearchTrigger full />
          </span>
        </div>
        <MockContent />
      </div>
    </div>
  );
}

/** 10. 하단 바 — 상단에는 브랜드만, 이동은 화면 아래에서 한다 */
export function BottomBarGnb({ items, activeHref }: GnbVariantProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center border-b border-border/60 px-6">
        <Wordmark />
        <span className="ml-auto flex items-center gap-2">
          <SearchTrigger />
          <ThemeTrigger />
        </span>
      </div>
      <MockContent className="flex-1" />
      <nav className="grid grid-cols-5 border-t border-border/60 bg-card">
        {items.map(({ href, label }, index) => {
          const Icon = ICONS[index % ICONS.length] ?? FileText;
          return (
            <span
              key={href}
              className={`flex flex-col items-center gap-1 py-3 text-14 ${
                href === activeHref ? 'font-medium text-brand' : 'text-muted-foreground'
              }`}
            >
              <Icon className="size-4" aria-hidden />
              {label}
            </span>
          );
        })}
      </nav>
    </div>
  );
}

/** 08 보조 — 드로어 시안은 화면 프레임이 필요해 여기서 다시 내보낸다 */
export { DrawerGnb } from './bars';

/** 참고: NavLinks 를 이 파일에서도 쓸 수 있게 재수출 */
export { NavLinks };
