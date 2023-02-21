import { defineConfig } from "vite";
import { externalizeDeps } from "vite-plugin-externalize-deps";
import dts from "vite-plugin-dts";
import tsconfig from "./tsconfig.json";
import renameNodeModules from "rollup-plugin-rename-node-modules";

export default defineConfig({
  build: {
    emptyOutDir: true,
    lib: {
      entry: ["./src/index.ts", "./src/cim/index.ts", "./src/ocm/index.ts"],
      formats: ["cjs"],
    },
    minify: false,
    outDir: tsconfig.compilerOptions.outDir,
    rollupOptions: {
      output: {
        preserveModules: true,
        preserveModulesRoot: "src",
        sourcemapExcludeSources: true,
      },
    },
    sourcemap: true,
  },
  plugins: [
    externalizeDeps({
      deps: false,
      peerDeps: true,
    }),
    dts({
      skipDiagnostics: true,
    }),
    renameNodeModules("ext"),
  ],
});
