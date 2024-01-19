import { formatDistance } from "date-fns";
import { OpenPosition, Signal, Trade } from "types/types";

export const finalizePosition = (
  entryPosition: OpenPosition,
  exitPosition: OpenPosition
) => {
  const {
    time: entryTime,
    price: entryPrice,
    signal: entrySignal,
    askPrice: entryAskPrice,
    bidPrice: entryBidPrice,
  } = entryPosition;
  const {
    time: exitTime,
    price: exitPrice,
    signal: exitSignal,
    askPrice: exitAskPrice,
    bidPrice: exitBidPrice,
  } = exitPosition;

  // let exitPriceReal = exitPrice;
  // if (includeSpreads) {
  //   if (exitSignal === Signal.BUY || exitSignal === Signal.BUYTOCOVER) {
  //     exitPriceReal = askPrice;
  //   }
  //   if (exitSignal === Signal.SELL || exitSignal === Signal.SELLSHORT) {
  //     exitPriceReal = bidPrice;
  //   }
  // }

  const profitLoss =
    entrySignal === Signal.BUY
      ? parseFloat((exitPrice - entryPrice).toFixed(5))
      : parseFloat((entryPrice - exitPrice).toFixed(5));

  const profitPct = ((profitLoss / entryPrice) * 100).toFixed(3) + "%";

  const holdingPeriod = formatDistance(entryTime, exitTime);

  const growth =
    entrySignal === Signal.BUY
      ? exitPrice / entryPrice
      : entryPrice / exitPrice;

  /**SPREADS */
  // on web app:
  // buy: 1.08810, sell: 1.08800, => BUY 50units, spread: -0.002
  // buy: 1.08804, sell: 1.08794, => CLOSE, profit: -0.01, spread: -0.002

  // let spreadCostOnEntry, spreadCostOnExit, totalSpreadCost;

  let spreadCosts = 0;

  if (entrySignal === Signal.BUY) {
    spreadCosts += entryAskPrice - entryPrice;
    spreadCosts += exitPrice - exitBidPrice;
  }
  if (entrySignal === Signal.SELLSHORT) {
    spreadCosts += entryPrice - entryBidPrice;
    spreadCosts += exitAskPrice - exitPrice;
  }

  // const spreadCostOnEntry = entrySignal === Signal.BUY ? entryAskPrice - entryPrice  : entryPrice - entryBidPrice;
  // const spreadCostOnExit = ex === Signal.BUY ? entryAskPrice - entryPrice  : entryPrice - entryBidPrice;

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
    spreadCosts,
  };

  return trade;
};
