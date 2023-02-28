import 'zx/globals';

const patterns = [
    'lib/**/*.js',
    'lib/**/*.map',
    'lib/**/*.d.ts',
    '!lib/@types'
];

for await (const file of glob.globbyStream(patterns)) {
    console.log('Removing', file);
    await fs.rm(file);
}
