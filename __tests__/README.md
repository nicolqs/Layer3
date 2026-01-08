# Testing Guide

Lightweight but comprehensive test suite to prevent regressions and ensure code quality.

## Running Tests

```bash
# Run tests in watch mode (dev)
pnpm test

# Run tests once (CI)
pnpm test:run

# Run with UI
pnpm test:ui

# Generate coverage report
pnpm test:coverage
```

## Test Structure

```
__tests__/
├── lib/                    # Unit tests for utilities
│   ├── transactionIntent.test.ts
│   ├── transactionStats.test.ts
│   ├── chains.test.ts
│   └── utils.test.ts
├── api/trpc/              # Functional tests for tRPC endpoints
│   └── user.test.ts
└── integration/           # High-level smoke tests
    └── regression.test.ts
```

## What's Tested

### ✅ Unit Tests

**Transaction Intent Decoder** (`lib/transactionIntent.test.ts`)
- Detects transfer, swap, mint, approve operations
- Handles 100+ function signatures
- Categorizes transactions correctly
- Gracefully handles unknown methods

**Transaction Stats** (`lib/transactionStats.test.ts`)
- Calculates volume, gas fees, success rate
- Filters transactions by date range (7d, 30d, 90d)
- Formats relative timestamps
- Handles edge cases (empty arrays, failed txs)

**Chain Utilities** (`lib/chains.test.ts`)
- Validates chain configurations
- Verifies explorer URLs
- Tests major chain support (ETH, Base, Arbitrum, etc.)

**Utility Functions** (`lib/utils.test.ts`)
- Address truncation
- Token balance formatting
- USD value formatting
- Edge cases (zero, small numbers, large numbers)

### ✅ Functional Tests

**tRPC User Router** (`api/trpc/user.test.ts`)
- User data fetching from Layer3 API
- Multi-chain balance aggregation
- Transaction history with pagination
- NFT fetching from Alchemy
- Error handling and graceful degradation

**Regression Tests** (`integration/regression.test.ts`)
- Critical data transformations don't break
- Chain configurations are valid
- Type safety is maintained
- Constants are properly configured

## Adding New Tests

### For New Utilities

```typescript
// __tests__/lib/myutil.test.ts
import { describe, it, expect } from 'vitest'
import { myFunction } from '@/lib/myutil'

describe('My Utility', () => {
  it('should do something', () => {
    expect(myFunction('input')).toBe('expected')
  })
})
```

### For New tRPC Endpoints

```typescript
// __tests__/api/trpc/myrouter.test.ts
import { describe, it, expect } from 'vitest'
// Add mocks for external APIs
// Test your router procedures
```

### For Regression Prevention

Add a test to `integration/regression.test.ts`:

```typescript
it('should not break my critical feature', () => {
  const { myFunction } = require('@/lib/mymodule')
  const result = myFunction()
  expect(result).toBeDefined()
  // Add minimal assertions to catch breaking changes
})
```

## Test Coverage Goals

- **Critical Utilities**: 80%+ coverage
- **Data Transformations**: 90%+ coverage
- **API Routes**: Smoke tests for all endpoints
- **UI Components**: Not heavily tested (rely on TypeScript)

## Best Practices

1. **Keep tests fast** - No network calls, use mocks
2. **Test behavior, not implementation** - Don't test private methods
3. **One concept per test** - Small, focused tests
4. **Descriptive names** - "should do X when Y"
5. **Arrange, Act, Assert** - Clear test structure

## CI Integration

Add to your CI pipeline:

```yaml
# .github/workflows/test.yml
- name: Run tests
  run: pnpm test:run

- name: Check coverage
  run: pnpm test:coverage
```

## Mocking External APIs

For full integration tests, use MSW:

```typescript
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'

const server = setupServer(
  http.get('https://layer3.xyz/api/assignment/users', () => {
    return HttpResponse.json({ users: [mockUser] })
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

## Debugging Tests

```bash
# Run specific test file
pnpm test transactionIntent

# Run in debug mode
node --inspect-brk node_modules/.bin/vitest

# Use console.log (they'll show in test output)
it('test', () => {
  console.log('debug info')
  expect(true).toBe(true)
})
```

## Common Issues

**Import errors**: Make sure `@/` alias is configured in `vitest.config.ts`

**Async timeouts**: Increase timeout for slow tests:
```typescript
it('slow test', async () => {
  // test code
}, 10000) // 10 second timeout
```

**Mocking Next.js**: Use `vi.mock` for Next.js modules:
```typescript
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() })
}))
```
