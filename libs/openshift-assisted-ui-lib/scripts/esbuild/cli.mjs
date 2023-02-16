import esbuild from 'esbuild';
import { dtsPlugin } from 'esbuild-plugin-d.ts';
import { loadJSON } from '../toolbox.mjs';

function main() {
  const packageJson = loadJSON('../../package.json');
  const tsconfigJson = loadJSON('../../tsconfig.json');
  const srcDir = path.resolve(path.dirname(packageJson.source));
  const outDir = path.resolve(tsconfigJson.compilerOptions.outDir);

  try {
    esbuild.build({
      entryPoints: [packageJson.source, path.resolve(srcDir, '/cim/index.ts'), path.resolve(srcDir, '/ocm/index.ts')],
      external: [...Object.keys(packageJson.dependencies), ...Object.keys(packageJson.peerDependencies)],
      bundle: true,
      sourcemap: true,
      minify: false,
      outDir,
      format: 'esm',
      target: ['esnext'],
      plugins: [
        dtsPlugin(),
      ],
    });

    buildResult.outputFiles.forEach(f => console.log(f.path))
    buildResult.warnings.forEach(msg => console.warn(msg))
    buildResult.errors.forEach(msg => console.error(msg))
  } catch (e) {
    /** @type {import('esbuild').BuildFailure} */
    const error = e;
    console.error(error.name, error.message);
    process.exit(1);
  }
}

main();