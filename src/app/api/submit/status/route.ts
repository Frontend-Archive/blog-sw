import { NextResponse } from 'next/server';
import { z } from 'zod';
import { ARCHIVE_FILE_NAME } from '@/features/submit/schema';
import { ARCHIVE_REPO } from '@/lib/archive/config';
import { archives, articles } from '@/lib/archive/source';

/**
 * 등록 요청이 어디까지 갔는지 알려준다.
 *
 * - inArchiveRepo: archive 레포의 main 에 실제로 반영됐는지 (매번 원본을 확인)
 * - inThisDeployment: 지금 이 배포가 들고 있는 데이터에 들어있는지.
 *   빌드 시점에 굳은 데이터라 이게 true 면 재배포까지 끝났다는 뜻이다.
 */
export const dynamic = 'force-dynamic';

const querySchema = z.object({
  fileName: z.string().regex(ARCHIVE_FILE_NAME, '파일명 형식이 올바르지 않습니다.'),
  archiveId: z.coerce.number().int().positive(),
  url: z.url().optional(),
});

async function existsInArchiveRepo(fileName: string, url: string | undefined): Promise<boolean> {
  const { owner, name, path, ref } = ARCHIVE_REPO;
  const rawUrl = `https://raw.githubusercontent.com/${owner}/${name}/${ref}/${path}/${fileName}`;

  const headers: Record<string, string> = { 'User-Agent': 'frontend-archive-blog' };
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(rawUrl, { headers, cache: 'no-store' });
  if (!response.ok) return false;
  if (!url) return true;

  return (await response.text()).includes(url);
}

export async function GET(request: Request) {
  const parsed = querySchema.safeParse(
    Object.fromEntries(new URL(request.url).searchParams.entries()),
  );
  if (!parsed.success) {
    return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 });
  }

  const { fileName, archiveId, url } = parsed.data;

  const inThisDeployment = url
    ? articles.some((article) => article.url === url)
    : archives.some((archive) => archive.id === archiveId);

  let inArchiveRepo = inThisDeployment;
  if (!inArchiveRepo) {
    try {
      inArchiveRepo = await existsInArchiveRepo(fileName, url);
    } catch {
      inArchiveRepo = false;
    }
  }

  return NextResponse.json(
    { inArchiveRepo, inThisDeployment },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
