# Testing Guide for Recallify

This guide explains how to write and run tests in the Recallify project using Vitest.

## Quick Start

```bash
# Run tests in watch mode (interactive)
npm test

# Run tests once (CI mode)
npm run test:run

# Run tests with UI dashboard
npm run test:ui

# Run tests with coverage report
npm run test:coverage
```

## Testing Stack

- **Vitest**: Fast test runner built on Vite
- **@testing-library/react**: React component testing utilities
- **@testing-library/user-event**: Simulate user interactions
- **@testing-library/jest-dom**: Custom matchers for DOM assertions
- **jsdom**: DOM environment for testing

## Project Structure

```
src/
├── test/
│   ├── setup.ts              # Global test configuration
│   └── test-utils.tsx        # Custom render functions and mocks
├── components/
│   ├── Sidebar.tsx
│   └── Sidebar.test.tsx      # Component tests
├── services/
│   ├── database.ts
│   └── database.test.ts      # Service/integration tests
└── utils/
    ├── spacedRepetition.ts
    └── spacedRepetition.test.ts  # Unit tests
```

## Writing Tests

### 1. Unit Tests (Pure Functions)

Unit tests are for testing pure functions without dependencies:

```typescript
import { describe, it, expect } from 'vitest';
import { calculateNextReview } from './spacedRepetition';

describe('calculateNextReview', () => {
  it('should calculate first review with quality 5', () => {
    const result = calculateNextReview(5);

    expect(result.interval).toBe(1);
    expect(result.repetitions).toBe(1);
  });
});
```

### 2. Component Tests

Component tests verify UI behavior and user interactions:

```typescript
import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../test/test-utils';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('should render with correct text', () => {
    render(<MyComponent />);

    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('should handle button click', async () => {
    const user = userEvent.setup();
    render(<MyComponent />);

    const button = screen.getByRole('button', { name: 'Click me' });
    await user.click(button);

    expect(screen.getByText('Clicked!')).toBeInTheDocument();
  });
});
```

### 3. Service/Integration Tests

Service tests verify API calls and data flow:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getSubjects } from './database';

vi.mock('@tauri-apps/api/tauri', () => ({
  invoke: vi.fn(),
}));

import { invoke } from '@tauri-apps/api/tauri';

describe('getSubjects', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch subjects from database', async () => {
    const mockData = [{ id: 1, name: 'Math' }];
    (invoke as any).mockResolvedValue(mockData);

    const subjects = await getSubjects();

    expect(subjects).toEqual(mockData);
    expect(invoke).toHaveBeenCalledWith('db_select', expect.any(Object));
  });
});
```

## Best Practices

### 1. Test Structure (AAA Pattern)

Organize tests using the **Arrange-Act-Assert** pattern:

```typescript
it('should do something', () => {
  // Arrange: Set up test data and conditions
  const input = 5;

  // Act: Execute the code being tested
  const result = myFunction(input);

  // Assert: Verify the results
  expect(result).toBe(10);
});
```

### 2. Use Descriptive Test Names

```typescript
// ❌ Bad
it('works', () => { ... });

// ✅ Good
it('should calculate next review interval for quality 5', () => { ... });
```

### 3. Test One Thing at a Time

```typescript
// ❌ Bad - Testing multiple things
it('should work correctly', () => {
  expect(result.interval).toBe(1);
  expect(result.repetitions).toBe(1);
  expect(result.easeFactor).toBe(2.6);
  // ... 10 more assertions
});

// ✅ Good - Focused tests
it('should set interval to 1 for first review', () => {
  expect(result.interval).toBe(1);
});

it('should increment repetitions for successful review', () => {
  expect(result.repetitions).toBe(1);
});
```

### 4. Mock External Dependencies

```typescript
// Mock Tauri APIs
vi.mock('@tauri-apps/api/tauri', () => ({
  invoke: vi.fn(),
}));

// Mock database functions
vi.mock('../services/database', () => ({
  getRevisionsDueToday: vi.fn().mockResolvedValue([]),
}));

// Mock localStorage
beforeEach(() => {
  localStorage.clear();
});
```

### 5. Use Test Utilities

Use the custom `render` function from `test-utils.tsx` for components:

```typescript
import { render } from '../test/test-utils';

// This automatically wraps components with ChakraProvider and BrowserRouter
render(<MyComponent />);
```

### 6. Clean Up After Tests

```typescript
beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
});

