const fs = require('fs');
const path = require('path');

const bugLogPath = path.join(__dirname, '../docs/logs/BUG_LOG.md');
const legacyBugLogPath = path.join(__dirname, '../docs/BUG_LOG.md');

const targetPath = fs.existsSync(bugLogPath) ? bugLogPath : legacyBugLogPath;

if (fs.existsSync(targetPath)) {
    console.log(`📖 Reading Bug Log: ${targetPath}\n`);
    console.log(fs.readFileSync(targetPath, 'utf8'));
} else {
    console.log('❌ Bug Log not found.');
}
