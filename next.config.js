const withPWA = require('next-pwa')
const runtimeCaching = require('next-pwa/cache')

module.exports = withPWA({
  headers() {
    return [
      {
        source: '/api/file/:file*',
        headers: [
          {
            key: 'Cache-Control',
            value:
              'public, max-age=31536000, s-maxage=31536000, stale-while-revalidate=31536000',
          },
        ],
      },
    ]
  },
  redirects() {
    return [
      {
        source: '/note',
        destination: '/',
        permanent: true,
      },
    ]
  },
  webpack(config, { defaultLoaders }) {
    config.module.rules.push({
      test: /\.jsx/,
      use: [defaultLoaders.babel],
      include: [/node_modules\/heroicons/],
    })

    return config
  },
  pwa: {
    disable: process.env.NODE_ENV === 'development',
    dest: 'public',
    runtimeCaching,
  },
})
