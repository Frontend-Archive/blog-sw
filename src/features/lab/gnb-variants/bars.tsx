import {
  MenuTrigger,
  MockContent,
  NavLinks,
  SearchTrigger,
  ThemeTrigger,
  Wordmark,
  type GnbVariantProps,
} from './shared';

/** 01. 좌측 집약 — 로고와 내비를 왼쪽에 붙이고 액션만 오른쪽 */
export function LeftClusterGnb(props: GnbVariantProps) {
  return (
    <div className="flex h-16 items-center gap-8 px-6">
      <Wordmark />
      <NavLinks {...props} />
      <span className="ml-auto flex items-center gap-2">
        <SearchTrigger />
        <ThemeTrigger />
      </span>
    </div>
  );
}

/** 02. 3분할 — 로고·내비·액션이 각각 3분의 1을 차지한다 */
export function ThirdsGnb(props: GnbVariantProps) {
  return (
    <div className="grid h-16 grid-cols-3 items-center px-6">
      <Wordmark />
      <NavLinks {...props} className="flex items-center justify-center gap-5 text-14" />
      <span className="flex items-center justify-end gap-2">
        <SearchTrigger />
        <ThemeTrigger />
      </span>
    </div>
  );
}

/** 03. 우측 집약 — 로고만 왼쪽, 내비와 액션이 모두 오른쪽 */
export function RightClusterGnb(props: GnbVariantProps) {
  return (
    <div className="flex h-16 items-center px-6">
      <Wordmark />
      <span className="ml-auto flex items-center gap-6">
        <NavLinks {...props} />
        <span className="flex items-center gap-2">
          <SearchTrigger />
          <ThemeTrigger />
        </span>
      </span>
    </div>
  );
}

/** 04. 2단 — 위는 브랜드와 액션, 아래는 내비가 폭을 다 쓴다 */
export function TwoRowGnb(props: GnbVariantProps) {
  return (
    <div className="flex flex-col">
      <div className="flex h-14 items-center px-6">
        <Wordmark className="text-18" />
        <span className="ml-auto flex items-center gap-2">
          <SearchTrigger />
          <ThemeTrigger />
        </span>
      </div>
      <NavLinks
        {...props}
        className="flex h-11 items-center gap-6 border-t border-border/60 px-6 text-14"
      />
    </div>
  );
}

/** 05. 로고 중앙 — 내비 왼쪽, 로고 가운데, 액션 오른쪽으로 대칭을 잡는다 */
export function CenterWordmarkGnb(props: GnbVariantProps) {
  return (
    <div className="grid h-16 grid-cols-3 items-center px-6">
      <NavLinks {...props} />
      <span className="flex justify-center">
        <Wordmark />
      </span>
      <span className="flex items-center justify-end gap-2">
        <SearchTrigger />
        <ThemeTrigger />
      </span>
    </div>
  );
}

/** 06. 검색 확장 — 검색이 헤더 가운데를 통째로 차지하고 내비는 메뉴로 접힌다 */
export function SearchLedGnb() {
  return (
    <div className="flex h-16 items-center gap-6 px-6">
      <Wordmark />
      <span className="min-w-0 flex-1">
        <SearchTrigger full />
      </span>
      <span className="flex items-center gap-2">
        <ThemeTrigger />
        <MenuTrigger />
      </span>
    </div>
  );
}

/** 07. 스크롤 축소 — 처음엔 크게 펼쳐지고 스크롤하면 한 줄로 줄어든다 */
export function ShrinkOnScrollGnb(props: GnbVariantProps) {
  return (
    <div className="flex flex-col">
      <div className="border-b border-dashed border-border/60">
        <p className="px-6 pt-3 text-14 text-muted-foreground">스크롤 전</p>
        <div className="flex h-24 items-end justify-between px-6 pb-4">
          <Wordmark className="text-24" />
          <span className="flex items-center gap-2">
            <SearchTrigger />
            <ThemeTrigger />
          </span>
        </div>
        <NavLinks {...props} className="flex h-11 items-center gap-6 px-6 text-14" />
      </div>
      <div>
        <p className="px-6 pt-3 text-14 text-muted-foreground">스크롤 후</p>
        <div className="flex h-14 items-center gap-6 px-6">
          <Wordmark />
          <NavLinks {...props} className="flex items-center gap-5 text-14" />
          <span className="ml-auto flex items-center gap-2">
            <SearchTrigger />
            <ThemeTrigger />
          </span>
        </div>
      </div>
    </div>
  );
}

/** 08. 드로어 — 헤더에는 로고와 메뉴만, 내비는 옆에서 밀려 나온다 */
export function DrawerGnb(props: GnbVariantProps) {
  return (
    <div className="relative h-full">
      <div className="flex h-16 items-center border-b border-border/60 px-6">
        <Wordmark />
        <span className="ml-auto flex items-center gap-2">
          <SearchTrigger />
          <MenuTrigger />
        </span>
      </div>
      <MockContent />
      <div className="absolute inset-y-0 right-0 flex w-56 flex-col gap-4 border-l border-border/60 bg-card p-6 shadow-xl">
        <p className="text-14 text-muted-foreground">메뉴</p>
        <NavLinks {...props} className="flex flex-col gap-3 text-16" />
      </div>
    </div>
  );
}
