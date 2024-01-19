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

// TO-DO: STOP-LOSS and PROFIT-TARGET as DOLLAR-AMOUNT instead of PERCENTAGE

export const backtest = (
  strategy: Strategy,
  data: Array<CandleWithSpreadAndSMA>,
  // data: Array<CandleWithSMA>,
  options: {
    isStopLoss: boolean;
    stopDistancePct: number;
    isProfitTarget: boolean;
    profitDistancePct: number;
    includeSpreads: boolean;
  } = {
    isStopLoss: true,
    stopDistancePct: 3,
    isProfitTarget: true,
    profitDistancePct: 1.25,
    includeSpreads: true,
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
        // price: candle.c,
        // time: candle.time,
        // ask: candle.ask,
        // bid: candle.bid,
      });
    },
    { trades: [], openPositions: [] }
  );

  return results;
};
