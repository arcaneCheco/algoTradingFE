import styled from "styled-components";
import { getPerformanceSummary } from "@src/utils";
import { useEffect, useState } from "react";
import { Trade } from "@src/types/types";
import { CandlestickGranularity } from "@lt_surge/algo-trading-shared-types";

const granularityTimeMap: Record<any, number> = {
  D: 1,
  H1: 1 / 24,
};

export const PerformanceSummary = ({ trades, granularity }: any) => {
  const [results, setResults] = useState<Record<string, any>>({});

  useEffect(() => {
    if (trades.length) {
      setResults(getPerformanceSummary(trades));
    }
  }, [trades]);

  const getPerformanceSummary = (trades: any) => {
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
      positionSize,
      monthlyProfit: monthlyProfit.toFixed(2),
      yearlyProfit: yearlyProfit.toFixed(2),
      netProfit: netProfit.toFixed(2),
      barCount,
      totalTrades,
      numWinningTrades,
      numLosingTrades,
      winRate: winRate.toFixed(2),
      loseRate: loseRate.toFixed(2),
      averageWinningTrade: averageWinningTrade.toFixed(2),
      averageLosingTrade: averageLosingTrade.toFixed(2),
      averageProfitPerTrade: averageProfitPerTrade.toFixed(2),
      "averageHoldingPeriod (bars)": averageHoldingPeriod.toFixed(2),
      "averageHoldingPeriod (days)": averageHoldingPeriodDays.toFixed(2),
      maxDrawdown: maxDrawdown.toFixed(2),
    };
  };
  return (
    <Wrapper>
      <Table>
        <TBody>
          <TableRow>
            <TableHeader>Property</TableHeader>
            <TableHeader>Value</TableHeader>
          </TableRow>
          {Object.entries(results).map(([property, value]) => {
            return (
              <TableRow key={property}>
                <TableCell>{property}</TableCell>
                <TableCell>{value}</TableCell>
              </TableRow>
            );
          })}
        </TBody>
      </Table>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  margin-top: 50px;
  width: 100%;
  height: fit-content;
  display: flex;
  justify-content: center;
`;

const Table = styled.table`
  width: fit-content;
  text-align: center;
  border-collapse: collapse;
`;

const TBody = styled.tbody`
  & :last-child {
    border-bottom: 1px solid black;
  }
`;

const TableRow = styled.tr`
  border-top: 1px solid black;
`;
const TableHeader = styled.th`
  min-width: 200px;
`;
const TableCell = styled.td``;
