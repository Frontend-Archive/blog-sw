'use client';

import { Search } from 'lucide-react';
import type { CommandPaletteData } from '@/lib/archive/command-data';
import { CommandPalette, useCommandPaletteState } from './command-palette';

interface CommandPaletteTriggerProps {
  data: CommandPaletteData;
}

export function CommandPaletteTrigger({ data }: CommandPaletteTriggerProps) {
  const { open, setOpen, openPalette } = useCommandPaletteState();

  return (
    <>
      <button
        type="button"
        onClick={openPalette}
        aria-label="검색 열기"
        className="flex h-9 items-center gap-2 rounded-lg border border-input pr-2 pl-3 text-14 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      >
        <Search className="size-4" aria-hidden />
        <span className="hidden sm:inline">검색</span>
        {/* 버튼 높이(36) 안에 들어가도록 20px 로 고정한다. */}
        <kbd className="ml-4 hidden h-5 items-center rounded border border-border bg-muted px-1 font-mono text-14 leading-none sm:inline-flex">
          ⌘K
        </kbd>
      </button>
      <CommandPalette data={data} open={open} onOpenChange={setOpen} />
    </>
  );
}
