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
  sma?: number;
}
export interface CandleWithSMA extends Candle {
  sma: number;
}

export type Strategy = (candle: CandleWithSMA) => Signal;

export interface OpenPosition {
  time: string;
  signal: Signal;
  price: number;
  amount: number;
}

export type Nullable<T> = T | null;

export interface Trade {
  entryTime: string;
  entryPrice: number;
  entrySignal: Signal;
  positionSize: number;
  exitTime: Nullable<string>;
  exitPrice: Nullable<number>;
  exitSignal: Nullable<Signal>;
  profitLoss: Nullable<number>;
  profitPct: Nullable<number>;
  // riskPct: Nullable<number>;
  holdingPeriod: Nullable<string>;
}
