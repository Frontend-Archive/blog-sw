import { PenLine } from 'lucide-react';

interface EmptySlotCardProps {
  author: string;
}

/**
 * 회차를 먼저 열어두고 발표자가 순차적으로 채우는 방식이라
 * 아직 안 채워진 자리도 감추지 않고 그대로 보여준다.
 */
export function EmptySlotCard({ author }: EmptySlotCardProps) {
  return (
    <div className="flex min-h-40 flex-col justify-between rounded-xl border border-dashed border-border/70 p-5 text-muted-foreground">
      <span className="text-12 font-medium text-foreground/70">{author}</span>
      <span className="inline-flex items-center gap-1 text-14">
        <PenLine className="size-4" aria-hidden />
        작성 예정
      </span>
    </div>
  );
}
