import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import path from 'path';
import type { PreRenderedAsset } from 'rollup';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      exclude: [
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
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ReactTableMapping',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'mjs' : 'js'}`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime', 'uuid', 'lodash'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime',
          uuid: 'uuid',
          lodash: 'lodash',
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
