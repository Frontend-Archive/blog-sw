import type { Metadata } from 'next';
import { NotFoundView } from '@/features/status/not-found-view';

export const metadata: Metadata = {
  title: '페이지를 찾을 수 없습니다',
  robots: { index: false, follow: true },
};

/**
 * 없는 주소와 notFound() 가 모두 여기로 온다.
 *
 * 글 주소는 회차와 멤버 id 로 만들어서, 멤버 id 가 바뀌거나 회차가 지워지면
 * 예전 링크가 이리로 떨어진다. 막다른 길이 되지 않게 갈 곳을 둘 준다.
 */
export default function NotFound() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 pb-24">
      <NotFoundView />
    </main>
  );
}
