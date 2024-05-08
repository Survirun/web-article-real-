/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['static.toss.im'],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "https://toss.tech",
        port: '',
        pathname: '/article/**',
      },
      {
        protocol: "https",
        hostname: "static.toss.im",
        port: '',
        pathname: '/article/**',
      }
    ]
  }
};

export default nextConfig;
