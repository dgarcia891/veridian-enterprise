const fs = require('fs');
['docs/architecture/CONTEXT.md', 'docs/logs/BUG_LOG.md'].forEach(f => {
    if (fs.existsSync(f)) console.log(`\n--- ${f} ---\n` + fs.readFileSync(f, 'utf8').slice(-1000));
});
