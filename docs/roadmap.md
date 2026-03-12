# Spendable — Roadmap

> Last updated: 2026-03-12 (M2 complete)

## Milestones

### M0 — Foundation ✅
- [x] Brainstorm & concept validation
- [x] PRD written
- [x] Tech stack decided (Next.js, Tailwind, shadcn/ui, Zustand, Claude API)
- [x] Competitor analysis

### M1 — Scaffold & Core Engine ✅
- [x] Next.js app scaffolded under `app/`
- [x] Data model defined (`types.ts`)
- [x] Zustand store wired up (`store.ts`)
- [x] Safe to Spend calculation engine (`calculate.ts`)
- [x] Core UI components (SafeToSpendCard, BalanceInput, SetupIncome, ExpenseList, TransactionLog)
- [x] App renders and basic flow works

### M2 — Testing & CI/CD ✅
- [x] Vitest + React Testing Library configured
- [x] Playwright E2E configured
- [x] Unit tests: calculate.ts (20 tests, full coverage of engine)
- [x] Store tests: partialize, rehydration, actions (26 tests total)
- [ ] Component tests: SafeToSpendCard, SetupIncome, ExpenseList
- [ ] E2E test: full happy path (set income → add expense → see Safe to Spend)
- [x] Git repo initialized at project root
- [x] GitHub repo: https://github.com/otonielrojas/spendable
- [x] Netlify auto-deploy on merge to master → https://spendable.netlify.app
- [x] Netlify PR deploy previews (unique URL per open PR)
- [x] GitHub Actions CI: lint + unit tests on every PR
- [x] Development workflow documented in CLAUDE.md (branch naming, PR checklist, merge policy)

### M3 — MVP Polish
- [ ] Persistence: localStorage so data survives refresh
- [ ] Onboarding flow: first-time user guided setup (income → buffer → first expense)
- [ ] Empty states for every section
- [ ] Error handling & input validation (negative amounts, past due dates, etc.)
- [ ] Mobile UX pass: touch targets, keyboard behavior, safe area insets
- [ ] Dark mode support
- [ ] PWA manifest + installable on mobile homescreen

### M4 — Validation & Feedback
- [ ] Deploy to production URL
- [ ] Share with 10 target users (young professionals)
- [ ] Collect feedback via simple typeform or in-app widget
- [ ] Track key metric: do users return after day 1? day 7?
- [ ] Iterate on core UX based on feedback

### M5 — V2: Bank Sync
- [ ] Plaid integration: link bank account
- [ ] Auto-import transactions
- [ ] Auto-detect recurring expenses from transaction history
- [ ] Balance auto-updated from bank

### M6 — V2: AI Layer (Freemium)
- [ ] Claude API integration
- [ ] "Why is my Safe to Spend low?" — AI explanation
- [ ] Smart categorization of transactions
- [ ] Pay cycle insights ("You usually have $X left by day 10")
- [ ] Subscription paywall ($5–8/mo) for AI features

---

## Decisions Log

| Date | Decision | Reason |
|------|----------|--------|
| 2026-03-11 | No bank sync in MVP | Validate core UX loop cheaply before Plaid integration complexity |
| 2026-03-11 | Pay-cycle-native (not calendar month) | Primary differentiator vs PocketGuard |
| 2026-03-11 | Target: young professionals on first salary | Clear niche, high pain point, word-of-mouth potential |
| 2026-03-11 | Freemium: core free, AI ~$5-8/mo | Lower barrier to adoption; AI features justify upsell |
| 2026-03-12 | Vitest (not Jest) | Faster, native ESM, better Next.js/React 19 compat |
| 2026-03-12 | Playwright for E2E (not Cypress) | Better performance, cross-browser, first-class TypeScript |
