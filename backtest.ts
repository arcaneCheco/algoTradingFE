import { profitTarget } from "./profitTarget";
import { stopLoss } from "./stopLoss";
import {
  Candle,
  CandleWithSMA,
  Signal,
  Strategy,
  OpenPosition,
  Trade,
} from "./types/types";
import { formatRFC3339, formatDistance } from "date-fns";

// TO-DO: STOP-LOSS and PROFIT-TARGET as DOLLAR-AMOUNT instead of PERCENTAGE

const finalizePosition = (
  openPosition: OpenPosition,
  exitSignal: Signal,
  exitTime: string,
  exitPrice: number
) => {
  const { time, price, signal } = openPosition;

  const profitLoss =
    signal === Signal.BUY
      ? parseFloat((exitPrice - price).toFixed(5))
      : parseFloat((price - exitPrice).toFixed(5));

  const profitPct = ((profitLoss / price) * 100).toFixed(3) + "%";

  const holdingPeriod = formatDistance(time, exitTime);

  const growth = signal === Signal.BUY ? exitPrice / price : price / exitPrice;

  const trade: Trade = {
    entryTime: time,
    entryPrice: price,
    entrySignal: signal,
    exitTime,
    exitPrice,
    exitSignal: exitSignal,
    profitLoss,
    profitPct,
    holdingPeriod,
    growth,
  };

  return trade;
};

const executeTrade = ({
  signal,
  trades,
  openPositions,
  price,
  time,
}: {
  signal: Signal;
  trades: Array<Trade>;
  openPositions: Array<OpenPosition>;
  price: number;
  time: string;
}): {
  trades: Array<Trade>;
  openPositions: Array<OpenPosition>;
} => {
  const position = {
    // time: formatRFC3339(new Date()),
    time,
    signal,
    price,
  };

  let newPositions = [];
  let newTrades = [...trades];

  if (signal === Signal.BUY) {
    // cover short positions
    newPositions = openPositions.filter((openPosition) => {
      if (openPosition.signal === Signal.SELLSHORT) {
        const trade = finalizePosition(openPosition, signal, time, price);
        newTrades.push(trade);
        return false;
      }
      return true;
    });
    // open new long position
    // for now: only open position if there are no open positions already
    if (!newPositions.length) {
      newPositions.push(position);
    }

    return { openPositions: newPositions, trades: newTrades };
  }
  if (signal === Signal.SELLSHORT) {
    // close open positions
    newPositions = openPositions.filter((openPosition) => {
      if (openPosition.signal === Signal.BUY) {
        const trade = finalizePosition(openPosition, signal, time, price);
        newTrades.push(trade);
        return false;
      }
      return true;
    });
    // open new short position
    // for now: only open position if there are no open positions already
    if (!newPositions.length) {
      newPositions.push(position);
    }

    return { openPositions: newPositions, trades: newTrades };
  }
  if (signal === Signal.BUYTOCOVER) {
    // close short positions
    newPositions = openPositions.filter((openPosition) => {
      if (openPosition.signal === Signal.SELLSHORT) {
        const trade = finalizePosition(openPosition, signal, time, price);
        newTrades.push(trade);
        return false;
      }
      return true;
    });
    return { openPositions: newPositions, trades: newTrades };
  }
  if (signal === Signal.SELL) {
    // close long positions
    newPositions = openPositions.filter((openPosition) => {
      if (openPosition.signal === Signal.BUY) {
        const trade = finalizePosition(openPosition, signal, time, price);
        newTrades.push(trade);
        return false;
      }
      return true;
    });
    return { openPositions: newPositions, trades: newTrades };
  }
  // if HOLD
  return { trades, openPositions };
};

export const backtest = (strategy: Strategy, data: Array<CandleWithSMA>) => {
  const results = data.reduce(
    (
      acc: {
        trades: Array<Trade>;
        openPositions: Array<OpenPosition>;
      },
      candle
    ) => {
      let signal = strategy(candle);

      // STOP-LOSS
      if (acc.openPositions.length) {
        const entryPrice = acc.openPositions[0].price;
        const stopDistancePct = 3;
        const stopLossSignal = stopLoss(entryPrice, candle.c, stopDistancePct);
        if (stopLossSignal) {
          signal = stopLossSignal;
        }
      }

      // PROFIT-TARGET
      if (acc.openPositions.length) {
        const entryPrice = acc.openPositions[0].price;
        const profitDistancePct = 1.25;
        const profitTargetSignal = profitTarget(
          entryPrice,
          candle.c,
          profitDistancePct
        );
        if (profitTargetSignal) {
          signal = profitTargetSignal;
        }
      }

      return executeTrade({
        ...acc,
        signal,
        price: candle.c,
        time: candle.time,
      });
    },
    { trades: [], openPositions: [] }
  );

  return results;
};
