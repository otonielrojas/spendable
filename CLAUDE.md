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
├── CLAUDE.md           ← This file (session recovery)
├── README.md           ← Project overview
├── docs/
│   ├── brainstorm.md   ← Initial brainstorm session (2026-03-11)
│   ├── prd.md          ← Product Requirements Document
│   ├── tech-stack.md   ← Tech stack decisions & rationale
│   └── competitors.md  ← Competitor analysis
└── app/                ← Source code (not yet created)
```

## Current State

| Phase | Status |
|-------|--------|
| Brainstorm | Done |
| Docs / PRD | Done (initial) |
| Project scaffold | Not started |
| MVP build | Not started |

## MVP Feature Scope (agreed)

1. Manual income entry — salary amount, next payday, pay frequency
2. Manual recurring expenses — rent, subscriptions, known bills
3. Manual spending log — quick-add transactions
4. **Safe to Spend** number, recalculated in real-time
5. Timeline view — upcoming committed expenses before next payday

Bank sync (Plaid) and AI features are **v2**, not MVP.

## Next Steps (pick up here)

- [ ] Decide on framework details (Next.js App Router, shadcn/ui, Tailwind)
- [ ] Scaffold the Next.js app under `spendable/app/`
- [ ] Design the data model (income, expenses, transactions, pay cycles)
- [ ] Build the Safe to Spend calculation engine
- [ ] Build the core UI (home screen with the number + timeline)

## Reference Docs

- Full brainstorm: `docs/brainstorm.md`
- PRD: `docs/prd.md`
- Competitor notes: `docs/competitors.md`
- Tech decisions: `docs/tech-stack.md`
