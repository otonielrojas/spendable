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
    <main className="bg-background text-foreground overflow-x-hidden">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border px-5 py-3 flex items-center justify-between">
        <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
        <div className="h-3 w-20 rounded-full bg-muted animate-pulse" />
        <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
      </header>
      <div className="max-w-md mx-auto px-5 pt-6 pb-2 animate-pulse">
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
      <div className="h-px bg-border mx-5" />
      <div className="max-w-md mx-auto px-5 py-5 flex flex-col gap-3 animate-pulse">
        <div className="h-12 rounded-xl bg-muted" />
        <div className="h-10 rounded-xl bg-muted" />
        <div className="h-10 rounded-xl bg-muted" />
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
    <main className="bg-background text-foreground overflow-x-hidden">

      {/* Sticky header — stays visible while content scrolls */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-md mx-auto px-5 py-3 flex items-center justify-between">
          <ThemeToggle />
          <h1 className="text-[11px] font-bold tracking-[0.3em] uppercase">
            spendable
          </h1>
          <button
            onClick={() => setShowOnboarding(true)}
            title="Show tutorial"
            className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-xs text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
            aria-label="Show tutorial"
          >
            ?
          </button>
        </div>
      </header>

      {/* Hero — scrolls with the page (no fixed height, no inner scroll container) */}
      <div className="max-w-md mx-auto">
        <SafeToSpendCard onGoToSetup={() => setTab("setup")} />
      </div>

      {/* Separator */}
      <div className="h-px bg-border mx-5 max-w-md mx-auto" />

      {/* Tab content — natural height, whole page scrolls.
          This is intentional: avoids iOS keyboard shrinking a fixed-height
          inner scroll container, which causes forms to fill weirdly. */}
      <div className="max-w-md mx-auto pb-32">

        {tab === "home" && (
          <div className="px-5 pt-5 flex flex-col gap-6">
            <PaydayButton />
            <TransactionLog />
          </div>
        )}

        {tab === "bills" && (
          <div className="px-5 pt-5">
            <ExpenseList />
          </div>
        )}

        {tab === "setup" && (
          <div className="px-5 pt-5 flex flex-col gap-6">
            <BalanceInput />
            <SetupIncome />
          </div>
        )}

      </div>

      {/* Fixed bottom nav */}
      <BottomNav tab={tab} onChange={(t) => setTab(t)} />
    </main>
  );
}
