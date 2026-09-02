'use client';

import { Check, Loader2, TriangleAlert } from 'lucide-react';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import type { PendingSubmission } from './schema';

const POLL_INTERVAL_MS = 5_000;
/** 커밋 + 재배포에 보통 1~2분. 그보다 넉넉히 잡고 그 뒤로는 수동 확인을 안내한다. */
const POLL_TIMEOUT_MS = 5 * 60_000;

const statusSchema = z.object({
  inArchiveRepo: z.boolean(),
  inThisDeployment: z.boolean(),
});

type Status = z.infer<typeof statusSchema>;

type Phase = 'polling' | 'done' | 'timeout';

interface SubmitStatusProps {
  pending: PendingSubmission;
}

function Step({ label, state }: { label: string; state: 'waiting' | 'done' }) {
  return (
    <li className="flex items-center gap-2 text-14">
      {state === 'done' ? (
        <Check className="size-4 shrink-0" aria-hidden />
      ) : (
        <Loader2 className="size-4 shrink-0 animate-spin text-muted-foreground" aria-hidden />
      )}
      <span className={state === 'done' ? '' : 'text-muted-foreground'}>{label}</span>
    </li>
  );
}

export function SubmitStatus({ pending }: SubmitStatusProps) {
  const [status, setStatus] = useState<Status>({
    inArchiveRepo: false,
    inThisDeployment: false,
  });
  const [phase, setPhase] = useState<Phase>('polling');

  useEffect(() => {
    const params = new URLSearchParams({
      fileName: pending.fileName,
      archiveId: String(pending.archiveId),
    });
    if (pending.url) params.set('url', pending.url);

    let cancelled = false;
    const startedAt = Date.now();

    async function poll() {
      try {
        const response = await fetch(`/api/submit/status?${params.toString()}`, {
          cache: 'no-store',
        });
        if (!response.ok || cancelled) return;

        const next = statusSchema.safeParse(await response.json());
        if (!next.success) return;

        setStatus(next.data);
        if (next.data.inThisDeployment) {
          setPhase('done');
          clearInterval(timer);
          return;
        }
      } catch {
        // 일시적인 네트워크 오류는 다음 주기에 다시 시도한다.
      }

      if (Date.now() - startedAt > POLL_TIMEOUT_MS) {
        setPhase('timeout');
        clearInterval(timer);
      }
    }

    const timer = setInterval(poll, POLL_INTERVAL_MS);
    void poll();

    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [pending.archiveId, pending.fileName, pending.url]);

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border/70 p-5">
      <ul className="flex flex-col gap-2">
        <Step label="archive 레포에 반영" state={status.inArchiveRepo ? 'done' : 'waiting'} />
        <Step label="사이트 재배포" state={status.inThisDeployment ? 'done' : 'waiting'} />
      </ul>

      {phase === 'done' ? (
        <div className="flex items-center gap-3">
          <p className="text-14">반영이 끝났습니다.</p>
          <Button size="sm" onClick={() => window.location.reload()}>
            새로고침
          </Button>
        </div>
      ) : null}

      {phase === 'timeout' ? (
        <p className="flex gap-2 text-16 leading-relaxed text-muted-foreground">
          <TriangleAlert className="mt-1 size-4 shrink-0" aria-hidden />
          아직 반영되지 않았습니다. archive 레포의 Actions 탭에서 실패한 실행이 있는지 확인해
          주세요.
        </p>
      ) : null}
    </div>
  );
}
