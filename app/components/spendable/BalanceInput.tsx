"use client";

import { useState } from "react";
import { useSpendableStore } from "@/lib/store";
import { formatCurrency } from "@/lib/calculate";
import { useHydrated } from "@/lib/useHydrated";

export function BalanceInput() {
  const hydrated = useHydrated();
  const { settings, updateSettings } = useSpendableStore();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | undefined>();

  // Initialize input value from persisted store once hydrated
  const [initialized, setInitialized] = useState(false);
  if (hydrated && !initialized) {
    setValue((settings.currentBalanceCents / 100).toFixed(2));
    setInitialized(true);
  }

  if (!hydrated) {
    return <div className="h-5 w-48 rounded bg-muted animate-pulse" />;
  }

  function handleSave() {
    const cents = Math.round(parseFloat(value) * 100);
    if (isNaN(cents) || cents < 0) {
      setError("Enter a valid balance (0 or greater).");
      return;
    }
    setError(undefined);
    updateSettings({ currentBalanceCents: cents });
    setEditing(false);
  }

  if (!editing) {
    return (
      <button
        onClick={() => setEditing(true)}
        className="w-full rounded-xl border border-border bg-card px-4 py-3.5 text-left flex items-center justify-between group hover:border-primary/40 transition-colors"
      >
        <div>
          <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-0.5">
            Current Balance
          </p>
          <p className="text-lg font-semibold tabular-nums font-mono">
            {formatCurrency(settings.currentBalanceCents)}
          </p>
        </div>
        <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors">
          Edit →
        </span>
      </button>
    );
  }

  return (
    <div className="rounded-xl border border-primary/40 bg-primary/5 p-4 flex flex-col gap-3">
      <p className="text-sm font-semibold">Update your balance</p>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted-foreground font-medium">Balance ($)</label>
        <input
          type="number"
          inputMode="decimal"
          min="0"
          step="0.01"
          autoFocus
          enterKeyHint="done"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (error) setError(undefined);
          }}
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
          className={`w-full border rounded-md px-3 py-2.5 text-base bg-background ${
            error ? "border-destructive" : "border-primary/40"
          }`}
        />
        {error && <span className="text-xs text-destructive">{error}</span>}
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleSave}
          className="flex-1 rounded-md bg-primary text-primary-foreground px-4 py-2.5 text-sm font-semibold"
        >
          Save
        </button>
        <button
          onClick={() => {
            setEditing(false);
            setError(undefined);
          }}
          className="rounded-md border px-4 py-2.5 text-sm font-medium text-muted-foreground"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
