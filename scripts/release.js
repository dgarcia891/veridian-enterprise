import fs from 'fs';

const type = process.argv[2] || 'patch';
const pkgPath = 'package.json';

if (!fs.existsSync(pkgPath)) process.exit(0);

const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
let parts = (pkg.version || '0.0.0').split('.').map(Number);

if (type === 'major') { parts[0]++; parts[1] = 0; parts[2] = 0; }
else if (type === 'minor') { parts[1]++; parts[2] = 0; }
else { parts[2]++; }

pkg.version = parts.join('.');
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
console.log(`📦 Version bumped to ${pkg.version}`);
