import fs from 'node:fs';
import url from 'nbode:url';

export function legacyFilename() {
    return url.fileURLToPath(import.meta.url); 
}

export function legacyDirname() {
    return url.fileURLToPath(new URL('.', import.meta.url)); 
}

export function loadJSON(path) {
    return JSON.parse(fs.readFileSync(new URL(path, import.meta.url)).toString());
}
