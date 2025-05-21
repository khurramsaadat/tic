/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Changed from 'standalone' to 'export' for static deployment
  images: {
    unoptimized: true, // Required for static export
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  reactStrictMode: true,
  swcMinify: true,
  // Add trailing slashes for better compatibility
  trailingSlash: true,
};

export default nextConfig; 