import { describe, it, expect, beforeEach } from "vitest";
import { useSpendableStore } from "@/lib/store";

// Reset store state between tests
beforeEach(() => {
  useSpendableStore.setState({
    income: null,
    expenses: [],
    transactions: [],
    settings: { bufferCents: 20000, currentBalanceCents: 0 },
    safeToSpendCents: 0,
    nextPayday: null,
    committedCents: 0,
  });
});

describe("store — partialize", () => {
  it("persisted state excludes derived fields", () => {
    const state = useSpendableStore.getState();
    // @ts-expect-error — accessing internal persist api
    const persisted = useSpendableStore.persist.getOptions().partialize(state);
    expect(persisted).not.toHaveProperty("safeToSpendCents");
    expect(persisted).not.toHaveProperty("nextPayday");
    expect(persisted).not.toHaveProperty("committedCents");
    expect(persisted).toHaveProperty("income");
    expect(persisted).toHaveProperty("expenses");
    expect(persisted).toHaveProperty("transactions");
    expect(persisted).toHaveProperty("settings");
  });
});

describe("store — onRehydrateStorage", () => {
  it("recalculates derived state after rehydration", () => {
    // Simulate rehydrated raw state (as if loaded from localStorage)
    const rehydrated = {
      income: {
        amountCents: 300000,
        nextPayday: "2026-03-20",
        frequency: "biweekly" as const,
      },
      expenses: [
        { id: "1", name: "Rent", amountCents: 150000, dueDate: "2026-03-15", isRecurring: true },
      ],
      transactions: [],
      settings: { bufferCents: 20000, currentBalanceCents: 500000 },
      safeToSpendCents: 0, // stale — should be recalculated
      nextPayday: null,    // stale
      committedCents: 0,   // stale
    };

    // Invoke onRehydrateStorage callback directly
    // @ts-expect-error — accessing internal persist api
    const onRehydrate = useSpendableStore.persist.getOptions().onRehydrateStorage();
    onRehydrate(rehydrated as any);

    // Should have recomputed: 500000 - 150000 - 20000 = 330000
    expect(rehydrated.safeToSpendCents).toBe(330000);
    expect(rehydrated.committedCents).toBe(150000);
    expect(rehydrated.nextPayday).toBe("2026-03-20");
  });
});

describe("store — schema version", () => {
  it("has version 1", () => {
    // @ts-expect-error — accessing internal persist api
    const version = useSpendableStore.persist.getOptions().version;
    expect(version).toBe(1);
  });
});

describe("store — actions", () => {
  const income = {
    amountCents: 300000,
    nextPayday: "2026-03-20",
    frequency: "biweekly" as const,
  };

  it("setIncome updates derived state", () => {
    useSpendableStore.getState().updateSettings({ currentBalanceCents: 500000 });
    useSpendableStore.getState().setIncome(income);
    const s = useSpendableStore.getState();
    expect(s.nextPayday).toBe("2026-03-20");
    expect(s.safeToSpendCents).toBe(480000); // 500000 - 0 committed - 20000 buffer
  });

  it("addTransaction reduces balance and recalculates", () => {
    useSpendableStore.getState().updateSettings({ currentBalanceCents: 500000 });
    useSpendableStore.getState().setIncome(income);
    useSpendableStore.getState().addTransaction({
      id: "t1",
      description: "Coffee",
      amountCents: 500,
      date: "2026-03-12",
    });
    const s = useSpendableStore.getState();
    expect(s.settings.currentBalanceCents).toBe(499500);
    expect(s.safeToSpendCents).toBe(479500);
  });

  it("removeTransaction restores balance", () => {
    useSpendableStore.getState().updateSettings({ currentBalanceCents: 500000 });
    useSpendableStore.getState().setIncome(income);
    useSpendableStore.getState().addTransaction({
      id: "t1",
      description: "Coffee",
      amountCents: 500,
      date: "2026-03-12",
    });
    useSpendableStore.getState().removeTransaction("t1");
    expect(useSpendableStore.getState().settings.currentBalanceCents).toBe(500000);
  });
});
