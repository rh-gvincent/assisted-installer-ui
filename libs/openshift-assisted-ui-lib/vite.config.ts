import module from "node:module";
import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import dts from 'vite-plugin-dts'

const require = module.createRequire(import.meta.url);
const pkgManifest = require('./package.json');

export default defineConfig({
  build: {
    lib: {
      entry: {
        'index': path.resolve(pkgManifest.exports["."]),
        'cim': path.resolve(pkgManifest.exports["./cim"]),
        'ocm': path.resolve(pkgManifest.exports["./ocm"]),
      },
      formats: ['es', 'cjs'],
    },
    minify: false,
    rollupOptions: {
      external: [...Object.keys(pkgManifest.peerDependencies)],
    },
    outDir: "build/lib",
    sourcemap: true,
  },
  plugins: [
    react(),
    dts({ skipDiagnostics: true  }),
  ],
});
