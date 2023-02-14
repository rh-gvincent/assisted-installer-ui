import fs from "node:fs";

function loadJSON(path) {
    return JSON.parse(fs.readFileSync(new URL(path, import.meta.url)));
}

/**
 * Transforms the entry points in the `package.json` in order to reference the transpiled
 * modules instead of the ones in the source code and removes the following fields:
 * `dependencies`, `devDependencies`, `scripts`
 * @param {import("../package.json")} pkg 
 */
function transform(pkg) {
    pkg.type = "module";
    pkg.main = "./lib/index.js";
    pkg.exports["./cim"] = './lib/cim/index.js';
    pkg.exports["./ocm"] = './lib/ocm/index.js';
    pkg.exports["./locales/*"] = "./locales/*";
    pkg.exports["./index.css"] = './lib/style.css';
    pkg.files = ["lib", "locales"];
    pkg.typesVersions = {
        "*": {
            "cim": [
                "./lib/cim/index.d.ts"
            ],
            "ocm": [
                "./lib/ocm/index.d.ts"
            ]
        }
    },

    // Dependencies are embedded, so no need to install them.
    delete pkg.dependencies;
    // DevDeps are never installed in production.
    delete pkg.devDependencies;
    // Currently the scripts are not needed in the production manifest.
    delete pkg.scripts;
    
    // Use The NEXT_VERSION variable in order to populate the version field in CI/CD environments.
    pkg.version = process.env.NEXT_VERSION ?? '0.0.0';
}

/**
 * Reads the `package.json` and overwrites its entripoints.
 * After the transformation is applied it writes the new `package.json` into the `build` folder.
 */
function main() {
    const pkgManifest = loadJSON("../package.json");
    transform(pkgManifest);
    
    if (!fs.existsSync('build')) {
        fs.mkdirSync('build');
    }

    fs.cpSync('locales', 'build/locales', { recursive: true });
    const json = JSON.stringify(pkgManifest, null, 2);
    fs.writeFileSync('build/package.json', json);
}

main(process.argv.slice(1));
