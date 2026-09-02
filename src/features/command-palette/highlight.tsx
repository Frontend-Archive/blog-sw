'use client';

import { Fragment, type ReactNode } from 'react';

/**
 * 검색어와 일치하는 조각을 포인트 색으로 칠한다.
 *
 * 정규식을 만들지 않고 인덱스로 자른다. 태그에 (), +, * 같은 문자가 들어갈 수 있어
 * 사용자 입력을 그대로 패턴에 넣으면 깨지기 때문이다.
 */
export function highlight(text: string, terms: string[]): ReactNode {
  const needles = terms.map((term) => term.trim().toLowerCase()).filter(Boolean);
  if (needles.length === 0) return text;

  const haystack = text.toLowerCase();
  const hits: [number, number][] = [];

  for (const needle of needles) {
    let from = 0;
    for (;;) {
      const at = haystack.indexOf(needle, from);
      if (at === -1) break;
      hits.push([at, at + needle.length]);
      from = at + needle.length;
    }
  }
  if (hits.length === 0) return text;

  // 겹치는 구간을 하나로 합친다.
  hits.sort((a, b) => a[0] - b[0]);
  const merged: [number, number][] = [];
  for (const [start, end] of hits) {
    const last = merged.at(-1);
    if (last && start <= last[1]) {
      last[1] = Math.max(last[1], end);
    } else {
      merged.push([start, end]);
    }
  }

  const parts: ReactNode[] = [];
  let cursor = 0;
  merged.forEach(([start, end], index) => {
    if (start > cursor) parts.push(text.slice(cursor, start));
    parts.push(
      <mark key={`${start}-${index}`} className="bg-transparent font-medium text-brand">
        {text.slice(start, end)}
      </mark>,
    );
    cursor = end;
  });
  if (cursor < text.length) parts.push(text.slice(cursor));

  return parts.map((part, index) => <Fragment key={index}>{part}</Fragment>);
}
