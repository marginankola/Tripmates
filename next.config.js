/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        hostname: 'firebasestorage.googleapis.com',
      },
      {
        hostname: 'api.dicebear.com',
      },
      {
        hostname: 'lh3.googleusercontent.com',
      },
      {
        hostname: 'external-content.duckduckgo.com',
      },
    ],
  },
}

module.exports = nextConfig
