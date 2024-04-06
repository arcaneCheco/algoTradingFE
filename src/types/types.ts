import { Store } from "@src/store";

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
  stopLossPrice: number;
  // direction: PositionStatus;
}

export type PositionStatus = "NONE" | "LONG" | "SHORT";

export type Nullable<T> = T | null;

export type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

export interface ParamSetup {
  use: boolean;
  optional: boolean;
  control: boolean;
}

export type SetupParam = keyof Pick<
  Store,
  | "instrument"
  | "startTime"
  | "endTime"
  | "granularity"
  | "smaPeriod"
  | "stopLoss"
>;

export type IISetup = Partial<Record<SetupParam, ParamSetup>>;

export interface IPerformanceSummary {
  controlParam: number;
  positionSize: number;
  monthlyProfit: number;
  yearlyProfit: number;
  netProfit: number;
  barCount: number;
  totalTrades: number;
  numWinningTrades: number;
  numLosingTrades: number;
  winRate: number;
  loseRate: number;
  averageWinningTrade: number;
  averageLosingTrade: number;
  averageProfitPerTrade: number;
  averageHoldingPeriodBars: number;
  averageHoldingPeriodDays: number;
  maxDrawdown: number;
}

export interface BacktestResult {
  trades: Array<Trade>;
  transactions: Array<any>;
  openTrades: Array<OpenTrade>;
  additionalData?: any;
}

export type BacktestResultWithControlParam = BacktestResult & {
  controlParam: any;
};
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
