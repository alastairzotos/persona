import { defineConfig } from 'vite'
import * as path from 'path';
import react from '@vitejs/plugin-react-swc'
import hotReloadExtension from 'hot-reload-extension-vite'
import { viteStaticCopy } from 'vite-plugin-static-copy';

import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@bitmetro/persona-react': path.resolve(__dirname, '..', '..', 'libs', 'react', 'dist'),
      '@bitmetro/persona-extension': path.resolve(__dirname, '..', '..', 'libs', 'extension', 'dist'),
      'react': path.resolve(__dirname, 'node_modules/react'),
    },
  },
  plugins: [
    react(),
    hotReloadExtension({
      log: true,
      backgroundPath: 'src/background.ts',
    }),
    viteStaticCopy({
      targets: [
        {
          src: 'manifest.json',
          dest: '.'
        },
        {
          src: 'public/icons/*',
          dest: 'icons/'
        }
      ]
    }),
    nodePolyfills(),
  ],
  // optimizeDeps: {
  //   esbuildOptions: {
  //     plugins: [
  //       NodeGlobalsPolyfillPlugin({
  //         process: true,
  //         buffer: true
  //       }),
  //       NodeModulesPolyfillPlugin()
  //     ] as any[],
  //   }
  // },
  // optimizeDeps: {
  //   include: ['@bitmetro/persona-react']
  // },
  build: {
    // commonjsOptions: {
    //   include: [/@bitmetro\/persona-react/, /node-modules/]
    // },
    rollupOptions: {
      external: ['react/jsx-runtime'],
      input: {
        background: 'src/background.ts',
        popup: 'src/App.tsx',
        main: 'index.html'
      },
      output: {
        dir: 'dist',
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
      },
    }
  }
})
