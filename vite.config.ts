import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mdx from '@mdx-js/rollup';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [mdx(), react()],
  resolve: {
    alias: {
      '@': path.resolve('./src'),
      '@assets': path.resolve('./src/assets'),
      '@components': path.resolve('./src/components'),
      '@hooks': path.resolve('./src/hooks'),
      '@styles': path.resolve('./src/assets/styles')
    }
  },
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].min.js',
        chunkFileNames: 'assets/[name].[hash].chunk.js',
        assetFileNames: (assetInfo) => {
          const extType = assetInfo.name?.split('.').at(1) || '';
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            return 'assets/images/[name][extname]';
          }
          if (/css/i.test(extType)) {
            return 'assets/styles/[name].min[extname]';
          }
          return 'assets/[name][extname]';
        }
      }
    }
  },
  define: {
    'process.env': {}
  }
});
