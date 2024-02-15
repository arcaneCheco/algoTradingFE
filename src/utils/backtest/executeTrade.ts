import {
  Candle,
  OpenTrade,
  PositionStatus,
  Signal,
  Trade,
} from "@src/types/types";
import { finalizePosition } from "./finalizePosition";

const closePositionsUtil = ({
  openPositions,
  exitPosition,
  closeLongPositions,
}: {
  openPositions: Array<OpenTrade>;
  exitPosition: OpenTrade;
  closeLongPositions: boolean;
}) => {
  const finalizedTrades: Array<Trade> = [];
  const openPositionsLeft = openPositions.filter((openPosition) => {
    if (openPosition.signal === (closeLongPositions ? "BUY" : "SELLSHORT")) {
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
  openTrades,
  currentPosition,
  candle,
}: {
  signal: Signal;
  trades: Array<Trade>;
  openTrades: Array<OpenTrade>;
  currentPosition: PositionStatus;
  candle: Candle;
}): {
  trades: Array<Trade>;
  openTrades: Array<OpenTrade>;
  currentPosition: PositionStatus;
} => {
  const { c, time } = candle;
  const newPosition: OpenTrade = {
    signal,
    time,
    price: c,
  };

  let newPositions: Array<OpenTrade> = [];
  let newTrades = [...trades];

  if (signal === "BUY") {
    // cover short positions
    const { finalizedTrades, openPositionsLeft } = closePositionsUtil({
      openPositions,
      exitPosition: newPosition,
      closeLongPositions: false,
    });
    newPositions = [...openPositionsLeft];
    newTrades = [...newTrades, ...finalizedTrades];
    // open new long position
    // for now: only open position if there are no open positions already
    if (!newPositions.length) {
      newPositions.push(newPosition);
    }

    return { openPositions: newPositions, trades: newTrades };
  }
  if (signal === "SELLSHORT") {
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
  if (signal === "BUYTOCOVER") {
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
  if (signal === "SELL") {
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
  return { trades, openTrades: openPositions, currentPosition: "NONE" };
};
