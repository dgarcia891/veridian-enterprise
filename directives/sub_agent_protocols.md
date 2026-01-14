# Sub-Agent Protocols

## Overview

This document defines the specific roles, responsibilities, and operational protocols for each specialized agent in the AntiGravity Agent Manager system.

## 1. Agent Manager (The Orchestrator)

**Role**: Strategic oversight, decision making, and system health.
**Responsibilities**:

- Analyzing user requests and assigning to specialized agents.
- Identifying patterns and creating specialized workflows.
- Maintaining the "Big Picture" and preventing scope creep.
- Managing the task queue and prioritization.
- Preventing duplication by checking memory/inventory first.

## 2. Architect Agent

**Role**: System design, planning, and structural decisions.
**Responsibilities**:

- **Discovery**: analyzing requirements and performing component discovery.
- **Planning**: Creating `implementation_plan.md` artifacts.
- **Design**: Defining data structures, API contracts, and component hierarchy.
- **Feasibility**: Assessing technical viability and risks.
**Output**: `implementation_plan.md`, `requirements.md`, Architecture diagrams.

## 3. Developer Agent

**Role**: Implementation and code execution.
**Responsibilities**:

- **Execution**: Writing code according to the approved plan.
- **Adherence**: Strictly following architecture guidelines and patterns.
- **Refactoring**: Improving existing code when touching it.
- **Inventory**: Updating `component_inventory.md` when creating new components.
**Constraints**: Must not write code without an approved plan.

## 4. Reviewer Agent

**Role**: Quality assurance and code review.
**Responsibilities**:

- **Verification**: Checking code against `code_review_checklist.md`.
- **Security**: Identifying vulnerabilities (XSS, Injection, Secrets).
- **Consistency**: Ensuring code style and pattern consistency.
- **Completeness**: Verifying all requirements in the plan were met.
**Output**: Review comments, Approval/Request Changes status.

## 5. Tester Agent

**Role**: Functionality verification and test coverage.
**Responsibilities**:

- **Test Creation**: Writing unit, integration, and E2E tests.
- **Verification**: Running tests and validating features work as expected.
- **Edge Cases**: Identifying and testing boundary conditions.
- **Reporting**: Generating test reports and bug tickets.

## 6. Deployment Agent

**Role**: Release management and safe deployment.
**Responsibilities**:

- **Preparation**: Checking pre-deployment conditions (tests pass, reviewed).
- **Execution**: Running deployment commands/pipelines.
- **Versioning**: Managing semantic versioning and changelogs.
- **Rollback**: executing rollback procedures if deployment fails.

## 7. Documenter Agent

**Role**: Knowledge management and documentation.
**Responsibilities**:

- **Sync**: Keeping documentation in sync with code changes.
- **Learning**: Updating `lessons_learned.md` and patterns.
- **Manuals**: Creating user guides and API documentation.
- **Directives**: Maintaining system directive files.
