"use client";

import { useState } from "react";
import { useSpendableStore } from "@/lib/store";

export function PaydayButton() {
  const { income, justGotPaid } = useSpendableStore();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | undefined>();

  if (!income) return null;

  const suggestion = (income.amountCents / 100).toFixed(2);

  function handleConfirm() {
    const cents = Math.round(parseFloat(value) * 100);
    if (!value.trim() || isNaN(cents) || cents < 0) {
      setError("Enter your new balance (0 or greater).");
      return;
    }
    justGotPaid(cents);
    setOpen(false);
    setValue("");
    setError(undefined);
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full rounded-2xl border border-primary/25 bg-primary/5 px-4 py-4 flex items-center justify-between text-left active:bg-primary/10 transition-colors"
      >
        <div className="flex flex-col gap-0.5">
          <p className="text-sm font-semibold text-foreground">Just got paid?</p>
          <p className="text-xs text-muted-foreground">Refresh your cycle with your new balance</p>
        </div>
        <span className="text-primary text-xl font-light ml-3">→</span>
      </button>
    );
  }

  return (
    <div className="rounded-2xl border border-primary/40 bg-primary/5 p-4 flex flex-col gap-3">
      <div>
        <p className="font-semibold text-sm">What&apos;s your new balance?</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          Past expenses and logs will clear for the new cycle.
        </p>
      </div>

      <div className="flex flex-col gap-1">
        <input
          type="number"
          inputMode="decimal"
          min="0"
          step="0.01"
          autoFocus
          enterKeyHint="done"
          placeholder={suggestion}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (error) setError(undefined);
          }}
          onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
          className={`border rounded-xl px-4 py-3 text-base bg-background w-full ${
            error ? "border-destructive" : "border-primary/40"
          }`}
        />
        {error && <span className="text-xs text-destructive">{error}</span>}
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleConfirm}
          className="flex-1 rounded-xl bg-primary text-primary-foreground px-4 py-3 text-sm font-semibold"
        >
          Start fresh cycle
        </button>
        <button
          onClick={() => {
            setOpen(false);
            setValue("");
            setError(undefined);
          }}
          className="rounded-xl border px-4 py-3 text-sm font-medium text-muted-foreground"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
