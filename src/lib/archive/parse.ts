import matter from 'gray-matter';
import { archiveSchema, type Archive } from './schema';

export class ArchiveParseError extends Error {
  constructor(
    readonly fileName: string,
    message: string,
  ) {
    super(`[${fileName}] ${message}`);
    this.name = 'ArchiveParseError';
  }
}

export interface ParsedArchive extends Archive {
  /** 원본 파일명 (예: 202608.md) */
  fileName: string;
  /** frontmatter 아래 본문 한 줄 요약 */
  summary: string;
}

const ARCHIVE_FILE_NAME = /^(\d{4})(\d{2})\.md$/;

/** archives/YYYYMM.md 한 개를 파싱하고 검증한다. */
export function parseArchiveMarkdown(fileName: string, raw: string): ParsedArchive {
  const fileNameMatch = ARCHIVE_FILE_NAME.exec(fileName);
  if (!fileNameMatch) {
    throw new ArchiveParseError(fileName, '파일명이 YYYYMM.md 형식이 아닙니다.');
  }

  const parsed = matter(raw);
  const result = archiveSchema.safeParse(parsed.data);
  if (!result.success) {
    const issues = result.error.issues
      .map((issue) => `${issue.path.join('.') || '(root)'}: ${issue.message}`)
      .join(', ');
    throw new ArchiveParseError(fileName, `frontmatter 검증 실패 — ${issues}`);
  }

  const archive = result.data;
  const [, year, month] = fileNameMatch;
  const expectedPrefix = `${year}-${month}`;
  if (!archive.date.startsWith(expectedPrefix)) {
    throw new ArchiveParseError(
      fileName,
      `파일명과 date 의 연·월이 다릅니다. date=${archive.date}`,
    );
  }

  const authors = archive.articles.map((article) => article.author);
  const duplicated = authors.find((author, index) => authors.indexOf(author) !== index);
  if (duplicated) {
    throw new ArchiveParseError(fileName, `author 가 중복되었습니다 — ${duplicated}`);
  }

  return {
    ...archive,
    fileName,
    summary: parsed.content.trim(),
  };
}

/** 여러 회차를 파싱해 최신순(id 내림차순)으로 정렬한다. */
export function parseArchives(files: { fileName: string; raw: string }[]): ParsedArchive[] {
  const archives = files.map(({ fileName, raw }) => parseArchiveMarkdown(fileName, raw));

  const ids = archives.map((archive) => archive.id);
  const duplicatedId = ids.find((id, index) => ids.indexOf(id) !== index);
  if (duplicatedId !== undefined) {
    throw new Error(`회차 id 가 중복되었습니다 — ${duplicatedId}`);
  }

  return archives.sort((a, b) => b.id - a.id);
}
