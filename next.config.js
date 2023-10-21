/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    async rewrites() {
        return [
            {
                source: '/graphql:path*',
                destination: 'http://localhost:8080/graphql:path*',
            },
        ];
    },
}

module.exports = nextConfig
