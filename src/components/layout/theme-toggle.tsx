'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

/**
 * 누를 때마다 라이트와 다크를 오간다.
 *
 * resolvedTheme 을 보는 이유는 아직 system 으로 남아 있는 방문자 때문이다.
 * 그 상태에서 눌러도 지금 화면과 반대되는 테마로 정확히 넘어간다.
 *
 * 아이콘은 CSS 로 바꾼다. 마운트 여부를 상태로 들고 있으면 Next 16 의
 * react-hooks/set-state-in-effect 에 걸리고, 하이드레이션 전에 잘못된 아이콘이 보인다.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="테마 전환"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
    >
      <Sun className="size-4 dark:hidden" aria-hidden />
      <Moon className="hidden size-4 dark:block" aria-hidden />
    </Button>
  );
}
