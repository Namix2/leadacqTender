export interface CompanyBidStats {
  bidCount12m: number;
  winCount12m: number;
  daysSinceLastBid: number;
}

export function calculatePriorityScore(stats: CompanyBidStats): number {
  const winRate = stats.bidCount12m > 0 ? stats.winCount12m / stats.bidCount12m : 0;
  const frequencyScore = Math.min(stats.bidCount12m / 10, 1) * 40;
  const painScore = (1 - winRate) * 40;
  const recencyScore = Math.max(0, (180 - stats.daysSinceLastBid) / 180) * 20;
  return Math.round((frequencyScore + painScore + recencyScore) * 10) / 10;
}

export function normaliseCompanyName(name: string) {
  return name.toLowerCase().replace(/\b(limited|ltd|plc|llp|uk|the)\b/g, "").replace(/[^a-z0-9]/g, "").trim();
}

export function matchConfidence(target: string, supplier: string) {
  const a = normaliseCompanyName(target);
  const b = normaliseCompanyName(supplier);
  if (!a || !b) return 0;
  if (a === b) return 1;
  const longer = a.length > b.length ? a : b;
  const shorter = a.length > b.length ? b : a;
  if (longer.includes(shorter) && shorter.length >= 5) return shorter.length / longer.length;
  const grams = (value: string) => new Set(Array.from({ length: Math.max(0, value.length - 1) }, (_, i) => value.slice(i, i + 2)));
  const x = grams(a), y = grams(b);
  const intersection = [...x].filter((item) => y.has(item)).length;
  return (2 * intersection) / Math.max(1, x.size + y.size);
}
