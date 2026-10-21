import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { ImageResponse } from 'next/og';

import { R_PATH, TILE_PATH } from '@/components/logo';

export const alt = 'Zhiheng (Ryan) Gan, software engineer, at ryangan.me';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Satori needs TTF, OTF, or WOFF data, so the fonts are read from packages
// rather than taken from next/font, which only ships woff2.
const [semiBold, regular, taglineItalic] = await Promise.all([
  readFile(
    join(
      process.cwd(),
      'node_modules/geist/dist/fonts/geist-sans/Geist-SemiBold.ttf',
    ),
  ),
  readFile(
    join(
      process.cwd(),
      'node_modules/geist/dist/fonts/geist-sans/Geist-Regular.ttf',
    ),
  ),
  readFile(
    join(
      process.cwd(),
      'node_modules/@fontsource/newsreader/files/newsreader-latin-500-italic.woff',
    ),
  ),
]);

/**
 * The site's share card: the brand tile, the name with the home page's
 * tagline under it, and the role and domain along the bottom.
 */
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '80px 88px 62px',
        background: '#0a0a0a',
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
          paddingBottom: 86,
        }}
      >
        <div
          style={{
            fontSize: 79,
            fontWeight: 600,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
          }}
        >
          Zhiheng (Ryan) Gan
        </div>
        <div
          style={{
            marginTop: 8,
            fontFamily: 'Newsreader',
            fontStyle: 'italic',
            fontSize: 41,
            color: '#a3a3a3',
          }}
        >
          I am a user before a developer.
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          borderTop: '1px solid #262626',
          paddingTop: 28,
          fontSize: 27,
          color: '#737373',
        }}
      >
        <span>Software Engineer</span>
        <span>ryangan.me</span>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: 'Geist', data: semiBold, weight: 600, style: 'normal' },
        { name: 'Geist', data: regular, weight: 400, style: 'normal' },
        {
          name: 'Newsreader',
          data: taglineItalic,
          weight: 500,
          style: 'italic',
        },
      ],
    },
  );
}
