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
        className="text-sm text-muted-foreground underline underline-offset-4 py-2 px-1"
      >
        Balance: {formatCurrency(settings.currentBalanceCents)} — tap to update
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-1 items-center">
      <div className="flex gap-2 items-center">
        <span className="text-sm font-medium">Balance $</span>
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
          className={`border rounded-md px-3 py-1.5 text-sm bg-background w-36 ${
            error ? "border-destructive" : ""
          }`}
        />
        <button
          onClick={handleSave}
          className="rounded-md bg-primary text-primary-foreground px-3 py-1.5 text-sm font-medium"
        >
          Save
        </button>
        <button
          onClick={() => {
            setEditing(false);
            setError(undefined);
          }}
          className="text-sm text-muted-foreground"
        >
          Cancel
        </button>
      </div>
      {error && <span className="text-xs text-destructive">{error}</span>}
    </div>
  );
}
