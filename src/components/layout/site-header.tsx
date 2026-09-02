import Link from 'next/link';
import { SiteNav } from '@/components/layout/site-nav';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { CommandPaletteTrigger } from '@/features/command-palette/command-palette-trigger';
import { buildCommandPaletteData } from '@/lib/archive/command-data';

export function SiteHeader() {
  const commandData = buildCommandPaletteData();

  return (
    <header
      data-site-header
      className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur"
    >
      <div className="mx-auto flex h-(--header-height) w-full max-w-6xl items-center gap-8 px-6">
        <Link href="/" className="text-16 font-semibold tracking-tight">
          Frontend Archive
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
