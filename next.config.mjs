/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Destination photography is served from Unsplash for now.
    // Swap in your own CDN/host here when the shoot is ready.
    remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }]
  }
};

export default nextConfig;
