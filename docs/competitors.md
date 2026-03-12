# Spendable — Competitor Analysis

**Date:** 2026-03-11

---

## Primary Competitor: PocketGuard

**Closest feature match** — has "In My Pocket" which calculates a similar safe-to-spend number. Established reputation, significant user base. Must be beaten on every axis that matters.

| Attribute | PocketGuard | Spendable |
|-----------|-------------|-----------|
| Core concept | "In My Pocket" balance | Safe to Spend |
| Cycle model | Calendar month | Pay cycle (salary date) |
| Onboarding | Requires bank sync first | 2 min, no sync needed |
| Number transparency | Black box | Fully auditable breakdown |
| AI layer | None | Claude-powered co-pilot |
| Design era | ~2016 UX | 2026, mobile-first |
| Price | Free + $7.99/mo Pro | Free + ~$4.99/mo |
| Platform | iOS + Android | Web PWA first |
| Irregular income | Not supported | Dedicated mode (v2) |
| Data privacy | Requires bank credentials | Local-first (no bank needed) |

### Their Biggest Vulnerabilities

#### 1. The Number Isn't Trustworthy
App store reviews frequently report the "In My Pocket" number being wrong, confusing, or unexplained. It's a black box — users don't understand what's being subtracted or why.

**Spendable's answer:** Make the calculation fully auditable. Tap the number → see every component:
```
$847 Safe to Spend
  Your balance:        $2,400
  - Rent (in 3 days):  -$1,200
  - Netflix (Friday):  -$15
  - Spotify (Sunday):  -$10
  - Your buffer:       -$200
  - Spent so far:      -$128
  ──────────────────────────
  = $847
```
**Radical transparency = trust.** This is the #1 weapon.

#### 2. Forced Bank Sync = High Drop-off
Bank connection is step 1. Plaid has had user lawsuits and trust issues. Many users never get past this step.

**Spendable's answer:** Full value with zero bank sync. Manual entry + optional sync later. Frame it as a privacy feature: *"Your data never leaves your device."*

#### 3. Calendar Month, Not Pay Cycle
PocketGuard resets on the 1st. If you're paid on the 15th or bi-weekly, the model is structurally wrong for you — it shows "you have money" right before rent is due.

**Spendable's answer:** Architecture built around your actual payday. Not a UX tweak — a fundamentally more correct model.

#### 4. Aggressive Paywalling
Free tier is crippled: limited accounts, no custom categories, ads. Heavy upsell toward $7.99/mo or $79.99 lifetime. App store reviews mention the paywall constantly.

**Spendable's answer:** Generous free tier (core Safe to Spend, unlimited expenses, no ads). Monetize on AI and bank sync. Price clearly lower.

#### 5. Zero AI
A 2014-era product. Pure reactive dashboard. Never talks to you, never predicts, never warns.

**Spendable's answer:** Claude-powered co-pilot that's proactive:
- *"3 subscriptions hit before Friday — your safe amount drops to $180"*
- *"You usually spend ~$70 on dining the week before payday. Heads up."*
- Natural language log: type "lunch $14" → done
- End-of-cycle plain English summary

#### 6. Mobile Only, Dated Design
No web app. UI looks and feels like 2017. No delight, no micro-interactions.

**Spendable's answer:** Web-first PWA (any device), modern design, animations that make the number feel alive when it updates.

#### 7. No Irregular Income Support
Gig workers and freelancers — anyone without a predictable paycheck — get no real help. The model just breaks.

**Spendable's answer:** Variable income mode: *"I usually earn $1,800–$2,400. Use conservative estimate."* Unlocks a massive underserved market.

### Strategic Positioning

**Don't fight them on features. Win on trust, accuracy, and intelligence.**

> *"PocketGuard tells you what's left. Spendable tells you what's safe."*

### Things to Verify While Using PocketGuard

- [ ] How long until you see the core number (onboarding friction)?
- [ ] Can you understand WHY the number is what it is?
- [ ] How does it handle manual/cash expenses?
- [ ] Does it proactively warn you about anything?
- [ ] Does it reset at month-end regardless of your pay date?
- [ ] What's paywalled and how aggressively is it pushed?
- [ ] Home screen clutter level — how many things compete for attention?

---

## YNAB (You Need A Budget)

**Most powerful but highest friction.**

- Philosophy: "give every dollar a job" — zero-based budgeting
- Requires significant mental model shift and ~30min setup
- $14.99/mo — highest in category
- Beloved by power users, intimidating to casual users
- **Not a direct threat for our target persona** — she bounced off YNAB already

---

## Copilot

**Best design in category, Apple ecosystem only.**

- Beautiful UI, excellent transaction categorization
- $12.99/mo — premium positioning
- iOS/macOS only — excludes Android users entirely
- No pay-cycle concept
- **Not a threat unless they go cross-platform**

---

## Monarch Money

- Household/couples focus
- $14.99/mo
- Good net worth tracking, bills, goals
- Complexity is a feature for their target (families), not ours
- **Different target user, not direct competition**

---

## Mint (Intuit)

- Shut down January 2024
- Users migrated to Credit Karma (Intuit) — inferior product
- **This is an opportunity** — orphaned Mint users actively looking for alternatives

---

## Emma (UK)

- UK/EU focused
- Subscription tracking, open banking
- Limited US presence
- **Not relevant for US launch**

---

## Simplifi by Quicken

- $3.99/mo — most affordable
- Decent spending plan feature
- Dated Quicken brand perception
- Calendar-month focus
- **Weak AI, weak design — beatable**

---

## What Nobody Does Well

1. **Pay-cycle native** — every app uses calendar months
2. **Sub-2-minute onboarding** — all require bank sync or lengthy setup
3. **Proactive AI warnings** — reactive dashboards, not forward-looking agents
4. **Single-number clarity** — all show dashboards of charts, not one trusted number
5. **Trust-first (no bank sync required)** — all push bank sync as first step

These are all **Spendable's whitespace.**

---

## Research To Do

- [x] Sign up for PocketGuard free tier — in progress (downloading now)
- [ ] Check PocketGuard's app store reviews for pain points users mention
- [ ] Review r/personalfinance and r/ynab for recurring complaints about existing tools
- [ ] Check Product Hunt for recent personal finance launches
- [ ] Talk to 5 people in target persona (22-28, first salary) about current habits
