import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

const external = [
  'react',
  'react-dom',
  'react-dom/client',
  'react/jsx-runtime',
  'react/jsx-dev-runtime',
  'dayjs',
  'zustand',
  'zustand/react',
  'zustand/vanilla',
  'zustand/react/shallow',
  // Bundled into the consumer app (installed automatically via dependencies),
  // kept out of our dist so it stays lean and tree-shakeable.
  'react-datepicker',
  'react-datepicker/dist/react-datepicker.css',
]

const globals = {
  react: 'React',
  'react-dom': 'ReactDOM',
  'react-dom/client': 'ReactDOMClient',
  'react/jsx-runtime': 'jsxRuntime',
  'react/jsx-dev-runtime': 'jsxDevRuntime',
  dayjs: 'dayjs',
  zustand: 'zustand',
  'zustand/react': 'zustand',
  'zustand/vanilla': 'zustand',
  'zustand/react/shallow': 'zustand',
  'react-datepicker': 'ReactDatePicker',
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
