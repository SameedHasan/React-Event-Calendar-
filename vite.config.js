import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

const external = [
  'react',
  'react-dom',
  'react/jsx-runtime',
  'react/jsx-dev-runtime',
  'antd',
  'dayjs',
  'zustand',
  '@ant-design/icons',
]

const globals = {
  react: 'React',
  'react-dom': 'ReactDOM',
  'react/jsx-runtime': 'jsxRuntime',
  'react/jsx-dev-runtime': 'jsxDevRuntime',
  antd: 'antd',
  dayjs: 'dayjs',
  zustand: 'zustand',
  '@ant-design/icons': 'icons',
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    copyPublicDir: false,
    emptyOutDir: true,
    lib: {
      entry: resolve(__dirname, 'src/Calender.jsx'),
      name: 'ReactEventCalendarSuite',
      formats: ['es', 'umd'],
      fileName: (format) => `react-event-calendar-suite.${format === 'es' ? 'js' : 'umd.cjs'}`,
    },
    rollupOptions: {
      external,
      output: { globals },
    },
  },
})
