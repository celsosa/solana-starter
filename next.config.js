/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    /*
    domains: [
      "i.giphy.com",
      "media3.giphy.com",
      "media4.giphy.com",
      "media1.giphy.com",
    ],
    */
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

module.exports = nextConfig;
