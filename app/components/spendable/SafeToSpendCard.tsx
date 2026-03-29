"use client";

import { useSpendableStore } from "@/lib/store";
import { formatCurrency } from "@/lib/calculate";
import { useHydrated } from "@/lib/useHydrated";

export function SafeToSpendCard() {
  const hydrated = useHydrated();
  const { safeToSpendCents, nextPayday, committedCents, settings, income } =
    useSpendableStore();

  const isNegative = safeToSpendCents < 0;
  const hasIncome = income !== null;

  if (!hydrated) {
    return (
      <div className="flex flex-col items-center gap-2 py-10 animate-pulse">
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
          Safe to Spend
        </p>
        <div className="h-20 w-48 rounded-xl bg-muted" />
        <div className="mt-4 flex flex-col items-center gap-2">
          <div className="h-4 w-32 rounded bg-muted" />
          <div className="h-4 w-28 rounded bg-muted" />
          <div className="h-4 w-24 rounded bg-muted" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2 py-10">
      <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
        Safe to Spend
      </p>

      {!hasIncome ? (
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-5xl">💸</p>
          <p className="text-xl font-semibold text-foreground">You&apos;re all set up</p>
          <p className="text-sm text-muted-foreground max-w-xs">
            Add your income below to see how much you can safely spend before your next payday.
          </p>
        </div>
      ) : (
        <>
          <p
            className={`text-7xl font-bold tabular-nums transition-colors ${
              isNegative ? "text-warning" : "text-primary"
            }`}
          >
            {formatCurrency(safeToSpendCents)}
          </p>

          <div className="mt-4 flex flex-col items-center gap-1 text-sm text-muted-foreground">
            <span>
              Balance: <strong>{formatCurrency(settings.currentBalanceCents)}</strong>
            </span>
            <span>
              Committed: <strong>−{formatCurrency(committedCents)}</strong>
            </span>
            <span>
              Buffer: <strong>−{formatCurrency(settings.bufferCents)}</strong>
            </span>
            {nextPayday && (
              <span className="mt-1 text-xs">
                Next payday:{" "}
                <strong>
                  {new Date(nextPayday + "T00:00:00").toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </strong>
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}
