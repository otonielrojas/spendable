"use client";

import { useSpendableStore } from "@/lib/store";
import { formatCurrency } from "@/lib/calculate";
import { useHydrated } from "@/lib/useHydrated";
import { PayFrequency } from "@/lib/types";

const FREQUENCY_DAYS: Record<PayFrequency, number> = {
  weekly: 7,
  biweekly: 14,
  semimonthly: 15,
  monthly: 30,
};

function getPayCycleProgress(
  nextPayday: string,
  cycleDays: number
): { progress: number; daysUntil: number } {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const payday = new Date(nextPayday + "T00:00:00");
  const lastPayday = new Date(payday);
  lastPayday.setDate(lastPayday.getDate() - cycleDays);

  const totalMs = payday.getTime() - lastPayday.getTime();
  const elapsedMs = today.getTime() - lastPayday.getTime();
  const progress = Math.min(1, Math.max(0, elapsedMs / totalMs));

  const daysUntil = Math.max(
    0,
    Math.ceil((payday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  );

  return { progress, daysUntil };
}

function PayCycleBar({
  nextPayday,
  cycleDays,
}: {
  nextPayday: string;
  cycleDays: number;
}) {
  const { progress, daysUntil } = getPayCycleProgress(nextPayday, cycleDays);
  const isNearEnd = progress > 0.75;
  const paydayDate = new Date(nextPayday + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <div className="h-1 w-full rounded-full bg-border overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${
            isNearEnd ? "bg-warning" : "bg-primary"
          }`}
          style={{ width: `${progress * 100}%` }}
        />
      </div>
      <p className="text-[11px] text-muted-foreground text-center tabular-nums">
        {daysUntil === 0
          ? "Payday is today!"
          : `${daysUntil} day${daysUntil === 1 ? "" : "s"} to payday`}
        {" · "}
        {paydayDate}
      </p>
    </div>
  );
}

export function SafeToSpendCard({ onGoToSetup }: { onGoToSetup: () => void }) {
  const hydrated = useHydrated();
  const { safeToSpendCents, nextPayday, committedCents, settings, income } =
    useSpendableStore();

  const isNegative = safeToSpendCents < 0;
  const hasIncome = income !== null;

  if (!hydrated) {
    return (
      <div className="px-5 pt-7 pb-5 animate-pulse">
        <div className="h-3 w-24 rounded-full bg-muted mb-4 mx-auto" />
        <div className="h-14 w-44 rounded-xl bg-muted mx-auto mb-5" />
        <div className="h-1 w-full rounded-full bg-muted mb-1.5" />
        <div className="h-3 w-40 rounded-full bg-muted mx-auto mb-5" />
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-1 h-16 rounded-2xl bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  const cycleDays = income ? FREQUENCY_DAYS[income.frequency] : 14;

  return (
    <div className="px-5 pt-7 pb-5">
      {/* Label */}
      <p
        className={`text-[10px] font-bold tracking-[0.18em] uppercase text-center mb-3 ${
          isNegative ? "text-warning/70" : "text-muted-foreground"
        }`}
      >
        {isNegative ? "Over Budget" : "Safe to Spend"}
      </p>

      {!hasIncome ? (
        <div className="flex flex-col items-center gap-2 text-center py-2 mb-5">
          <p className="text-4xl mb-1">💸</p>
          <p className="text-base font-semibold">Set up your income</p>
          <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
            Tap <strong>Setup</strong> below to add your pay schedule and see
            your safe-to-spend number.
          </p>
        </div>
      ) : (
        <>
          {/* Hero number */}
          <p
            className={`text-[3.75rem] leading-none font-bold tabular-nums font-mono text-center mb-5 tracking-tight transition-colors ${
              isNegative ? "text-warning" : "text-primary"
            }`}
          >
            {formatCurrency(safeToSpendCents)}
          </p>

          {/* Pay cycle progress bar */}
          {nextPayday && (
            <div className="mb-5">
              <PayCycleBar nextPayday={nextPayday} cycleDays={cycleDays} />
            </div>
          )}

          {/* Stat chips */}
          <div className="flex gap-2">
            {/* Balance chip — navigates to Setup */}
            <button
              onClick={onGoToSetup}
              className="flex-1 rounded-2xl bg-muted/60 px-3 py-3 text-left active:bg-muted active:scale-[0.97] transition-all"
            >
              <p className="text-[9px] font-bold tracking-widest uppercase text-muted-foreground mb-1">
                Balance
              </p>
              <p className="text-sm font-semibold tabular-nums font-mono leading-none">
                {formatCurrency(settings.currentBalanceCents)}
              </p>
              <p className="text-[9px] text-muted-foreground/60 mt-1">tap to edit</p>
            </button>

            {/* Committed chip */}
            <div className="flex-1 rounded-2xl bg-muted/60 px-3 py-3">
              <p className="text-[9px] font-bold tracking-widest uppercase text-muted-foreground mb-1">
                Bills
              </p>
              <p className="text-sm font-semibold tabular-nums font-mono leading-none text-destructive/80">
                −{formatCurrency(committedCents)}
              </p>
              <p className="text-[9px] text-muted-foreground/60 mt-1">committed</p>
            </div>

            {/* Buffer chip */}
            <div className="flex-1 rounded-2xl bg-muted/60 px-3 py-3">
              <p className="text-[9px] font-bold tracking-widest uppercase text-muted-foreground mb-1">
                Buffer
              </p>
              <p className="text-sm font-semibold tabular-nums font-mono leading-none">
                −{formatCurrency(settings.bufferCents)}
              </p>
              <p className="text-[9px] text-muted-foreground/60 mt-1">safety net</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
