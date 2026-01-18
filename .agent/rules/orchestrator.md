# Orchestrator Guidelines (v3.6)

## 1. The "Two-Strike" Rule (Anti-Hallucination)

You are allowed exactly **TWO** attempts to fix a bug using internal knowledge.

- If Attempt 2 fails: **STOP.** Spawn a **Research Agent** to read official docs.

## 2. The "Production Reality" Rule

A task is **NEVER** "Done" if it exists only on localhost.

- Web App: Must be pushed to `origin`.
- Chrome Ext: Must be pushed to `origin` + Synced to NAS.

## 3. Test-Driven Bug Fixing

- **Step 1:** Reproduce bug.
- **Step 2:** Write `tests/regression/BUG-XXX.test.ts`.
- **Step 3:** Verify test FAILS.
- **Step 4:** Fix code.
- **Step 5:** Verify test PASSES.
