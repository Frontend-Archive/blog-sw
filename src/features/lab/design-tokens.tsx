const TEXT_SCALE = [14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 36, 40, 48] as const;
const SPACE_SCALE = [1, 2, 3, 4, 6, 8, 12, 16, 20, 24] as const;

const COLORS = [
  { token: 'background', className: 'bg-background', note: '페이지 바탕' },
  { token: 'card', className: 'bg-card', note: '카드 바탕' },
  { token: 'muted', className: 'bg-muted', note: '보조 영역' },
  { token: 'accent', className: 'bg-accent', note: '호버 배경' },
  { token: 'border', className: 'bg-border', note: '테두리' },
  { token: 'foreground', className: 'bg-foreground', note: '본문' },
  { token: 'muted-foreground', className: 'bg-muted-foreground', note: '보조 텍스트' },
  { token: 'brand', className: 'bg-brand', note: '포인트 — 링크·활성·포커스' },
  { token: 'brand-subtle', className: 'bg-brand-subtle', note: '포인트 배경' },
  { token: 'destructive', className: 'bg-destructive', note: '오류' },
] as const;

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-14 font-medium text-muted-foreground">{title}</h3>
      {children}
    </div>
  );
}

export function DesignTokens() {
  return (
    <section id="tokens" className="scroll-mt-20">
      <header className="mb-8 flex flex-col gap-2 border-b border-border/60 pb-4">
        <h2 className="font-semibold tracking-tight">00 · 디자인 토큰</h2>
        <p className="text-14 text-muted-foreground">
          텍스트는 12px 부터 2px 씩 오르는 한 벌만 쓰고, 12px 은 가독성 때문에 쓰지 않는다. 간격은
          4의 배수만. 색은 무채색에 포인트 하나.
        </p>
      </header>

      <div className="flex flex-col gap-12">
        <Block title="타이포그래피">
          <div className="flex flex-col gap-3">
            {TEXT_SCALE.map((size) => (
              <div key={size} className="flex items-baseline gap-4 border-b border-border/40 pb-3">
                <code className="w-16 shrink-0 text-14 text-muted-foreground">text-{size}</code>
                <span className="truncate" style={{ fontSize: `${size / 16}rem`, lineHeight: 1.3 }}>
                  읽고, 쓰고, 나눈 것들 Archive 0123
                </span>
              </div>
            ))}
          </div>
        </Block>

        <Block title="간격 (4의 배수)">
          <div className="flex flex-col gap-2">
            {SPACE_SCALE.map((step) => (
              <div key={step} className="flex items-center gap-4">
                <code className="w-16 shrink-0 text-14 text-muted-foreground">{step}</code>
                <span className="w-12 shrink-0 text-14 text-muted-foreground tabular-nums">
                  {step * 4}px
                </span>
                <span
                  className="h-4 rounded-sm bg-brand/60"
                  style={{ width: `${step * 4}px` }}
                  aria-hidden
                />
              </div>
            ))}
          </div>
        </Block>

        <Block title="컬러">
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {COLORS.map(({ token, className, note }) => (
              <li key={token} className="flex items-center gap-4">
                <span
                  className={`size-12 shrink-0 rounded-lg border border-border/60 ${className}`}
                  aria-hidden
                />
                <span className="flex min-w-0 flex-col">
                  <code className="truncate text-14">{token}</code>
                  <span className="truncate text-14 text-muted-foreground">{note}</span>
                </span>
              </li>
            ))}
          </ul>
        </Block>
      </div>
    </section>
  );
}
