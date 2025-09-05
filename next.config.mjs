/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8082',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'mobileappindia.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'mobileappindia.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'www.mobileappindia.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.mobileappindia.com',
        pathname: '/**',
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*", 
        destination: "http://mobileappindia.com:3032/api/v1/:path*", 
      },
    ];
  },
};

export default nextConfig;
