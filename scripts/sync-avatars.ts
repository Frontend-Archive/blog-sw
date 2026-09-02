/**
 * 멤버의 GitHub 프로필 사진을 내려받아 public/avatars 에 보관한다.
 *
 * 핫링크하지 않는 이유는 OG 썸네일과 같다. 원격이 막히거나 바뀌어도
 * 사이트가 깨지지 않도록 사본을 들고 있는다.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { GITHUB_LOGIN_BY_AUTHOR } from '@/lib/archive/members-config';

const AVATAR_DIR = 'public/avatars';
const SIZE = 160;

async function main(): Promise<void> {
  const entries = Object.entries(GITHUB_LOGIN_BY_AUTHOR).filter(([, login]) => login);
  if (entries.length === 0) {
    console.log('[sync-avatars] 설정된 GitHub 아이디가 없어 건너뜁니다.');
    return;
  }

  const dir = resolve(process.cwd(), AVATAR_DIR);
  await mkdir(dir, { recursive: true });

  let saved = 0;
  for (const [author, login] of entries) {
    try {
      const response = await fetch(`https://github.com/${login}.png?size=${SIZE}`, {
        redirect: 'follow',
        signal: AbortSignal.timeout(15_000),
      });
      if (!response.ok) {
        console.warn(`[sync-avatars] ${author}(${login}) 실패: ${response.status}`);
        continue;
      }
      const bytes = Buffer.from(await response.arrayBuffer());
      await writeFile(resolve(dir, `${login}.png`), bytes);
      saved += 1;
    } catch (error) {
      console.warn(
        `[sync-avatars] ${author}(${login}) 실패: ${error instanceof Error ? error.message : error}`,
      );
    }
  }

  console.log(`[sync-avatars] ${saved}/${entries.length}개 저장`);
}

main().catch((error: unknown) => {
  console.error('[sync-avatars] 실패:', error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
