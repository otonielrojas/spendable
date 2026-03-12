"use client";

import { useState } from "react";
import { useSpendableStore } from "@/lib/store";
import { Expense } from "@/lib/types";
import { formatCurrency, todayISO } from "@/lib/calculate";

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

export function ExpenseList() {
  const { expenses, addExpense, removeExpense } = useSpendableStore();
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");

  function handleAdd() {
    const cents = Math.round(parseFloat(amount) * 100);
    if (!name || !cents || isNaN(cents) || !dueDate) return;
    const expense: Expense = {
      id: generateId(),
      name,
      amountCents: cents,
      dueDate,
      isRecurring: true,
    };
    addExpense(expense);
    setName("");
    setAmount("");
    setDueDate("");
    setAdding(false);
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
          Upcoming expenses
        </h2>
        <button
          onClick={() => setAdding((v) => !v)}
          className="text-sm text-primary font-medium"
        >
          {adding ? "Cancel" : "+ Add"}
        </button>
      </div>

      {adding && (
        <div className="rounded-xl border p-3 flex flex-col gap-2">
          <input
            placeholder="Name (e.g. Rent)"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
          <input
            type="date"
            value={dueDate}
            min={todayISO()}
            onChange={(e) => setDueDate(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm bg-background"
          />
          <button
            onClick={handleAdd}
            className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium"
          >
            Add expense
          </button>
        </div>
      )}

      {expenses.length === 0 ? (
        <p className="text-sm text-muted-foreground">No expenses added yet.</p>
      ) : (
        <ul className="flex flex-col gap-1">
          {expenses.map((e) => (
            <li
              key={e.id}
              className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm"
            >
              <div>
                <span className="font-medium">{e.name}</span>
                <span className="ml-2 text-muted-foreground">
                  due{" "}
                  {new Date(e.dueDate + "T00:00:00").toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-medium">{formatCurrency(e.amountCents)}</span>
                <button
                  onClick={() => removeExpense(e.id)}
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
