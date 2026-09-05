'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { MemberAvatar } from '@/features/members/member-avatar';
import { formatArchiveDate } from '@/lib/format';
import { cn } from '@/lib/utils';
import { MeetingType, parseTags, Row, Select, TagInput } from './submit-fields';
import type { EditableArchive, EditableSlot } from './types';

/** 회차 정보 라벨은 '진행 방식'이 가장 길다. */
export const HEAD_COLUMNS = 'sm:grid-cols-[5rem_minmax(0,1fr)]';

/**
 * 사람 한 명.
 *
 * 아직 안 쓴 자리는 이름을 흐리게 둔다. 따로 글자를 붙이면 네 줄 중 어디가
 * 비었는지 읽어야 하지만, 밝기 차이는 훑기만 해도 보인다.
 */
function Person({ slot, dimmed }: { slot: EditableSlot; dimmed: boolean }) {
  return (
    <span className={cn('flex items-center gap-2 transition-opacity', dimmed && 'opacity-30')}>
      <MemberAvatar author={slot.author} size={24} />
      <span className="text-14 font-medium">{slot.author}</span>
    </span>
  );
}

interface SlotProps {
  slot: EditableSlot;
  errors: Record<string, string[]>;
  /** 두 탭이 같은 name 을 쓰므로 id 만 갈라 둔다. */
  idPrefix: string;
  showEmptyHint: boolean;
}

/**
 * 사람 한 명의 입력 묶음.
 *
 * 왼쪽에 누구인지를 세우고 오른쪽에 입력을 모은다. 라벨도 입력 왼쪽에 두어
 * 한 사람이 세 줄로 끝나게 한다. 위에 얹으면 여섯 줄이 된다.
 */
function SlotFields({ slot, errors, idPrefix, showEmptyHint }: SlotProps) {
  const title = `title__${slot.memberId}`;
  const url = `url__${slot.memberId}`;
  const tags = `tags__${slot.memberId}`;

  // 흐리게 둘지는 지금 입력된 값으로 판단한다. 서버가 준 값만 보면 한 글자
  // 적어 넣어도 이름이 계속 죽어 있어, 무엇을 고치는 중인지 안 보인다.
  const [titleValue, setTitleValue] = useState(slot.title);
  const [urlValue, setUrlValue] = useState(slot.url);
  const [tagCount, setTagCount] = useState(() => parseTags(slot.tags).length);
  const empty = titleValue.trim() === '' && urlValue.trim() === '' && tagCount === 0;

  return (
    <div className="grid gap-4 py-6 sm:grid-cols-[7rem_minmax(0,1fr)]">
      <div className="sm:pt-2">
        <Person slot={slot} dimmed={showEmptyHint && empty} />
      </div>

      <div className="flex flex-col gap-3">
        <Row label="제목" htmlFor={`${idPrefix}${title}`} errors={errors[title]}>
          <Input
            id={`${idPrefix}${title}`}
            name={title}
            maxLength={200}
            value={titleValue}
            onChange={(event) => setTitleValue(event.target.value)}
            placeholder="비워 두면 빈 자리로 남습니다"
          />
        </Row>

        <Row label="링크" htmlFor={`${idPrefix}${url}`} errors={errors[url]}>
          <Input
            id={`${idPrefix}${url}`}
            name={url}
            type="url"
            inputMode="url"
            value={urlValue}
            onChange={(event) => setUrlValue(event.target.value)}
            placeholder="https://"
          />
        </Row>

        <Row label="태그" htmlFor={`${idPrefix}${tags}`} errors={errors[tags]}>
          <TagInput
            id={`${idPrefix}${tags}`}
            name={tags}
            defaultValue={slot.tags}
            onChange={(next) => setTagCount(next.length)}
          />
        </Row>
      </div>
    </div>
  );
}

/** 명부 순서대로 늘어놓은 사람별 입력. 수정 탭과 생성 탭이 같이 쓴다. */
export function SlotList({
  slots,
  errors,
  idPrefix = '',
  showEmptyHint = true,
}: {
  slots: EditableSlot[];
  errors: Record<string, string[]>;
  idPrefix?: string;
  showEmptyHint?: boolean;
}) {
  return (
    <div className="flex flex-col divide-y divide-border/60 border-y border-border/60">
      {slots.map((slot) => (
        <SlotFields
          key={slot.memberId}
          slot={slot}
          errors={errors}
          idPrefix={idPrefix}
          showEmptyHint={showEmptyHint}
        />
      ))}
    </div>
  );
}

interface ArchiveEditFieldsProps {
  archives: EditableArchive[];
  selected: EditableArchive;
  onSelect: (id: number) => void;
  errors: Record<string, string[]>;
}

/** 회차 정보 한 줄과 그 아래 사람별 입력 */
export function ArchiveEditFields({
  archives,
  selected,
  onSelect,
  errors,
}: ArchiveEditFieldsProps) {
  return (
    <div className="flex flex-col gap-8">
      {/* 아래 사람별 입력이 폭을 가득 쓰니, 회차 정보는 좁게 묶어 둔다.
          여기까지 넓게 늘어지면 무엇을 고치는 중인지 놓친다. */}
      <div className="flex max-w-2xl flex-col gap-3">
        <Row label="회차" htmlFor="archiveId" columns={HEAD_COLUMNS}>
          <Select
            id="archiveId"
            value={selected.id}
            onChange={(event) => onSelect(Number(event.target.value))}
          >
            {archives.map((archive) => (
              <option key={archive.id} value={archive.id}>
                {archive.title} · {formatArchiveDate(archive.date)}
              </option>
            ))}
          </Select>
        </Row>

        <Row label="진행일" htmlFor="date" errors={errors.date} columns={HEAD_COLUMNS}>
          <Input
            id="date"
            name="date"
            type="date"
            required
            defaultValue={selected.date}
            className="w-fit"
          />
        </Row>

        <Row label="진행 방식" htmlFor="type" errors={errors.type} columns={HEAD_COLUMNS}>
          <MeetingType defaultValue={selected.type} idPrefix="" />
        </Row>
      </div>

      <SlotList slots={selected.slots} errors={errors} />
    </div>
  );
}
