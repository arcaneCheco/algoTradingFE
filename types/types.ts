export enum PricingComponent {
  M = "M",
  B = "B",
  A = "A",
}
export enum CandlestickGranularity {
  S5 = "S5",
  S10 = "S10",
  S15 = "S15",
  S30 = "S30",
  M1 = "M1",
  M2 = "M2",
  M3 = "M3",
  M4 = "M4",
  M5 = "M5",
  M10 = "M10",
  M15 = "M15",
  M30 = "M30",
  H1 = "H1",
  H2 = "H2",
  H3 = "H3",
  H4 = "H4",
  H6 = "H6",
  H8 = "H8",
  H12 = "H12",
  D = "D",
  W = "W",
  M = "M",
}

export enum Signal {
  BUY = "BUY",
  SELL = "SELL",
  HOLD = "HOLD",
  SELLSHORT = "SELLSHORT",
  BUYTOCOVER = "BUYTOCOVER",
}

export interface Candle {
  o: number;
  c: number;
  h: number;
  l: number;
  time: string;
}
export interface CandleWithSMA extends Candle {
  sma: number;
}
export interface CandleWithSpread extends Candle {
  bid: number;
  ask: number;
}

export interface CandleWithSpreadAndSMA
  extends CandleWithSpread,
    CandleWithSMA {}

export type Strategy = (candle: CandleWithSMA) => Signal;

export interface OpenPosition {
  // time: string;
  // signal: Signal;
  // price: number;
  time: string;
  price: number;
  signal: Signal;
  askPrice: number;
  bidPrice: number;
}

export type Nullable<T> = T | null;

// export interface Trade {
//   entryTime: string;
//   entryPrice: number;
//   entrySignal: Signal;
//   positionSize: number;
//   exitTime: Nullable<string>;
//   exitPrice: Nullable<number>;
//   exitSignal: Nullable<Signal>;
//   profitLoss: Nullable<number>;
//   profitPct: Nullable<number>;
//   // riskPct: Nullable<number>;
//   holdingPeriod: Nullable<string>;
//   growth: Nullable<number>;
// }
export interface Trade {
  entryTime: string;
  entryPrice: number;
  entrySignal: Signal;
  exitTime: string;
  exitPrice: number;
  exitSignal: Signal;
  profitLoss: number;
  profitPct: string;
  // riskPct: number;
  holdingPeriod: string;
  growth: number;
  spreadCosts: number;
}

export interface PerformanceSummary {
  startingCapital: number;
  finalCapital: number;
  profit: number;
  profitPct: string;
  growth: number;
  totalTrades: number;
  numWinningTrades: number;
  numLosingTrades: number;
  winRate: string;
  loseRate: string;
  averageWinningTrade: number;
  averageLosingTrade: number;
  averageProfitPerTrade: number;
  barCount: number;
  profitFactor: number | string;
  totalSpreadCosts: number;
  avgSpreadCostPerTrade: number;
}
