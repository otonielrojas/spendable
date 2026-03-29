"use client";

import { useEffect, useState } from "react";
import { useSpendableStore } from "@/lib/store";
import { SetupIncome } from "./SetupIncome";
import { ExpenseList } from "./ExpenseList";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

type Step = 1 | 2 | 3;

const STEP_HEADINGS: Record<Step, { title: string; subtitle: string }> = {
  1: {
    title: "When do you get paid?",
    subtitle: "We use your pay cycle — not the calendar month — to calculate your safe-to-spend window.",
  },
  2: {
    title: "Any bills before your next payday?",
    subtitle: "Rent, subscriptions, anything due soon. You can skip this and add them later.",
  },
  3: {
    title: "What's your current balance?",
    subtitle: "Check your bank account. This is the starting point for your number.",
  },
};

interface OnboardingWizardProps {
  onComplete: () => void;
  /** True when the user manually re-opens the tutorial from the dashboard. */
  replay?: boolean;
  /** Called when the user dismisses the tutorial in replay mode. */
  onDismiss?: () => void;
}

export function OnboardingWizard({ onComplete, replay = false, onDismiss }: OnboardingWizardProps) {
  const [step, setStep] = useState<Step>(1);
  const income = useSpendableStore((s) => s.income);
  const { updateSettings } = useSpendableStore();

  const [balanceValue, setBalanceValue] = useState("");
  const [balanceError, setBalanceError] = useState<string | undefined>();

  // Auto-advance from step 1 only on first-time setup (income was null when wizard mounted).
  // In replay mode income is already set, so we skip auto-advance and let the user navigate manually.
  const [incomeWasNullOnMount] = useState(income === null);
  useEffect(() => {
    if (!replay && step === 1 && income !== null && incomeWasNullOnMount) {
      setStep(2);
    }
  }, [income, step, replay, incomeWasNullOnMount]);

  function handleFinish() {
    const cents = Math.round(parseFloat(balanceValue) * 100);
    if (!balanceValue.trim() || isNaN(cents) || cents < 0) {
      setBalanceError("Enter a valid balance (0 or greater).");
      return;
    }
    updateSettings({ currentBalanceCents: cents });
    onComplete();
  }

  const { title, subtitle } = STEP_HEADINGS[step];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-md px-4 pb-safe">
        <header className="py-6 flex items-center justify-center relative">
          <div className="absolute left-0">
            <ThemeToggle />
          </div>
          <h1 className="text-xl font-bold tracking-tight">spendable</h1>
          {replay && onDismiss && (
            <button
              onClick={onDismiss}
              title="Close tutorial"
              className="absolute right-0 text-muted-foreground hover:text-foreground w-8 h-8 rounded-full border flex items-center justify-center text-sm"
            >
              ✕
            </button>
          )}
        </header>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {([1, 2, 3] as Step[]).map((s) => (
            <div
              key={s}
              className={`h-1.5 w-8 rounded-full transition-colors ${
                s <= step ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>

        <div className="text-center mb-6">
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        </div>

        {/* Step 1 — Income */}
        {step === 1 && (
          <div className="flex flex-col gap-4">
            <SetupIncome />
            {/* In replay mode income is already set — show a manual Next button */}
            {replay && (
              <button
                onClick={() => setStep(2)}
                className="rounded-md bg-primary text-primary-foreground px-4 py-3 text-sm font-medium"
              >
                Next →
              </button>
            )}
          </div>
        )}

        {/* Step 2 — Expenses */}
        {step === 2 && (
          <div className="flex flex-col gap-4">
            <ExpenseList />
            <div className="flex gap-3 mt-2">
              {replay ? (
                <>
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 rounded-md border px-4 py-3 text-sm font-medium text-muted-foreground"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="flex-1 rounded-md bg-primary text-primary-foreground px-4 py-3 text-sm font-medium"
                  >
                    Next →
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setStep(3)}
                    className="flex-1 rounded-md border px-4 py-3 text-sm font-medium text-muted-foreground"
                  >
                    Skip
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="flex-1 rounded-md bg-primary text-primary-foreground px-4 py-3 text-sm font-medium"
                  >
                    Continue →
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Step 3 — Balance */}
        {step === 3 && (
          <div className="flex flex-col gap-4">
            <div className="rounded-xl border p-4 flex flex-col gap-3">
              <label className="flex flex-col gap-1 text-sm">
                Current balance ($)
                <input
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.01"
                  autoFocus
                  enterKeyHint="done"
                  value={balanceValue}
                  placeholder="2400.00"
                  onChange={(e) => {
                    setBalanceValue(e.target.value);
                    if (balanceError) setBalanceError(undefined);
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleFinish()}
                  className={`border rounded-md px-3 py-2 text-base bg-background ${
                    balanceError ? "border-destructive" : ""
                  }`}
                />
                {balanceError && (
                  <span className="text-xs text-destructive">{balanceError}</span>
                )}
              </label>
            </div>
            <div className="flex gap-3">
              {replay && (
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 rounded-md border px-4 py-3 text-sm font-medium text-muted-foreground"
                >
                  ← Back
                </button>
              )}
              <button
                onClick={handleFinish}
                className="flex-1 rounded-md bg-primary text-primary-foreground px-4 py-3 font-medium text-sm"
              >
                {replay ? "Save & close" : "See my number →"}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
