import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../..');
const exampleNodeModules = path.join(__dirname, 'node_modules');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Monorepo: trace files from repo root (there are multiple lockfiles)
  outputFileTracingRoot: repoRoot,
  transpilePackages: ['react-event-calendar-suite'],
  webpack: (config) => {
    // Prefer this example's node_modules so the linked package shares one React
    // (do NOT alias react/react-dom globally — that breaks Next.js internals)
    config.resolve.modules = [
      exampleNodeModules,
      ...(config.resolve.modules || ['node_modules']),
    ];

    config.resolve.alias = {
      ...config.resolve.alias,
      'react-event-calendar-suite/style.css': path.join(
        repoRoot,
        'dist/react-event-calendar-suite.css'
      ),
      'react-event-calendar-suite': path.join(
        repoRoot,
        'dist/react-event-calendar-suite.js'
      ),
    };

    return config;
  },
};

export default nextConfig;
