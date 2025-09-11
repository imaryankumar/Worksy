/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["avatar.iran.liara.run"],
  },
  async rewrites() {
    return [
      { source: "/overview", destination: "/dashboard/overview" },
      { source: "/leaves", destination: "/dashboard/leaves" },
      { source: "/worklogs", destination: "/dashboard/worklogs" },
      { source: "/attendance", destination: "/dashboard/attendance" },
      { source: "/inventory", destination: "/dashboard/inventory" },
      { source: "/profile", destination: "/dashboard/profile" },
    ];
  },
};

export default nextConfig;
