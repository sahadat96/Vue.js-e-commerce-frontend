import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// Custom plugin to handle require statements
function requireTransform() {
  return {
    name: 'require-transform',
    transform(code, id) {
      // Only transform JavaScript files
      if (id.endsWith('.js') || id.endsWith('.jsx')) {
        // Replace require statements with dynamic imports
        if (code.includes('require(')) {
          return {
            code: code.replace(/require\(['"](.+?)['"]\)/g, 'await import("$1").then(m => m.default || m)'),
            map: null
          };
        }
      }
      return null;
    }
  }
}

export default defineConfig({
  plugins: [
    vue(),
    requireTransform()
  ],
  resolve: {
    alias: {
      // '@': path.resolve(__dirname, './src',import.meta.url),
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    }
  }
})
