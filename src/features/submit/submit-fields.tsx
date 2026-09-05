'use client';

import { ChevronDown, X } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MAX_TAGS } from './schema';

/** '리액트, 성능' → ['리액트', '성능'] */
export function parseTags(value: string): string[] {
  return value
    .split(',')
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);
}

export function FieldError({ errors }: { errors: string[] | undefined }) {
  if (!errors || errors.length === 0) return null;
  return <p className="text-14 text-destructive">{errors.join(' ')}</p>;
}

/** 라벨을 입력 위에 얹는 자리 */
export function Field({
  label,
  htmlFor,
  errors,
  children,
}: {
  label: string;
  htmlFor: string;
  errors?: string[];
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      <FieldError errors={errors} />
    </div>
  );
}

/** 라벨을 입력 왼쪽에 세우는 자리. 한 사람에 입력이 셋이라 줄 수를 아낀다. */
export function Row({
  label,
  htmlFor,
  errors,
  // 라벨 길이가 다른 자리도 있어서 열 너비만 밖에서 바꾼다.
  columns = 'sm:grid-cols-[3rem_minmax(0,1fr)]',
  children,
}: {
  label: string;
  htmlFor: string;
  errors?: string[];
  columns?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`grid gap-x-3 gap-y-1 sm:items-center ${columns}`}>
      <Label htmlFor={htmlFor} className="text-muted-foreground">
        {label}
      </Label>
      <div className="flex flex-col gap-1">
        {children}
        <FieldError errors={errors} />
      </div>
    </div>
  );
}

export function Select({
  id,
  value,
  onChange,
  children,
}: {
  id: string;
  value: number;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
}) {
  return (
    // 브라우저가 그려 주는 화살표는 오른쪽 끝에 바짝 붙고 자리도 못 옮긴다.
    // 기본 모양을 끄고 아이콘을 직접 얹어 안쪽 여백을 맞춘다.
    <div className="relative w-fit">
      <select
        id={id}
        value={value}
        onChange={onChange}
        className="h-9 w-full appearance-none rounded-md border border-input bg-background py-0 pr-9 pl-3 text-14"
      >
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
    </div>
  );
}

const MEETING_OPTIONS = [
  { value: 'off-line', label: '오프라인' },
  { value: 'on-line', label: '온라인' },
] as const;

/**
 * 진행 방식은 둘 중 하나라 펼쳐 두는 편이 낫다.
 *
 * 라디오 위에 모양만 입힌다. 자바스크립트 없이도 눌리고, 화살표 키 이동과
 * 스크린 리더 안내가 그대로 살아 있다.
 */
export function MeetingType({
  defaultValue,
  idPrefix,
}: {
  defaultValue: 'on-line' | 'off-line';
  idPrefix: string;
}) {
  return (
    <div className="inline-flex h-9 w-fit items-center rounded-lg bg-muted p-1">
      {MEETING_OPTIONS.map((option, index) => (
        <label key={option.value} className="cursor-pointer">
          <input
            id={index === 0 ? `${idPrefix}type` : undefined}
            type="radio"
            name="type"
            value={option.value}
            defaultChecked={defaultValue === option.value}
            className="peer sr-only"
          />
          <span className="flex h-7 items-center rounded-md px-3 text-14 text-muted-foreground transition-colors peer-checked:bg-background peer-checked:font-medium peer-checked:text-foreground peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand">
            {option.label}
          </span>
        </label>
      ))}
    </div>
  );
}

/**
 * 태그를 칩으로 넣는 입력.
 *
 * 쉼표로 구분해 적게 하면 몇 개를 넣었는지, 어디가 한 태그인지 눈으로 세야 한다.
 * 서버로는 예전처럼 쉼표로 이어 보내 폼 스키마를 그대로 둔다.
 */
export function TagInput({
  name,
  id,
  defaultValue,
  onChange,
}: {
  name: string;
  id: string;
  defaultValue: string;
  /** 바깥에서 이 자리가 비었는지 판단할 때 쓴다. */
  onChange?: (tags: string[]) => void;
}) {
  const [tags, setTags] = useState(() => parseTags(defaultValue));
  const [draft, setDraft] = useState('');
  const full = tags.length >= MAX_TAGS;

  // 상태를 바꾸는 자리가 셋이라, 바깥에 알리는 일도 한곳에 모아 둔다.
  const update = (next: string[]) => {
    setTags(next);
    onChange?.(next);
  };

  const add = () => {
    const value = draft.trim();
    if (!value || full || tags.includes(value)) {
      setDraft('');
      return;
    }
    update([...tags, value]);
    setDraft('');
  };

  return (
    <div className="flex flex-col gap-2">
      <input type="hidden" name={name} value={tags.join(', ')} />

      <Input
        id={id}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ',') {
            // Enter 로 폼이 제출되지 않게 막고 칩으로 넘긴다.
            event.preventDefault();
            add();
          }
          if (event.key === 'Backspace' && draft === '' && tags.length > 0) {
            update(tags.slice(0, -1));
          }
        }}
        onBlur={add}
        disabled={full}
        placeholder={full ? `${MAX_TAGS}개까지 넣을 수 있습니다` : '입력 후 Enter'}
      />

      {tags.length > 0 ? (
        <ul className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <li key={tag}>
              <span className="inline-flex items-center gap-1 rounded-md bg-muted py-0.5 pr-1 pl-2 text-14">
                {tag}
                <button
                  type="button"
                  onClick={() => update(tags.filter((item) => item !== tag))}
                  aria-label={`${tag} 태그 빼기`}
                  className="cursor-pointer rounded p-0.5 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <X className="size-3" aria-hidden />
                </button>
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
