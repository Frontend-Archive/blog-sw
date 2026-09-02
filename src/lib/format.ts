/** '2026-08-22' → '2026.08.22' — archive 본문 요약과 같은 표기를 쓴다. */
export function formatArchiveDate(isoDate: string): string {
  return isoDate.replaceAll('-', '.');
}
