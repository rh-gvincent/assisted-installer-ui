import {
  ChokidarWatchOptions,
  ChokidarAllEventsListener,
  ChokidarFSWatcher
} from "./chokidar-type-aliases";
import type Runnable from "./runnable";


export default interface WatchToolOptions {
  ignored: ChokidarWatchOptions['ignored'];
  jobs: string[];
  onChange: (job: Runnable) => ChokidarAllEventsListener;
  onSIGINT: (job: Runnable, watcher: ChokidarFSWatcher) => NodeJS.SignalsListener;
  sourcesDir: string;
}
