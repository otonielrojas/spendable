import { SafeToSpendCard } from "@/components/spendable/SafeToSpendCard";
import { SetupIncome } from "@/components/spendable/SetupIncome";
import { BalanceInput } from "@/components/spendable/BalanceInput";
import { ExpenseList } from "@/components/spendable/ExpenseList";
import { TransactionLog } from "@/components/spendable/TransactionLog";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-md px-4 pb-16">
        {/* Header */}
        <header className="py-6 text-center">
          <h1 className="text-xl font-bold tracking-tight">spendable</h1>
        </header>

        {/* Hero number */}
        <SafeToSpendCard />

        {/* Balance update */}
        <div className="flex justify-center mb-8">
          <BalanceInput />
        </div>

        {/* Divider */}
        <div className="border-t mb-6" />

        {/* Income setup */}
        <div className="mb-6">
          <SetupIncome />
        </div>

        {/* Expenses */}
        <div className="mb-6">
          <ExpenseList />
        </div>

        {/* Transaction log */}
        <div className="mb-6">
          <TransactionLog />
        </div>
      </div>
    </main>
  );
}
