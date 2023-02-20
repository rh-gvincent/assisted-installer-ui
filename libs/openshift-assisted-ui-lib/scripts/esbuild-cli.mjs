///<reference types="esbuild">

import 'zx/globals';
import esbuild from 'esbuild';


/**
 * @param {esbuild.BuildContext} [ctx]
 * @returns {NodeJS.SignalsListener}
 */
const handleInterrupt = (ctx = null) => {
  return (signal) => {
    console.error(`\n${signal} recevied, stop watching files...`);
    if (!ctx) {
      process.exit(1);
    }
    
    ctx.dispose().then(() => process.exit(2));
  };
}

async function main() {
  const pwd = process.cwd();
  const esbuildConfigFile = argv['c'];
  const isWatchMode = argv['watch'];
  
  /** @type {esbuild.BuildOptions} */
  const esbuildConfig = (await import(path.resolve(pwd, esbuildConfigFile))).default;
  if (fs.existsSync(esbuildConfig.outdir)) {
    fs.rmSync(esbuildConfig.outdir, { recursive: true });
  }
  
  if (isWatchMode) {
    process.once('SIGINT', handleInterrupt());
    const ctx = await esbuild.context(esbuildConfig); 
    process.once('SIGINT', handleInterrupt(ctx));
    await ctx.watch();
    console.log('Build succeeded, watching files...');
  } else {
    console.log('Building files...');
    await esbuild.build(esbuildConfig);
    console.log('Build succeeded');
  }
}

main();
