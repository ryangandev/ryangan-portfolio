/** @type {import('next').NextConfig} */
const nextConfig = {
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
};

export default nextConfig;
