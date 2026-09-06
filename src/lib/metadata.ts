import type { Metadata } from 'next';
import { SITE_NAME } from './site';

interface PageMetaInput {
  title: string;
  description: string;
  /** 사이트 루트 기준 경로. metadataBase 가 절대 주소로 편다. */
  path: string;
  /** 대표 이미지. 아티클은 원문 썸네일을 그대로 쓴다. */
  image?: { src: string; width: number; height: number };
}

/**
 * 페이지 메타데이터 한 벌.
 *
 * canonical 을 페이지마다 붙인다. 같은 글이 태그·회차·멤버 목록 어디서 들어와도
 * 검색엔진이 한 주소로 모으게 하기 위해서다.
 */
export function pageMetadata({ title, description, path, image }: PageMetaInput): Metadata {
  // 홈은 제목이 곧 사이트 이름이라 뒤에 또 붙이지 않는다.
  const isRoot = title === SITE_NAME;

  return {
    title: isRoot ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title: isRoot ? title : `${title} · ${SITE_NAME}`,
      description,
      url: path,
      locale: 'ko_KR',
      images: image ? [{ url: image.src, width: image.width, height: image.height }] : undefined,
    },
  };
}
