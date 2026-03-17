/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/JudgyDuck.io",
  assetPrefix: "/JudgyDuck.io/",
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
