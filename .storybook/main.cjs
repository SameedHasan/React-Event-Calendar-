const path = require('path');

const repoRoot = path.resolve(__dirname, '..');

/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.@(js|jsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-links'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {},
  async viteFinal(viteConfig) {
    const r = (pkg) => path.resolve(repoRoot, 'node_modules', pkg);

    viteConfig.resolve = viteConfig.resolve ?? {};
    viteConfig.resolve.alias = {
      ...viteConfig.resolve.alias,
      'react-event-calendar-suite/style.css': path.join(repoRoot, 'src/index.css'),
      'react-event-calendar-suite': path.join(repoRoot, 'src/Calender.jsx'),
      react: r('react'),
      'react-dom': r('react-dom'),
      'react-dom/client': r('react-dom/client'),
      'react/jsx-runtime': r('react/jsx-runtime'),
      'react/jsx-dev-runtime': r('react/jsx-dev-runtime'),
    };
    viteConfig.resolve.dedupe = ['react', 'react-dom', 'zustand'];
    viteConfig.server = viteConfig.server ?? {};
    viteConfig.server.fs = { allow: [repoRoot] };

    if (process.env.STORYBOOK_BASE) {
      viteConfig.base = process.env.STORYBOOK_BASE;
    }

    return viteConfig;
  },
};

module.exports = config;
