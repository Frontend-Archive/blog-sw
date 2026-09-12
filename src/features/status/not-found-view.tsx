'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BrandMark } from '@/components/icons/brand-mark';
import { Button } from '@/components/ui/button';
import { StatusScreen } from './status-screen';

/** 없는 주소 화면. 가운데 0 이 사이트 마크다. */
export function NotFoundView() {
  const path = usePathname();

  return (
    <StatusScreen
      glyphs={['4', <BrandMark key="mark" idPrefix="not-found" className="size-[0.78em]" />, '4']}
      title="페이지를 찾을 수 없습니다"
      note={path}
      actions={
        <>
          <Button asChild size="lg">
            <Link href="/">전체 아티클 보기</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/tags">태그로 찾기</Link>
          </Button>
        </>
      }
    />
  );
}
