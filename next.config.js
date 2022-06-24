/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "i.ibb.co",
      "static.cdnlogo.com",
      "cdn.sanity.io",
      "thirdweb.com",
      "angrynico.xyz",
    ],
  },
};

module.exports = nextConfig;
