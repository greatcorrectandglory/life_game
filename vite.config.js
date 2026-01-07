import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3000,
    open: true,
    cors: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          'core': [
            './src/core/enhancedState.js',
            './src/core/engine.js',
            './src/core/combat.js',
            './src/core/director.js',
            './src/core/economy.js'
          ],
          'systems': [
            './src/systems/cognitive.js',
            './src/systems/skills.js',
            './src/systems/events.js'
          ],
          'utils': [
            './src/utils/logger.js',
            './src/utils/helpers.js',
            './src/utils/saveSystem.js'
          ],
          'data': [
            './src/data/chapters.js',
            './src/data/actions.js',
            './src/data/skillsTree.js',
            './src/data/events.js',
            './src/data/constants.js',
            './src/data/zones.js'
          ]
        }
      }
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html']
    }
  }
});
