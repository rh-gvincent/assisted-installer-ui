import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { globby } from 'zx';

const require = createRequire(import.meta.url);
const pwd = process.cwd();

export const packageJson = require(path.resolve(pwd, 'package.json'));

export const tsconfigJson = require(path.resolve(pwd, 'tsconfig.json'));

export const genenrateEntriesFromSources = (
  globPattern = 'src/**/*',
  sourcesRootDir = 'src'
) => Object.fromEntries(
  globby.globbySync(globPattern).map(file => {
      // This remove `src/` and the file extension from each
      // file, so e.g. src/nested/foo.js becomes nested/foo
      const entryAlias = path.relative(
      sourcesRootDir,
      file.slice(0, file.length - path.extname(file).length)
      );
      // This expands the relative paths to absolute paths, so e.g.
      // src/nested/foo becomes /project/src/nested/foo.js
      const absolutePathToFile = path.resolve(file);
      if (!fs.existsSync(absolutePathToFile)) {
        throw new Error(`${absolutePathToFile} doesn't exist!`);
      }
      
      return [entryAlias, absolutePathToFile];
  }),
);
