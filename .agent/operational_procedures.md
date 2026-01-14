# Operational Procedures (SOP)

## Workflow Steps

### 1. Request & Classification
*   Wait for user to trigger `/bug` or `/feature`.
*   If manual request, classify it and treat it as a workflow trigger.
*   Log it in the corresponding Log file (`bug_log.md` or `enhancement_log.md`).

### 2. Research & Planning
*   Review `project_requirements_document.md` for alignment.
*   **CRITICAL: Pre-Flight Check**:
    *   Consult `active_rules.md`. Have we learned a rule that applies here?
    *   **SOP Citation**: You must explicitly state: "Executing SOP Step X.Y: [Action]".
*   Draft a Plan: "I will create a regression test for X, implements Y, and verify Z."

### 3. Test-Driven Development (TDD)
*   **NEVER** skip this step.
*   Write a **Regression Test** (for bugs) or **Feature Test** (for new features) *before* or *simultaneously* with the fix.
*   Ensure the test *fails* without the fix (if possible) and *passes* with it.

### 4. Implementation & Validation
*   Write the code.
*   **Lint**: Run `npm run lint` (or equivalent). Fix **ALL** errors.
*   **Test**: Run `npm test`. **ALL** tests must pass.
*   **Coverage**: Aim for high test coverage (e.g., 80%).

### 5. Learning & Closure
*   If you made a mistake or encountered a tricky bug, extract a **General Principle** and add it to `active_rules.md`.
*   Update `bug_log.md` with the fix details.
*   Update `project_requirements_document.md` if the feature set changed.
*   **Process Sync**: If you changed any Rules or SOPs, update `agentic_instantiation_prompt.md` **IMMEDIATELY**.
