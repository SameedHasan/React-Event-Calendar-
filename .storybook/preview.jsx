import React from 'react';
import '../src/index.css';

/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    layout: 'fullscreen',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        order: ['Introduction', 'Calendar', '*'],
      },
    },
  },
  decorators: [
    (_Story) => (
      <div
        style={{
          minHeight: '100vh',
          padding: 16,
          boxSizing: 'border-box',
          background: 'var(--calendar-story-bg, #f5f5f5)',
        }}
      >
        <_Story />
      </div>
    ),
  ],
};

export default preview;
