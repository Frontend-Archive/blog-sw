import { z } from 'zod';

/**
 * 글을 등록할 수 있는 사람은 스터디 멤버뿐이다.
 * GitHub 로그인 아이디를 archive 레포의 author 이름에 대응시킨다.
 *
 * 예: ARCHIVE_MEMBERS={"kwonsean":"권시현","junkyeong":"민준경"}
 */
const memberMapSchema = z.record(z.string().min(1), z.string().min(1));

function parseMemberMap(): Record<string, string> {
  const raw = process.env.ARCHIVE_MEMBERS;
  if (!raw) return {};

  try {
    const parsed = memberMapSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) {
      console.error('[auth] ARCHIVE_MEMBERS 형식이 올바르지 않습니다.', parsed.error.message);
      return {};
    }
    return parsed.data;
  } catch (error) {
    console.error('[auth] ARCHIVE_MEMBERS 를 JSON 으로 읽지 못했습니다.', error);
    return {};
  }
}

const memberMap = parseMemberMap();

/** 멤버 매핑이 설정되어 있는지. 비어 있으면 아무도 등록할 수 없다. */
export const isMemberMapConfigured = Object.keys(memberMap).length > 0;

/** GitHub 로그인 아이디에 대응하는 archive author 이름. 멤버가 아니면 undefined */
export function resolveAuthor(githubLogin: string | undefined | null): string | undefined {
  if (!githubLogin) return undefined;
  return memberMap[githubLogin.toLowerCase()] ?? memberMap[githubLogin];
}

/**
 * OAuth 를 쓸 수 있는 상태인지. 셋 중 하나라도 없으면 Auth.js 가 런타임에 에러를 던지므로
 * 호출 전에 확인해서 안내로 대체한다.
 */
export const isAuthConfigured = Boolean(
  process.env.AUTH_SECRET && process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET,
);
