import { defineConfig } from 'vite';
import { externalizeDeps } from 'vite-plugin-externalize-deps';
import dts from 'vite-plugin-dts'
import tsconfig from './tsconfig.json';
import { genenrateEntriesFromSources } from './scripts/toolbox.mjs';

const entry = genenrateEntriesFromSources(
  'src/**/*.!(yaml)',
  tsconfig.compilerOptions.rootDir,
  import.meta.url
);

export default defineConfig(({ mode }) => ({
  build: {
    emptyOutDir: true,
    lib: {
      entry,
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
    sourcemap: mode === 'production' ? 'hidden' : true,
  },
  plugins: [
    externalizeDeps({
      deps: false,
      peerDeps: true,
    }),
    dts({
      skipDiagnostics: true,
    }),
  ],
}));
