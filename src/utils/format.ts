export function formatMoney(amount: number): string {
  if (amount >= 1_000_000) {
    const millions = amount / 1_000_000;
    return `€${parseFloat(millions.toFixed(1))}M`;
  }
  if (amount >= 1_000) {
    const thousands = amount / 1_000;
    return `€${parseFloat(thousands.toFixed(1))}K`;
  }
  return `€${amount}`;
}

export function formatShortName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length <= 1) return fullName;
  const initials = parts.slice(0, -1).map((p) => p[0] + '.').join(' ');
  return `${initials} ${parts[parts.length - 1]}`;
}
