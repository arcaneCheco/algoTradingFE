import {
  CandleWithSpreadAndSMA,
  OpenPosition,
  Signal,
  Trade,
} from "types/types";
import { finalizePosition } from "./finalizePosition";

const closePositionsUtil = ({
  openPositions,
  exitPosition,
  closeLongPositions,
}: {
  openPositions: Array<OpenPosition>;
  exitPosition: OpenPosition;
  closeLongPositions: boolean;
}) => {
  const finalizedTrades: Array<Trade> = [];
  const openPositionsLeft = openPositions.filter((openPosition) => {
    if (
      openPosition.signal ===
      (closeLongPositions ? Signal.BUY : Signal.SELLSHORT)
    ) {
      const trade = finalizePosition(openPosition, exitPosition);
      finalizedTrades.push(trade);
      return false;
    }
    return true;
  });
  return { finalizedTrades, openPositionsLeft };
};

export const executeTrade = ({
  signal,
  trades,
  openPositions,
  candle,
}: {
  signal: Signal;
  trades: Array<Trade>;
  openPositions: Array<OpenPosition>;
  candle: CandleWithSpreadAndSMA;
}): {
  trades: Array<Trade>;
  openPositions: Array<OpenPosition>;
} => {
  const { c, time, ask, bid } = candle;
  const newPosition: OpenPosition = {
    signal,
    time,
    price: c,
    askPrice: ask,
    bidPrice: bid,
  };

  let newPositions: Array<OpenPosition> = [];
  let newTrades = [...trades];

  if (signal === Signal.BUY) {
    // cover short positions
    const { finalizedTrades, openPositionsLeft } = closePositionsUtil({
      openPositions,
      exitPosition: newPosition,
      closeLongPositions: false,
    });
    newPositions = [...openPositionsLeft];
    newTrades = [...newTrades, ...finalizedTrades];
    // newPositions = openPositions.filter((openPosition) => {
    //   if (openPosition.signal === Signal.SELLSHORT) {
    //     const trade = finalizePosition(openPosition, newPosition, includeSpreads);
    //     newTrades.push(trade);
    //     return false;
    //   }
    //   return true;
    // });
    // open new long position
    // for now: only open position if there are no open positions already
    if (!newPositions.length) {
      newPositions.push(newPosition);
    }

    return { openPositions: newPositions, trades: newTrades };
  }
  if (signal === Signal.SELLSHORT) {
    // close open positions
    const { finalizedTrades, openPositionsLeft } = closePositionsUtil({
      openPositions,
      exitPosition: newPosition,
      closeLongPositions: true,
    });
    newPositions = [...openPositionsLeft];
    newTrades = [...newTrades, ...finalizedTrades];

    // open new short position
    // for now: only open position if there are no open positions already
    if (!newPositions.length) {
      newPositions.push(newPosition);
    }

    return { openPositions: newPositions, trades: newTrades };
  }
  if (signal === Signal.BUYTOCOVER) {
    // close short positions
    const { finalizedTrades, openPositionsLeft } = closePositionsUtil({
      openPositions,
      exitPosition: newPosition,
      closeLongPositions: false,
    });
    newPositions = [...openPositionsLeft];
    newTrades = [...newTrades, ...finalizedTrades];

    return { openPositions: newPositions, trades: newTrades };
  }
  if (signal === Signal.SELL) {
    // close long positions
    const { finalizedTrades, openPositionsLeft } = closePositionsUtil({
      openPositions,
      exitPosition: newPosition,
      closeLongPositions: true,
    });
    newPositions = [...openPositionsLeft];
    newTrades = [...newTrades, ...finalizedTrades];

    return { openPositions: newPositions, trades: newTrades };
  }
  // if HOLD
  return { trades, openPositions };
};
