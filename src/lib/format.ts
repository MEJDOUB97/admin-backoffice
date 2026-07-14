const money = new Intl.NumberFormat("fr-FR", {
  maximumFractionDigits: 2,
});

export function formatMoney(amount: number) {
  return `${money.format(Number(amount || 0))} MAD`;
}

export function formatCompactNumber(amount: number) {
  return new Intl.NumberFormat("fr-MA", { notation: "compact", maximumFractionDigits: 1 }).format(amount);
}

export function formatDate(input: string) {
  return new Intl.DateTimeFormat("fr-MA", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(input));
}

export function formatDateTime(input: string) {
  return new Intl.DateTimeFormat("fr-MA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(input));
}

export function formatPercent(value: number) {
  return `${Math.round(value)}%`;
}