afterEach(() => {
  vi.useRealTimers(); // If using fake timers
});
```

### 7. Test Edge Cases

```typescript
describe('calculateNextReview', () => {
  it('should handle minimum quality (0)', () => { ... });
  it('should handle maximum quality (5)', () => { ... });
  it('should throw error for invalid quality', () => {
    expect(() => calculateNextReview(-1)).toThrow();
  });
});
```

### 8. Use Parameterized Tests

```typescript
it.each([
  [0, 1, 0],
  [3, 1, 1],
  [5, 1, 1],
])('quality %i should give interval %i and reps %i',
  (quality, interval, reps) => {
    const result = calculateNextReview(quality);
    expect(result.interval).toBe(interval);
    expect(result.repetitions).toBe(reps);
});
```

## Common Testing Patterns

### Testing Async Code

```typescript
it('should fetch data', async () => {
  const data = await fetchData();
  expect(data).toBeDefined();
});

// Or with waitFor
it('should display data after loading', async () => {
  render(<MyComponent />);

  await waitFor(() => {
    expect(screen.getByText('Data loaded')).toBeInTheDocument();
  });
});
```

### Testing Timers

```typescript
beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2024-01-01'));
});

afterEach(() => {
  vi.useRealTimers();
});

it('should trigger after timeout', () => {
  const callback = vi.fn();
  setTimeout(callback, 1000);

  vi.advanceTimersByTime(1000);

  expect(callback).toHaveBeenCalled();
});
```

### Testing User Interactions

```typescript
it('should handle form submission', async () => {
  const user = userEvent.setup();
  render(<LoginForm />);

  await user.type(screen.getByLabelText('Email'), 'test@example.com');
  await user.type(screen.getByLabelText('Password'), 'password123');
  await user.click(screen.getByRole('button', { name: 'Submit' }));

  expect(screen.getByText('Login successful')).toBeInTheDocument();
});
```

### Testing Error States

```typescript
it('should handle API errors', async () => {
  (invoke as any).mockRejectedValue(new Error('Network error'));

  await expect(fetchData()).rejects.toThrow('Network error');
});
```

## Useful Matchers

```typescript
// Basic matchers
expect(value).toBe(5);
expect(value).toEqual({ a: 1 });
expect(value).toBeTruthy();
expect(value).toBeFalsy();
expect(value).toBeNull();
expect(value).toBeUndefined();

// Number matchers
expect(value).toBeGreaterThan(3);
expect(value).toBeLessThan(10);
expect(value).toBeCloseTo(0.3); // Floating point

// String matchers
expect(str).toMatch(/pattern/);
expect(str).toContain('substring');

// Array matchers
expect(arr).toContain(item);
expect(arr).toHaveLength(5);

// DOM matchers (from @testing-library/jest-dom)
expect(element).toBeInTheDocument();
expect(element).toBeVisible();
expect(element).toHaveTextContent('text');
expect(element).toHaveAttribute('href', '/path');
expect(input).toHaveValue('value');
expect(checkbox).toBeChecked();
```

## Debugging Tests

### Run specific test file

```bash
npm test -- Sidebar.test.tsx
```

### Run specific test by name

```bash
npm test -- -t "should render all menu items"
```

### Enable verbose logging

```bash
npm test -- --reporter=verbose
```

### Debug in VS Code

Add to `.vscode/launch.json`:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Tests",
  "runtimeExecutable": "npm",
  "runtimeArgs": ["test"],
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen"
}
```

## Coverage Reports

View coverage reports to identify untested code:

```bash
npm run test:coverage
```

This generates:
- Console summary
- HTML report in `coverage/index.html`
- JSON report for CI tools

## CI/CD Integration

For GitHub Actions or other CI:

```yaml
- name: Run tests
  run: npm run test:run

- name: Generate coverage
  run: npm run test:coverage
```

## Tips for Testing Tauri Apps

1. **Mock Tauri APIs**: Always mock `@tauri-apps/api` modules
2. **Test browser-side logic**: Focus on React components and business logic
3. **Integration tests**: Test full workflows with mocked Tauri responses
4. **E2E tests**: Use Tauri's testing tools for full app testing (separate from Vitest)

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library Docs](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## Getting Help

If you encounter issues:
1. Check the test examples in `src/` directories
2. Review this guide
3. Check Vitest and Testing Library docs
4. Ask the team!
