/** archive 레포 위치. 포크해서 쓸 수 있도록 환경변수로 덮어쓸 수 있다. */
export const ARCHIVE_REPO = {
  owner: process.env.ARCHIVE_REPO_OWNER ?? 'Frontend-Archive',
  name: process.env.ARCHIVE_REPO_NAME ?? 'archive',
  path: process.env.ARCHIVE_REPO_PATH ?? 'archives',
  ref: process.env.ARCHIVE_REPO_REF ?? 'main',
} as const;

export const ARCHIVE_REPO_SLUG = `${ARCHIVE_REPO.owner}/${ARCHIVE_REPO.name}`;

export const ARCHIVE_REPO_URL = `https://github.com/${ARCHIVE_REPO_SLUG}`;

/** 캐시 파일 경로 (레포 루트 기준). 빌드 실패를 막는 폴백이자 오프라인 개발용 소스다. */
export const ARCHIVE_CACHE_PATH = 'content/archive.json';
