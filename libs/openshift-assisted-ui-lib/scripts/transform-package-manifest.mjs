import module from "node:module";
import fs from "node:fs";

/**
 * This lifecycle script transforms the entry points in package.json
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
        import: './lib/cim/index.js',
        require: './lib/cim/index.cjs'
    };
    pkgManifest.exports["./ocm"] = {
        import: './lib/ocm/index.js',
        require: './lib/ocm/index.cjs'
    };
    pkgManifest.exports["./css"] = './lib/style.css';
    pkgManifest.main = './lib/index.cjs';
    pkgManifest.module = './lib/index.js';
    pkgManifest.types = './lib/index.d.ts';

    delete pkgManifest.scripts;
    /**
     * The NEXT_VERSION variable can be used in CI/CD envs in order to populate
     * the version field in the new package.json
     */
    pkgManifest.version = process.env.NEXT_VERSION ?? '0.0.0';
    if (!fs.existsSync('build')) {
        fs.mkdirSync('build');
    }

    fs.writeFileSync(
        'build/package.json',
        JSON.stringify(pkgManifest, null, 2)
    );
}

main(process.argv.slice(1));
