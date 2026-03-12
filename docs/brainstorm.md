# Spendable — Initial Brainstorm Session

**Date:** 2026-03-11
**Participants:** Founder + Claude

---

## Origin Idea

Build an app with a special focus on helping people manage expenses. Users should be able to easily know at any moment how much they can spend safely before the next salary payment, plus a list of coming expenses pending before the next salary date.

Starting point: explore feasibility, market potential, and what competitive edge we can bring — simplicity, niche focus, AI agentic capabilities, cutting-edge tech.

---

## The Core Insight

Most expense apps answer: *"Where did my money go?"*

**Spendable** answers: **"How much can I spend RIGHT NOW without screwing myself?"**

That single number — **Safe to Spend** — is what nobody shows you clearly:

```
Current Balance
  - Upcoming committed expenses before next payday
  - Personal safety buffer
  ──────────────────────────────────────────────
= Safe to Spend
```

---

## Market Landscape

### Existing Competitors

| App | Core Weakness |
|-----|--------------|
| **YNAB** | Steep learning curve, budget-first not balance-first, $15/mo |
| **Mint** | Deprecated/acquired, backward-looking |
| **Copilot** | Apple-only, $13/mo |
| **Monarch Money** | Complex, household-focused, $15/mo |
| **PocketGuard** | Has "In My Pocket" (closest rival) but dated UX, no AI |
| **Emma** | UK-centric |
| **Simplifi** | $4/mo, decent but not pay-cycle native |

### Closest Competitor
**PocketGuard** — has an "In My Pocket" feature that does the same calculation. Key weaknesses:
- Dated UX/design
- No AI layer
- Not pay-cycle native (calendar month focus)
- Complex onboarding

---

## Competitive Edges Identified

### 1. Radical Simplicity
- One primary number, always visible
- Onboarding in under 2 minutes (vs YNAB's 30-minute setup)
- No "budget categories" required to get value on day 1

### 2. Pay-Cycle Native
- Most apps think in months. People think in **paycheck cycles**
- Everything resets and recalculates around your salary date
- Works naturally for bi-weekly, weekly, irregular income (gig workers)
- This is a genuine structural differentiator, not just UX polish

### 3. AI Agentic Capabilities
- **Predict upcoming expenses** from spending history ("you usually spend ~$60 on gas around day 5 of your cycle")
- **Natural language entry**: "just bought lunch for $14" → auto-categorized
- **Proactive warnings**: "heads up, 3 subscriptions hit before Friday — your safe amount drops to $180"
- **Negotiation nudges**: "you could save $40 by pausing Netflix this cycle — want to?"
- Claude API is the natural choice for the conversational layer

### 4. Committed vs. Discretionary Split
- Automatically learn which expenses are fixed/recurring vs. optional
- Show two buckets visually — "locked" money vs. "free" money
- Makes the abstraction tangible and easy to grasp

### 5. Trust-First Design
- Major barrier for new fintech apps: people don't trust connecting bank accounts
- MVP avoids this entirely — manual entry lowers barrier to zero
- Build trust before asking for bank access

---

## Target Niches (Prioritized)

1. **Young professionals** — first real salary, want to build habits, underserved by YNAB complexity
2. **Gig / freelance workers** — irregular income, hardest underserved case, huge market
3. **Couples** — shared income, shared commitments, different spending styles

**Decision: start with young professionals for MVP. Cleaner problem, regular income simplifies v1.**

---

## Feasibility Assessment

### Technical
- Bank connectivity: **Plaid** (US/CA/EU) or **TrueLayer** (UK/EU) — mature APIs
- MVP can skip bank sync — manual entry + CSV import validates concept cheaply
- AI layer: Claude API for predictions, categorization, conversation
- Stack: Next.js + possible React Native (Expo) later for mobile

### Business Model
- Freemium: core safe-to-spend free, AI features / bank sync behind $5-8/mo
- Lower price point than YNAB/Monarch is a viable positioning
- Goal: 1,000 paying users at $6/mo = $6k MRR as initial validation target

### Risks
- Bank sync compliance + security is non-trivial (solvable with Plaid, but adds complexity)
- Trust barrier — people are skeptical connecting bank accounts to new apps → MVP sidesteps this
- PocketGuard already does a version of this → must be clearly simpler and smarter

---

## MVP Scope Decision

**No bank connection in MVP.** Manual entry only. Validates core UX loop with zero compliance risk.

MVP features:
1. Manual income entry (salary amount + next payday date + pay frequency)
2. Manual recurring expenses (rent, subscriptions, known bills)
3. Manual spending log (quick-add transactions)
4. **Safe to Spend** number, recalculated in real-time
5. Timeline view of upcoming committed expenses before next payday

Bank sync (Plaid) and AI features move to v2.

---

## Name Decision

Candidates considered:
- Payday — simple, cycle-focused
- Float — "how much float do you have?"
- Runway — "X days of runway"
- Clearance — what's clear to spend
- **Spendable** — dead obvious, immediately communicates the value prop ✓

**Selected: Spendable**

---

## Open Questions (for future sessions)

- Should the primary display be a number, a progress bar, or a gauge?
- How do we handle unexpected expenses (car repair, medical bill)?
- What's the onboarding flow — wizard vs. conversational (AI-guided)?
- iOS/Android native vs. web-first PWA?
- Should safety buffer be a fixed amount or a percentage?
- Multi-currency support from day 1?
