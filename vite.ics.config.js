import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    copyPublicDir: false,
    emptyOutDir: false,
    outDir: 'dist/utils',
    lib: {
      entry: resolve(__dirname, 'src/utils/icsExport.js'),
      name: 'ReactEventCalendarSuiteICS',
      formats: ['es', 'cjs'],
      fileName: (format) => `icsExport.${format === 'es' ? 'js' : 'cjs'}`,
    },
    rollupOptions: {
      external: ['dayjs'],
      output: {
        globals: { dayjs: 'dayjs' },
      },
    },
  },
})
