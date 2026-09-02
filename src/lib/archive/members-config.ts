/**
 * archive 의 author 이름 → GitHub 로그인 아이디.
 *
 * 아이디가 있으면 빌드 시 scripts/sync-avatars.ts 가 프로필 사진을 내려받아
 * public/avatars 에 보관하고, 멤버 화면에서 그 사본을 쓴다.
 * 비어 있으면 이름 첫 글자로 만든 아바타로 대체된다.
 */
export const GITHUB_LOGIN_BY_AUTHOR: Record<string, string> = {
  권시현: 'kwonsean',
  민준경: 'junbox98221',
  염승준: 'prgmr99',
  최승원: 'seung1',
};

/** public 기준 아바타 경로. 파일이 없으면 화면에서 알아서 대체 아바타를 쓴다. */
export function avatarPath(author: string): string | undefined {
  const login = GITHUB_LOGIN_BY_AUTHOR[author];
  return login ? `/avatars/${login}.png` : undefined;
}

/** 멤버의 GitHub 프로필 주소. 아이디가 없으면 undefined */
export function githubProfileUrl(author: string): string | undefined {
  const login = GITHUB_LOGIN_BY_AUTHOR[author];
  return login ? `https://github.com/${login}` : undefined;
}

/** 멤버의 GitHub 로그인 아이디 */
export function githubLogin(author: string): string | undefined {
  return GITHUB_LOGIN_BY_AUTHOR[author];
}

/**
 * 멤버의 개인 블로그. 아카이브의 아티클과 별개로 본인 글 전체를 볼 수 있는 곳이다.
 * 공개를 원치 않는 사람은 비워 둔다.
 */
export const BLOG_URL_BY_AUTHOR: Record<string, string> = {
  권시현: 'https://kwonsean.tistory.com',
  민준경: 'https://jk-devv.vercel.app',
  염승준: 'https://yeomyeom.tistory.com',
};

export function blogUrl(author: string): string | undefined {
  return BLOG_URL_BY_AUTHOR[author];
}
