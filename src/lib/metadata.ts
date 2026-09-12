import type { Metadata } from 'next';
import { SITE_NAME } from './site';

/**
 * 검색 결과 문구로 쓰기 좋은 길이.
 *
 * 구글은 한국어 설명을 대략 이 안쪽에서 자른다. 넘치는 부분은 보이지도 않으면서
 * 어디서 끊길지 검색엔진에 맡기게 된다.
 */
const DESCRIPTION_LIMIT = 150;

/** 공유 카드 기본 이미지. app/share-image/route.tsx 가 빌드 때 만든다. */
const DEFAULT_OG_IMAGE = { url: '/share-image', width: 1200, height: 630 };

/** 공백 단위로 끊어 말줄임표를 붙인다. 단어 한가운데서 자르지 않는다. */
export function clampDescription(text: string, limit = DESCRIPTION_LIMIT): string {
  const flat = text.replace(/\s+/g, ' ').trim();
  if (flat.length <= limit) return flat;

  const cut = flat.slice(0, limit - 1);
  const lastSpace = cut.lastIndexOf(' ');
  // 공백이 너무 앞에만 있으면 그냥 글자 수로 자른다. 긴 영어 URL 같은 경우다.
  const head = lastSpace > limit * 0.6 ? cut.slice(0, lastSpace) : cut;
  return `${head.replace(/[\s,.·—-]+$/, '')}…`;
}

interface PageMetaInput {
  title: string;
  description: string;
  /** 사이트 루트 기준 경로. metadataBase 가 절대 주소로 편다. */
  path: string;
  /** 대표 이미지. 아티클은 원문 썸네일을 그대로 쓴다. 없으면 사이트 기본 이미지. */
  image?: { src: string; width: number; height: number };
  /** 아티클 페이지면 글 정보를 붙인다. 공유 카드가 글로 인식한다. */
  article?: { publishedTime: string; authors: string[]; tags: string[] };
}

/**
 * 페이지 메타데이터 한 벌.
 *
 * canonical 을 페이지마다 붙인다. 같은 글이 태그·회차·멤버 목록 어디서 들어와도
 * 검색엔진이 한 주소로 모으게 하기 위해서다.
 */
export function pageMetadata({
  title,
  description,
  path,
  image,
  article,
}: PageMetaInput): Metadata {
  // 홈은 제목이 곧 사이트 이름이라 뒤에 또 붙이지 않는다.
  const isRoot = title === SITE_NAME;
  const summary = clampDescription(description);
  const images = [
    image ? { url: image.src, width: image.width, height: image.height } : DEFAULT_OG_IMAGE,
  ];
  const common = {
    siteName: SITE_NAME,
    title: isRoot ? title : `${title} · ${SITE_NAME}`,
    description: summary,
    url: path,
    locale: 'ko_KR',
    images,
  };

  return {
    title: isRoot ? { absolute: title } : title,
    description: summary,
    alternates: { canonical: path },
    openGraph: article
      ? {
          ...common,
          type: 'article',
          publishedTime: article.publishedTime,
          authors: article.authors,
          tags: article.tags,
        }
      : { ...common, type: 'website' },
  };
}
