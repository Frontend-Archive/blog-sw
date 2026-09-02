'use client';

import { CircleCheck, CircleX, Loader2 } from 'lucide-react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { OpenSlot } from '@/lib/archive/model';
import { formatArchiveDate } from '@/lib/format';
import { submitArticle } from './actions';
import { MAX_TAGS, type SubmitResult } from './schema';
import { SubmitStatus } from './submit-status';

interface SubmitFormProps {
  author: string;
  openSlots: OpenSlot[];
  nextArchiveId: number;
}

function FieldError({ errors }: { errors: string[] | undefined }) {
  if (!errors || errors.length === 0) return null;
  return <p className="text-12 text-destructive">{errors.join(' ')}</p>;
}

function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="gap-2">
      {pending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
      {children}
    </Button>
  );
}

function ResultBanner({ result }: { result: SubmitResult | null }) {
  if (!result) return null;
  const Icon = result.ok ? CircleCheck : CircleX;
  return (
    <p
      aria-live="polite"
      className={`flex items-center gap-2 text-14 ${result.ok ? 'text-foreground' : 'text-destructive'}`}
    >
      <Icon className="size-4 shrink-0" aria-hidden />
      {result.message}
    </p>
  );
}

export function SubmitForm({ author, openSlots, nextArchiveId }: SubmitFormProps) {
  const [result, formAction] = useActionState<SubmitResult | null, FormData>(submitArticle, null);
  const fieldErrors = result?.fieldErrors ?? {};

  if (result?.ok && result.pending) {
    return (
      <div className="flex flex-col gap-4">
        <ResultBanner result={result} />
        <SubmitStatus pending={result.pending} />
      </div>
    );
  }

  return (
    <Tabs defaultValue="fill-slot" className="gap-6">
      <TabsList>
        <TabsTrigger value="fill-slot">내 자리 채우기</TabsTrigger>
        <TabsTrigger value="new-archive">새 회차 열기</TabsTrigger>
      </TabsList>

      <TabsContent value="fill-slot">
        {openSlots.length === 0 ? (
          <p className="text-16 leading-relaxed text-muted-foreground">
            {author} 님이 채울 빈 자리가 없습니다. 새 회차를 먼저 열어 주세요.
          </p>
        ) : (
          <form action={formAction} className="flex flex-col gap-5">
            <input type="hidden" name="mode" value="fill-slot" />

            <div className="flex flex-col gap-2">
              <Label htmlFor="archiveId">회차</Label>
              <select
                id="archiveId"
                name="archiveId"
                required
                defaultValue={openSlots[0]?.archiveId}
                className="h-9 rounded-md border border-input bg-background px-3 text-14"
              >
                {openSlots.map((slot) => (
                  <option key={slot.archiveId} value={slot.archiveId}>
                    {slot.archiveTitle} · {formatArchiveDate(slot.date)}
                  </option>
                ))}
              </select>
              <FieldError errors={fieldErrors.archiveId} />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="title">제목</Label>
              <Input id="title" name="title" required maxLength={200} placeholder="글 제목" />
              <FieldError errors={fieldErrors.title} />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="url">링크</Label>
              <Input
                id="url"
                name="url"
                type="url"
                required
                inputMode="url"
                placeholder="https://"
              />
              <FieldError errors={fieldErrors.url} />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="tags">태그</Label>
              <Input id="tags" name="tags" placeholder="쉼표로 구분. 예: React, 성능 개선" />
              <p className="text-12 text-muted-foreground">최대 {MAX_TAGS}개</p>
              <FieldError errors={fieldErrors.tags} />
            </div>

            <div className="flex items-center gap-4">
              <SubmitButton>등록</SubmitButton>
              <ResultBanner result={result} />
            </div>
          </form>
        )}
      </TabsContent>

      <TabsContent value="new-archive">
        <form action={formAction} className="flex flex-col gap-5">
          <input type="hidden" name="mode" value="new-archive" />

          <p className="text-16 leading-relaxed text-muted-foreground">
            {nextArchiveId}회차를 만들고 멤버 자리를 비워 둡니다. 각자 나중에 채우면 됩니다.
          </p>

          <div className="flex flex-col gap-2">
            <Label htmlFor="date">진행일</Label>
            <Input id="date" name="date" type="date" required />
            <FieldError errors={fieldErrors.date} />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="type">진행 방식</Label>
            <select
              id="type"
              name="type"
              required
              defaultValue="off-line"
              className="h-9 rounded-md border border-input bg-background px-3 text-14"
            >
              <option value="off-line">오프라인</option>
              <option value="on-line">온라인</option>
            </select>
            <FieldError errors={fieldErrors.type} />
          </div>

          <div className="flex items-center gap-4">
            <SubmitButton>회차 만들기</SubmitButton>
            <ResultBanner result={result} />
          </div>
        </form>
      </TabsContent>
    </Tabs>
  );
}
