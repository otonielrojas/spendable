export type PayFrequency = "weekly" | "biweekly" | "semimonthly" | "monthly";

export interface Income {
  amountCents: number; // per pay period, in cents
  nextPayday: string; // ISO date string "YYYY-MM-DD"
  frequency: PayFrequency;
}

export interface Expense {
  id: string;
  name: string;
  amountCents: number;
  dueDate: string; // ISO date string "YYYY-MM-DD" — next occurrence
  isRecurring: boolean;
}

export interface Transaction {
  id: string;
  description: string;
  amountCents: number; // always positive; represents money spent
  date: string; // ISO date string "YYYY-MM-DD"
}

export interface Settings {
  bufferCents: number; // personal safety buffer in cents
  currentBalanceCents: number; // manually entered current balance
}
