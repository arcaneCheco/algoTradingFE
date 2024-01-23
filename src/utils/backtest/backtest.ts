import { profitTarget } from "./profitTarget";
import { stopLoss } from "./stopLoss";
import {
  Candle,
  CandleWithSMA,
  Signal,
  Strategy,
  OpenPosition,
  Trade,
  CandleWithSpread,
  CandleWithSpreadAndSMA,
} from "types/types";
import { formatRFC3339, formatDistance } from "date-fns";
import { finalizePosition } from "./finalizePosition";
import { executeTrade } from "./executeTrade";
import { useMyStore } from "@src/store";

// TO-DO: STOP-LOSS and PROFIT-TARGET as DOLLAR-AMOUNT instead of PERCENTAGE

export interface BacktestData extends Candle {
  sma: number;
  bid: number;
  ask: number;
}

export const backtest = (
  strategy: Strategy,
  data: Array<BacktestData>,
  options: {
    isStopLoss: boolean;
    stopDistancePct: number;
    isProfitTarget: boolean;
    profitDistancePct: number;
    includeSpreads: boolean;
  }
) => {
  const results = data.reduce(
    (
      acc: {
        trades: Array<Trade>;
        openPositions: Array<OpenPosition>;
      },
      candle
    ) => {
      // if (data[0] instanceof CandleWithSpread) // implement typegurd in future to check type of data: https://medium.com/ovrsea/checking-the-type-of-an-object-in-typescript-the-type-guards-24d98d9119b0

      let signal = strategy(candle);

      // STOP-LOSS
      if (options.isStopLoss && acc.openPositions.length) {
        const entryPrice = acc.openPositions[0].price;
        const stopLossSignal = stopLoss(
          entryPrice,
          candle.c,
          options.stopDistancePct
        );
        if (stopLossSignal) {
          signal = stopLossSignal;
        }
      }

      // PROFIT-TARGET
      if (options.isProfitTarget && acc.openPositions.length) {
        const entryPrice = acc.openPositions[0].price;
        const profitTargetSignal = profitTarget(
          entryPrice,
          candle.c,
          options.profitDistancePct
        );
        if (profitTargetSignal) {
          signal = profitTargetSignal;
        }
      }

      return executeTrade({
        ...acc,
        signal,
        candle,
        includeSpreads: options.includeSpreads,
      });
    },
    { trades: [], openPositions: [] }
  );

  return results;
};
