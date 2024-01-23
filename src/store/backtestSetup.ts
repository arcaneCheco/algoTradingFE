import { StateCreator, create } from "zustand";

export interface BacktestSetup {
  isStopLoss: boolean;
  setIsStopLoss: (isStopLoss: boolean) => void;
  stopDistancePct: number;
  setStopDistancePct: (stopDistancePct: number) => void;
  isProfitTarget: boolean;
  setIsProfitTarget: (isProfitTarget: boolean) => void;
  profitDistancePct: number;
  setProfitDistancePct: (profitDistancePct: number) => void;
  includeSpreads: boolean;
  setIncludeSpreads: (includeSpreads: boolean) => void;
}

export const useBacktestSetupBase: StateCreator<BacktestSetup> = (set) => ({
  isStopLoss: true,
  setIsStopLoss: (isStopLoss) => set(() => ({ isStopLoss })),
  stopDistancePct: 3,
  setStopDistancePct: (stopDistancePct) => set(() => ({ stopDistancePct })),
  isProfitTarget: true,
  setIsProfitTarget: (isProfitTarget) => set(() => ({ isProfitTarget })),
  profitDistancePct: 1.25,
  setProfitDistancePct: (profitDistancePct) =>
    set(() => ({ profitDistancePct })),
  includeSpreads: true,
  setIncludeSpreads: (includeSpreads) => set(() => ({ includeSpreads })),
});
