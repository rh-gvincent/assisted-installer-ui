import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import dts from 'vite-plugin-dts'
import { chunkSplitPlugin } from 'vite-plugin-chunk-split';
import pkgManifest from "./package.json";

export default defineConfig({
  build: {
    lib: {
      entry: {
        'cim/index': path.resolve(pkgManifest.exports["./cim"].default),
        'ocm/index': path.resolve(pkgManifest.exports["./ocm"].default),
      },
      formats: ['es'],
    },
    minify: false,
    rollupOptions: {
      external: (id) => Object.keys(pkgManifest.peerDependencies).some(dep => new RegExp(dep).test(id)),
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
