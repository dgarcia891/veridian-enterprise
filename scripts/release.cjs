const fs = require('fs');
const type = process.argv[2] || 'patch';
const pkgPath = 'package.json';

if (!fs.existsSync(pkgPath)) {
    console.error('package.json not found');
    process.exit(1);
}

const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
let [major, minor, patch] = (pkg.version || '0.0.0').split('.').map(Number);

if (type === 'major') {
    major++;
    minor = 0;
    patch = 0;
} else if (type === 'minor') {
    minor++;
    patch = 0;
} else {
    patch++;
}

pkg.version = `${major}.${minor}.${patch}`;
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
console.log(`📦 Bumped to ${pkg.version}`);
