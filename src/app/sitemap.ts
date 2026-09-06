import type { MetadataRoute } from 'next';
import { archives, articles } from '@/lib/archive/source';
import { articleSlug, authorSlugs, tagSlugs } from '@/lib/archive/taxonomy';
import { SITE_URL } from '@/lib/site';

/**
 * 검색엔진에 넘길 주소 목록.
 *
 * 로그인이 필요한 /submit 과 브라우저 기록에 기대는 /recent 는 넣지 않는다.
 * 크롤러에게는 둘 다 빈 화면이라 색인해 봐야 얻을 게 없다.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => `${SITE_URL}${path}`;

  // 회차 날짜를 마지막 수정일로 쓴다. 글이 늘면 그 회차가 새로 잡힌다.
  const latest = archives[0]?.date;

  return [
    { url: url('/'), lastModified: latest, changeFrequency: 'weekly', priority: 1 },
    { url: url('/timeline'), lastModified: latest, changeFrequency: 'monthly' },
    { url: url('/tags'), lastModified: latest, changeFrequency: 'monthly' },
    { url: url('/members'), lastModified: latest, changeFrequency: 'monthly' },

    ...articles.map((article) => ({
      url: url(`/articles/${articleSlug(article)}`),
      lastModified: article.archiveDate,
      changeFrequency: 'yearly' as const,
      priority: 0.8,
    })),

    ...archives.map((archive) => ({
      url: url(`/archives/${archive.id}`),
      lastModified: archive.date,
      changeFrequency: 'yearly' as const,
    })),

    ...tagSlugs.map((slug) => ({
      url: url(`/tags/${slug}`),
      lastModified: latest,
      changeFrequency: 'monthly' as const,
    })),

    ...authorSlugs.map((slug) => ({
      url: url(`/members/${slug}`),
      lastModified: latest,
      changeFrequency: 'monthly' as const,
    })),
  ];
}
