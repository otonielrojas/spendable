"use client";

import { useSpendableStore } from "@/lib/store";
import { formatCurrency } from "@/lib/calculate";

export function SafeToSpendCard() {
  const { safeToSpendCents, nextPayday, committedCents, settings, income } =
    useSpendableStore();

  const isNegative = safeToSpendCents < 0;
  const hasIncome = income !== null;

  return (
    <div className="flex flex-col items-center gap-2 py-10">
      <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
        Safe to Spend
      </p>

      {!hasIncome ? (
        <p className="text-2xl text-muted-foreground">Set up your income to get started</p>
      ) : (
        <>
          <p
            className={`text-7xl font-bold tabular-nums transition-colors ${
              isNegative ? "text-destructive" : "text-primary"
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
