import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  /** 제목 아래 한 줄 설명. 페이지마다 크기가 달라지지 않게 여기서만 정한다. */
  description?: ReactNode;
  /** 상위 목록으로 돌아가는 링크 */
  back?: { href: string; label: string };
  /** 제목 위에 붙는 배지나 날짜 등 */
  eyebrow?: ReactNode;
  children?: ReactNode;
}

export function PageHeader({ title, description, back, eyebrow, children }: PageHeaderProps) {
  return (
    <>
      {back ? (
        <nav className="pt-12">
          <Link
            href={back.href}
            className="inline-flex items-center gap-1 text-14 text-muted-foreground transition-colors hover:text-brand"
          >
            <ChevronLeft className="size-4" aria-hidden />
            {back.label}
          </Link>
        </nav>
      ) : null}

      <header className={back ? 'pt-8 pb-12' : 'pt-20 pb-12'}>
        {eyebrow ? <div className="mb-4 flex items-center gap-3">{eyebrow}</div> : null}
        <h1 className="text-30 font-semibold tracking-tight">{title}</h1>
        {description ? (
          <p className="mt-3 max-w-3xl text-16 leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : null}
        {children}
      </header>
    </>
  );
}
