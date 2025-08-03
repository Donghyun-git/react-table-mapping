import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import path from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
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
      external: ['react', 'react-dom', 'uuid', 'lodash'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          uuid: 'uuid',
          lodash: 'lodash',
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
