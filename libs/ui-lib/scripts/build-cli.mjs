import "zx/globals";
import throttle from "lodash-es/throttle.js";
import chokidar from "chokidar";
import tsconfigCjsJson from "../tsconfig.cjs.json" assert { type: "json" };
import tsconfigEsmJson from "../tsconfig.esm.json" assert { type: "json" };

const pwd = process.cwd();

class BuildJob {
  #outDir = null;
  #rootDir = null;
  #isVerbose = false;
  #isWatchMode = false;
  #tsconfigName = null;

  constructor(tsconfig, isVerbose = false, isWatchMode = false) {
    this.#outDir = tsconfig.compilerOptions.outDir;
    this.#rootDir = tsconfig.compilerOptions.rootDir;
    this.#tsconfigName = tsconfig.display;
    this.#isVerbose = isVerbose;
    this.#isWatchMode = isWatchMode;
  }
  
  /** Builds the project from scratch */
  async tscBuildTask() {
    if (!this.#isWatchMode) {
      await $`yarn tsc -b --clean ${this.#tsconfigName}`;
    }

    await $`yarn tsc -b ${this.#isVerbose ? "--verbose" : ""} ${this.#tsconfigName}`;
  }

  /** Copies all css files to outDir */
  async copyStylesTask() {
    for await (const file of globby.globbyStream([`${this.#rootDir}/**/*.css`])) {
      const dest = file.replace(new RegExp(`^${this.#rootDir}\/`), `${this.#outDir}/`);
      if (this.#isVerbose) console.log(`Copying ${file} to ${dest}`);
      await fs.ensureDir(path.dirname(dest));
      await fs.copy(file, dest);
    }
  }

  /** Publishes the changes locally to consuming apps (yalc'd) */
  async publishTask() {
    await $`yarn dlx yalc push --changed`;
  }

  async run() {
    await this.tscBuildTask();
    await this.copyStylesTask();
    await this.publishTask();
  }
}

async function main() {
  const isVerbose = typeof argv.verbose !== "undefined" && argv.verbose;
  const tsconfig = argv.format === "esm" ? tsconfigEsmJson : tsconfigCjsJson;
  const { outDir, rootDir } = tsconfig.compilerOptions;
  
  // Schedule the initial build job...
  await (new BuildJob(tsconfig, isVerbose, false).run());
  
  if (argv.watch) {
    let isLastBuildJobDone = true;
    const watchList = [rootDir, "package.json", "tsconfig*.json"];
    const watcher = chokidar.watch(watchList, {
      persistent: true,
      awaitWriteFinish: true
    });
    console.log('Watching files...', watchList);

    process.on("SIGINT", (signal) => {
      watcher.close().then(async () => {
        console.log(`\n${signal} received. Stop watching files...`);
        if (isLastBuildJobDone) {
          process.exit(0);
        } else {
          console.log('Waiting for the last job to finish...');
          try {
            await retry(3, '10s', () => isLastBuildJobDone);
            process.exit(0);
          } catch {
            // Harakiri...
            process.kill(process.pid);
          }
        }
      });
    });
    
    const handleChangeThrottled = throttle((_path, _stats) => {
      if (isLastBuildJobDone) {
        isLastBuildJobDone = false;
        new BuildJob(tsconfig, isVerbose, true).run().then(() => {
          isLastBuildJobDone = true;
        });
      }
    }, 2000, { trailing: true });
    watcher.on("change", handleChangeThrottled);
  }
}

void main();
