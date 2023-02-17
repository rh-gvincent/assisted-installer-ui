/// <reference types="node">

import fs from 'node:fs';
import url from 'node:url';
import path from 'node:path';
import glob from 'glob';

/**
 * @param {string} file - A path to a JSON file.
 * @returns {unknown}
 */
export function loadJSON(file) {
    const fileUrl = new URL(file, import.meta.url);
    return JSON.parse(fs.readFileSync(fileUrl).toString());
}

/**
 * @param {string} globPattern
 * @param {string} sourcesRoot 
 * @param {string} importMetaUrl 
 * @returns 
 */
export function genenrateEntriesFromSources(globPattern, sourcesRoot, importMetaUrl) {
    return Object.fromEntries(
		glob.sync(globPattern).map(file => {
            // This remove `src/` and the file extension from each
            // file, so e.g. src/nested/foo.js becomes nested/foo
            const entryAlias = path.relative(
                sourcesRoot,
                file.slice(0, file.length - path.extname(file).length)
            );
            // This expands the relative paths to absolute paths, so e.g.
            // src/nested/foo becomes /project/src/nested/foo.js
            const filePath = url.fileURLToPath(new URL(file, importMetaUrl))
            
            return [entryAlias, filePath];
        }),
	);
}
