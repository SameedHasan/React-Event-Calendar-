import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/Calender.jsx'),
      name: 'ReactEventCalendarSuite',
      fileName: (format) => `react-event-calendar-suite.${format === 'es' ? 'js' : 'umd.cjs'}`,
      formats: ['es', 'umd']
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'react/jsx-dev-runtime',
        'antd',
        'dayjs',
        'zustand',
        '@ant-design/icons'
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime',
          'react/jsx-dev-runtime': 'jsxDevRuntime',
          antd: 'antd',
          dayjs: 'dayjs',
          zustand: 'zustand',
          '@ant-design/icons': 'icons'
        }
      }
    }
  }
})
