module.exports = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: { and: [/\.(js|ts|md)x?$/] },
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            //svgoConfig: { plugins: [{ removeViewBox: false }] }
            //svgoConfig: { plugins: [{ removeViewBox: false }] }
            svgoConfig: {
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          // disable plugins
          removeViewBox: false,
        },
      },
    },
  ],
},
          }
        }
      ]
    });
    return config;
  }
};