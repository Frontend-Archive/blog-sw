import { z } from 'zod';
import { MEETING_TYPES } from '@/lib/archive/schema';

/** 태그는 최대 5개, 각 30자 이내. 원본 규칙은 자유 문자열이지만 폼에서만 상한을 둔다. */
export const MAX_TAGS = 5;
const MAX_TAG_LENGTH = 30;

export const tagsSchema = z
  .string()
  .transform((value) =>
    value
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0),
  )
  .pipe(
    z
      .array(z.string().max(MAX_TAG_LENGTH, `태그는 ${MAX_TAG_LENGTH}자 이내여야 합니다.`))
      .max(MAX_TAGS, `태그는 최대 ${MAX_TAGS}개까지 넣을 수 있습니다.`),
  );

/**
 * 회차 안 글 한 편.
 *
 * 아직 안 채운 자리는 빈 값으로 온다. 제목과 링크는 함께 있거나 함께 비어야
 * 하고, 그 검사는 배열을 다 모은 뒤 editArchiveSchema 에서 한다.
 */
export const articleEditSchema = z.object({
  author: z.string().trim().min(1),
  title: z.string().trim().max(200, '제목이 너무 깁니다.'),
  url: z.union([z.literal(''), z.url('http 로 시작하는 올바른 링크를 넣어 주세요.')]),
  tags: tagsSchema,
});

export const editArchiveSchema = z.object({
  mode: z.literal('edit-archive'),
  archiveId: z.coerce.number().int().positive(),
  date: z.iso.date('날짜를 YYYY-MM-DD 형식으로 넣어 주세요.'),
  type: z.enum(MEETING_TYPES),
  articles: z.array(articleEditSchema).min(1, '회차에 사람이 한 명도 없습니다.'),
});

export const newArchiveSchema = z.object({
  mode: z.literal('new-archive'),
  date: z.iso.date('날짜를 YYYY-MM-DD 형식으로 넣어 주세요.'),
  type: z.enum(MEETING_TYPES),
  /** 만들면서 바로 채워도 된다. 다 비우면 빈 회차가 생긴다. */
  articles: z.array(articleEditSchema).min(1, '회차에 사람이 한 명도 없습니다.'),
});

export type ArticleEditInput = z.infer<typeof articleEditSchema>;
export type EditArchiveInput = z.infer<typeof editArchiveSchema>;
export type NewArchiveInput = z.infer<typeof newArchiveSchema>;

/** 등록 요청이 실제로 반영됐는지 추적하는 데 필요한 정보 */
export interface PendingSubmission {
  /** archive 레포에서 확인할 파일 (예: 202607.md) */
  fileName: string;
  archiveId: number;
  /** 채우기 요청이면 이 URL 이 파일에 들어갔는지로 판정한다 */
  url?: string;
}

export interface SubmitResult {
  ok: boolean;
  message: string;
  /** 필드별 오류. 폼에서 각 입력 아래에 표시한다. */
  fieldErrors?: Record<string, string[]>;
  pending?: PendingSubmission;
}

export const ARCHIVE_FILE_NAME = /^\d{6}\.md$/;
