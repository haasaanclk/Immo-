/** Pure, testable financial model for a property. */

export const energyFactor: Record<string, number> = {
  "A+": 0.0008,
  A: 0.0012,
  "B+": 0.0017,
  B: 0.0022,
  C: 0.003,
};

export interface FinanceInput {
  price: number;
  downPct: number; // %
  term: number; // years
  rate: number; // annual %
  energy: string;
  investment: number; // 0-10
}

export interface FinanceResult {
  down: number;
  loan: number;
  mortgage: number; // monthly
  maintenance: number; // monthly
  energyCost: number; // monthly
  fees: number; // monthly
  totalMonthly: number;
  growth: number; // annual rate (fraction)
  value10: number;
  gain: number;
}

export function computeFinance({
  price,
  downPct,
  term,
  rate,
  energy,
  investment,
}: FinanceInput): FinanceResult {
  const down = (price * downPct) / 100;
  const loan = price - down;
  const r = rate / 100 / 12;
  const n = term * 12;
  const mortgage = r === 0 ? loan / n : (loan * r) / (1 - Math.pow(1 + r, -n));
  const maintenance = (price * 0.012) / 12;
  const energyCost = (price * (energyFactor[energy] ?? 0.0015)) / 12;
  const fees = (price * 0.003) / 12;
  const totalMonthly = mortgage + maintenance + energyCost + fees;

  const growth = 0.018 + (investment - 8) * 0.006;
  const value10 = price * Math.pow(1 + growth, 10);
  const gain = value10 - price;

  return { down, loan, mortgage, maintenance, energyCost, fees, totalMonthly, growth, value10, gain };
}
