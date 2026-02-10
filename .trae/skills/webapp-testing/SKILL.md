---
name: "webapp-testing"
description: "Helps create and run tests for web applications including unit, integration, and e2e tests. Invoke when user needs test coverage, debugging tests, or setting up testing frameworks."
---

# Web App Testing

This skill assists with all aspects of web application testing.

## Test Types Supported

### 1. Unit Tests
- Component testing
- Utility function testing
- Hook testing
- Mock/stub strategies

### 2. Integration Tests
- API integration
- Component interaction
- State management testing
- Router testing

### 3. E2E Tests
- User flow testing
- Critical path validation
- Cross-browser testing
- Visual regression

## Frameworks

- **Jest** - Unit testing
- **React Testing Library** - Component testing
- **Cypress/Playwright** - E2E testing
- **Vitest** - Fast unit testing
- **MSW** - API mocking

## Testing Strategies

1. **AAA Pattern**: Arrange, Act, Assert
2. **Given-When-Then**: BDD style
3. **Test Coverage**: Aim for meaningful coverage
4. **Mocking**: When and how to mock

## Common Tasks

- Write test cases for new features
- Debug failing tests
- Set up test configuration
- Improve test coverage
- Refactor tests for maintainability

## Best Practices

- Test behavior, not implementation
- One assertion per test (ideally)
- Descriptive test names
- Setup and teardown properly
- Avoid testing third-party code