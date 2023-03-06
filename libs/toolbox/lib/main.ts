#!/usr/bin/env node
import throttle from "lodash-es/throttle.js";
import { argv, retry } from "zx";
import {
  ChokidarFSWatcher,
  ChokidarAllEventsListener
} from "./@types/chokidar-type-aliases";
import type Runnable from "./@types/runnable";
import { watchTool } from "./tools.js";

async function handleWatchCmd() {
  // Handle ctrl+c gracefully
  const handleSIGINT = (job: Runnable, watcher: ChokidarFSWatcher) =>
  (signal: string) => {
    watcher.close().then(async () => {
      console.log(`\n${signal} received. Stop watching files...`);
      if (job.isDone) {
        process.exit(0);
      } else {
        console.log('Waiting for the last job to finish...');
        try {
          await retry(3, '5s', () => job.isDone);
          process.exit(0);
        } catch {
          process.abort();
        }
      }
    });    
  };

  const handleChangeThrottled = (job: Runnable) =>
    throttle<ChokidarAllEventsListener>(
      (_eventName, _path, _stats) => { if (job.isDone) void job.run(); },
      1500,
      { trailing: true }
    );
  
  await watchTool({
    ignored: ['!lib/@types', /\.(jsx?|d\.ts|map)$/],
    onChange: handleChangeThrottled,
    onSIGINT: handleSIGINT,
    jobs: argv._.slice(1),
    sourcesDir: 'lib',
  });
}

async function main() {  
  const cmd = argv._[0];
  switch (cmd) {
    case 'watch':
      handleWatchCmd();
      break;
  
    default:
      console.error(`No tool called ${cmd} in this toolbox yet.`);
      process.exit(1);
  }
  
}

void main();
