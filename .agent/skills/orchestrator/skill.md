---
name: Orchestrator Protocol v6.5
description: Unified Identity & Role-Based Architecture
---

# 🚀 Orchestrator Protocol v6.5

## 1. AUTO-DETECTION (Bootup Scan)

### IF `supabase/config.toml` OR `.lovable` found

- **ACTIVATE ROLE**: Protocol B (Lovable Architect).
- **UI Rule**: Proxy Mode (Read-Only). Do NOT edit JSX/TSX. Write High-Fidelity Prompts for the user to give Lovable.
- **DB Rule**: Supabase Kill-Switch. `db push`/`reset` FORBIDDEN. Write migration files to `supabase/migrations/`.

### IF `manifest.json` found

- **ACTIVATE ROLE**: Protocol A (Chrome Architect).
- **Rule**: Manifest V3 Strictness.

## 2. SAFETY CLAMPS (Always Active)

- **500-Line Limit**: If file > 500 lines, STOP. Request refactor.
- **Spec-First**: Do not code without validating against `docs/architecture.md`.
