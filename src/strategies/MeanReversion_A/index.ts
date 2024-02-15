import {
  Candle,
  OpenTrade,
  PositionStatus,
  Signal,
  Trade,
} from "@src/types/types";

export const Description = `
    Indicators:
        1. SIMPLE MOVING AVERAGE (SMA)
    PARAMETERS:
        1. BUY_RANGE
        2. STOP_LOSS (OPTIONAL)
        3. PROFIT_TARGET (OPTIONAL)
        4. UNITS
    Entry Criteria:
        1. BUY
            - close is below SMA
            - close in in bottom BUY_RANGE% of the candle
        2. SHORT
            - close is above SMA
            - close in in upper BUY_RANGE% of the candle
    Exit Criteria:
        1. SELL
            - close is above SMA
        2. BUY_TO_COVER
            - close is below SMA
        3. STOP_LOSS
        4. PROFIT_TARGET
    Approach:
        - SINGLE_TRADE_ENTRY
        - FIXED_POSITION_SIZE
`;
interface Args {
  candles: Array<Candle>;
  smaSeries: Array<number>;
  buyRange: number;
  stopLoss?: number;
  profitTarget?: number;
  units: number;
}

export const meanReversion_A = ({
  candles,
  smaSeries,
  buyRange,
  stopLoss,
  profitTarget,
  units,
}: Args) => {
  if (candles.length !== smaSeries.length) {
    throw new Error("data and sma-series don't line up");
  }
  let positionStatus: PositionStatus = "NONE";
  let signal: Signal = "HOLD";
  const trades: Array<Trade> = [];
  const transactions: Array<any> = [];
  let openTrade: OpenTrade | null = null;

  candles.forEach((candle, index) => {
    const { c, l, h } = candle;
    const range = h - l;
    const sma = smaSeries[index];

    if (c < sma && c - l < buyRange * range) {
      signal = "BUY";
    } else if (c > sma && h - c < buyRange * range) {
      signal = "SELLSHORT";
    } else if (c > sma) {
      signal = "SELL";
    } else if (c < sma) {
      signal = "BUYTOCOVER";
    }

    let closePosition = false;
    let openNewPosition = false;
    let isReversal = false;

    switch (positionStatus) {
      case "LONG":
        if (signal === "SELL" || signal === "SELLSHORT") {
          closePosition = true;
          if (signal === "SELLSHORT") {
            openNewPosition = true;
            isReversal = true;
          }
        }
        break;
      case "SHORT":
        if (signal === "BUY" || signal === "BUYTOCOVER") {
          closePosition = true;
          if (signal === "BUY") {
            openNewPosition = true;
            isReversal = true;
          }
        }
        break;
      case "NONE":
        if (signal === "BUY" || signal === "SELLSHORT") {
          openNewPosition = true;
        }
        break;
      default:
        break;
    }

    if (openTrade) {
      openTrade.holdingPeriod++;
    }

    if (closePosition) {
      if (!openTrade) {
        throw new Error("Expected open position");
      }
      const closedTrade: Trade = {
        entryTime: openTrade.time,
        entryPrice: openTrade.price,
        entrySignal: openTrade.signal,
        holdingPeriod: openTrade.holdingPeriod,
        exitTime: candle.time,
        exitPrice: c,
        exitSignal: signal,
        profitLoss:
          positionStatus === "LONG"
            ? (c - openTrade.price) * units
            : (openTrade.price - c) * units,
        units,
      };
      trades.push(closedTrade);
      openTrade = null;
      positionStatus = "NONE";
    }

    if (openNewPosition) {
      openTrade = {
        time: candle.time,
        price: c,
        signal,
        holdingPeriod: 0,
      };
      positionStatus = signal === "BUY" ? "LONG" : "SHORT";
    }

    const isTransaction = closePosition || openNewPosition;
    if (isTransaction) {
      let positionSize = openTrade ? units : 0;
      let transactionUnits = units;
      if (isReversal) {
        transactionUnits += units;
      }
      if (signal === "SELL" || signal === "SELLSHORT") {
        transactionUnits *= -1;
        positionSize *= -1;
      }
      transactions.push({
        time: candle.time,
        units: transactionUnits,
        price: c,
        positionSize,
      });
    }
  });

  return { trades, transactions };
};
