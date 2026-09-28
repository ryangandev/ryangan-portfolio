import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { format } from 'date-fns';
import { ImageResponse } from 'next/og';
import { notFound } from 'next/navigation';

import { R_PATH, TILE_PATH } from '@/components/logo';
import { getAllPostSlugs, getPostBySlug } from '@/lib/content';
import { parseContentDate } from '@/lib/date';

export const alt = 'Blog post title card from ryangan.me';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export const generateStaticParams = async () => {
  const slugs = await getAllPostSlugs();

  return slugs.map((slug) => ({ slug }));
};

// Satori needs TTF/OTF data, so these are read from the geist package rather
// than taken from next/font, which only ships woff2.
const loadFont = (weight: string) =>
  readFile(
    join(
      process.cwd(),
      'node_modules/geist/dist/fonts/geist-sans',
      `Geist-${weight}.ttf`,
    ),
  );

/**
 * A card per post in the style of the site-wide `opengraph-image.png`: the
 * brand tile, the post title where the name sits on the site card, and its
 * date and reading time where the tagline is.
 */
export default async function PostImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const post = await getPostBySlug((await params).slug);

  if (!post) {
    notFound();
  }

  const [semiBold, regular] = await Promise.all([
    loadFont('SemiBold'),
    loadFont('Regular'),
  ]);

  const date = format(parseContentDate(post.publishedDate), 'MMM d, yyyy');
  // Long titles step down a size so they stay within three lines.
  const titleSize = post.title.length > 48 ? 60 : 72;

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '80px 88px 62px',
        background: '#0a0a0b',
        color: '#fafafa',
        fontFamily: 'Geist',
      }}
    >
      <svg width={96} height={96} viewBox="0 0 100 100">
        <path d={`${TILE_PATH} ${R_PATH}`} fill="#fafafa" fillRule="evenodd" />
      </svg>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          justifyContent: 'flex-end',
          paddingBottom: 56,
        }}
      >
        <div
          style={{
            fontSize: titleSize,
            fontWeight: 600,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
          }}
        >
          {post.title}
        </div>
        <div style={{ marginTop: 24, fontSize: 32, color: '#8e8e93' }}>
          {`${date}  ·  ${post.readingTime} min read`}
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          borderTop: '2px solid #2c2c2e',
          paddingTop: 32,
          fontSize: 28,
          color: '#8e8e93',
        }}
      >
        <span>Ryan Gan</span>
        <span>ryangan.me</span>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: 'Geist', data: semiBold, weight: 600, style: 'normal' },
        { name: 'Geist', data: regular, weight: 400, style: 'normal' },
      ],
    },
  );
}
