/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: ['i.ibb.co', 'firebasestorage.googleapis.com'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Optimize for Heroku deployment
  output: 'standalone',
  // Environment variable validation
  env: {
    CUSTOM_ENV_VAR: process.env.NODE_ENV,
  },
  // Enable Turbopack for faster development builds
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
}

export default nextConfig
