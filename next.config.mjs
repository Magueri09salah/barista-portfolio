import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // A stray lockfile in the home directory makes Next infer the wrong
  // workspace root. Pin it to this project.
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
