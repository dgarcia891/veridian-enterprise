# Orchestrator Manifest (v20.7)
>
> **Compliance:** Implements ANTIGRAVITY_GLOBAL_RULES_v1.1

## Core Protocols

- **Single Source of Truth:** `docs/architecture/CONTEXT.md`
- **Proxy Mode:** UI via Prompts, Logic via Code.
- **Two-Strike Rule:** Mandatory escalation after 2 failures.

## Workflows

| Command | Purpose |
|---------|---------|
| `/plan` | Architecture blueprint + Active Recall |
| `/build` | Logic Implementation (Backend/Hooks) |
| `/deploy` | Push to GitHub (Triggers Lovable Sync) |
| `/fix` | Two-Strike Bug Repair (Test-Driven) |
| `/bug_report` | Log issue (Read-Only/No Code) |
| `/handoff` | Session Archival & Context Save |
