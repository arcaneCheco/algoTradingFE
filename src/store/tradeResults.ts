// start date, granularity

import { StateCreator } from "zustand";

const strategies = [
  {
    start: "2024-01-31T15:00:00.000000000Z",
    granularity: "H1",
    smaPeriod: 40,
  },
];

interface Candles {
  x: string;
  y: [number, number, number, number];
}

interface SMA {
  x: string;
  y: number;
}

interface Trade {
  openTime: string;
  state: string;
  closeTime?: string;
  price: number;
  units: number;
  profitLoss?: number;
  unrealizedPL?: number;
}

export interface TradeResultsStore {
  candles: Array<Candles>;
  setCandles: (data: Array<Candles>) => void;
  sma: Array<SMA>;
  setSMA: (sma: Array<SMA>) => void;
  trades: Array<Trade>;
  setTrades: (trades: Array<Trade>) => void;
}

export const useTradeResultsStore: StateCreator<TradeResultsStore> = (set) => ({
  candles: [],
  setCandles: (candles) => set({ candles }),
  sma: [],
  setSMA: (sma) => set({ sma }),
  trades: [],
  setTrades: (trades) => set({ trades }),
});
