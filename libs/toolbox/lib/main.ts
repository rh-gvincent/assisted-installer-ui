#!/usr/bin/env node
import throttle from "lodash-es/throttle.js";
import { argv, chalk, ProcessOutput, retry } from "zx";
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
} from "./constants.js";
import { error, warn } from "./logger.js";


async function handleWatchCmd() {
  // Handle ctrl+c gracefully
  const handleSIGINT = (job: Runnable, watcher: ChokidarFSWatcher) =>
  (signal: string) => {
    watcher.close().then(async () => {
      warn(`\n${signal} received. Stop watching files...`);
      if (job.isDone) {
        process.exit(EC_NORMAL);
      } else {
        warn('Waiting for the last job to finish...');
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
      (_eventName, _path, _stats) => {
        if (job.isDone) {
          job.run().catch((po: ProcessOutput) => {
            warn(`The last job failed with exit code: ${po.exitCode}. Check its output above.`);
          });
        }
      },
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
      error(`No tool called ${cmd} in this toolbox yet.`);
      process.exit(EC_MISSING_TOOL);
  }
  
}

void main();
