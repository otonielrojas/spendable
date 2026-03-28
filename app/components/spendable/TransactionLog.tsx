"use client";

import { useState } from "react";
import { useSpendableStore } from "@/lib/store";
import { Transaction } from "@/lib/types";
import { formatCurrency, todayISO } from "@/lib/calculate";
import { useHydrated } from "@/lib/useHydrated";

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

export function TransactionLog() {
  const hydrated = useHydrated();
  const { transactions, addTransaction, removeTransaction } = useSpendableStore();
  const [adding, setAdding] = useState(false);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [errors, setErrors] = useState<{ description?: string; amount?: string }>({});

  function validate(): boolean {
    const next: typeof errors = {};

    if (!description.trim()) {
      next.description = "Enter a description.";
    }

    const cents = Math.round(parseFloat(amount) * 100);
    if (!amount.trim()) {
      next.amount = "Enter an amount.";
    } else if (isNaN(cents) || cents <= 0) {
      next.amount = "Amount must be greater than $0.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleAdd() {
    if (!validate()) return;
    const cents = Math.round(parseFloat(amount) * 100);
    const tx: Transaction = {
      id: generateId(),
      description: description.trim(),
      amountCents: cents,
      date: todayISO(),
    };
    addTransaction(tx);
    setDescription("");
    setAmount("");
    setErrors({});
    setAdding(false);
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
          Spending log
        </h2>
        <button
          onClick={() => {
            setAdding((v) => !v);
            setErrors({});
          }}
          className="text-sm text-primary font-medium py-2 px-1"
        >
          {adding ? "Cancel" : "+ Log spend"}
        </button>
      </div>

      {adding && (
        <div className="rounded-xl border p-3 flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <input
              placeholder="What did you spend on?"
              autoCorrect="off"
              autoCapitalize="sentences"
              enterKeyHint="next"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description) setErrors((p) => ({ ...p, description: undefined }));
              }}
              className={`border rounded-md px-3 py-2 text-sm bg-background ${
                errors.description ? "border-destructive" : ""
              }`}
            />
            {errors.description && (
              <span className="text-xs text-destructive">{errors.description}</span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <input
              type="number"
              inputMode="decimal"
              placeholder="Amount ($)"
              min="0.01"
              step="0.01"
              enterKeyHint="done"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                if (errors.amount) setErrors((p) => ({ ...p, amount: undefined }));
              }}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              className={`border rounded-md px-3 py-2 text-sm bg-background ${
                errors.amount ? "border-destructive" : ""
              }`}
            />
            {errors.amount && (
              <span className="text-xs text-destructive">{errors.amount}</span>
            )}
          </div>

          <button
            onClick={handleAdd}
            className="rounded-md bg-primary text-primary-foreground px-4 py-3 text-sm font-medium"
          >
            Log it
          </button>
        </div>
      )}

      {!hydrated ? (
        <div className="flex flex-col gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      ) : transactions.length === 0 ? (
        <div className="rounded-xl border border-dashed px-4 py-6 flex flex-col items-center gap-1 text-center">
          <p className="text-2xl">🧾</p>
          <p className="text-sm font-medium text-foreground">No spending logged yet</p>
          <p className="text-xs text-muted-foreground">
            Log a purchase to see it deducted from your balance in real time.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-1">
          {transactions.map((tx) => (
            <li
              key={tx.id}
              className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm"
            >
              <div>
                <span className="font-medium">{tx.description}</span>
                <span className="ml-2 text-muted-foreground text-xs">{tx.date}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-medium text-destructive">
                  −{formatCurrency(tx.amountCents)}
                </span>
                <button
                  onClick={() => removeTransaction(tx.id)}
                  className="text-muted-foreground hover:text-destructive text-xs p-2"
                >
                  ✕
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
