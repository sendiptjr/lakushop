const path = require('path')
const { parsed: localEnv } = require('dotenv').config()
const webpack = require('webpack')
module.exports = {
  webpack(config) {
    config.plugins.push(new webpack.EnvironmentPlugin(localEnv))
    return config
  },
  eslint:{
    ignoreDuringBuilds: true
  },
  images: {
    unoptimized: true
  },
  output: 'export',
  trailingSlash: true,
  reactStrictMode: false,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  generateBuildId: async () => {
    // Dapatkan timestamp saat ini dan konversi menjadi string
    const timestamp = new Date().getTime().toString();
    // Gabungkan timestamp dengan string lainnya (misalnya, versi aplikasi, konfigurasi tertentu, dll.)
    return `my-build-id-${timestamp}`;
  },
  async headers() {
    return [
      {
        source: '/fonts/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Expires',
            value: '0',
          },
        ],
      },
    ];
  },
}