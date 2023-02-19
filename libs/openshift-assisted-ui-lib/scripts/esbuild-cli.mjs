/* eslint-disable @typescript-eslint/no-var-requires */
import 'zx/globals';
import esbuild from 'esbuild';


/** @param {import('esbuild').BuildResult} buildResult */
const handleBuildSucceeded = (buildResult) => {
  console.log('Build succeeded');
  if (buildResult.errors?.length > 0) {
    console.error(...buildResult.errors);
  }
  
  if (buildResult.warnings?.length > 0) {
    console.warn(...buildResult.warnings);
  }
  
  if (buildResult.outputFiles?.length > 0) {
    console.info(...buildResult.outputFiles.map(({ path }) => path));
  }
};

async function main() {
  const pwd = process.cwd();
  const esbuildConfigFile = argv['c'];
  const isWatchMode = argv['watch']

  const { default: esbuildConfig } = await import(path.resolve(pwd, esbuildConfigFile));
  if (fs.existsSync(esbuildConfig.outdir)) {
    fs.rmSync(esbuildConfig.outdir, { recursive: true });
  }

  try {
    let buildResult = null;
    if (isWatchMode) {
      buildResult = esbuild.build({
        ...esbuildConfig,
        watch: {
          onRebuild(error, result) {
            if (error) {
              console.error('Watch build failed:', error);
            } else {
              console.log('Watch build succeeded:', result);
            }
          },
        },
      });
      console.log('Build succeeded and started watching', buildResult)
    } else {
      buildResult = esbuild.build(esbuildConfig);
    }

    handleBuildSucceeded(buildResult);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();
