import { CandlestickGranularity } from "@lt_surge/algo-trading-shared-types";
import { IISetup, SetupParam } from "@src/types/types";
import { entriesFromObject } from "@src/utils";
import { create, StateCreator, StoreApi } from "zustand";

// export type SetupParam =
//   | "instrument"
//   | "startTime"
//   | "endTime"
//   | "granularity"
//   | "smaPeriod"
//   | "stopLoss";
// // | "profitTarget";

// interface ParamSetup {
//   use: boolean;
//   optional: boolean;
//   control: boolean;
// }

// export type SetupParam = keyof Pick<
//   Store,
//   | "instrument"
//   | "startTime"
//   | "endTime"
//   | "granularity"
//   | "smaPeriod"
//   | "stopLoss"
// >;

// type IISetup = Partial<Record<SetupParam, ParamSetup>>;

export interface IStrategy {
  setup: IISetup;
  description: any;
  func: any;
  runBatchTest: any;
}

// interface DataArgs {
//   instrument: string;
//   setInstrument: (instrument: string) => void;
//   startTime: string;
//   setStartTime: (startTime: string) => void;
//   endTime: string;
//   setEndTime: (endTime: string) => void;
//   granularity: CandlestickGranularity;
//   setGranularity: (granularity: CandlestickGranularity) => void;
//   smaPeriod: DataParamSMA;
//   setSMAPeriod: (updates: Partial<DataParamSMA>) => void;
//   stopLoss: DataParamSMA;
//   setStopLoss: (updates: Partial<DataParamSMA>) => void;
// }

// export const usesDataArgsStore = create<DataArgs>((set) => ({
//   instrument: "EUR_USD",
//   setInstrument: (instrument) => set(() => ({ instrument })),
//   startTime: new Date(
//     new Date().getTime() - 1000 * 60 * 60 * 24 * 365
//   ).toISOString(),
//   setStartTime: (startTime) => set(() => ({ startTime })),
//   endTime: new Date(new Date().getTime() - 1000 * 60 * 60 * 24).toISOString(),
//   setEndTime: (endTime) => set(() => ({ endTime })),
//   granularity: "D",
//   setGranularity: (granularity) => set(() => ({ granularity })),
//   smaPeriod: {
//     value: 40,
//     stepSize: 5,
//     minStep: 1,
//     min: 2,
//     max: 200,
//     minValue: 10,
//     maxValue: 100,
//   },
//   setSMAPeriod: (updates) =>
//     set((state) => ({ smaPeriod: { ...state.smaPeriod, ...updates } })),
//   stopLoss: {
//     value: 1,
//     stepSize: 1,
//     minStep: 0.01,
//     min: 0.01,
//     max: 100,
//     minValue: 1,
//     maxValue: 10,
//   },
//   setStopLoss: (updates) =>
//     set((state) => ({ stopLoss: { ...state.stopLoss, ...updates } })),
// }));

export interface DataParamSMA {
  value: number;
  stepSize: number;
  minStep: number;
  min: number;
  max: number;
  minValue: number;
  maxValue: number;
}

export interface StoreProps {
  isSidePanel: boolean;
  instrument: string;
  startTime: string;
  endTime: string;
  granularity: CandlestickGranularity;
  smaPeriod: DataParamSMA;
  stopLoss: DataParamSMA;
  controlParam: SetupParam | null;
  activeParams: Record<SetupParam, boolean>;
  // strategy
  strategy: IStrategy;
  // results
  candles: Array<any>;
  results: Array<any>;
}

export interface Store extends StoreProps {
  setIsSidePanel: (isSidePanel: boolean) => void;
  setInstrument: (instrument: string) => void;
  setStartTime: (startTime: string) => void;
  setEndTime: (endTime: string) => void;
  setGranularity: (granularity: CandlestickGranularity) => void;
  setSMAPeriod: (updates: Partial<DataParamSMA>) => void;
  setStopLoss: (updates: Partial<DataParamSMA>) => void;
  setControlParam: (controlParam: SetupParam | null) => void;
  updateActiveParam: (param: SetupParam) => void;
  // strategy
  setStrategy: (strategy: IStrategy) => void;
  // results
  setResults: (results: any) => void;
  clear: () => void;
}

const initialStore: StoreProps = {
  isSidePanel: true,
  instrument: "EUR_USD",
  startTime: new Date(
    new Date().getTime() - 1000 * 60 * 60 * 24 * 365
  ).toISOString(),
  endTime: new Date(new Date().getTime() - 1000 * 60 * 60 * 24).toISOString(),
  granularity: "D",
  smaPeriod: {
    value: 40,
    stepSize: 5,
    minStep: 1,
    min: 2,
    max: 200,
    minValue: 10,
    maxValue: 100,
  },
  stopLoss: {
    value: 1,
    stepSize: 1,
    minStep: 0.01,
    min: 0.01,
    max: 100,
    minValue: 1,
    maxValue: 10,
  },
  controlParam: "smaPeriod",
  activeParams: {
    instrument: true,
    startTime: true,
    endTime: true,
    granularity: true,
    smaPeriod: true,
    stopLoss: true,
  },
  strategy: {
    func: () => {},
    description: "",
    setup: {},
    runBatchTest: () => {},
  },
  candles: [],
  results: [],
};

const useStore = create<Store>((set) => ({
  ...initialStore,
  setIsSidePanel: (isSidePanel) => set(() => ({ isSidePanel })),
  setInstrument: (instrument) => set(() => ({ instrument })),
  setStartTime: (startTime) => set(() => ({ startTime })),
  setEndTime: (endTime) => set(() => ({ endTime })),
  setGranularity: (granularity) => set(() => ({ granularity })),
  setSMAPeriod: (updates) =>
    set((state) => ({ smaPeriod: { ...state.smaPeriod, ...updates } })),
  setStopLoss: (updates) =>
    set((state) => ({ stopLoss: { ...state.stopLoss, ...updates } })),
  setControlParam: (controlParam) => set(() => ({ controlParam })),
  updateActiveParam: (param) => {
    set((state) => {
      const updatedActiveParams = { ...state.activeParams };
      const currentValue = updatedActiveParams[param];
      updatedActiveParams[param] = !currentValue;

      let controlParam = state.controlParam;
      if (currentValue && controlParam === param) {
        // unset controlParam if deactivated
        controlParam = null;
      }
      console.log({ updatedActiveParams });
      return { ...state, activeParams: updatedActiveParams, controlParam };
    });
  },
  setStrategy: (strategy) =>
    set(() => ({
      strategy: {
        func: strategy.func,
        description: strategy.description,
        setup: strategy.setup,
        runBatchTest: strategy.runBatchTest,
      },
    })),
  setResults: (results) => set(() => ({ results })),
  clear: () => set((state) => ({ ...state, ...initialStore })),
}));

export default useStore;
