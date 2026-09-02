import 'next-auth';

declare module 'next-auth' {
  interface User {
    /** GitHub 로그인 아이디 */
    githubLogin?: string;
    /** archive 레포의 author 이름. 멤버가 아니면 없다. */
    author?: string;
  }
}
