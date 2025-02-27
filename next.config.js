/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config, { isServer }) => {
    // contract と hakatchi_engine ディレクトリを無視する
    config.watchOptions = {
      ...config.watchOptions,
      ignored: [
        "**/contract/**",
        "**/hakatchi_engine/**",
        "**/node_modules/**",
      ],
    };

    return config;
  },
  // これらのディレクトリをビルドプロセスから除外
  transpilePackages: [],
  experimental: {
    // ビルド時に特定のディレクトリを無視
    outputFileTracingIgnores: ["**/contract/**", "**/hakatchi_engine/**"],
  },
};

module.exports = nextConfig;
