import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

/**
 * 크롤러 안내.
 *
 * /submit 은 로그인해야 볼 수 있고 /recent 는 브라우저 기록에 기댄다.
 * 둘 다 크롤러에게는 빈 화면이라 아예 들르지 않게 한다.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/submit', '/recent', '/api/'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
