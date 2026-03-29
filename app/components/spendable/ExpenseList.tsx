"use client";

import { useState, useCallback } from "react";
import { useSpendableStore } from "@/lib/store";
import { Expense } from "@/lib/types";
import { formatCurrency, todayISO } from "@/lib/calculate";
import { useHydrated } from "@/lib/useHydrated";

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

function ExpenseRow({
  expense: e,
  onRemove,
  past = false,
}: {
  expense: Expense;
  onRemove: (id: string) => void;
  past?: boolean;
}) {
  return (
    <li className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm ${past ? "line-through" : ""}`}>
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
          onClick={() => onRemove(e.id)}
          className="text-muted-foreground hover:text-destructive text-xs p-2"
        >
          ✕
        </button>
      </div>
    </li>
  );
}

export function ExpenseList() {
  const hydrated = useHydrated();
  const { expenses, addExpense, removeExpense } = useSpendableStore();

  const today = todayISO();
  const upcomingExpenses = expenses.filter((e) => e.dueDate >= today);
  const pastExpenses = expenses.filter((e) => e.dueDate < today);

  const clearPast = useCallback(() => {
    pastExpenses.forEach((e) => removeExpense(e.id));
  }, [pastExpenses, removeExpense]);
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
    } else if (dueDate < todayISO()) {
      next.dueDate = "Due date must be today or later.";
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
          className="text-sm text-primary font-medium py-2 px-1"
        >
          {adding ? "Cancel" : "+ Add"}
        </button>
      </div>

      {adding && (
        <div className="rounded-xl border p-3 flex flex-col gap-2 overflow-hidden">
          <div className="flex flex-col gap-1">
            <input
              placeholder="Name (e.g. Rent)"
              autoCorrect="off"
              autoCapitalize="words"
              enterKeyHint="next"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((p) => ({ ...p, name: undefined }));
              }}
              className={`w-full border rounded-md px-3 py-2 text-sm bg-background ${
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
              inputMode="decimal"
              placeholder="Amount ($)"
              min="0.01"
              step="0.01"
              enterKeyHint="next"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                if (errors.amount) setErrors((p) => ({ ...p, amount: undefined }));
              }}
              className={`w-full border rounded-md px-3 py-2 text-sm bg-background ${
                errors.amount ? "border-destructive" : ""
              }`}
            />
            {errors.amount && (
              <span className="text-xs text-destructive">{errors.amount}</span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground font-medium">Due date</label>
            <div className="relative">
              <input
                type="date"
                value={dueDate}
                min={todayISO()}
                enterKeyHint="done"
                onChange={(e) => {
                  setDueDate(e.target.value);
                  if (errors.dueDate) setErrors((p) => ({ ...p, dueDate: undefined }));
                }}
                className={`w-full border rounded-md px-3 py-2 pr-10 text-sm bg-background ${
                  errors.dueDate ? "border-destructive" : ""
                }`}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </span>
            </div>
            {errors.dueDate && (
              <span className="text-xs text-destructive">{errors.dueDate}</span>
            )}
          </div>

          <button
            onClick={handleAdd}
            className="w-full rounded-md bg-primary text-primary-foreground px-4 py-3 text-sm font-medium"
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
      ) : upcomingExpenses.length === 0 && pastExpenses.length === 0 ? (
        <div className="rounded-xl border border-dashed px-4 py-6 flex flex-col items-center gap-1 text-center">
          <p className="text-2xl">📋</p>
          <p className="text-sm font-medium text-foreground">No upcoming expenses</p>
          <p className="text-xs text-muted-foreground">
            Add rent, subscriptions, or any bill due before your next payday.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          <ul className="flex flex-col gap-1">
            {upcomingExpenses.map((e) => (
              <ExpenseRow key={e.id} expense={e} onRemove={removeExpense} />
            ))}
          </ul>

          {pastExpenses.length > 0 && (
            <div className="mt-2 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground uppercase tracking-wide">
                  Past
                </span>
                <button
                  onClick={clearPast}
                  className="text-xs text-muted-foreground hover:text-destructive py-1 px-1"
                >
                  Clear all
                </button>
              </div>
              <ul className="flex flex-col gap-1 opacity-50">
                {pastExpenses.map((e) => (
                  <ExpenseRow key={e.id} expense={e} onRemove={removeExpense} past />
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
