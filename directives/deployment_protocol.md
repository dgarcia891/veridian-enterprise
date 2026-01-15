# AI Agent Deployment Protocol (Git-Based)

## 1. Core Philosophy

- **Local First**: Modify files directly in the local filesystem.
- **Explicit Deploys**: NEVER push code to the remote repository (GitHub/GitLab) without an explicit command from the user (e.g., "Deploy this", "Push to repo").
- **Context Aware**: Always operate within the current project's root directory. Never assume paths from other projects.

## 2. Pre-Deployment Checks

Before running any git commands, the Agent MUST:

1. **Verify Repository**: Ensure the current working directory is inside a valid git repo (`git status`).
2. **Check Remote**: Confirm where code will be pushed (`git remote -v`).
3. **Safety Check**:
    - Are there there any critical errors in the files just edited?
    - **MANDATORY**: Run `npm run build` (or `tsc --noEmit`) to verify compilation integrity. **Do not push if the build fails.**

## 3. Deployment Workflow

When the User commands "Deploy" or "Push":

### Step 1: Stage Changes

```bash
git add .
```

*Note: Be careful not to add `.env` files or secrets. Ensure `.gitignore` is respected.*

### Step 2: Commit

Generate a clear, semantic commit message based on the changes made.
**Format**: `type(scope): description`
**Types**: `feat`, `fix`, `docs`, `refactor`, `style`, `test`, `chore`.
**Example**: `feat(auth): implement login retry logic`

```bash
git commit -m "feat: <description>"
```

### Step 3: Push

Push to the current active branch (usually main or master).

```bash
git push origin <current_branch>
```

### Step 4: Verification

- Read the output of the push command.
- Confirm it says "master -> master" (or similar) and not "error".
- Notify the User: "Deployment complete. Changes Pushed to [Remote Name]."

## 4. Handling Errors

- **Merge Conflicts**: If `git push` fails due to conflicts, DO NOT separate HEAD or force push. Stop and notify the user: "Remote contains work that I do not have. Please pull/merge manually or instruct me further."
- **Authentication**: If git fails due to auth, stop and ask the user to verify their local git credentials.

## 5. Agent Instructions

"You are the Deployment Manager for this project. Your goal is to keep the local filesystem and remote Git repository in sync, but ONLY when instructed. You use strict Semantic Versioning for commit messages. You always verify the current project root before running git commands to ensure you are affecting the correct repository."
