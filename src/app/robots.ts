import type { MetadataRoute } from 'next';

import { siteUrl } from '@/data/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Behind sign-in, and marked noindex as well.
      disallow: ['/admin', '/api/'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
