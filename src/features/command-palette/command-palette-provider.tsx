'use client';

import { createContext, use, useCallback, useState } from 'react';
import type { CommandPaletteData } from '@/lib/archive/command-data';
import { CommandPalette, useCommandPaletteShortcut } from './command-palette';

/**
 * 팔레트는 앱에 하나만 둔다.
 *
 * 상단 검색 버튼과 모바일 하단 바가 같은 팔레트를 연다. 각자 띄우게 하면
 * ⌘K 를 눌렀을 때 둘이 함께 열리고, 열린 쪽이 어느 것인지도 알 수 없다.
 */
const CommandPaletteContext = createContext<(() => void) | null>(null);

export function CommandPaletteProvider({
  data,
  children,
}: {
  data: CommandPaletteData;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const openPalette = useCallback(() => setOpen(true), []);
  useCommandPaletteShortcut(openPalette);

  return (
    <CommandPaletteContext value={openPalette}>
      {children}
      <CommandPalette data={data} open={open} onOpenChange={setOpen} />
    </CommandPaletteContext>
  );
}

export function useCommandPalette(): () => void {
  const openPalette = use(CommandPaletteContext);
  if (!openPalette) {
    throw new Error('CommandPaletteProvider 안에서만 쓸 수 있습니다.');
  }
  return openPalette;
}
