---
name: fix
description: Two-Strike Bug Repair Protocol
steps:
  - node scripts/consult.js
  - echo 'Write failing test'
  - echo 'Attempt fix'
  - echo 'Log result'
---
## Steps

1. **Recall**: `node scripts/consult.js` (Read BUG_LOG).
2. **Strike 0**: Write FAILING test to `tests/regression/`.
3. **Strike 1**: Attempt fix. Run test.
4. **Strike 2**: If fail, STOP. Research.
5. **Log**: Update `docs/logs/BUG_LOG.md`.
