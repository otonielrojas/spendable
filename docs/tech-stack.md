# Spendable — Tech Stack Decisions

**Date:** 2026-03-11

---

## MVP Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | Next.js 14 (App Router) | SSR/SSG flexibility, good PWA support, familiar |
| Language | TypeScript | Type safety for financial calculations is non-negotiable |
| Styling | Tailwind CSS + shadcn/ui | Fast, consistent, accessible components |
| State | Zustand | Lightweight, simple, works well with local-first |
| Storage | localStorage (MVP) | Zero backend, offline-first, privacy advantage |
| Hosting | Vercel | Zero-config Next.js deployment |

---

## V2 Additions

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Database | Supabase (Postgres) | Auth + DB in one, good free tier, real-time subscriptions |
| Auth | Supabase Auth or Clerk | Clerk if we need social login quickly |
| Bank sync | Plaid | Industry standard, US/CA/EU coverage |
| AI | Claude API (claude-sonnet-4-6) | Best reasoning for financial context, Anthropic's latest |

---

## Architecture Decisions

### Local-First for MVP
- All data stays in localStorage — no backend required
- This is a **feature**, not a limitation: market it as "your data never leaves your device"
- Makes onboarding instant — no account creation, no email required
- Migration path: when user opts in to sync, export localStorage → Supabase

### Financial Calculations
- All monetary values stored as **integers in cents** (not floats) to avoid floating point errors
- Example: $12.99 stored as `1299`
- All display formatting handled by a single `formatCurrency(cents: number)` utility

### PWA First, Native Later
- Next.js can be configured as a PWA with service worker for offline support
- Users can "install" it to home screen on iOS/Android
- Native app (Expo/React Native) only if PWA retention proves insufficient

---

## What We're NOT Using (and Why)

| Rejected | Reason |
|----------|--------|
| React Native (now) | Adds complexity before product is validated |
| Firebase | Vendor lock-in, pricing unpredictability at scale |
| Redux | Too much boilerplate for this app's complexity |
| Prisma + self-hosted DB | Unnecessary ops burden for MVP |
| Stripe (now) | No payments in MVP — freemium model validated first |

---

## Open Decisions

- [ ] shadcn/ui vs. Radix UI directly — leaning shadcn for speed
- [ ] Dark mode from day 1 or post-MVP?
- [ ] Currency/locale: USD only for MVP or multi-currency?
- [ ] Chart library: Recharts, Victory, or custom SVG for the timeline view?
