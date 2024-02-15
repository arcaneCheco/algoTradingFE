export enum PricingComponent {
  M = "M",
  B = "B",
  A = "A",
}

// export enum Signal {
//   BUY = "BUY",
//   SELL = "SELL",
//   HOLD = "HOLD",
//   SELLSHORT = "SELLSHORT",
//   BUYTOCOVER = "BUYTOCOVER",
// }

export type Signal = "BUY" | "SELL" | "SELLSHORT" | "BUYTOCOVER" | "HOLD";

export interface Candle {
  o: number;
  c: number;
  h: number;
  l: number;
  time: string;
}

// export type Strategy = (candle: Candle) => Signal;
export type Strategy = ({
  candle,
  additionalData,
  index,
}: {
  candle: Candle;
  additionalData: any;
  index: number;
}) => Signal;

export interface OpenTrade {
  time: string;
  price: number;
  signal: Signal;
  holdingPeriod: number;
  // direction: PositionStatus;
}

export type PositionStatus = "NONE" | "LONG" | "SHORT";

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
  // profitPct: string;
  // riskPct: number;
  holdingPeriod: number;
  // growth: number;
  spreadCosts?: number;
  units: number;
  // direction: PositionStatus;
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
