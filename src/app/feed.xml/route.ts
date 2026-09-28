import { blogDescription, blogTitle, siteUrl } from '@/data/site';
import { getSortedPosts } from '@/lib/content';

// Rendered once at build time, like every page; the posts only change on deploy.
export const dynamic = 'force-static';

const xmlEscapes: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&apos;',
};

const escapeXml = (value: string) =>
  value.replace(/[&<>"']/g, (character) => xmlEscapes[character]);

/**
 * RFC 822 dates, as RSS 2.0 requires. Built from the date string at UTC
 * midnight rather than through `parseContentDate`, which is local midnight and
 * would make the feed depend on the build machine's timezone.
 */
const toRfc822 = (date: string) => new Date(`${date}T00:00:00Z`).toUTCString();

export const GET = async () => {
  const posts = await getSortedPosts();

  const items = posts.map((post) => {
    const url = `${siteUrl}/blog/${post.slug}`;
    const categories = post.topics
      .map((topic) => `      <category>${escapeXml(topic)}</category>`)
      .join('\n');

    return [
      '    <item>',
      `      <title>${escapeXml(post.title)}</title>`,
      `      <link>${url}</link>`,
      `      <guid isPermaLink="true">${url}</guid>`,
      `      <description>${escapeXml(post.summary)}</description>`,
      `      <pubDate>${toRfc822(post.publishedDate)}</pubDate>`,
      ...(categories ? [categories] : []),
      '    </item>',
    ].join('\n');
  });

  // The newest post, not the build time, so an unchanged feed stays unchanged
  // across deploys.
  const lastBuildDate = posts[0]
    ? `\n    <lastBuildDate>${toRfc822(posts[0].publishedDate)}</lastBuildDate>`
    : '';

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(blogTitle)}</title>
    <link>${siteUrl}/blog</link>
    <description>${escapeXml(blogDescription)}</description>
    <language>en-us</language>${lastBuildDate}
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml" />
${items.join('\n')}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
};
