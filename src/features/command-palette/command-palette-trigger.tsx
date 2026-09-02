'use client';

import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { CommandPaletteData } from '@/lib/archive/command-data';
import { CommandPalette, useCommandPaletteState } from './command-palette';

interface CommandPaletteTriggerProps {
  data: CommandPaletteData;
}

export function CommandPaletteTrigger({ data }: CommandPaletteTriggerProps) {
  const { open, setOpen, openPalette } = useCommandPaletteState();

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={openPalette}
        aria-label="검색 열기"
        className="h-8 gap-2 px-2.5 font-normal text-muted-foreground sm:pr-1.5"
      >
        <Search className="size-4" aria-hidden />
        <span className="hidden sm:inline">검색</span>
        <kbd className="hidden rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline">
          ⌘K
        </kbd>
      </Button>
      <CommandPalette data={data} open={open} onOpenChange={setOpen} />
    </>
  );
}
