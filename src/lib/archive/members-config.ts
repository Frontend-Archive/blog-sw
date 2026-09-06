/**
 * 스터디 멤버 명부.
 *
 * archive 레포의 마크다운에는 이름(author)만 적힌다. 이름은 바뀔 수 있으므로
 * 이름을 식별자로 쓰지 않는다. 여기서 고정 id 를 주고, 이름은 표시용으로만 둔다.
 *
 * 이름이 바뀌면 name 을 고치고 옛 이름을 aliases 에 남긴다. 그러면 예전 회차의
 * 글도 계속 같은 사람으로 이어지고, 주소와 아바타 파일은 그대로 유지된다.
 */
export interface MemberConfig {
  /** 고정 식별자. 주소와 아바타 파일 이름에 쓴다. 한 번 정하면 바꾸지 않는다. */
  id: string;
  /** 지금 archive 레포에 적혀 있는 이름. 화면에 이 이름이 나온다. */
  name: string;
  /** archive 레포에 쓰였던 예전 이름들 */
  aliases?: string[];
  /** GitHub 로그인 아이디. 있으면 프로필 사진과 링크를 붙인다. */
  github?: string;
  /** 개인 블로그. 공개를 원치 않으면 비워 둔다. */
  blog?: string;
}

export const MEMBERS: MemberConfig[] = [
  {
    id: 'kwonsean',
    name: '권시현',
    github: 'kwonsean',
    blog: 'https://kwonsean.tistory.com',
  },
  {
    id: 'junbox98221',
    name: '민준경',
    github: 'junbox98221',
    blog: 'https://jk-devv.vercel.app',
  },
  {
    id: 'prgmr99',
    name: '염승준',
    github: 'prgmr99',
    blog: 'https://yeomyeom.tistory.com',
  },
  {
    id: 'seung1',
    name: '최승원',
    github: 'seung1',
  },
];

const byName = new Map<string, MemberConfig>();
const byId = new Map<string, MemberConfig>();
// GitHub 아이디는 대소문자를 가리지 않는다. 소문자로 눕혀 둔다.
const byGithub = new Map<string, MemberConfig>();

for (const member of MEMBERS) {
  if (byId.has(member.id)) {
    throw new Error(`멤버 id 가 중복되었습니다 — ${member.id}`);
  }
  byId.set(member.id, member);

  if (member.github) {
    byGithub.set(member.github.toLowerCase(), member);
  }

  for (const name of [member.name, ...(member.aliases ?? [])]) {
    const existing = byName.get(name);
    if (existing && existing.id !== member.id) {
      throw new Error(`멤버 이름 "${name}" 이 ${existing.id} 와 ${member.id} 에 겹칩니다.`);
    }
    byName.set(name, member);
  }
}

export const memberIds = MEMBERS.map((member) => member.id);

export function memberById(id: string): MemberConfig | undefined {
  return byId.get(id);
}

/**
 * GitHub 로그인 아이디로 멤버를 찾는다. 로그인한 사람이 누구인지 가릴 때 쓴다.
 *
 * github 를 적어 두지 않은 멤버는 여기서 안 잡힌다. 로그인은 못 하지만
 * 화면에는 그대로 나온다.
 */
export function memberByGithub(login: string | undefined | null): MemberConfig | undefined {
  if (!login) return undefined;
  return byGithub.get(login.toLowerCase());
}

/**
 * 이름으로 멤버를 찾는다. 명부에 없으면 곧바로 실패시킨다.
 *
 * archive 레포에서 이름을 바꾸거나 새 멤버가 들어오면 여기서 걸린다.
 * 조용히 넘어가면 아바타와 링크만 사라져 한참 뒤에야 알아채게 된다.
 */
export function requireMember(name: string): MemberConfig {
  const member = byName.get(name);
  if (!member) {
    throw new Error(
      `archive 의 작성자 "${name}" 이 멤버 명부에 없습니다. ` +
        `src/lib/archive/members-config.ts 에 추가하거나, 이름이 바뀐 것이라면 ` +
        `해당 멤버의 name 을 고치고 옛 이름을 aliases 에 남기세요.`,
    );
  }
  return member;
}

/** 화면에 쓸 이름. archive 에 남은 옛 이름으로 들어와도 지금 이름으로 바꿔 준다. */
export function displayName(name: string): string {
  return byName.get(name)?.name ?? name;
}

export function memberId(name: string): string | undefined {
  return byName.get(name)?.id;
}

/** public 기준 아바타 경로. 파일이 없으면 화면에서 알아서 대체 아바타를 쓴다. */
export function avatarPath(name: string): string | undefined {
  const login = byName.get(name)?.github;
  return login ? `/avatars/${login}.png` : undefined;
}

/** 멤버의 GitHub 프로필 주소. 아이디가 없으면 undefined */
export function githubProfileUrl(name: string): string | undefined {
  const login = byName.get(name)?.github;
  return login ? `https://github.com/${login}` : undefined;
}

/** 멤버의 GitHub 로그인 아이디 */
export function githubLogin(name: string): string | undefined {
  return byName.get(name)?.github;
}

/** 멤버의 개인 블로그. 아카이브의 아티클과 별개로 본인 글 전체를 볼 수 있는 곳이다. */
export function blogUrl(name: string): string | undefined {
  return byName.get(name)?.blog;
}
