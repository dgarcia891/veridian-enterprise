import { execSync } from 'child_process';
import fs from 'fs';

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const ver = pkg.version;

try {
    const branch = `release/v${ver}`;
    console.log(`🌿 Branch: ${branch}`);
    try { execSync(`git branch -D ${branch}`, { stdio: 'ignore' }); } catch (e) { }
    execSync(`git checkout -b ${branch}`);
    execSync('git add -A');
    // Allow empty commits in case version bump happened but no other changes (or just untracked files added)
    // But usually git add -A will add changes.
    execSync(`git commit -m "chore(release): v${ver}" --allow-empty`);
    console.log(`📤 Pushing ${branch}...`);
    execSync(`git push -u origin ${branch} --force`);
    console.log('✅ Release Pushed. Open PR to merge.');
} catch (e) {
    console.error(e.message);
    process.exit(1);
}
