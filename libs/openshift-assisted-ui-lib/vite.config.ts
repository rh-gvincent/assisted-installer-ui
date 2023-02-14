import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import dts from 'vite-plugin-dts'
import { chunkSplitPlugin } from 'vite-plugin-chunk-split';
import pkgManifest from "./package.json";

export default defineConfig({
  build: {
    emptyOutDir: true,
    lib: {
      entry: {
        'index': path.resolve("./src/index.ts"),
        'cim/index': path.resolve("./src/cim/index.ts"),
        'ocm/index': path.resolve("./src/ocm/index.ts"),
      },
      formats: ['es'],
    },
    minify: false,
    rollupOptions: {
      external: (id: string) => Object.keys(pkgManifest.peerDependencies).some(dep => new RegExp(dep).test(id)),
      output: {
        sourcemapExcludeSources: true,
      },
    },
    outDir: "build/lib",
    sourcemap: true,
  },
  plugins: [
    react(),
    dts({
      skipDiagnostics: true
    }),
    chunkSplitPlugin({
      strategy: "all-in-one",
      customSplitting: {
        'common/index': [/src\/common/],
        'deps': [/node_modules/]
      }
    })
  ],
});
