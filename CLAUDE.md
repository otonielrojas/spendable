# Spendable — Claude Context File

This file is loaded automatically by Claude Code. Read it at the start of every session to recover context.

## What Is Spendable

A mobile-first web app that answers one question: **"How much can I safely spend right now?"**

Core concept: show a single "Safe to Spend" number calculated as:
```
Current Balance
  - Upcoming committed expenses before next payday
  - Personal safety buffer
  ──────────────────────────────────────────────
= Safe to Spend
```

Everything revolves around the **pay cycle** (not calendar month). This is the primary differentiator vs. existing apps.

## Key Decisions Made

- **Name:** Spendable
- **Primary differentiator:** Pay-cycle-native, radical simplicity, one number front and center
- **MVP approach:** No bank sync — manual entry only to validate core UX loop cheaply
- **Target niche (start):** Young professionals on their first real salary
- **Business model:** Freemium — core free, AI features behind ~$5-8/mo
- **Closest competitor:** PocketGuard ("In My Pocket" feature) — must be clearly simpler and smarter
- **Tech stack (decided):** Next.js (web-first), Claude API for AI layer, Plaid for bank sync in v2

## Project Structure

```
spendable/
├── CLAUDE.md               ← This file (session recovery)
├── README.md               ← Project overview
├── netlify.toml            ← Netlify build config (base: app/)
├── .github/workflows/ci.yml← GitHub Actions: lint + unit tests on PR
├── docs/
│   ├── brainstorm.md       ← Initial brainstorm session (2026-03-11)
│   ├── prd.md              ← Product Requirements Document
│   ├── roadmap.md          ← Milestones + decisions log (keep updated)
│   ├── tech-stack.md       ← Tech stack decisions & rationale
│   └── competitors.md      ← Competitor analysis
└── app/                    ← Next.js source
    ├── app/                ← App Router pages
    ├── components/
    │   ├── spendable/      ← Feature components
    │   └── ui/             ← shadcn/ui primitives
    ├── lib/
    │   ├── types.ts        ← Shared TypeScript types
    │   ├── store.ts        ← Zustand store (persisted via localStorage)
    │   ├── calculate.ts    ← Pure calculation engine
    │   └── utils.ts        ← cn() helper
    └── __tests__/
        ├── unit/           ← Vitest unit tests
        └── e2e/            ← Playwright E2E tests
```

## Current State

| Phase | Status |
|-------|--------|
| Brainstorm | Done |
| Docs / PRD | Done |
| Project scaffold | Done |
| Core engine + UI | Done |
| Testing setup | Done |
| CI/CD (GitHub + Netlify) | Done |
| MVP polish | Next |

## Live URLs

- **Production:** https://spendable.netlify.app — auto-deploys on merge to `master`
- **PR previews:** Netlify generates a unique preview URL for every open PR
- **GitHub:** https://github.com/otonielrojas/spendable (private)

## Development Workflow

> Every change goes through a branch and PR — never commit directly to `master`.

### Starting a feature

```bash
git checkout master && git pull
git checkout -b <type>/<short-description>
# e.g. feat/localStorage-persistence, fix/negative-balance-display, chore/update-deps
```

### Branch naming

| Prefix | When to use |
|--------|-------------|
| `feat/` | New user-visible functionality |
| `fix/` | Bug fix |
| `chore/` | Deps, config, tooling — no user-visible change |
| `test/` | Tests only |
| `docs/` | Documentation only |
| `refactor/` | Code restructure with no behaviour change |

### Before opening a PR

```bash
cd app
npm test           # all unit tests must pass
npm run lint       # zero lint errors
npm run build      # build must succeed (catches type errors)
```

### PR checklist

- [ ] Branch is up to date with `master`
- [ ] `npm test` passes locally
- [ ] `npm run build` succeeds (no TypeScript errors)
- [ ] New behaviour has tests; bug fixes have a regression test
- [ ] Netlify preview URL reviewed on mobile viewport
- [ ] `docs/roadmap.md` updated if a milestone item is completed

### Merge policy

- Squash merge preferred for feature branches (clean history on `master`)
- Merge commit for long-lived branches where commit history matters
- CI (GitHub Actions: lint + unit tests) must be green before merge
- Delete the branch after merge

### Commit message format (Conventional Commits)

```
<type>(<scope>): <short summary>

[optional body]

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
```

Types: `feat`, `fix`, `chore`, `test`, `docs`, `refactor`, `ci`

---

## MVP Feature Scope (agreed)

1. Manual income entry — salary amount, next payday, pay frequency
2. Manual recurring expenses — rent, subscriptions, known bills
3. Manual spending log — quick-add transactions
4. **Safe to Spend** number, recalculated in real-time
5. Timeline view — upcoming committed expenses before next payday

Bank sync (Plaid) and AI features are **v2**, not MVP.

## Persistence Strategy

- **Now (MVP):** Zustand `persist` middleware → `localStorage["spendable-storage"]`
  - `version: 1` + `migrate` hook for schema changes
  - `partialize` excludes derived fields; `onRehydrateStorage` recalculates them on load
- **When to move to Supabase:** after first real user validation, or when Plaid/AI work begins (V2)

## Reference Docs

- Full brainstorm: `docs/brainstorm.md`
- PRD: `docs/prd.md`
- Roadmap: `docs/roadmap.md`
- Competitor notes: `docs/competitors.md`
- Tech decisions: `docs/tech-stack.md`
