# Spendable — Product Requirements Document

**Version:** 0.1 (MVP)
**Date:** 2026-03-11
**Status:** Draft

---

## 1. Problem Statement

People make daily spending decisions without knowing if they can actually afford them. Bank balance alone is misleading — it doesn't account for rent due in 3 days, the Netflix charge on Friday, or the insurance auto-pay at end of month.

The question people actually need answered: **"How much can I spend right now without screwing up my finances before my next paycheck?"**

No mainstream app answers this question simply, quickly, and accurately.

---

## 2. Target User (MVP)

**Primary persona: "First Salary Sarah"**
- 22-28 years old, first or second full-time job
- Regular monthly or bi-weekly salary
- Wants to build savings habits but finds YNAB overwhelming
- Mostly lives paycheck-to-paycheck by default, not necessity
- Would benefit from a simple visibility tool, not a full budgeting system

**What she needs:**
- A number she can trust ("safe to spend")
- A quick way to see what's coming out before payday
- Minimal setup — value in under 2 minutes

---

## 3. Core Concept

### The Safe to Spend Number

```
Safe to Spend = Current Balance − Committed Upcoming Expenses − Safety Buffer
```

- **Current Balance:** manually entered, updated as user logs spending
- **Committed Upcoming Expenses:** all recurring/scheduled expenses between today and next payday
- **Safety Buffer:** user-defined floor (e.g., "always keep $200 in reserve")

This number updates in real-time as the user logs transactions.

### Pay Cycle

Everything revolves around the pay cycle, not the calendar month.

Supported frequencies: monthly, bi-weekly (every 2 weeks), weekly.
User inputs: salary amount and next payday date. App calculates all future cycles from there.

---

## 4. MVP Features

### F1 — Onboarding Setup
- Enter salary amount (net/take-home)
- Select pay frequency (monthly / bi-weekly / weekly)
- Enter next payday date
- Set safety buffer (default: $0, user can change)
- Enter starting balance (current bank balance)

Completion: under 2 minutes. No account required for MVP (local storage).

### F2 — Safe to Spend Dashboard (Home Screen)
- Large, prominent Safe to Spend number
- Days until next payday
- Current balance (smaller, secondary)
- Visual indicator: green/amber/red based on how much buffer remains
- Quick-add transaction button

### F3 — Committed Expenses Manager
- Add recurring expenses: name, amount, due date, frequency
- Mark as "committed" (will definitely happen) vs "estimated" (likely but variable)
- Examples: Rent (committed), Netflix (committed), Groceries (estimated ~$200)
- List view sorted by next occurrence date

### F4 — Upcoming Expenses Timeline
- Chronological list: today → next payday
- Shows each committed expense with days until it hits
- Running balance shown after each hit
- Clear visual when Safe to Spend would drop into buffer zone

### F5 — Transaction Log
- Quick-add: amount + optional note + optional category
- Tap to log — should take under 5 seconds
- List of recent transactions for current cycle
- Editing and deletion

### F6 — Cycle Reset
- On payday, app detects new cycle (or user confirms)
- Updates balance, resets cycle tracking
- Shows summary: "Last cycle: you stayed within budget X of Y days"

---

## 5. Out of Scope (MVP)

- Bank account sync (Plaid) → v2
- AI features (predictions, assistant, nudges) → v2
- Multiple accounts → v2
- Couples / shared finances → v3
- Irregular/gig income → v3
- Savings goals → v2
- Reports / analytics → v2
- iOS/Android native app → post-MVP (start with PWA)

---

## 6. Non-Functional Requirements

- **Performance:** Safe to Spend calculation must update instantly (< 50ms)
- **Offline-first:** MVP works entirely offline (localStorage), no backend required
- **Mobile-first:** designed for thumb-friendly one-handed use
- **Privacy:** no data leaves the device in MVP (a trust advantage to communicate)

---

## 7. Data Model (MVP)

```
PayCycle {
  id
  salaryAmount: number
  frequency: 'monthly' | 'biweekly' | 'weekly'
  nextPayday: date
  safetyBuffer: number
  currentBalance: number
}

Expense {
  id
  name: string
  amount: number
  dueDay: number          // day of cycle (1-30 or day offset)
  frequency: 'once' | 'monthly' | 'biweekly' | 'weekly'
  type: 'committed' | 'estimated'
  category: string
  active: boolean
}

Transaction {
  id
  amount: number
  note: string
  category: string
  date: datetime
  cycleId: string
}
```

---

## 8. Success Metrics (MVP Validation)

- **Activation:** 80% of users who complete onboarding return the next day
- **Retention:** 40% weekly active users after 2 weeks
- **Core action:** median user logs 1+ transaction per day
- **NPS:** > 40 after 2 weeks of use
- **Qualitative:** users describe the Safe to Spend number as "trustworthy" and "useful"

---

## 9. Design Principles

1. **One number rules** — Safe to Spend is always the hero
2. **Cycle-first, not month-first** — all language and UI references the pay cycle
3. **Committed before discretionary** — make it visual and obvious what's already spoken for
4. **Fast by default** — logging a transaction should never take more than 3 taps
5. **Honest uncertainty** — estimated expenses show differently from committed ones

---

## 10. Open Questions

- [ ] Should onboarding require account creation, or stay anonymous (localStorage only)?
- [ ] Primary UI: number + progress bar, or gauge/dial?
- [ ] How does the app handle unexpected expenses (car repair, medical)?
- [ ] What happens when the user's actual payday is different from expected?
- [ ] Should the safety buffer be shown as a separate line item or just subtracted silently?
