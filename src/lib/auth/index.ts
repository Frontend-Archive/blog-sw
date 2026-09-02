import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import { z } from 'zod';
import { resolveAuthor } from './members';

/** GitHub 프로필에서 필요한 필드만 검증해서 꺼낸다. 타입 단언을 쓰지 않기 위함. */
const githubProfileSchema = z.object({ login: z.string().min(1) });

function readGithubLogin(profile: unknown): string | undefined {
  const parsed = githubProfileSchema.safeParse(profile);
  return parsed.success ? parsed.data.login : undefined;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub],
  session: { strategy: 'jwt' },
  callbacks: {
    /** 스터디 멤버가 아니면 로그인 자체를 막는다. */
    signIn({ profile }) {
      return resolveAuthor(readGithubLogin(profile)) !== undefined;
    },
    jwt({ token, profile }) {
      const login = readGithubLogin(profile);
      if (login) {
        token.githubLogin = login;
        token.author = resolveAuthor(login);
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.githubLogin = typeof token.githubLogin === 'string' ? token.githubLogin : '';
        session.user.author = typeof token.author === 'string' ? token.author : undefined;
      }
      return session;
    },
  },
});
