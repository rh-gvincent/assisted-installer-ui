#!/usr/bin/env node
import throttle from "lodash-es/throttle.js";
import { argv, retry } from "zx";
import {
  ChokidarFSWatcher,
  ChokidarAllEventsListener
} from "./@types/chokidar-type-aliases";
import type Runnable from "./@types/runnable";
import { watchTool } from "./tools.js";
import {
  EC_NORMAL,
  MAX_RETRIES_BEFORE_ABORT,
  DELAY_BETWEEN_EXIT_ATTEMPTS,
  EC_MISSING_TOOL,
  THROTTLE_WAIT_MS
} from "./constants";


async function handleWatchCmd() {
  // Handle ctrl+c gracefully
  const handleSIGINT = (job: Runnable, watcher: ChokidarFSWatcher) =>
  (signal: string) => {
    watcher.close().then(async () => {
      console.log(`\n${signal} received. Stop watching files...`);
      if (job.isDone) {
        process.exit(EC_NORMAL);
      } else {
        console.log('Waiting for the last job to finish...');
        try {
          await retry(
            MAX_RETRIES_BEFORE_ABORT,
            DELAY_BETWEEN_EXIT_ATTEMPTS,
            () => job.isDone
          );
          process.exit(EC_NORMAL);
        } catch {
          process.abort();
        }
      }
    });    
  };

  const handleChangeThrottled = (job: Runnable) =>
    throttle<ChokidarAllEventsListener>(
      (_eventName, _path, _stats) => { if (job.isDone) void job.run(); },
      THROTTLE_WAIT_MS,
      { trailing: true }
    );
  
  await watchTool({
    ignored: argv.ignore,
    jobs: argv._.slice(1),
    onChange: handleChangeThrottled,
    onSIGINT: handleSIGINT,
    sourcesDir: argv.dir,
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
      process.exit(EC_MISSING_TOOL);
  }
  
}

void main();
