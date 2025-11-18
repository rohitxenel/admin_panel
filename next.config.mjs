/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://mobileappindia.com:3032/api/v1/:path*", // backend
      },
    ];
  },
};

export default nextConfig;
