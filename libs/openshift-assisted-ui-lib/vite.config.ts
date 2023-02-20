import { defineConfig } from 'vite';
import { externalizeDeps } from 'vite-plugin-externalize-deps';
import dts from 'vite-plugin-dts'
import tsconfig from './tsconfig.json';
import { genenrateEntriesFromSources } from './scripts/toolbox.mjs';

// Each source file becomes a separate chunk
const entryPoints = genenrateEntriesFromSources('src/**/*.!(yaml)');
// Generates only 3 chunks 
// const entryPoints = [
//   packageJson['ai:sources'].default,
//   packageJson['ai:sources'].cim,
//   packageJson['ai:sources'].ocm
// ];

export default defineConfig({
  build: {
    emptyOutDir: true,
    lib: {
      entry: entryPoints,
      formats: ['cjs'],
    },
    minify: false,    
    outDir: tsconfig.compilerOptions.outDir,
    rollupOptions: {
      output: {
        exports: 'named',
        sourcemapExcludeSources: true,
      },
    },
    sourcemap: true,
  },
  plugins: [
    externalizeDeps({
      deps: true,
      peerDeps: true,
    }),
    dts({
      skipDiagnostics: true,
    }),
  ],
});
