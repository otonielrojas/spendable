# Spendable — App

The Next.js application source. See the [root README](../README.md) for the project overview.

## Setup

```bash
npm install
npm run dev        # http://localhost:3000
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build + TypeScript check |
| `npm run lint` | ESLint |
| `npm test` | Vitest unit tests (run once) |
| `npm run test:watch` | Vitest in watch mode |
| `npm run test:coverage` | Coverage report |
| `npm run test:e2e` | Playwright E2E (requires `npm run dev` or built app) |
| `npm run test:e2e:ui` | Playwright with interactive UI |

## Key files

| File | Purpose |
|------|---------|
| `lib/types.ts` | Shared TypeScript types (`Income`, `Expense`, `Transaction`, `Settings`) |
| `lib/calculate.ts` | Pure Safe-to-Spend engine — no side effects, fully unit-tested |
| `lib/store.ts` | Zustand store with localStorage persistence |
| `app/page.tsx` | Main page — composes all feature components |
| `components/spendable/` | Feature components |
| `components/ui/` | shadcn/ui primitives |
| `__tests__/unit/` | Vitest unit tests |
| `__tests__/e2e/` | Playwright E2E tests |

## Persistence

Data is stored in `localStorage["spendable-storage"]` via Zustand's `persist` middleware.

- Only source-of-truth fields are stored (`partialize`)
- Derived fields (`safeToSpendCents`, `nextPayday`, `committedCents`) are recalculated on rehydration
- Schema version is `1` — bump `version` in `store.ts` and add a `migrate` handler when changing the data model
