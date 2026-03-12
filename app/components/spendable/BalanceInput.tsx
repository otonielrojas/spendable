"use client";

import { useState } from "react";
import { useSpendableStore } from "@/lib/store";
import { formatCurrency } from "@/lib/calculate";

export function BalanceInput() {
  const { settings, updateSettings } = useSpendableStore();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(
    (settings.currentBalanceCents / 100).toFixed(2)
  );

  function handleSave() {
    const cents = Math.round(parseFloat(value) * 100);
    if (isNaN(cents)) return;
    updateSettings({ currentBalanceCents: cents });
    setEditing(false);
  }

  if (!editing) {
    return (
      <button
        onClick={() => setEditing(true)}
        className="text-sm text-muted-foreground underline underline-offset-4"
      >
        Balance: {formatCurrency(settings.currentBalanceCents)} — tap to update
      </button>
    );
  }

  return (
    <div className="flex gap-2 items-center">
      <span className="text-sm font-medium">Balance $</span>
      <input
        type="number"
        min="0"
        step="0.01"
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSave()}
        className="border rounded-md px-3 py-1.5 text-sm bg-background w-36"
      />
      <button
        onClick={handleSave}
        className="rounded-md bg-primary text-primary-foreground px-3 py-1.5 text-sm font-medium"
      >
        Save
      </button>
      <button
        onClick={() => setEditing(false)}
        className="text-sm text-muted-foreground"
      >
        Cancel
      </button>
    </div>
  );
}
