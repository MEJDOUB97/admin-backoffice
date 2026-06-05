import { formatMoney } from "@/lib/format";

export default function MoneyAmount({ amount, className = "" }: { amount: number; className?: string }) {
  return <span className={className}>{formatMoney(amount)}</span>;
}
