const { execSync } = require('child_process');
const type = process.argv[2] || 'chore';
const msg = process.argv[3] || 'update';

try {
    execSync('git add -A', { stdio: 'inherit' });
    execSync(`git commit -m "${type}: ${msg} [orchestrator]" --allow-empty`, { stdio: 'inherit' });
    console.log("📤 Pushing to GitHub (Lovable Sync)...");
    execSync('git push origin main', { stdio: 'inherit' });
} catch (e) {
    console.error("❌ Deploy failed:", e.message);
}
