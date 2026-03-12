"use client";

import { useState } from "react";
import { useSpendableStore } from "@/lib/store";
import { PayFrequency } from "@/lib/types";
import { todayISO } from "@/lib/calculate";

const FREQUENCIES: { value: PayFrequency; label: string }[] = [
  { value: "weekly", label: "Weekly" },
  { value: "biweekly", label: "Every 2 weeks" },
  { value: "semimonthly", label: "Twice a month" },
  { value: "monthly", label: "Monthly" },
];

export function SetupIncome() {
  const { income, setIncome } = useSpendableStore();
  const [amount, setAmount] = useState(
    income ? (income.amountCents / 100).toFixed(2) : ""
  );
  const [nextPayday, setNextPayday] = useState(income?.nextPayday ?? "");
  const [frequency, setFrequency] = useState<PayFrequency>(
    income?.frequency ?? "biweekly"
  );
  const [open, setOpen] = useState(!income);

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

  function handleSave() {
    const cents = Math.round(parseFloat(amount) * 100);
    if (!cents || isNaN(cents) || !nextPayday) return;
    setIncome({ amountCents: cents, nextPayday, frequency });
    setOpen(false);
  }

  return (
    <div className="rounded-xl border p-4 flex flex-col gap-3">
      <h2 className="font-semibold">Income setup</h2>

      <label className="flex flex-col gap-1 text-sm">
        Pay per period ($)
        <input
          type="number"
          min="0"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="3500.00"
          className="border rounded-md px-3 py-2 text-base bg-background"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Next payday
        <input
          type="date"
          value={nextPayday}
          min={todayISO()}
          onChange={(e) => setNextPayday(e.target.value)}
          className="border rounded-md px-3 py-2 text-base bg-background"
        />
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
