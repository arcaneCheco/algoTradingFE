import {
  Candle,
  CandleWithSMA,
  Signal,
  Strategy,
  OpenPosition,
  Trade,
} from "./types/types";
import { formatRFC3339, formatDistance } from "date-fns";

const calculatePositionValue = (
  positions: Array<OpenPosition>,
  currentPrice: number
) => {
  // return positions.reduce((total, position) => total + position.amount * currentPrice, 0);
};

const finalizePosition = (
  openPosition: OpenPosition,
  exitSignal: Signal,
  exitTime: string,
  exitPrice: number
) => {
  const { time, price, signal, amount } = openPosition;

  const profitLoss =
    signal === Signal.BUY
      ? (exitPrice - price) * amount
      : (price - exitPrice) * amount;

  const profitPct = (profitLoss / amount / price) * 100;

  const holdingPeriod = formatDistance(time, exitTime);

  const trade: Trade = {
    entryTime: time,
    entryPrice: price,
    entrySignal: signal,
    positionSize: amount,
    exitTime,
    exitPrice,
    exitSignal: exitSignal,
    profitLoss,
    profitPct,
    holdingPeriod,
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
    amount:
      signal === Signal.BUY ? 100 : signal === Signal.SELLSHORT ? -100 : 0, // Adjust position size as needed
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
      const signal = strategy(candle);
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
