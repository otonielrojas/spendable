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

export function HomeContent() {
  const hydrated = useHydrated();
  const income = useSpendableStore((s) => s.income);
  const [onboarded, setOnboarded] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  if (!hydrated) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <div className="mx-auto max-w-md px-4">
          <header className="py-6 text-center">
            <h1 className="text-xl font-bold tracking-tight">spendable</h1>
          </header>
          <div className="h-32 rounded-xl bg-muted animate-pulse mb-6" />
          <div className="h-5 w-48 rounded bg-muted animate-pulse mx-auto mb-8" />
          <div className="border-t mb-6" />
          <div className="h-20 rounded-xl bg-muted animate-pulse mb-4" />
          <div className="h-20 rounded-xl bg-muted animate-pulse" />
        </div>
      </main>
    );
  }

  const isFirstTime = !income && !onboarded;

  if (isFirstTime || showOnboarding) {
    return (
      <OnboardingWizard
        replay={showOnboarding && !isFirstTime}
        onComplete={() => { setOnboarded(true); setShowOnboarding(false); }}
        onDismiss={() => setShowOnboarding(false)}
      />
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-md px-4 pb-safe">
        <header className="py-6 flex items-center justify-center relative">
          <h1 className="text-xl font-bold tracking-tight">spendable</h1>
          <button
            onClick={() => setShowOnboarding(true)}
            title="Show tutorial"
            className="absolute right-0 text-muted-foreground hover:text-foreground w-8 h-8 rounded-full border flex items-center justify-center text-sm"
          >
            ?
          </button>
        </header>

        <SafeToSpendCard />

        <div className="flex justify-center mb-8">
          <BalanceInput />
        </div>

        <div className="border-t mb-6" />

        <div className="mb-6">
          <SetupIncome />
        </div>

        <div className="mb-6">
          <ExpenseList />
        </div>

        <div className="mb-6">
          <TransactionLog />
        </div>
      </div>
    </main>
  );
}
