import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    /**
     * 썸네일 원본은 sync:og 가 주소 해시로 이름 붙여 받아 둔 파일이라 같은 주소의
     * 내용이 바뀌지 않는다. 기본 4시간 대신 30일을 잡아 재검증 요청을 줄인다.
     * 원문이 이미지를 바꾸면 파일명이 달라지므로 새 썸네일은 바로 반영된다.
     */
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
};

export default nextConfig;
