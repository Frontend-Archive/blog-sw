# archive 레포 연동

이 디렉터리의 파일은 **blog-sw 가 아니라 [Frontend-Archive/archive](https://github.com/Frontend-Archive/archive) 레포에 두고 동작한다.**
공용 레포라 임의로 밀어넣지 않고, 여기서 관리하다가 멤버 합의가 끝나면 옮긴다.

## 왜 여기에 있나

블로그의 글 등록 폼은 마크다운을 직접 고치지 않는다. archive 레포에는 작은따옴표 규칙,
항목 사이 빈 줄, `prettier-plugin-frontmatter-align` 같은 고유 포맷 규칙이 있는데,
그 규칙은 그 레포의 prettier 설정만 정확히 알고 있다. 그래서 블로그는 "무엇을 바꿀지"만
`repository_dispatch` 로 넘기고, 파일 수정은 archive 레포 안에서 한다.

## 파일

| 경로                                | 설명                                                        |
| ----------------------------------- | ----------------------------------------------------------- |
| `.github/workflows/add-article.yml` | 블로그가 보낸 `add-article` 이벤트를 받아 md 를 고치고 커밋 |
| `scripts/add-article.mjs`           | 실제 md 편집. 의존성 없이 Node 내장 모듈만 사용             |

## 설치

1. 두 파일을 archive 레포의 같은 경로에 복사한다.
2. blog-sw 쪽 환경변수에 `GITHUB_TOKEN` (repo 스코프 PAT) 을 넣는다.
   이 토큰으로 archive 레포에 dispatch 를 보낸다.
3. archive 레포 Settings → Actions → General → Workflow permissions 를
   **Read and write permissions** 로 둔다. 워크플로가 커밋을 푸시해야 한다.

## 동작

```
블로그 /submit 폼
  → 서버 액션이 세션으로 본인 확인 + 입력 검증
  → archive 레포로 repository_dispatch (add-article)
  → add-article.yml 이 md 수정 + npm run format + 커밋/푸시
  → (notify-blog.yml) 블로그 재배포
```

## 지원하는 요청

**`fill-slot`** — 기존 회차의 빈 자리를 채운다.

```json
{
  "mode": "fill-slot",
  "author": "최승원",
  "archiveId": 6,
  "title": "글 제목",
  "url": "https://example.com/post",
  "tags": ["React"],
  "requestedBy": "github-login"
}
```

이미 채워진 자리는 거부한다. 남의 글을 덮어쓰지 않기 위한 마지막 방어선이다.

**`new-archive`** — 새 회차를 열고 멤버 자리를 비워 둔다.

```json
{
  "mode": "new-archive",
  "date": "2026-09-19",
  "type": "on-line",
  "requestedBy": "github-login"
}
```

`id` 는 기존 최대값 + 1, 파일명은 `date` 의 `YYYYMM`, 멤버 목록과 순서는 가장 최근
회차에서 그대로 가져온다. 같은 달에 이미 회차가 있으면 거부한다.

## 검증한 것

실제 archive 파일 사본에 다음을 돌려 확인했다.

- 빈 자리 채우기 → 아포스트로피가 든 제목까지 정확히 기록
- 이미 채워진 자리 → 거부
- 새 회차 생성 → 멤버 4명 빈 슬롯과 본문 요약까지 생성
- 같은 달 중복 → 거부
- 결과물이 archive 레포의 `npm run format:check` 를 그대로 통과
- 블로그 파서가 결과를 다시 읽어 파싱
