/**
 * archive 레포 위치.
 *
 * 환경변수로 덮어쓸 수 있게 두었지만 실제로 바꾼 적이 없고, 설정해야 할 값만
 * 넷 늘렸다. 옮길 일이 생기면 여기를 고치는 편이 빠르다.
 */
export const ARCHIVE_REPO = {
  owner: 'Frontend-Archive',
  name: 'archive',
  path: 'archives',
  ref: 'main',
} as const;

export const ARCHIVE_REPO_SLUG = `${ARCHIVE_REPO.owner}/${ARCHIVE_REPO.name}`;

export const ARCHIVE_REPO_URL = `https://github.com/${ARCHIVE_REPO_SLUG}`;

/** 캐시 파일 경로 (레포 루트 기준). 빌드 실패를 막는 폴백이자 오프라인 개발용 소스다. */
export const ARCHIVE_CACHE_PATH = 'content/archive.json';
