/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cdn.discordapp.com',
            },
            {
                protocol: 'https',
                hostname: 'ik.imagekit.io',
            },
        ],
    },
    experimental: {
        serverActions: true,
    },
};

module.exports = nextConfig;
