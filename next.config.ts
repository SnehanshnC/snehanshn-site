import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ADR 0002 "Routes": the journey is the site. The old standalone pages
  // 301 to their rung E anchors so inbound links keep landing somewhere
  // meaningful. statusCode 301 (not Next's default 308) per the ADR.
  async redirects() {
    return [
      { source: "/fun", destination: "/#hobbies", statusCode: 301 },
      { source: "/about", destination: "/#who-i-am", statusCode: 301 },
    ];
  },
};

export default nextConfig;
