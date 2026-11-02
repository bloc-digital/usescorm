const { writeFileSync } = require('node:fs');
const { join } = require('node:path');

writeFileSync(join(__dirname, '..', 'dist', 'cjs', 'package.json'), '{"type":"commonjs"}\n');
