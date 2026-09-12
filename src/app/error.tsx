'use client';

import { useEffect } from 'react';
import { ErrorView } from '@/features/status/error-view';

interface ErrorPageProps {
  error: Error & { digest?: string };
  retry: () => void;
}

/**
 * 페이지를 그리다 실패했을 때.
 *
 * 대부분의 화면은 빌드 때 굳어서 여기까지 올 일이 드물다. 오는 곳은 세션을 읽는
 * 글 관리처럼 요청마다 그리는 화면이다.
 */
export default function ErrorPage({ error, retry }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 pb-24">
      <ErrorView digest={error.digest} onRetry={retry} />
    </main>
  );
}
