import { profitTarget } from "./profitTarget";
import { stopLoss } from "./stopLoss";
import {
  Candle,
  Signal,
  Strategy,
  Trade,
  OpenTrade,
  PositionStatus,
} from "types/types";
import { finalizePosition } from "./finalizePosition";
import { executeTrade } from "./executeTrade";
import { useMyStore } from "@src/store";

// TO-DO: STOP-LOSS and PROFIT-TARGET as DOLLAR-AMOUNT instead of PERCENTAGE

// there is only ever one open position
// there can be multiple open trades
// also return an array of transactions

interface Acc {
  trades: Array<Trade>;
  openTrades: Array<OpenTrade>;
  currentPosition: PositionStatus;
}

export const backtest = ({
  strategy,
  candles,
  additionalData,
  options,
}: {
  strategy: Strategy;
  candles: Array<Candle>;
  additionalData: any;
  options: {
    isStopLoss: boolean;
    stopDistancePct: number;
    isProfitTarget: boolean;
    profitDistancePct: number;
    type: string;
  };
}) => {
  const results = candles.reduce(
    (acc: Acc, candle, index) => {
      // if (data[0] instanceof CandleWithSpread) // implement typegurd in future to check type of data: https://medium.com/ovrsea/checking-the-type-of-an-object-in-typescript-the-type-guards-24d98d9119b0

      let signal = strategy({ candle, additionalData, index });

      if (!acc.openTrades.length) {
        if (signal === "BUYTOCOVER" || signal === "SELL") {
          signal = "HOLD";
        }
      }

      // not sure how to handle stop-loss when compounding trades

      // STOP-LOSS
      if (options.isStopLoss && acc.openTrades.length) {
        const entryPrice = acc.openTrades[0].price;
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
      if (options.isProfitTarget && acc.openTrades.length) {
        const entryPrice = acc.openTrades[0].price;
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
      });
    },
    { trades: [], openTrades: [], currentPosition: "NONE" }
  );

  return results;
};

// scaling in
/**
 *
 */
