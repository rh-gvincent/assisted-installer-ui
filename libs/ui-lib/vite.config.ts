import { defineConfig } from 'vite';
import { externalizeDeps } from 'vite-plugin-externalize-deps';
import dts from 'vite-plugin-dts'
import tsconfigJson from './tsconfig.json';
import packageJson from './package.json';


const { outDir, rootDir } = tsconfigJson.compilerOptions;

export default defineConfig({
  build: {
    emptyOutDir: true,
    lib: {
      entry: { index: packageJson.source },
      formats: ['es'],
    },
    minify: false,    
    outDir,
    rollupOptions: {
      makeAbsoluteExternalsRelative: true,
      output: {
        hoistTransitiveImports: false,
        preserveModules: true,
        preserveModulesRoot: rootDir,
        sourcemapExcludeSources: true,
      },
    },
    sourcemap: true,
    target: ['esnext'],
  },
  plugins: [
    externalizeDeps({
      deps: true,
      peerDeps: true,
    }),
    dts({
      skipDiagnostics: true,
      copyDtsFiles: false,
      noEmitOnError: true,
    }),
  ],
});