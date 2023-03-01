import 'zx/globals';

const filePatterns = [
    'lib/**/*.js',
    'lib/**/*.map',
    'lib/**/*.d.ts',
    '!lib/@types'
];
for await (const file of glob.globbyStream(filePatterns)) {
    console.log('Removing', file);
    await fs.rm(file, { recursive: true, force: true });
}

const dirs = ['build', '.cache']; 
for (const dir of dirs) {
    if (fs.existsSync(dir) && fs.statSync(dir).isDirectory()) {
        console.log('Removing', dir);
        fs.removeSync(path.resolve(process.cwd(), dir));
    }
}
