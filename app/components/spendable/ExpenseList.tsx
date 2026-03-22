"use client";

import { useState } from "react";
import { useSpendableStore } from "@/lib/store";
import { Expense } from "@/lib/types";
import { formatCurrency, todayISO } from "@/lib/calculate";
import { useHydrated } from "@/lib/useHydrated";

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

export function ExpenseList() {
  const hydrated = useHydrated();
  const { expenses, addExpense, removeExpense } = useSpendableStore();
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [errors, setErrors] = useState<{ name?: string; amount?: string; dueDate?: string }>({});

  function validate(): boolean {
    const next: typeof errors = {};

    if (!name.trim()) {
      next.name = "Enter an expense name.";
    }

    const cents = Math.round(parseFloat(amount) * 100);
    if (!amount.trim()) {
      next.amount = "Enter an amount.";
    } else if (isNaN(cents) || cents <= 0) {
      next.amount = "Amount must be greater than $0.";
    }

    if (!dueDate) {
      next.dueDate = "Select a due date.";
    } else if (dueDate <= todayISO()) {
      next.dueDate = "Due date must be in the future.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleAdd() {
    if (!validate()) return;
    const cents = Math.round(parseFloat(amount) * 100);
    const expense: Expense = {
      id: generateId(),
      name: name.trim(),
      amountCents: cents,
      dueDate,
      isRecurring: true,
    };
    addExpense(expense);
    setName("");
    setAmount("");
    setDueDate("");
    setErrors({});
    setAdding(false);
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
          Upcoming expenses
        </h2>
        <button
          onClick={() => {
            setAdding((v) => !v);
            setErrors({});
          }}
          className="text-sm text-primary font-medium"
        >
          {adding ? "Cancel" : "+ Add"}
        </button>
      </div>

      {adding && (
        <div className="rounded-xl border p-3 flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <input
              placeholder="Name (e.g. Rent)"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((p) => ({ ...p, name: undefined }));
              }}
              className={`border rounded-md px-3 py-2 text-sm bg-background ${
                errors.name ? "border-destructive" : ""
              }`}
            />
            {errors.name && (
              <span className="text-xs text-destructive">{errors.name}</span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <input
              type="number"
              placeholder="Amount ($)"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                if (errors.amount) setErrors((p) => ({ ...p, amount: undefined }));
              }}
              className={`border rounded-md px-3 py-2 text-sm bg-background ${
                errors.amount ? "border-destructive" : ""
              }`}
            />
            {errors.amount && (
              <span className="text-xs text-destructive">{errors.amount}</span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <input
              type="date"
              value={dueDate}
              min={todayISO()}
              onChange={(e) => {
                setDueDate(e.target.value);
                if (errors.dueDate) setErrors((p) => ({ ...p, dueDate: undefined }));
              }}
              className={`border rounded-md px-3 py-2 text-sm bg-background ${
                errors.dueDate ? "border-destructive" : ""
              }`}
            />
            {errors.dueDate && (
              <span className="text-xs text-destructive">{errors.dueDate}</span>
            )}
          </div>

          <button
            onClick={handleAdd}
            className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium"
          >
            Add expense
          </button>
        </div>
      )}

      {!hydrated ? (
        <div className="flex flex-col gap-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-10 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      ) : expenses.length === 0 ? (
        <div className="rounded-xl border border-dashed px-4 py-6 flex flex-col items-center gap-1 text-center">
          <p className="text-2xl">📋</p>
          <p className="text-sm font-medium text-foreground">No upcoming expenses</p>
          <p className="text-xs text-muted-foreground">
            Add rent, subscriptions, or any bill due before your next payday.
          </p>
        </div>
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
