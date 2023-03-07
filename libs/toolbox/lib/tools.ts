import { path } from "zx";
import chokidar from "chokidar";
import JobsRunner from "./jobs-runner.js";
import type WatchToolOptions from "./@types/watch-tool-options";
import { info } from "./logger.js";


export async function watchTool(options: WatchToolOptions) {  
  const {
    ignored,
    jobs,
    onChange,
    onSIGINT,
    sourcesDir,
  } = options;
  const watcher = chokidar.watch(sourcesDir, {
    ignored,
    persistent: true,
    awaitWriteFinish: true
  });
  info('Watching files in', path.resolve(sourcesDir));
  
  let job = new JobsRunner(jobs);
  process.on("SIGINT", onSIGINT(job, watcher));
  watcher.on("all", onChange(job));
}
