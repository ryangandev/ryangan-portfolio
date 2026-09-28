/**
 * Sent with every response.
 *
 * HSTS is not here: Vercel already sends `max-age=63072000` on every custom
 * domain, and a second copy from the app could only disagree with it.
 *
 * There is no script CSP either. Next inlines its bootstrap scripts, and
 * next-themes inlines one to set the theme before paint, so a CSP that allows
 * them needs a per-request nonce, and generating one would turn every static
 * page into a dynamically rendered one. `frame-ancestors` is the one directive
 * that costs nothing, so the CSP carries only that.
 */
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Nothing on the site is meant to be framed. `frame-ancestors` is the
  // standard; X-Frame-Options covers browsers that predate it.
  { key: 'Content-Security-Policy', value: "frame-ancestors 'none'" },
  { key: 'X-Frame-Options', value: 'DENY' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
      },
    ],
    // Next.js 16 narrowed the default allowed qualities to `[75]`. Project and
    // post images are rendered with `quality={95}`, so it has to be opted in.
    qualities: [75, 95],
  },
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

export default nextConfig;
