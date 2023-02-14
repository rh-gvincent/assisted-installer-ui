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
    // Use The NEXT_VERSION variable in order to populate the version field in CI/CD environments.
    pkg.exports = {
        ".": "./lib/index.mjs",
        "./cim": './lib/cim/index.mjs',
        "./ocm": './lib/ocm/index.mjs',
        "./locales/*": "./locales/*",
        "./index.css": './lib/style.css',
    }
    pkg.keywords = [
        pkg.name,
        "assisted-ui",
        "assisted-ui-lib",
        "facet-lib",
        "library",
        "openshift",
        "react",
    ]
    pkg.files = ["lib", "locales"];
    pkg.main = "./lib/index.mjs";
    pkg.type = "module";
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
    pkg.version = process.env.NEXT_VERSION ?? '0.0.0';

    // Dependencies are embedded, so no need to install them.
    delete pkg.dependencies;
    // DevDeps are never installed in production.
    delete pkg.devDependencies;
    // Currently the scripts are not needed in the production manifest.
    delete pkg.scripts;
    
}

/**
 * Reads the `package.json` and overwrites its entripoints.
 * After the transformation is applied it writes the new `package.json` into the `build` folder.
 */
function main() {
    const pkg = loadJSON("../package.json");
    transform(pkg);
    
    if (!fs.existsSync('build')) {
        fs.mkdirSync('build');
    }

    fs.cpSync('locales', 'build/locales', { recursive: true });
    const json = JSON.stringify(pkg, null, 2);
    fs.writeFileSync('build/package.json', json);
}

main(process.argv.slice(1));
