import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    copyPublicDir: false,
    emptyOutDir: false,
    outDir: 'dist/utils',
    lib: {
      entry: {
        icsExport: resolve(__dirname, 'src/utils/icsExport.js'),
        icsImport: resolve(__dirname, 'src/utils/icsImport.js'),
      },
      formats: ['es', 'cjs'],
      fileName: (format, entryName) =>
        `${entryName}.${format === 'es' ? 'js' : 'cjs'}`,
    },
    rollupOptions: {
      external: ['dayjs'],
      output: {
        globals: { dayjs: 'dayjs' },
      },
    },
  },
})
