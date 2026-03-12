# Spendable

> Know exactly how much you can spend today — without breaking next week.

[![CI](https://github.com/otonielrojas/spendable/actions/workflows/ci.yml/badge.svg)](https://github.com/otonielrojas/spendable/actions/workflows/ci.yml)
[![Netlify Status](https://api.netlify.com/api/v1/badges/spendable/deploy-status)](https://spendable.netlify.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**[spendable.netlify.app →](https://spendable.netlify.app)**

---

## What is Spendable?

Most budgeting apps tell you where your money *went*. They think in calendar months, not pay cycles. They need 30 minutes of setup before you get any value.

Spendable answers the one question your bank never does:

**"How much can I safely spend right now before my next paycheck?"**

```
Safe to Spend = Current Balance − Upcoming Bills − Safety Buffer
```

One number. Always visible. Recalculated in real time around your **pay cycle** — not an arbitrary calendar month.

---

## Features

| Feature | Description |
|---------|-------------|
| **Safe to Spend** | Your real spending power right now |
| **Pay-cycle aware** | Tracks weekly, biweekly, semi-monthly, and monthly pay schedules |
| **Upcoming Hits** | Shows committed expenses between today and your next payday |
| **Quick-Log** | Add a transaction in seconds; balance updates instantly |
| **Safety Buffer** | Set a floor you never want to go below |
| **Zero setup friction** | No account required, no bank link — works immediately |

---

## Running Locally

**Requirements:** Node.js 22+

```bash
git clone https://github.com/otonielrojas/spendable.git
cd spendable/app
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Available scripts

```bash
npm run dev          # Start dev server
npm run build        # Production build (also runs TypeScript check)
npm run lint         # ESLint
npm test             # Vitest unit tests
npm run test:watch   # Unit tests in watch mode
npm run test:e2e     # Playwright end-to-end tests
```

---

## Project Structure

```
spendable/
├── app/                        # Next.js application
│   ├── app/                    # App Router pages & layout
│   ├── components/
│   │   ├── spendable/          # Feature components
│   │   └── ui/                 # shadcn/ui primitives
│   ├── lib/
│   │   ├── types.ts            # Shared TypeScript types
│   │   ├── store.ts            # Zustand store (localStorage persistence)
│   │   ├── calculate.ts        # Pure Safe-to-Spend calculation engine
│   │   └── utils.ts            # Utilities
│   └── __tests__/
│       ├── unit/               # Vitest unit tests
│       └── e2e/                # Playwright E2E tests
└── docs/                       # PRD, roadmap, brainstorm, decisions
```

---

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org) (App Router)
- **UI:** [Tailwind CSS](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com)
- **State:** [Zustand](https://zustand-demo.pmnd.rs) with localStorage persistence
- **Testing:** [Vitest](https://vitest.dev) + [React Testing Library](https://testing-library.com) + [Playwright](https://playwright.dev)
- **Hosting:** [Netlify](https://netlify.com)

### Roadmap

- **v2:** Bank account sync via Plaid
- **v2:** AI-powered insights via Claude API
- **v3:** Shared finances, irregular income support

See [`docs/roadmap.md`](docs/roadmap.md) for the full milestone breakdown.

---

## Contributing

Spendable is currently in active early development. External contributions are not open yet, but the plan is to invite trusted collaborators once the MVP is validated.

If you find a bug or have a feature idea, please [open an issue](https://github.com/otonielrojas/spendable/issues) — feedback is very welcome.

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full contribution guide.

---

## Security

Found a vulnerability? Please do **not** open a public issue. See [SECURITY.md](SECURITY.md) for responsible disclosure instructions.

---

## License

[MIT](LICENSE) © 2026 Otoniel Rojas
