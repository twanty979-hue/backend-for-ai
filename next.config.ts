// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // เพิ่มส่วน headers เพื่อแก้เรื่อง CORS
  async headers() {
    return [
      {
        source: "/api/:path*", // บังคับใช้กับทุก API
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" }, // อนุญาตทุกที่ (สำคัญ!)
          { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
        ]
      }
    ]
  }
};

export default nextConfig;