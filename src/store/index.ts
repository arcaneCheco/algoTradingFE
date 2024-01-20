import { create, StoreApi, UseBoundStore } from "zustand";
import { CandlestickGranularity } from "@lt_surge/algo-trading-shared-types";
import { Candle } from "@src/types/types";

type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never;

const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(
  _store: S
) => {
  let store = _store as WithSelectors<typeof _store>;
  store.use = {};
  for (let k of Object.keys(store.getState())) {
    (store.use as any)[k] = () => store((s) => s[k as keyof typeof s]);
  }

  return store;
};

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
}

const useMyStoreBaase = create<MyStore>((set) => ({
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
}));

const useMyStore = createSelectors(useMyStoreBaase);

export { useMyStore };

// function BearCounter() {
//     const bears = useStore((state) => state.bears)
//     return <h1>{bears} around here...</h1>
//   }

//   function Controls() {
//     const increasePopulation = useStore((state) => state.increasePopulation)
//     return <button onClick={increasePopulation}>one up</button>
//   }
