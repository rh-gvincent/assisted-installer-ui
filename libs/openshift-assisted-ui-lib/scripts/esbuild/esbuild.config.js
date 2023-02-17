/* eslint-disable @typescript-eslint/no-var-requires */
const { dtsPlugin } = require('esbuild-plugin-d.ts');
const packageJson = require('../../package.json');
const tsconfigJson = require('../../tsconfig.json');

/** @type {import('esbuild').BuildOptions} */
const buildOptions = {
  entryPoints: [
    packageJson['ai:sources'].default,
    packageJson['ai:sources'].cim,
    packageJson['ai:sources'].ocm
  ],
  // Don't bundle dependences and peerDependencies https://github.com/evanw/esbuild/issues/727#issuecomment-771743582
  external: [
    ...Object.keys(packageJson.dependencies),
    ...Object.keys(packageJson.peerDependencies),
  ],
  bundle: true,
  minify: false,
  sourcemap: true,
  outdir: tsconfigJson.compilerOptions.outDir,
  format: 'esm',
  target: ['esnext'],
  plugins: [
    dtsPlugin(), // requires "noEmit": false in tsconfig.json to successfully emit types
  ],
};

module.exports = buildOptions;
