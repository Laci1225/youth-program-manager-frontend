/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    async rewrites() {
        return [
            {
                source: '/graphql',
                destination: 'https://walrus-app-9qlw7.ondigitalocean.app/graphql',
            },
        ];
    },
}

module.exports = nextConfig
