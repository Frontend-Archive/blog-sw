'use client';

import { Search } from 'lucide-react';
import { useCommandPalette } from './command-palette-provider';

/** 상단 검색 버튼. 모바일에서는 하단 바가 대신하므로 숨긴다. */
export function CommandPaletteTrigger() {
  const openPalette = useCommandPalette();

  return (
    <button
      type="button"
      onClick={openPalette}
      aria-label="검색 열기"
      className="hidden h-9 items-center gap-2 rounded-lg border border-input pr-2 pl-3 text-14 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground md:flex"
    >
      <Search className="size-4" aria-hidden />
      <span>검색</span>
      {/* 버튼 높이(36) 안에 들어가도록 20px 로 고정한다. */}
      <kbd className="ml-4 inline-flex h-5 items-center rounded border border-border bg-muted px-1 font-mono text-14 leading-none">
        ⌘K
      </kbd>
    </button>
  );
}
