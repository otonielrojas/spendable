import { Expense, Income, PayFrequency } from "./types";

/** Returns the number of days between two ISO date strings */
function daysBetween(a: string, b: string): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round(
    (new Date(b).getTime() - new Date(a).getTime()) / msPerDay
  );
}

/** Returns the next payday after `from` given the frequency */
export function getNextPayday(income: Income, from: string = todayISO()): string {
  const frequencyDays: Record<PayFrequency, number> = {
    weekly: 7,
    biweekly: 14,
    semimonthly: 15, // approximation
    monthly: 30,   // approximation
  };

  let payday = income.nextPayday;
  const interval = frequencyDays[income.frequency];

  // Advance payday until it's in the future relative to `from`
  while (payday <= from) {
    const d = new Date(payday);
    d.setDate(d.getDate() + interval);
    payday = d.toISOString().split("T")[0];
  }

  return payday;
}

/** Today as ISO date string */
export function todayISO(): string {
  return new Date().toISOString().split("T")[0];
}

/**
 * Returns expenses with due dates strictly between today and the next payday (inclusive of payday).
 */
export function expensesDueBeforePayday(
  expenses: Expense[],
  nextPayday: string,
  today: string = todayISO()
): Expense[] {
  return expenses.filter(
    (e) => e.dueDate > today && e.dueDate <= nextPayday
  );
}

/** Sum of expense amounts in cents */
export function sumExpenses(expenses: Expense[]): number {
  return expenses.reduce((sum, e) => sum + e.amountCents, 0);
}

/**
 * Core Safe to Spend calculation.
 */
export function calcSafeToSpend({
  currentBalanceCents,
  expenses,
  bufferCents,
  income,
}: {
  currentBalanceCents: number;
  expenses: Expense[];
  bufferCents: number;
  income: Income | null;
}): { safeToSpendCents: number; nextPayday: string | null; committedCents: number } {
  if (!income) {
    return { safeToSpendCents: 0, nextPayday: null, committedCents: 0 };
  }

  const nextPayday = getNextPayday(income);
  const committed = expensesDueBeforePayday(expenses, nextPayday);
  const committedCents = sumExpenses(committed);
  const safeToSpendCents = currentBalanceCents - committedCents - bufferCents;

  return { safeToSpendCents, nextPayday, committedCents };
}

/** Format cents as a currency string, e.g. 1299 → "$12.99" */
export function formatCurrency(cents: number): string {
  const abs = Math.abs(cents);
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(abs / 100);
  return cents < 0 ? `-${formatted}` : formatted;
}
