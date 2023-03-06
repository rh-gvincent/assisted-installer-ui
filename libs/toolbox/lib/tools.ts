import { path } from "zx";
import chokidar from "chokidar";
import JobsRunner from "./jobs-runner.js";
import type WatchToolOptions from "./@types/watch-tool-options";


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
  console.log('Watching files in', path.resolve(sourcesDir));
  
  let job = new JobsRunner(jobs);
  process.on("SIGINT", onSIGINT(job, watcher));
  watcher.on("all", onChange(job));
}
