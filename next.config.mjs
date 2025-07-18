/** @type {import('next').NextConfig} */

const { withNetlify } = require('@netlify/next');

module.exports = withNetlify({
  reactStrictMode: true,
});

const nextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
