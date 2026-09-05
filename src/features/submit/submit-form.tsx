'use client';

import { CircleCheck, CircleX, Loader2 } from 'lucide-react';
import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { submitArticle } from './actions';
import { ArchiveEditFields, HEAD_COLUMNS, SlotList } from './archive-fields';
import { type SubmitResult } from './schema';
import { MeetingType, Row } from './submit-fields';
import { SubmitStatus } from './submit-status';
import type { EditableArchive, EditableSlot } from './types';

interface SubmitFormProps {
  archives: EditableArchive[];
  /** 새 회차에 놓일 빈 자리. 명부 순서 그대로다. */
  emptySlots: EditableSlot[];
}

function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending} className="gap-2 px-6">
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

export function SubmitForm({ archives, emptySlots }: SubmitFormProps) {
  const [result, formAction] = useActionState<SubmitResult | null, FormData>(submitArticle, null);
  const [selectedId, setSelectedId] = useState(archives[0]?.id);
  const errors = result?.fieldErrors ?? {};
  const selected = archives.find((archive) => archive.id === selectedId) ?? archives[0];

  if (result?.ok && result.pending) {
    return (
      <div className="flex flex-col gap-4">
        <ResultBanner result={result} />
        <SubmitStatus pending={result.pending} />
      </div>
    );
  }

  return (
    // 폼 안에도 세그먼트 토글(진행 방식)이 있어서, 상단까지 같은 모양이면
    // 무엇이 화면을 가르는 축인지 안 보인다. 여기는 밑줄로 가른다.
    <Tabs defaultValue="edit-archive" className="gap-8">
      <TabsList
        variant="line"
        className="h-auto w-full justify-start gap-6 border-b border-border/60 p-0"
      >
        <TabsTrigger
          value="edit-archive"
          className="flex-none px-0 pb-3 text-16 data-active:bg-transparent"
        >
          회차 수정
        </TabsTrigger>
        <TabsTrigger
          value="new-archive"
          className="flex-none px-0 pb-3 text-16 data-active:bg-transparent"
        >
          회차 생성
        </TabsTrigger>
      </TabsList>

      <TabsContent value="edit-archive">
        {selected === undefined ? (
          <p className="text-16 leading-relaxed text-muted-foreground">
            아직 회차가 없습니다. 먼저 회차를 만들어 주세요.
          </p>
        ) : (
          // 회차를 바꾸면 입력을 새로 그려야 defaultValue 가 갈린다.
          <form key={selected.id} action={formAction} className="flex flex-col gap-8">
            <input type="hidden" name="mode" value="edit-archive" />
            <input type="hidden" name="archiveId" value={selected.id} />

            <ArchiveEditFields
              archives={archives}
              selected={selected}
              onSelect={setSelectedId}
              errors={errors}
            />

            <div className="flex items-center justify-end gap-4">
              <ResultBanner result={result} />
              <SubmitButton>수정 요청</SubmitButton>
            </div>
          </form>
        )}
      </TabsContent>

      <TabsContent value="new-archive">
        <form action={formAction} className="flex flex-col gap-8">
          <input type="hidden" name="mode" value="new-archive" />

          <div className="flex max-w-2xl flex-col gap-3">
            <Row label="진행일" htmlFor="new-date" errors={errors.date} columns={HEAD_COLUMNS}>
              <Input id="new-date" name="date" type="date" required className="w-fit" />
            </Row>

            <Row label="진행 방식" htmlFor="new-type" errors={errors.type} columns={HEAD_COLUMNS}>
              <MeetingType defaultValue="off-line" idPrefix="new-" />
            </Row>
          </div>

          {/* 새 회차는 전부 빈 자리라 '빈 자리' 안내를 넷 다 붙일 이유가 없다. */}
          <SlotList slots={emptySlots} errors={errors} idPrefix="new-" showEmptyHint={false} />

          <div className="flex items-center justify-end gap-4">
            <ResultBanner result={result} />
            <SubmitButton>회차 만들기</SubmitButton>
          </div>
        </form>
      </TabsContent>
    </Tabs>
  );
}
