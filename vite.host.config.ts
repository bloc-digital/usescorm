import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

// Standalone host script for SCORM packages, exposed as the `UseScormHost` global.
export default defineConfig({
  publicDir: false,
  build: {
    outDir: fileURLToPath(new URL('./dist/host', import.meta.url)),
    emptyOutDir: true,
    lib: {
      entry: fileURLToPath(new URL('./src/bridge/host.ts', import.meta.url)),
      name: 'UseScormHost',
      formats: ['iife'],
      fileName: () => 'usescorm-host.js',
    },
  },
});
