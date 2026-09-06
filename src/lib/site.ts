/**
 * 사이트 정체성.
 *
 * 주소·이름·설명이 여러 파일에 흩어지면 한 곳만 고치고 나머지를 놓친다.
 * 화면과 메타데이터가 어긋나는 건 여기서만 막을 수 있다.
 */

/**
 * 절대 주소.
 *
 * sitemap 과 canonical 은 절대 주소여야 한다. 상대 주소로 두면 미리보기
 * 배포의 임시 도메인이 그대로 색인될 수 있다.
 */
export const SITE_URL = 'https://frontendarchive.vercel.app';

export const SITE_NAME = 'Frontend Archive';

/** 메인 히어로와 검색 결과에 같이 쓴다. */
export const SITE_DESCRIPTION =
  '3~5년차 주니어 개발자들이 실무에서 겪은 문제와 푼 과정, 얻은 인사이트를 남깁니다.';

/** Google Search Console 소유 확인. HTML 에 그대로 실리는 공개 값이다. */
export const GOOGLE_SITE_VERIFICATION = 'FCZPzvQhGCLae0VdfPIbLKxE-g2EH-pLM6QRUVBARic';
