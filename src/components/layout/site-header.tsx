import Link from 'next/link';
import { BrandMark } from '@/components/icons/brand-mark';
import { SiteNav } from '@/components/layout/site-nav';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { CommandPaletteTrigger } from '@/features/command-palette/command-palette-trigger';

export function SiteHeader() {
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
          <span>Frontend Archive</span>
        </Link>
        <SiteNav />
        <div className="ml-auto flex items-center gap-2">
          <CommandPaletteTrigger />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
