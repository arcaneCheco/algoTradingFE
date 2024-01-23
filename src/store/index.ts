import { create, StateCreator, StoreApi } from "zustand";
import { CandlestickGranularity } from "@lt_surge/algo-trading-shared-types";
import { Candle, Trade } from "@src/types/types";
import { createSelectors } from "./createSelectors";
import { BacktestSetup, useBacktestSetupBase } from "./backtestSetup";

interface MyStore {
  assetName: string;
  updateAssetName: (assetName: string) => void;
  startTime: string;
  setStartTime: (startTime: string) => void;
  endTime: string;
  setEndTime: (endTime: string) => void;
  granularity: CandlestickGranularity;
  setGranularity: (granularity: CandlestickGranularity) => void;
  candleData: Array<Candle>;
  setCandleData: (data: Array<Candle>) => void;
  smaPeriod: number;
  setSMAPeriod: (smaPeriod: number) => void;
  smaData: Array<number | null>;
  setSMAData: (smaData: Array<number | null>) => void;
  spreadsData: Array<{ bid: number; ask: number }>;
  setSpreadsData: (spreadsData: Array<{ bid: number; ask: number }>) => void;
  trades: Array<Trade>;
  setTrades: (spreadsData: Array<Trade>) => void;
  startingCapital: number;
  setStartingCapital: (startingCapital: number) => void;
}

const useMyStoreBaase: StateCreator<MyStore> = (set) => ({
  assetName: "EUR_GBP",
  updateAssetName: (assetName) => set(() => ({ assetName })),
  startTime: "2023-08-01T22:00",
  setStartTime: (startTime) => set(() => ({ startTime })),
  endTime: "2024-01-01T22:00",
  setEndTime: (endTime) => set(() => ({ endTime })),
  granularity: "D",
  setGranularity: (granularity) => set(() => ({ granularity })),
  candleData: [],
  setCandleData: (candleData) => set(() => ({ candleData })),
  smaPeriod: 50,
  setSMAPeriod: (smaPeriod) => set(() => ({ smaPeriod })),
  smaData: [],
  setSMAData: (smaData) => set(() => ({ smaData })),
  spreadsData: [],
  setSpreadsData: (spreadsData) => set(() => ({ spreadsData })),
  trades: [],
  setTrades: (trades) => set(() => ({ trades })),
  startingCapital: 10000,
  setStartingCapital: (startingCapital) => set(() => ({ startingCapital })),
});

const UseBoundStore = create<BacktestSetup & MyStore>()((...a) => ({
  ...useMyStoreBaase(...a),
  ...useBacktestSetupBase(...a),
}));

const useMyStore = createSelectors(UseBoundStore);

export { useMyStore };

// function BearCounter() {
//     const bears = useStore((state) => state.bears)
//     return <h1>{bears} around here...</h1>
//   }

//   function Controls() {
//     const increasePopulation = useStore((state) => state.increasePopulation)
//     return <button onClick={increasePopulation}>one up</button>
//   }
