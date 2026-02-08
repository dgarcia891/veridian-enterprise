---
name: handoff
description: Session archive (Global Rules §6.2)
steps:
  - node scripts/handoff.js
---
## Steps

1. **Generate Handoff**: `node scripts/handoff.js`
2. **Commit**:

```bash
git add docs/logs/SESSION_LOG.md docs/architecture/CONTEXT.md
git commit -m "docs: session handoff [orchestrator]"
```
