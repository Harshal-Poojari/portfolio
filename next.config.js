const { withContentlayer } = require('next-contentlayer2')

/** @type {import('next').NextConfig} */
const nextConfig = {
  // your existing config
}

module.exports = withContentlayer(nextConfig)
