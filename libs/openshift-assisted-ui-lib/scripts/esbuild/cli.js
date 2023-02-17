/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('node:fs');
const esbuild = require('esbuild');
const commonConfig = require('./esbuild.config');

/** @param {import('esbuild').BuildResult} buildResult */
const handleDone = (buildResult) => {
  console.log('Build succeeded');
  if (buildResult.errors.length > 0) console.error(...buildResult.errors);
  if (buildResult.warnings.length > 0) console.warn(...buildResult.warnings);
  if (buildResult.outputFiles.length > 0) console.info(...buildResult.outputFiles);
};

/** @param {import('esbuild').BuildFailure} buildFailure */
const handleError = (buildFailure) => {
  console.error(buildFailure.name, buildFailure.message);
  if (buildFailure.errors.length > 0) console.error(...buildFailure.errors);
  if (buildFailure.warnings.length > 0) console.warn(...buildFailure.warnings);
  if (buildFailure.stack) console.error(buildFailure.stack);
  
  process.exit(1);
};

const handleAbort = (ctx) => (signal) => {
  console.warn(signal, 'recevied, stop watching files.');
  ctx.dispose();
  process.exit(0);
}

async function watchMode(config) {
  const ctx = await esbuild.context(config);
  process.on('SIGINT', handleAbort(ctx));
  process.on('SIGQUIT', handleAbort(ctx));
  process.on('SIGTERM', handleAbort(ctx));
  await ctx.watch();
  console.log('Watching files...');
}

if (fs.existsSync(commonConfig.outdir)) {
  fs.rmSync(commonConfig.outdir, { recursive: true });
}

if (process.argv[2] === 'watch') {
  watchMode(commonConfig);
} else {
  esbuild
    .build(commonConfig)
    .then(handleDone)
    .catch(handleError);
}
