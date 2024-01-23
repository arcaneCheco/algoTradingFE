import { PerformanceSummary, Trade } from "@src/types/types";

export const getPerformanceSummary = (
  startingCapital: number,
  trades: Array<Trade>
): PerformanceSummary => {
  console.log("CALCULATING PERFROMANCE");
  let workingCapital = startingCapital;
  const totalTrades = trades.length;
  let numWinningTrades = 0;
  let numLosingTrades = 0;
  let barCount = 0;
  let totalProfits = 0;
  let totalLosses = 0;
  let totalSpreadCosts = 0;

  trades.forEach(({ growth, profitLoss, spreadCosts, entryPrice }) => {
    totalSpreadCosts += (workingCapital / entryPrice) * (spreadCosts || 0);

    workingCapital *= growth; // assuming entre capital is invested

    if (profitLoss > 0) {
      totalProfits += profitLoss;
      ++numWinningTrades;
    } else {
      totalLosses += profitLoss;
      ++numLosingTrades;
    }
  });

  const profit = workingCapital - startingCapital;
  const profitPct =
    parseFloat(((profit / startingCapital) * 100).toFixed(2)) + "%";
  const winRate =
    parseFloat(((numWinningTrades / totalTrades) * 100).toFixed(2)) + "%";
  const loseRate =
    parseFloat(((numLosingTrades / totalTrades) * 100).toFixed(2)) + "%";
  const averageWinningTrade =
    numWinningTrades > 0
      ? parseFloat((totalProfits / numWinningTrades).toFixed(5))
      : 0;
  const averageLosingTrade =
    numLosingTrades > 0
      ? parseFloat((totalLosses / numLosingTrades).toFixed(5))
      : 0;

  return {
    startingCapital,
    finalCapital: parseFloat(workingCapital.toFixed(2)),
    profit: parseFloat(profit.toFixed(2)),
    profitPct,
    growth: parseFloat((workingCapital / startingCapital).toFixed(5)),
    totalTrades,
    numWinningTrades,
    numLosingTrades,
    winRate,
    loseRate,
    averageWinningTrade,
    averageLosingTrade,
    averageProfitPerTrade: parseFloat((profit / totalTrades).toFixed(2)),
    profitFactor:
      totalLosses < 0
        ? parseFloat((totalProfits / Math.abs(totalLosses)).toFixed(5))
        : "no losing trades",
    barCount,
    totalSpreadCosts,
    avgSpreadCostPerTrade: totalSpreadCosts / totalTrades,
  };
};
