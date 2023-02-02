import module from "node:module";
import fs from "node:fs";

/**
 * This script transforms the entry points in package.json
 * in order to reference the built modules instead of the ones in
 * the source code. After the transformation is applied it
 * writes the new package.json into the 'build' folder.
 */
function main() {
    const require = module.createRequire(import.meta.url);
    const pkgManifest = require('../package.json');
    pkgManifest.files = ["lib"];
    pkgManifest.exports["."] = {
        import: './lib/index.js',
        require: './lib/index.cjs'
    };
    pkgManifest.exports["./cim"] = {
        import: './lib/cim.js',
        require: './lib/cim.cjs'
    };
    pkgManifest.exports["./ocm"] = {
        import: './lib/ocm.js',
        require: './lib/ocm.cjs'
    };
    pkgManifest.exports["./css"] = './lib/style.css';
    pkgManifest.main = './lib/index.cjs';
    pkgManifest.module = './lib/index.js';
    pkgManifest.types = './lib/index.d.ts';

    delete pkgManifest.scripts;
    
    /**
     * The NEXT_VERSION variable is used in CI/CD for populating
     * the version field in the new package.json
     */
    pkgManifest.version = process.env.NEXT_VERSION ?? '0.0.0';
    
    if (!fs.existsSync('build')) {
        fs.mkdirSync('build');
    }

    const json = JSON.stringify(pkgManifest, null, 2);
    fs.writeFileSync('build/package.json', json);
}

main(process.argv.slice(1));
