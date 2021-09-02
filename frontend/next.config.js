/** @type {import('next').NextConfig} */
module.exports = {
  basePath: '/bestsell',
  reactStrictMode: true,
  images: {
    domains: [
      'tailwindui.com'
    ]
  },
  async rewrites() {
    return [
      {
        source: '/bestsell/api/:path*',
        destination: 'http://backend:8000/:path*'
      }
    ]
  }
}
