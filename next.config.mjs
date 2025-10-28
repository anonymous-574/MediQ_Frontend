/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // ✅ Enables static export (creates /out directory)

  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    unoptimized: true, // ✅ Required because Next Image Optimization doesn't work in static export
  },
};

export default nextConfig;
