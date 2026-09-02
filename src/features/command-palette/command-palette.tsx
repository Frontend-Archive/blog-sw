'use client';

import { ExternalLink, Hash, Layers, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import type { CommandPaletteData } from '@/lib/archive/command-data';
import { formatArchiveDate } from '@/lib/format';
import { highlight } from './highlight';

interface CommandPaletteProps {
  data: CommandPaletteData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * cmdk 기본 점수 계산은 한글 조합을 잘 못 다뤄서 부분 문자열 포함 여부로 대체한다.
 * value 에 검색 대상 문자열을 통째로 넣어두고 여기서 판정한다.
 */
function matches(value: string, search: string): number {
  if (!search) return 1;
  const terms = search.toLowerCase().split(/\s+/).filter(Boolean);
  const target = value.toLowerCase();
  return terms.every((term) => target.includes(term)) ? 1 : 0;
}

export function CommandPalette({ data, open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const terms = search.trim().toLowerCase().split(/\s+/).filter(Boolean);

  const run = useCallback(
    (action: () => void) => {
      onOpenChange(false);
      action();
    },
    [onOpenChange],
  );

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="검색"
      description="아티클, 태그, 멤버, 회차를 검색합니다."
      className="sm:max-w-2xl"
    >
      <Command filter={matches}>
        <CommandInput
          value={search}
          onValueChange={setSearch}
          placeholder="아티클, 태그, 멤버, 회차 검색"
        />
        <CommandList className="h-96 max-h-none">
          <CommandEmpty>결과가 없습니다.</CommandEmpty>

          <CommandGroup heading="아티클">
            {data.articles.map((article) => (
              <CommandItem
                key={article.key}
                value={article.searchText}
                onSelect={() =>
                  run(() => window.open(article.url, '_blank', 'noopener,noreferrer'))
                }
              >
                <ExternalLink className="size-4 shrink-0" aria-hidden />
                <span className="min-w-0 flex-1 truncate">{highlight(article.title, terms)}</span>
                <span className="shrink-0 text-14 text-muted-foreground">{article.author}</span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="태그">
            {data.tags.map(({ tag, slug, count }) => (
              <CommandItem
                key={slug}
                value={`${tag} 태그 tag`}
                onSelect={() => run(() => router.push(`/tags/${slug}`))}
              >
                <Hash className="size-4 shrink-0" aria-hidden />
                <span className="min-w-0 flex-1 truncate">{highlight(tag, terms)}</span>
                <span className="shrink-0 text-14 text-muted-foreground tabular-nums">{count}</span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="멤버">
            {data.members.map(({ author, slug }) => (
              <CommandItem
                key={slug}
                value={`${author} 멤버 member`}
                onSelect={() => run(() => router.push(`/members/${slug}`))}
              >
                <User className="size-4 shrink-0" aria-hidden />
                <span className="min-w-0 flex-1 truncate">{highlight(author, terms)}</span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="회차">
            {data.archives.map(({ id, title, date }) => (
              <CommandItem
                key={id}
                value={`${title} ${id}회차 ${date}`}
                onSelect={() => run(() => router.push(`/archives/${id}`))}
              >
                <Layers className="size-4 shrink-0" aria-hidden />
                <span className="min-w-0 flex-1 truncate">{highlight(title, terms)}</span>
                <span className="shrink-0 text-14 text-muted-foreground tabular-nums">
                  {formatArchiveDate(date)}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}

/** ⌘K / Ctrl+K 로 팔레트를 여는 전역 단축키 */
export function useCommandPaletteShortcut(onOpen: () => void): void {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        onOpen();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onOpen]);
}

export function useCommandPaletteState() {
  const [open, setOpen] = useState(false);
  const openPalette = useCallback(() => setOpen(true), []);
  useCommandPaletteShortcut(openPalette);
  return { open, setOpen, openPalette };
}
