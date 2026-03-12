# Spendable

> Know exactly how much you can spend today — without breaking next week.

Spendable answers the one question your bank app never does:

**"How much can I safely spend right now before my next paycheck?"**

---

## The Problem

Most budgeting apps are backward-looking — they tell you where your money *went*. They think in calendar months, not pay cycles. They require 30 minutes of setup before you get any value.

Meanwhile, millions of people make daily spending decisions with no real guidance, just a vague sense of dread about whether they'll make it to payday.

## The Solution

A single number. Always visible. Always accurate.

```
Safe to Spend = Current Balance − Upcoming Bills − Safety Buffer
```

Spendable knows your pay cycle. It tracks what's already committed (rent, subscriptions, known bills) and shows you only what's genuinely free to spend — recalculated every time you log a purchase.

## Core Features (MVP)

- **Safe to Spend** — your real spending power, right now
- **Payday Countdown** — days until your next salary hits
- **Upcoming Hits** — a timeline of committed expenses between now and payday
- **Quick-Log** — add a transaction in 2 taps
- **Safety Buffer** — set a floor you never want to go below

## Roadmap

- **v2:** Bank account sync (Plaid) — auto-import transactions
- **v2:** AI predictions — forecast upcoming expenses from spending history
- **v2:** AI assistant — natural language spend queries and warnings
- **v3:** Couples / shared finances
- **v3:** Irregular income (gig workers, freelancers)

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **UI:** Tailwind CSS + shadcn/ui
- **Data:** Local-first (localStorage MVP) → database in v2
- **AI:** Claude API (v2)
- **Bank sync:** Plaid (v2)

## Status

Pre-development. See `docs/prd.md` for full requirements.
