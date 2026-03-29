"use client";

import { useHydrated } from "@/lib/useHydrated";
import { useSpendableStore } from "@/lib/store";
import { useState } from "react";
import { OnboardingWizard } from "./OnboardingWizard";
import { SafeToSpendCard } from "./SafeToSpendCard";
import { SetupIncome } from "./SetupIncome";
import { BalanceInput } from "./BalanceInput";
import { ExpenseList } from "./ExpenseList";
import { TransactionLog } from "./TransactionLog";
import { PaydayButton } from "./PaydayButton";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { BottomNav, Tab } from "@/components/ui/BottomNav";

function LoadingSkeleton() {
  return (
    <main className="min-h-dvh bg-background text-foreground overflow-x-hidden">
      <div className="max-w-md mx-auto flex flex-col min-h-dvh">
        <header className="px-5 py-4 flex items-center justify-between shrink-0">
          <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
          <div className="h-4 w-20 rounded-full bg-muted animate-pulse" />
          <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
        </header>
        <div className="px-5 pt-7 pb-5 animate-pulse shrink-0">
          <div className="h-3 w-24 rounded-full bg-muted mb-4 mx-auto" />
          <div className="h-14 w-44 rounded-xl bg-muted mx-auto mb-5" />
          <div className="h-1 w-full rounded-full bg-muted mb-1.5" />
          <div className="h-3 w-40 rounded-full bg-muted mx-auto mb-5" />
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex-1 h-16 rounded-2xl bg-muted" />
            ))}
          </div>
        </div>
        <div className="h-px bg-border mx-5 shrink-0" />
        <div className="flex-1 px-5 py-5 flex flex-col gap-3 animate-pulse">
          <div className="h-12 rounded-xl bg-muted" />
          <div className="h-10 rounded-xl bg-muted" />
          <div className="h-10 rounded-xl bg-muted" />
        </div>
      </div>
    </main>
  );
}

export function HomeContent() {
  const hydrated = useHydrated();
  const income = useSpendableStore((s) => s.income);
  const [onboarded, setOnboarded] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [tab, setTab] = useState<Tab>("home");

  if (!hydrated) {
    return <LoadingSkeleton />;
  }

  const isFirstTime = !income && !onboarded;

  if (isFirstTime || showOnboarding) {
    return (
      <OnboardingWizard
        replay={showOnboarding && !isFirstTime}
        onComplete={() => {
          setOnboarded(true);
          setShowOnboarding(false);
        }}
        onDismiss={() => setShowOnboarding(false)}
      />
    );
  }

  return (
    <main className="min-h-dvh bg-background text-foreground overflow-x-hidden">
      <div className="max-w-md mx-auto flex flex-col min-h-dvh">

        {/* Header */}
        <header className="px-5 py-4 flex items-center justify-between shrink-0">
          <ThemeToggle />
          <h1 className="text-sm font-semibold tracking-tight">spendable</h1>
          <button
            onClick={() => setShowOnboarding(true)}
            title="Show tutorial"
            className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-xs text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
            aria-label="Show tutorial"
          >
            ?
          </button>
        </header>

        {/* Hero — always visible above the tabs */}
        <div className="shrink-0">
          <SafeToSpendCard
            onGoToSetup={() => setTab("setup")}
          />
        </div>

        {/* Separator */}
        <div className="h-px bg-border mx-5 shrink-0" />

        {/* Scrollable tab content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden pb-24">

          {tab === "home" && (
            <div className="px-5 py-5 flex flex-col gap-6">
              <PaydayButton />
              <TransactionLog />
            </div>
          )}

          {tab === "bills" && (
            <div className="px-5 py-5">
              <ExpenseList />
            </div>
          )}

          {tab === "setup" && (
            <div className="px-5 py-5 flex flex-col gap-6">
              <BalanceInput />
              <SetupIncome />
            </div>
          )}

        </div>
      </div>

      {/* Fixed bottom nav — outside the max-w-md column so it's full-width */}
      <BottomNav
        tab={tab}
        onChange={(t) => setTab(t)}
      />
    </main>
  );
}
