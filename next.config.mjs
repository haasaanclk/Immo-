/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // libSQL ships native bindings — keep it external to the server bundle.
  experimental: {
    serverComponentsExternalPackages: ["@libsql/client", "libsql"],
  },
};

export default nextConfig;
