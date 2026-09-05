import Link from 'next/link';
import { BrandMark } from '@/components/icons/brand-mark';
import { SiteNav } from '@/components/layout/site-nav';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { CommandPaletteTrigger } from '@/features/command-palette/command-palette-trigger';
import { buildCommandPaletteData } from '@/lib/archive/command-data';

export function SiteHeader() {
  const commandData = buildCommandPaletteData();

  return (
    <header
      data-site-header
      className="sticky top-0 z-40 border-b border-border/50 bg-background/90 backdrop-blur-xl backdrop-saturate-150 supports-backdrop-filter:bg-background/55"
    >
      <div className="mx-auto flex h-(--header-height) w-full max-w-6xl items-center gap-8 px-6">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5 text-18 font-semibold tracking-tight"
        >
          <BrandMark idPrefix="hd" className="size-6" />
          {/* 히어로 제목과 겹쳐 보여 잠깐 빼 둔 상태. 되돌리려면 아래 한 줄을 살린다. */}
          <span className="sr-only">Frontend Archive</span>
        </Link>
        <SiteNav />
        <div className="ml-auto flex items-center gap-2">
          <CommandPaletteTrigger data={commandData} />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
