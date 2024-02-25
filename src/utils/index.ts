import { CandlestickGranularity } from "@lt_surge/algo-trading-shared-types";
import { Entries, IPerformanceSummary, Trade } from "@src/types/types";

export * from "./backtest";
export * from "./computeDrawdown";
export * from "./computeEquity";
export * from "./sma";
export * from "./formatDate";
export * from "./assembleQueryString";

export function entriesFromObject<T extends object>(object: T): Entries<T> {
  return Object.entries(object) as Entries<T>;
}

export function keysFromObject<T extends object>(object: T): (keyof T)[] {
  return Object.keys(object) as (keyof T)[];
}

const trimNum = (n: number) => Number(n.toFixed(2));

const granularityTimeMap: Partial<Record<CandlestickGranularity, number>> = {
  D: 1,
  H1: 1 / 24,
};

export const getPerformanceSummary = (
  trades: any,
  granularity: CandlestickGranularity
): IPerformanceSummary => {
  let barCount = 0;
  let netProfit = 0;
  let numWinningTrades = 0;
  let numLosingTrades = 0;
  let totalProfits = 0;
  let totalLosses = 0;

  let peakProfit = 0;
  let maxDrawdown = 0;

  trades.forEach((trade: Trade) => {
    barCount += trade.holdingPeriod;
    netProfit += trade.profitLoss;
    if (trade.profitLoss > 0) {
      numWinningTrades++;
      totalProfits += trade.profitLoss;
    } else {
      numLosingTrades++;
      totalLosses += trade.profitLoss;
    }

    if (netProfit > peakProfit) {
      peakProfit = netProfit;
    }
    const drawDown = peakProfit - netProfit;
    if (drawDown > maxDrawdown) {
      maxDrawdown = drawDown;
    }
  });

  const positionSize = trades[0].units;
  const totalTrades = trades.length;
  const simulationDays = barCount * granularityTimeMap[granularity];
  const numMonths = simulationDays / 30;
  const numYears = simulationDays / 365;
  const monthlyProfit = netProfit / numMonths;
  const yearlyProfit = netProfit / numYears;
  const winRate = numWinningTrades / totalTrades;
  const loseRate = numLosingTrades / totalTrades;
  const averageWinningTrade = totalProfits / numWinningTrades;
  const averageLosingTrade = totalLosses / numLosingTrades;
  const averageProfitPerTrade = netProfit / totalTrades;
  const averageHoldingPeriod = barCount / totalTrades;
  const averageHoldingPeriodDays = simulationDays / totalTrades;
  return {
    controlParam: 0,
    positionSize,
    monthlyProfit: trimNum(monthlyProfit),
    yearlyProfit: trimNum(yearlyProfit),
    netProfit: trimNum(netProfit),
    barCount,
    totalTrades,
    numWinningTrades,
    numLosingTrades,
    winRate: trimNum(winRate),
    loseRate: trimNum(loseRate),
    averageWinningTrade: trimNum(averageWinningTrade),
    averageLosingTrade: trimNum(averageLosingTrade),
    averageProfitPerTrade: trimNum(averageProfitPerTrade),
    averageHoldingPeriodBars: trimNum(averageHoldingPeriod),
    averageHoldingPeriodDays: trimNum(averageHoldingPeriodDays),
    maxDrawdown: trimNum(maxDrawdown),
  };
};
