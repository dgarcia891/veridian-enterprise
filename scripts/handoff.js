const fs = require('fs');
const log = `\nHANDOFF: ${new Date().toISOString()}\nSTATE: Clean\nNEXT: Awaiting instructions\n`;
fs.appendFileSync('docs/logs/SESSION_LOG.md', log);
console.log('✅ Handoff Logged.');
