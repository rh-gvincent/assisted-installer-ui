import fs from 'node:fs';
import packageJson from '../package.json' assert { type: 'json' };


function main(args) {
  const pathToPackageJson = args[1];
  const newVersion = args[2];
  packageJson.version = newVersion;

  fs.writeFileSync(pathToPackageJson, JSON.stringify(packageJson, null, 2));
}

void main(process.argv.slice(1));
