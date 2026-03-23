"use client";

import { useState } from "react";
import { useSpendableStore } from "@/lib/store";
import { PayFrequency } from "@/lib/types";
import { todayISO } from "@/lib/calculate";
import { useHydrated } from "@/lib/useHydrated";

const FREQUENCIES: { value: PayFrequency; label: string }[] = [
  { value: "weekly", label: "Weekly" },
  { value: "biweekly", label: "Every 2 weeks" },
  { value: "semimonthly", label: "Twice a month" },
  { value: "monthly", label: "Monthly" },
];

export function SetupIncome() {
  const hydrated = useHydrated();
  const { income, setIncome } = useSpendableStore();

  const [amount, setAmount] = useState("");
  const [nextPayday, setNextPayday] = useState("");
  const [frequency, setFrequency] = useState<PayFrequency>("biweekly");
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState<{ amount?: string; nextPayday?: string }>({});

  // Once hydrated, initialize form state from persisted income
  const [initialized, setInitialized] = useState(false);
  if (hydrated && !initialized) {
    setAmount(income ? (income.amountCents / 100).toFixed(2) : "");
    setNextPayday(income?.nextPayday ?? "");
    setFrequency(income?.frequency ?? "biweekly");
    setOpen(!income);
    setInitialized(true);
  }

  if (!hydrated) {
    return <div className="h-8 w-24 rounded bg-muted animate-pulse" />;
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-sm text-muted-foreground underline underline-offset-4"
      >
        Edit income
      </button>
    );
  }

  function validate(): boolean {
    const next: typeof errors = {};

    const cents = Math.round(parseFloat(amount) * 100);
    if (!amount.trim()) {
      next.amount = "Enter your pay per period.";
    } else if (isNaN(cents) || cents <= 0) {
      next.amount = "Amount must be greater than $0.";
    }

    if (!nextPayday) {
      next.nextPayday = "Select your next payday.";
    } else if (nextPayday < todayISO()) {
      next.nextPayday = "Payday must be today or in the future.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSave() {
    if (!validate()) return;
    const cents = Math.round(parseFloat(amount) * 100);
    setIncome({ amountCents: cents, nextPayday, frequency });
    setErrors({});
    setOpen(false);
  }

  return (
    <div className="rounded-xl border p-4 flex flex-col gap-3">
      <h2 className="font-semibold">Income setup</h2>

      <label className="flex flex-col gap-1 text-sm">
        Pay per period ($)
        <input
          type="number"
          min="0.01"
          step="0.01"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
            if (errors.amount) setErrors((p) => ({ ...p, amount: undefined }));
          }}
          placeholder="3500.00"
          className={`border rounded-md px-3 py-2 text-base bg-background ${
            errors.amount ? "border-destructive" : ""
          }`}
        />
        {errors.amount && (
          <span className="text-xs text-destructive">{errors.amount}</span>
        )}
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Next payday
        <input
          type="date"
          value={nextPayday}
          min={todayISO()}
          onChange={(e) => {
            setNextPayday(e.target.value);
            if (errors.nextPayday) setErrors((p) => ({ ...p, nextPayday: undefined }));
          }}
          className={`border rounded-md px-3 py-2 text-base bg-background ${
            errors.nextPayday ? "border-destructive" : ""
          }`}
        />
        {errors.nextPayday && (
          <span className="text-xs text-destructive">{errors.nextPayday}</span>
        )}
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Pay frequency
        <select
          value={frequency}
          onChange={(e) => setFrequency(e.target.value as PayFrequency)}
          className="border rounded-md px-3 py-2 text-base bg-background"
        >
          {FREQUENCIES.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
      </label>

      <button
        onClick={handleSave}
        className="mt-1 rounded-md bg-primary text-primary-foreground px-4 py-2 font-medium text-sm"
      >
        Save
      </button>
    </div>
  );
}
