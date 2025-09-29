import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    images: {
        // Простой способ:
        // domains: ["interstone.su"],

        // Или более точный контроль путей:
        remotePatterns: [
          {
            protocol: "https",
            hostname: "interstone.su",
            port: "",
            pathname: "/media/images/**",
          },
          {
            protocol: "https",
            hostname: "disk.yandex.ru",
            port: "",
          },
          {
            protocol: "https",
            hostname: "optim.tildacdn.com",
            port: "",
          },
          {
            protocol: "https",
            hostname: "static.tildacdn.com",
            port: "",
          },
          {
            protocol: "https",
            hostname: "quantraquartz.ru",
            port: "",
          },
          {
            protocol: "https",
            hostname: "technistone.ru",
            port: "",
          },
        ],
    },
};

export default nextConfig;
