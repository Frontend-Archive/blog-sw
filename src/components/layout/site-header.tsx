import Link from 'next/link';
import { ThemeToggle } from '@/components/layout/theme-toggle';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-6">
        <Link href="/" className="font-medium tracking-tight">
          Frontend Archive
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
