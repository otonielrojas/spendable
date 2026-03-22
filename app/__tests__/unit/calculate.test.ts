import { describe, it, expect } from "vitest";
import {
  getNextPayday,
  expensesDueBeforePayday,
  sumExpenses,
  calcSafeToSpend,
  formatCurrency,
} from "@/lib/calculate";
import type { Expense, Income } from "@/lib/types";

// ─── Fixtures ────────────────────────────────────────────────────────────────

const biweeklyIncome: Income = {
  amountCents: 300000, // $3,000
  nextPayday: "2026-03-20",
  frequency: "biweekly",
};

const monthlyIncome: Income = {
  amountCents: 500000,
  nextPayday: "2026-04-01",
  frequency: "monthly",
};

const rent: Expense = {
  id: "1",
  name: "Rent",
  amountCents: 150000, // $1,500
  dueDate: "2026-03-15",
  isRecurring: true,
};

const netflix: Expense = {
  id: "2",
  name: "Netflix",
  amountCents: 1599,
  dueDate: "2026-03-18",
  isRecurring: true,
};

const futureExpense: Expense = {
  id: "3",
  name: "Car insurance",
  amountCents: 20000,
  dueDate: "2026-04-10", // after next payday
  isRecurring: true,
};

// ─── getNextPayday ────────────────────────────────────────────────────────────

describe("getNextPayday", () => {
  it("returns nextPayday unchanged when it is already in the future", () => {
    const result = getNextPayday(biweeklyIncome, "2026-03-12");
    expect(result).toBe("2026-03-20");
  });

  it("advances nextPayday when it has passed", () => {
    const result = getNextPayday(biweeklyIncome, "2026-03-21");
    // 2026-03-20 + 14 days = 2026-04-03
    expect(result).toBe("2026-04-03");
  });

  it("advances multiple times if many cycles have passed", () => {
    // 60 days after nextPayday
    const result = getNextPayday(biweeklyIncome, "2026-05-19");
    // Should keep advancing by 14 days until past 2026-05-19
    expect(new Date(result) > new Date("2026-05-19")).toBe(true);
  });

  it("handles weekly frequency correctly", () => {
    const weekly: Income = { ...biweeklyIncome, frequency: "weekly", nextPayday: "2026-03-13" };
    const result = getNextPayday(weekly, "2026-03-14");
    expect(result).toBe("2026-03-20");
  });

  it("handles monthly frequency", () => {
    const result = getNextPayday(monthlyIncome, "2026-03-12");
    expect(result).toBe("2026-04-01");
  });
});

// ─── expensesDueBeforePayday ─────────────────────────────────────────────────

describe("expensesDueBeforePayday", () => {
  const today = "2026-03-12";
  const nextPayday = "2026-03-20";

  it("includes expenses due between today and payday (inclusive)", () => {
    const result = expensesDueBeforePayday([rent, netflix, futureExpense], nextPayday, today);
    expect(result).toHaveLength(2);
    expect(result.map((e) => e.id)).toEqual(["1", "2"]);
  });

  it("excludes expenses due on or before today", () => {
    const todayExpense: Expense = { ...rent, dueDate: today };
    const result = expensesDueBeforePayday([todayExpense], nextPayday, today);
    expect(result).toHaveLength(0);
  });

  it("includes expenses due exactly on the payday", () => {
    const paydayExpense: Expense = { ...rent, dueDate: nextPayday };
    const result = expensesDueBeforePayday([paydayExpense], nextPayday, today);
    expect(result).toHaveLength(1);
  });

  it("returns empty array when no expenses qualify", () => {
    const result = expensesDueBeforePayday([futureExpense], nextPayday, today);
    expect(result).toHaveLength(0);
  });
});

// ─── sumExpenses ──────────────────────────────────────────────────────────────

describe("sumExpenses", () => {
  it("sums amounts correctly", () => {
    expect(sumExpenses([rent, netflix])).toBe(151599);
  });

  it("returns 0 for empty array", () => {
    expect(sumExpenses([])).toBe(0);
  });

  it("handles a single expense", () => {
    expect(sumExpenses([netflix])).toBe(1599);
  });
});

// ─── calcSafeToSpend ─────────────────────────────────────────────────────────

describe("calcSafeToSpend", () => {
  it("returns zeros and null payday when income is null", () => {
    const result = calcSafeToSpend({
      currentBalanceCents: 500000,
      expenses: [rent],
      bufferCents: 20000,
      income: null,
    });
    expect(result).toEqual({ safeToSpendCents: 0, nextPayday: null, committedCents: 0 });
  });

  it("subtracts committed expenses and buffer from balance", () => {
    // balance: $5,000 | rent: $1,500 | netflix: $15.99 | buffer: $200
    // safe = 500000 - 151599 - 20000 = 328401
    // Pin today to 2026-03-12 so fixture dates (rent: 03-15, netflix: 03-18,
    // payday: 03-20) are all in the future relative to the test's reference date.
    const result = calcSafeToSpend({
      currentBalanceCents: 500000,
      expenses: [rent, netflix],
      bufferCents: 20000,
      income: biweeklyIncome,
      today: "2026-03-12",
    });
    expect(result.safeToSpendCents).toBe(328401);
    expect(result.committedCents).toBe(151599);
    expect(result.nextPayday).toBe("2026-03-20");
  });

  it("can return a negative Safe to Spend (overdraft warning)", () => {
    const result = calcSafeToSpend({
      currentBalanceCents: 100000, // $1,000 — less than rent alone
      expenses: [rent],
      bufferCents: 50000,
      income: biweeklyIncome,
      today: "2026-03-12",
    });
    expect(result.safeToSpendCents).toBe(-100000);
  });

  it("excludes expenses due after the next payday", () => {
    const result = calcSafeToSpend({
      currentBalanceCents: 500000,
      expenses: [futureExpense], // due 2026-04-10, after 2026-03-20 payday
      bufferCents: 0,
      income: biweeklyIncome,
    });
    expect(result.committedCents).toBe(0);
    expect(result.safeToSpendCents).toBe(500000);
  });
});

// ─── formatCurrency ───────────────────────────────────────────────────────────

describe("formatCurrency", () => {
  it("formats positive cents correctly", () => {
    expect(formatCurrency(150000)).toBe("$1,500.00");
  });

  it("formats zero", () => {
    expect(formatCurrency(0)).toBe("$0.00");
  });

  it("formats negative cents with leading minus", () => {
    expect(formatCurrency(-5099)).toBe("-$50.99");
  });

  it("formats cents less than $1", () => {
    expect(formatCurrency(99)).toBe("$0.99");
  });
});
