# Architecture Guidelines

## Core Principles

### 1. DRY (Don't Repeat Yourself)

- **Rule**: If logic appears twice, refactor it into a utility or shared component.
- **Process**: meaningful repetition check before implementation.
- **Tools**: Use `discover-components` workflow to find existing solutions.

### 2. Separation of Concerns

- **UI Components**: Presentational only. No complex business logic.
- **Hooks/Services**: Encapsulate state management and API logic.
- **Utils**: Pure helper functions with no side effects.
- **Types**: Shared type definitions in central location.

### 3. Modular Design

- Small, focused files (under 200 lines preferred).
- Single responsibility per component/function.
- Clear entry points (index.ts/js) for modules.

## Project Structure

*(Adjust based on specific framework, e.g., Next.js, React, Node)*

- `components/` - Reusable UI elements
- `features/` - Domain-specific feature modules
- `hooks/` - Custom React hooks
- `utils/` - Shared helper functions
- `types/` - TypeScript definitions
- `services/` - API and external service integration

## Code Style

- **Naming**: PascalCase for components, camelCase for functions/vars.
- **Comments**: Explain "Why", not "What".
- **Exports**: Named exports preferred over default exports for refactoring ease.

## Tech Stack Specifics

- **Styling**: [User Preference - e.g., Tailwind, CSS Modules]
- **State Management**: [User Preference - e.g., Context, Redux, Zustand]
- **Testing**: Jest + React Testing Library (standard)
