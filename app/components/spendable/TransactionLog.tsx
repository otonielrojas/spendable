"use client";

import { useState } from "react";
import { useSpendableStore } from "@/lib/store";
import { Transaction } from "@/lib/types";
import { formatCurrency, todayISO } from "@/lib/calculate";

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

export function TransactionLog() {
  const { transactions, addTransaction, removeTransaction } = useSpendableStore();
  const [adding, setAdding] = useState(false);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");

  function handleAdd() {
    const cents = Math.round(parseFloat(amount) * 100);
    if (!description || !cents || isNaN(cents)) return;
    const tx: Transaction = {
      id: generateId(),
      description,
      amountCents: cents,
      date: todayISO(),
    };
    addTransaction(tx);
    setDescription("");
    setAmount("");
    setAdding(false);
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
          Spending log
        </h2>
        <button
          onClick={() => setAdding((v) => !v)}
          className="text-sm text-primary font-medium"
        >
          {adding ? "Cancel" : "+ Log spend"}
        </button>
      </div>

      {adding && (
        <div className="rounded-xl border p-3 flex flex-col gap-2">
          <input
            placeholder="What did you spend on?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm bg-background"
          />
          <input
            type="number"
            placeholder="Amount ($)"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm bg-background"
          />
          <button
            onClick={handleAdd}
            className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium"
          >
            Log it
          </button>
        </div>
      )}

      {transactions.length === 0 ? (
        <p className="text-sm text-muted-foreground">No transactions yet.</p>
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
                  className="text-muted-foreground hover:text-destructive text-xs"
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
