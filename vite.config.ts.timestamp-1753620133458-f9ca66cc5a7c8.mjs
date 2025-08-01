// vite.config.ts
import { defineConfig } from "file:///D:/Projects/Portfolio/node_modules/vite/dist/node/index.js";
import react from "file:///D:/Projects/Portfolio/node_modules/@vitejs/plugin-react/dist/index.js";
import mdx from "file:///D:/Projects/Portfolio/node_modules/@mdx-js/rollup/index.js";
import path from "path";
var vite_config_default = defineConfig({
  plugins: [mdx(), react()],
  resolve: {
    alias: {
      "@": path.resolve("./src"),
      "@assets": path.resolve("./src/assets"),
      "@components": path.resolve("./src/components"),
      "@hooks": path.resolve("./src/hooks"),
      "@styles": path.resolve("./src/assets/styles")
    }
  },
  server: {
    port: 3e3,
    open: true
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: true,
    rollupOptions: {
      output: {
        entryFileNames: "assets/[name].min.js",
        chunkFileNames: "assets/[name].[hash].chunk.js",
        assetFileNames: (assetInfo) => {
          const extType = assetInfo.name?.split(".").at(1) || "";
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            return "assets/images/[name][extname]";
          }
          if (/css/i.test(extType)) {
            return "assets/styles/[name].min[extname]";
          }
          return "assets/[name][extname]";
        }
      }
    }
  },
  define: {
    "process.env": {}
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxQcm9qZWN0c1xcXFxQb3J0Zm9saW9cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXFByb2plY3RzXFxcXFBvcnRmb2xpb1xcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovUHJvamVjdHMvUG9ydGZvbGlvL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnO1xuaW1wb3J0IG1keCBmcm9tICdAbWR4LWpzL3JvbGx1cCc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFttZHgoKSwgcmVhY3QoKV0sXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgJ0AnOiBwYXRoLnJlc29sdmUoJy4vc3JjJyksXG4gICAgICAnQGFzc2V0cyc6IHBhdGgucmVzb2x2ZSgnLi9zcmMvYXNzZXRzJyksXG4gICAgICAnQGNvbXBvbmVudHMnOiBwYXRoLnJlc29sdmUoJy4vc3JjL2NvbXBvbmVudHMnKSxcbiAgICAgICdAaG9va3MnOiBwYXRoLnJlc29sdmUoJy4vc3JjL2hvb2tzJyksXG4gICAgICAnQHN0eWxlcyc6IHBhdGgucmVzb2x2ZSgnLi9zcmMvYXNzZXRzL3N0eWxlcycpXG4gICAgfVxuICB9LFxuICBzZXJ2ZXI6IHtcbiAgICBwb3J0OiAzMDAwLFxuICAgIG9wZW46IHRydWVcbiAgfSxcbiAgYnVpbGQ6IHtcbiAgICBvdXREaXI6ICdkaXN0JyxcbiAgICBhc3NldHNEaXI6ICdhc3NldHMnLFxuICAgIHNvdXJjZW1hcDogdHJ1ZSxcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBvdXRwdXQ6IHtcbiAgICAgICAgZW50cnlGaWxlTmFtZXM6ICdhc3NldHMvW25hbWVdLm1pbi5qcycsXG4gICAgICAgIGNodW5rRmlsZU5hbWVzOiAnYXNzZXRzL1tuYW1lXS5baGFzaF0uY2h1bmsuanMnLFxuICAgICAgICBhc3NldEZpbGVOYW1lczogKGFzc2V0SW5mbykgPT4ge1xuICAgICAgICAgIGNvbnN0IGV4dFR5cGUgPSBhc3NldEluZm8ubmFtZT8uc3BsaXQoJy4nKS5hdCgxKSB8fCAnJztcbiAgICAgICAgICBpZiAoL3BuZ3xqcGU/Z3xzdmd8Z2lmfHRpZmZ8Ym1wfGljby9pLnRlc3QoZXh0VHlwZSkpIHtcbiAgICAgICAgICAgIHJldHVybiAnYXNzZXRzL2ltYWdlcy9bbmFtZV1bZXh0bmFtZV0nO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoL2Nzcy9pLnRlc3QoZXh0VHlwZSkpIHtcbiAgICAgICAgICAgIHJldHVybiAnYXNzZXRzL3N0eWxlcy9bbmFtZV0ubWluW2V4dG5hbWVdJztcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuICdhc3NldHMvW25hbWVdW2V4dG5hbWVdJztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgZGVmaW5lOiB7XG4gICAgJ3Byb2Nlc3MuZW52Jzoge31cbiAgfVxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXVQLFNBQVMsb0JBQW9CO0FBQ3BSLE9BQU8sV0FBVztBQUNsQixPQUFPLFNBQVM7QUFDaEIsT0FBTyxVQUFVO0FBR2pCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVMsQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDO0FBQUEsRUFDeEIsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxLQUFLLFFBQVEsT0FBTztBQUFBLE1BQ3pCLFdBQVcsS0FBSyxRQUFRLGNBQWM7QUFBQSxNQUN0QyxlQUFlLEtBQUssUUFBUSxrQkFBa0I7QUFBQSxNQUM5QyxVQUFVLEtBQUssUUFBUSxhQUFhO0FBQUEsTUFDcEMsV0FBVyxLQUFLLFFBQVEscUJBQXFCO0FBQUEsSUFDL0M7QUFBQSxFQUNGO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsRUFDUjtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsUUFBUTtBQUFBLElBQ1IsV0FBVztBQUFBLElBQ1gsV0FBVztBQUFBLElBQ1gsZUFBZTtBQUFBLE1BQ2IsUUFBUTtBQUFBLFFBQ04sZ0JBQWdCO0FBQUEsUUFDaEIsZ0JBQWdCO0FBQUEsUUFDaEIsZ0JBQWdCLENBQUMsY0FBYztBQUM3QixnQkFBTSxVQUFVLFVBQVUsTUFBTSxNQUFNLEdBQUcsRUFBRSxHQUFHLENBQUMsS0FBSztBQUNwRCxjQUFJLGtDQUFrQyxLQUFLLE9BQU8sR0FBRztBQUNuRCxtQkFBTztBQUFBLFVBQ1Q7QUFDQSxjQUFJLE9BQU8sS0FBSyxPQUFPLEdBQUc7QUFDeEIsbUJBQU87QUFBQSxVQUNUO0FBQ0EsaUJBQU87QUFBQSxRQUNUO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixlQUFlLENBQUM7QUFBQSxFQUNsQjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
