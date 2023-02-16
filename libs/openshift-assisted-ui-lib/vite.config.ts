import path from 'node:path';
import { defineConfig } from 'vite';
import { externalizeDeps } from 'vite-plugin-externalize-deps';
import dts from 'vite-plugin-dts'
import packageJson from './package.json';
import tsconfig from './tsconfig.json';

export default defineConfig({
  build: {
    emptyOutDir: true,
    lib: {
      entry: {
        'index': path.resolve(packageJson.source),
        // 'cim/index': path.resolve("./src/cim/index.ts"),
        // 'ocm/index': path.resolve("./src/ocm/index.ts"),
      },
      formats: ['cjs'],
    },
    minify: false,    
    // rollupOptions: {
    //   output: {
    //     exports: 'named',
    //     preserveModules: true,
    //     preserveModulesRoot: 'src',
    //     sourcemapExcludeSources: true,
    //   },
    // },
    outDir: tsconfig.compilerOptions.outDir,
    sourcemap: process.env.NODE_ENV === 'production' ? 'hidden' : 'inline',
  },
  plugins: [
    externalizeDeps({
      peerDeps: true,
    }),
    dts({
      skipDiagnostics: true,
    }),
  ],
});
