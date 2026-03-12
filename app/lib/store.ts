"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Expense, Income, Settings, Transaction } from "./types";
import { calcSafeToSpend } from "./calculate";

interface SpendableState {
  income: Income | null;
  expenses: Expense[];
  transactions: Transaction[];
  settings: Settings;

  // Derived
  safeToSpendCents: number;
  nextPayday: string | null;
  committedCents: number;

  // Actions
  setIncome: (income: Income) => void;
  addExpense: (expense: Expense) => void;
  removeExpense: (id: string) => void;
  addTransaction: (tx: Transaction) => void;
  removeTransaction: (id: string) => void;
  updateSettings: (settings: Partial<Settings>) => void;
}

function recalc(state: Pick<SpendableState, "income" | "expenses" | "settings">) {
  return calcSafeToSpend({
    currentBalanceCents: state.settings.currentBalanceCents,
    expenses: state.expenses,
    bufferCents: state.settings.bufferCents,
    income: state.income,
  });
}

export const useSpendableStore = create<SpendableState>()(
  persist(
    (set, get) => ({
      income: null,
      expenses: [],
      transactions: [],
      settings: {
        bufferCents: 20000, // $200 default buffer
        currentBalanceCents: 0,
      },
      safeToSpendCents: 0,
      nextPayday: null,
      committedCents: 0,

      setIncome: (income) =>
        set((s) => {
          const derived = recalc({ ...s, income });
          return { income, ...derived };
        }),

      addExpense: (expense) =>
        set((s) => {
          const expenses = [...s.expenses, expense];
          const derived = recalc({ ...s, expenses });
          return { expenses, ...derived };
        }),

      removeExpense: (id) =>
        set((s) => {
          const expenses = s.expenses.filter((e) => e.id !== id);
          const derived = recalc({ ...s, expenses });
          return { expenses, ...derived };
        }),

      addTransaction: (tx) =>
        set((s) => {
          const transactions = [tx, ...s.transactions];
          const newBalanceCents = s.settings.currentBalanceCents - tx.amountCents;
          const settings = { ...s.settings, currentBalanceCents: newBalanceCents };
          const derived = recalc({ ...s, settings });
          return { transactions, settings, ...derived };
        }),

      removeTransaction: (id) =>
        set((s) => {
          const tx = s.transactions.find((t) => t.id === id);
          const transactions = s.transactions.filter((t) => t.id !== id);
          const newBalanceCents = tx
            ? s.settings.currentBalanceCents + tx.amountCents
            : s.settings.currentBalanceCents;
          const settings = { ...s.settings, currentBalanceCents: newBalanceCents };
          const derived = recalc({ ...s, settings });
          return { transactions, settings, ...derived };
        }),

      updateSettings: (partial) =>
        set((s) => {
          const settings = { ...s.settings, ...partial };
          const derived = recalc({ ...s, settings });
          return { settings, ...derived };
        }),
    }),
    {
      name: "spendable-storage",
      version: 1,
      migrate: (persisted, version) => {
        // v0 → v1: no structural changes yet; return as-is
        return persisted;
      },
      partialize: (state) => ({
        income: state.income,
        expenses: state.expenses,
        transactions: state.transactions,
        settings: state.settings,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          const derived = recalc(state);
          state.safeToSpendCents = derived.safeToSpendCents;
          state.nextPayday = derived.nextPayday;
          state.committedCents = derived.committedCents;
        }
      },
    }
  )
);
