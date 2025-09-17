import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import path from 'path';
import type { PreRenderedAsset } from 'rollup';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

const isLibraryBuild = process.env.NODE_ENV === 'publish';
const shouldAnalyze = process.env.ANALYZE === 'true';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: isLibraryBuild
          ? [
              [
                'babel-plugin-jsx-remove-data-test-id',
                {
                  attributes: ['data-testid'],
                },
              ],
            ]
          : [],
      },
    }),
    dts({
      insertTypesEntry: true,
      exclude: [
        'e2e/**/*',
        'stories/**/*',
        'src/main.tsx',
        'src/App.tsx',
        'src/App.css',
        '**/*.stories.ts',
        '**/*.stories.tsx',
        '**/*.test.ts',
        '**/*.test.tsx',
      ],
      tsconfigPath: './tsconfig.lib.json',
    }),
    shouldAnalyze &&
      isLibraryBuild &&
      visualizer({
        filename: 'dist/bundle-analysis.html',
        open: true,
        gzipSize: true,
        brotliSize: true,
        template: 'treemap',
      }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ReactTableMapping',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'mjs' : 'js'}`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime', 'uuid'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime',
          uuid: 'uuid',
        },
        assetFileNames: (assetInfo: PreRenderedAsset): string => {
          if (assetInfo.name === 'style.css') {
            return 'react-table-mapping.css';
          }
          return assetInfo.name || 'unknown.file';
        },
      },
    },
    sourcemap: true,
    emptyOutDir: true,
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
