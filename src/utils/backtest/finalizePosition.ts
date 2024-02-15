import { OpenTrade, Trade } from "@src/types/types";

export const finalizePosition = (
  entryPosition: OpenTrade,
  exitPosition: OpenTrade
) => {
  const {
    time: entryTime,
    price: entryPrice,
    signal: entrySignal,
  } = entryPosition;
  const { time: exitTime, price: exitPrice, signal: exitSignal } = exitPosition;

  const profitLoss =
    entrySignal === "BUY"
      ? parseFloat((exitPrice - entryPrice).toFixed(5))
      : parseFloat((entryPrice - exitPrice).toFixed(5));

  const profitPct = ((profitLoss / entryPrice) * 100).toFixed(3) + "%";

  let holdingPeriod;
  const holdingHours = Math.round(
    (new Date(exitTime).getTime() - new Date(entryTime).getTime()) /
      (1000 * 60 * 60)
  );
  if (holdingHours <= 24) {
    holdingPeriod = holdingHours + "hours";
  } else {
    holdingPeriod = `${Math.floor(holdingHours / 24)} days and ${
      holdingHours % 24
    } hours`;
  }

  const growth =
    entrySignal === "BUY" ? exitPrice / entryPrice : entryPrice / exitPrice;

  /**SPREADS */
  // on web app:
  // buy: 1.08810, sell: 1.08800, => BUY 50units, spread: -0.002
  // buy: 1.08804, sell: 1.08794, => CLOSE, profit: -0.01, spread: -0.002

  // let spreadCosts = 0;

  // if (includeSpreads) {
  //   if (entrySignal === Signal.BUY) {
  //     spreadCosts += entryAskPrice - entryPrice;
  //     spreadCosts += exitPrice - exitBidPrice;
  //   }
  //   if (entrySignal === Signal.SELLSHORT) {
  //     spreadCosts += entryPrice - entryBidPrice;
  //     spreadCosts += exitAskPrice - exitPrice;
  //   }
  // }

  const trade: Trade = {
    entryTime,
    entryPrice,
    entrySignal,
    exitTime,
    exitPrice: exitPrice,
    exitSignal: exitSignal,
    profitLoss,
    profitPct,
    holdingPeriod,
    growth,
  };

  return trade;
};
