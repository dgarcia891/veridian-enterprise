# Code Review Checklist

## Functionality

- [ ] Does the code do what the plan said it would?
- [ ] Are all requirements from the ticket/plan met?
- [ ] Are edge cases handled (empty states, errors, loading)?

## Architecture & Patterns

- [ ] **DRY Check**: Is this logic duplicated anywhere?
- [ ] **Component Inventory**: Does a similar component already exist?
- [ ] **Separation**: Is logic separated from presentation?
- [ ] **File Size**: Are files reasonable in size (<300 lines)?

## Quality & Style

- [ ] Are variable/function names descriptive?
- [ ] Is the code readable?
- [ ] Are magic numbers/strings extracted to constants?
- [ ] Is there sufficient error handling (try/catch, boundaries)?

## Testing

- [ ] Are unit tests included?
- [ ] Do tests cover the happy path AND failure modes?
- [ ] Is the code testable (dependency injection, pure functions)?

## Security

- [ ] No hardcoded secrets (API keys, passwords).
- [ ] Input sanitization present (no direct SQL/HTML injection).
- [ ] Auth checks present on sensitive actions.

## Documentation

- [ ] Are complex logic blocks commented?
- [ ] Is the component execution updated?
- [ ] Are types properly defined?
