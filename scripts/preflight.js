import { execSync } from 'child_process';

try {
    const status = execSync('git status --porcelain').toString();
    if (status) {
        console.error('❌ Dirty working tree. Commit first.');
        process.exit(1);
    }
    console.log('✅ Preflight Passed.');
} catch (e) {
    process.exit(1);
}
