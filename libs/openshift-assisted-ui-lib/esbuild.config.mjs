import { dtsPlugin } from 'esbuild-plugin-d.ts';
import { genenrateEntriesFromSources, packageJson, tsconfigJson } from './scripts/toolbox.mjs';

// Each source file becomes a separate chunk
// const entryPoints = genenrateEntriesFromSources('./src/**/*.!(yaml)');
// Generates only 3 chunks 
const entryPoints = [
  packageJson['ai:sources'].default,
  packageJson['ai:sources'].cim,
  packageJson['ai:sources'].ocm
];

/** @type {import('esbuild').BuildOptions} */
export default {
  bundle: true,
  entryPoints,
  // Don't bundle dependences and peerDependencies https://github.com/evanw/esbuild/issues/727#issuecomment-771743582
  external: [
    ...Object.keys(packageJson.dependencies),
    ...Object.keys(packageJson.peerDependencies),
  ],
  format: 'esm',
  minify: false,
  outdir: tsconfigJson.compilerOptions.outDir,
  plugins: [
    dtsPlugin(), // requires "noEmit": false in tsconfig.json to successfully emit types
  ],
  sourcemap: true,
  target: ['esnext'],
};
