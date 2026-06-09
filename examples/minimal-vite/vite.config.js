import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../..');
const r = (pkg) => path.resolve(__dirname, 'node_modules', pkg);

/**
 * Local example: bundle the calendar from source (src/) via alias.
 * The source's bare imports (react, zustand, ...) would otherwise resolve from
 * the repo root node_modules, creating a second React copy. The explicit
 * react/react-dom/zustand aliases + dedupe force a single shared instance.
 * Published consumers install from npm normally — none of this is needed.
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom', 'zustand'],
    alias: [
      { find: 'react-event-calendar-suite/style.css', replacement: path.join(repoRoot, 'src/index.css') },
      { find: 'react-event-calendar-suite', replacement: path.join(repoRoot, 'src/Calender.jsx') },
      { find: /^react$/, replacement: r('react') },
      { find: /^react-dom$/, replacement: r('react-dom') },
      { find: /^react-dom\/client$/, replacement: r('react-dom/client') },
      { find: /^react\/jsx-runtime$/, replacement: r('react/jsx-runtime') },
      { find: /^react\/jsx-dev-runtime$/, replacement: r('react/jsx-dev-runtime') },
    ],
  },
  server: {
    fs: {
      allow: [repoRoot],
    },
  },
});
