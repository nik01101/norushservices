import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.(png|jpe?g|gif|svg)$/i,
      use: [
        {
          loader: 'file-loader',
          options: {
            publicPath: '/_next/static/media',
            outputPath: 'static/media',
            name: '[name].[hash].[ext]',
            esModule: false,
          },
        },
      ],
    });

    config.module.rules.push({
      test: /\.(otf|woff|woff2|ttf)$/i,
      use: [
        {
          loader: 'file-loader',
          options: {
            publicPath: '/_next/static/fonts',
            outputPath: 'static/fonts',
            name: '[name].[hash].[ext]',
            esModule: false,
          },
        },
      ],
    });

    return config;
  }
};

export default nextConfig;
