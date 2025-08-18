import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  images:{
    remotePatterns:[
      {
        protocol:'https',
        hostname:"img.freepik.com"
      },{
        protocol:'https',
        hostname:'nyc.cloud.appwrite.io'
      }
    ]
  }
};

export default nextConfig;
