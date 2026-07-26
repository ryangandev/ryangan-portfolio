import type { MetadataRoute } from 'next';

import { siteUrl } from '@/data/site';
import { getSortedPosts, getSortedProjects } from '@/lib/content';
import { parseContentDate } from '@/lib/date';

/**
 * Built from the content directory rather than hand-maintained, so a new MDX
 * file is indexable the moment it ships.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [{ posts }, projects] = await Promise.all([
    getSortedPosts(),
    getSortedProjects(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: 'monthly', priority: 1 },
    { url: `${siteUrl}/portfolio`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteUrl}/blog`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${siteUrl}/contact`, changeFrequency: 'yearly', priority: 0.5 },
  ];

  return [
    ...staticRoutes,
    ...posts.map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: parseContentDate(post.publishedDate),
      changeFrequency: 'yearly' as const,
      priority: 0.7,
    })),
    ...projects.map((project) => ({
      url: `${siteUrl}/portfolio/${project.slug}`,
      lastModified: parseContentDate(project.date),
      changeFrequency: 'yearly' as const,
      priority: 0.7,
    })),
  ];
}
