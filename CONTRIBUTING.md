# Contributing to Spendable

Thank you for your interest in Spendable!

## Current Status: Early Development

Spendable is in active early development. The codebase is evolving quickly and the API/data model may change significantly. For this reason, **external pull requests are not being accepted at this time** while the MVP is being validated.

**What you can do right now:**

- ⭐ Star the repo to follow progress
- 🐛 [Report bugs](https://github.com/otonielrojas/spendable/issues/new?template=bug_report.yml)
- 💡 [Suggest features](https://github.com/otonielrojas/spendable/issues/new?template=feature_request.yml)
- 💬 Share feedback by opening a discussion

Once the MVP is stable, trusted contributors will be invited to collaborate. This file will be updated when that happens.

---

## For Invited Contributors

If you've been invited to contribute, here is the full workflow.

### Setup

```bash
git clone https://github.com/otonielrojas/spendable.git
cd spendable/app
npm install
npm run dev
```

### Branch Workflow

Always work in a branch — **never commit directly to `master`**.

```bash
git checkout master && git pull
git checkout -b <type>/<short-description>
```

| Prefix | When to use |
|--------|-------------|
| `feat/` | New user-visible functionality |
| `fix/` | Bug fix |
| `chore/` | Deps, config, tooling |
| `test/` | Tests only |
| `docs/` | Documentation only |
| `refactor/` | Code restructure, no behaviour change |

### Before Opening a PR

```bash
cd app
npm test          # all unit tests must pass
npm run lint      # zero lint errors
npm run build     # must succeed (catches TypeScript errors)
```

### PR Requirements

- All CI checks must pass (lint + unit tests)
- New behaviour must have tests; bug fixes must include a regression test
- Review the Netlify preview URL on a mobile viewport before requesting review
- Update `docs/roadmap.md` if a milestone item is completed

### Commit Format

We follow [Conventional Commits](https://www.conventionalcommits.org):

```
<type>(<scope>): <short summary>

[optional body explaining why, not what]
```

Types: `feat`, `fix`, `chore`, `test`, `docs`, `refactor`, `ci`

### Code Style

- TypeScript strict mode — no `any` unless unavoidable
- Tailwind for all styling — no inline styles, no separate CSS files
- Pure functions for all business logic (`lib/calculate.ts` pattern)
- Zustand for all shared state — no prop drilling, no React context for app state

### Questions?

Open a [GitHub Discussion](https://github.com/otonielrojas/spendable/discussions) or reach out via the issue tracker.
