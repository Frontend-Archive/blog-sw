import { memberByGithub } from '@/lib/archive/members-config';

/**
 * 글을 등록할 수 있는 사람은 스터디 멤버뿐이다.
 *
 * 누가 멤버인지는 members-config 의 명부 하나로만 정한다. 예전에는 같은 내용을
 * ARCHIVE_MEMBERS 환경변수에도 적었는데, 두 곳이 어긋나면 로그인은 되는데
 * 이름이 안 붙거나 그 반대가 됐다. 새 멤버는 어차피 명부에 넣어야 한다.
 */

/** GitHub 로그인 아이디에 대응하는 archive author 이름. 멤버가 아니면 undefined */
export function resolveAuthor(githubLogin: string | undefined | null): string | undefined {
  return memberByGithub(githubLogin)?.name;
}

/**
 * OAuth 를 쓸 수 있는 상태인지. 셋 중 하나라도 없으면 Auth.js 가 런타임에 에러를 던지므로
 * 호출 전에 확인해서 안내로 대체한다.
 */
export const isAuthConfigured = Boolean(
  process.env.AUTH_SECRET && process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET,
);
