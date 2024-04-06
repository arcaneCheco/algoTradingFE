import { CandlestickGranularity } from "@lt_surge/algo-trading-shared-types";
import { getCandles, getCandlesBigData } from "@src/api";
import useStore, { DataParamSMA, IStrategy, Store } from "@src/store";
import {
  Candle,
  IISetup,
  OpenTrade,
  PositionStatus,
  SetupParam,
  Signal,
  Trade,
} from "@src/types/types";
import { sma } from "@src/utils";

const Description = `
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

const setup: IISetup = {
  instrument: {
    use: true,
    optional: false,
    control: false,
  },
  startTime: {
    use: true,
    optional: false,
    control: false,
  },
  endTime: {
    use: true,
    optional: false,
    control: false,
  },
  granularity: {
    use: true,
    optional: false,
    control: false,
  },
  smaPeriod: {
    use: true,
    optional: false,
    control: true,
  },
  stopLoss: {
    use: true,
    optional: true,
    control: true,
  },
};

interface Args {
  candles: Array<Candle>;
  smaSeries: Array<number>;
  buyRange: number;
  stopLoss?: number;
  profitTarget?: number;
  units: number;
}

const strategy = ({
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
        if (c < openTrade!.stopLossPrice) {
          console.log("TRIGGER LONG");
          closePosition = true;
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
        if (c > openTrade!.stopLossPrice) {
          console.log("TRIGGER SHORT");
          closePosition = true;
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
      positionStatus = signal === "BUY" ? "LONG" : "SHORT";
      const stopLossDistance = ((stopLoss || 10000) / 100) * c;
      let stopLossPrice = c;
      if (positionStatus === "LONG") {
        stopLossPrice -= stopLossDistance;
      } else {
        stopLossPrice += stopLossDistance;
      }
      // console.log({ price: c, stopLossPrice });
      openTrade = {
        time: candle.time,
        price: c,
        signal,
        holdingPeriod: 0,
        stopLossPrice,
      };
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

  const openTrades: Array<OpenTrade> = [];
  if (openTrade) {
    openTrades.push(openTrade);
  }

  return { trades, transactions, openTrades };
};

const runBatchTest = async () => {
  const store = useStore.getState();
  const {
    instrument,
    startTime,
    endTime,
    granularity,
    smaPeriod,
    controlParam,
    activeParams,
    stopLoss,
  } = store;
  console.log(store);
  console.log({ instrument, startTime, endTime, granularity });
  const candleData = await getCandlesBigData({
    instrument,
    params: {
      from: startTime,
      to: endTime,
      granularity,
    },
  });

  if (!controlParam) {
    const additionalData = await getCandles({
      instrument,
      params: {
        to: startTime,
        count: `${smaPeriod.value}`,
        granularity,
      },
    });
    additionalData.pop();

    console.log({ is: activeParams.stopLoss, stopLoss: stopLoss.value });

    const res = strategy({
      candles: candleData,
      smaSeries: sma([...additionalData, ...candleData], smaPeriod.value),
      buyRange: 0.2,
      units: 1000,
      stopLoss: activeParams.stopLoss ? stopLoss.value : undefined,
    });

    const results = [{ ...res, controlParam: 0 }];

    // return results;
    store.setResults(results);
  }

  if (controlParam === "smaPeriod") {
    const additionalData = await getCandles({
      instrument,
      params: {
        to: startTime,
        count: `${smaPeriod.maxValue}`,
        granularity,
      },
    });
    additionalData.pop();

    const results = [];

    for (
      let i = smaPeriod.minValue;
      i <= smaPeriod.maxValue;
      i += smaPeriod.stepSize
    ) {
      const smaSeries = sma(
        [...additionalData.slice(-(i - 1)), ...candleData],
        i
      );
      const { trades, transactions, openTrades } = strategy({
        candles: candleData,
        smaSeries: smaSeries,
        buyRange: 0.2,
        units: 1000,
      });
      results.push({ trades, transactions, openTrades, controlParam: i });
    }

    // return results;
    store.setResults(results);
  }

  if (controlParam === "stopLoss") {
    const additionalData = await getCandles({
      instrument,
      params: {
        to: startTime,
        count: `${smaPeriod.value}`,
        granularity,
      },
    });
    additionalData.pop();

    const smaSeries = sma([...additionalData, ...candleData], smaPeriod.value);

    const results = [];

    for (
      let i = stopLoss.minValue;
      i <= stopLoss.maxValue;
      i += stopLoss.stepSize
    ) {
      const { trades, transactions, openTrades } = strategy({
        candles: candleData,
        smaSeries: smaSeries,
        buyRange: 0.2,
        units: 1000,
        stopLoss: i,
      });
      results.push({ trades, transactions, openTrades, controlParam: i });
    }

    // return results;
    store.setResults(results);
  }
};

export const meanReversion_A: IStrategy = {
  setup,
  description: Description,
  func: strategy,
  runBatchTest,
};
