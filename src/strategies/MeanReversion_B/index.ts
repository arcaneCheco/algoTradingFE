import { IStrategy } from "@src/store";
import {
  BacktestResultWithControlParam,
  Candle,
  IISetup,
  OpenTrade,
  PositionStatus,
  Signal,
  Trade,
} from "@src/types/types";
import useStore from "@src/store";
import { getCandles, getCandlesBigData } from "@src/api";
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
          - FIXED_POSITION_SIZE
          - CLOSE ALL TRAAES ON EXIT/REVERSE
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
  let openTrades: Array<OpenTrade> = [];

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

    let closeOpenTrades = false;
    let openNewTrade = false;

    switch (positionStatus) {
      case "LONG":
        if (signal === "BUY") {
          openNewTrade = true;
        }
        if (signal === "SELL") {
          closeOpenTrades = true;
        }
        if (signal === "SELLSHORT") {
          closeOpenTrades = true;
          openNewTrade = true;
        }
        break;
      case "SHORT":
        if (signal === "SELLSHORT") {
          openNewTrade = true;
        }
        if (signal === "BUYTOCOVER") {
          closeOpenTrades = true;
        }
        if (signal === "BUY") {
          closeOpenTrades = true;
          openNewTrade = true;
        }
      case "NONE":
        if (signal === "BUY" || signal === "SELLSHORT") {
          openNewTrade = true;
        }
      default:
        break;
    }

    if (openTrades.length) {
      openTrades.forEach((openTrade) => {
        openTrade.holdingPeriod++;
      });
    }

    let currentUnits = openTrades.length * units;
    if (positionStatus === "SHORT") {
      currentUnits *= -1;
    }

    if (closeOpenTrades) {
      if (!openTrades.length) {
        throw new Error("Expected open position");
      }
      openTrades.forEach((openTrade) => {
        const profitLoss =
          positionStatus === "LONG"
            ? (c - openTrade.price) * units
            : (openTrade.price - c) * units;

        const closedTrade: Trade = {
          entryTime: openTrade.time,
          entryPrice: openTrade.price,
          entrySignal: openTrade.signal,
          holdingPeriod: openTrade.holdingPeriod,
          exitTime: candle.time,
          exitPrice: c,
          exitSignal: signal,
          profitLoss,
          units,
        };
        trades.push(closedTrade);
      });
      openTrades = [];
      positionStatus = "NONE";
    }

    if (openNewTrade) {
      positionStatus = signal === "BUY" ? "LONG" : "SHORT";
      const stopLossDistance = ((stopLoss || 10000) / 100) * c;
      let stopLossPrice = c;
      if (positionStatus === "LONG") {
        stopLossPrice -= stopLossDistance;
      } else {
        stopLossPrice += stopLossDistance;
      }
      const newTrade = {
        time: candle.time,
        price: c,
        signal,
        holdingPeriod: 0,
        stopLossPrice,
        units,
      };
      openTrades.push(newTrade);
    }

    const isTransaction = closeOpenTrades || openNewTrade;
    if (isTransaction) {
      let positionSize = openTrades.length * units;
      if (positionStatus === "SHORT") {
        positionSize *= -1;
      }
      const transactionUnits = positionSize - currentUnits;

      transactions.push({
        time: candle.time,
        units: transactionUnits,
        price: c,
        positionSize,
      });
    }
  });

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
    candles,
  } = store;

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

    const smaSeriess = sma([...additionalData, ...candles], smaPeriod.value);

    const res = strategy({
      candles: candles,
      smaSeries: smaSeriess,
      buyRange: 0.2,
      units: 1000,
      stopLoss: activeParams.stopLoss ? stopLoss.value : undefined,
    });

    const results: Array<BacktestResultWithControlParam> = [
      { ...res, controlParam: 0, additionalData: { smaSeries: smaSeriess } },
    ];

    console.log({
      results,
      maxInvested: Math.max(...res.transactions.map((t) => t.positionSize)),
    });

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

    const results: Array<BacktestResultWithControlParam> = [];

    for (
      let i = smaPeriod.minValue;
      i <= smaPeriod.maxValue;
      i += smaPeriod.stepSize
    ) {
      const smaSeries = sma([...additionalData.slice(-(i - 1)), ...candles], i);
      const { trades, transactions, openTrades } = strategy({
        candles: candles,
        smaSeries: smaSeries,
        buyRange: 0.2,
        units: 1000,
      });
      results.push({
        trades,
        transactions,
        openTrades,
        controlParam: i,
        additionalData: { smaSeries },
      });
    }

    // return results;
    store.setResults(results);
  }

  // if (controlParam === "smaPeriod") {
  //   const additionalData = await getCandles({
  //     instrument,
  //     params: {
  //       to: startTime,
  //       count: `${smaPeriod.maxValue}`,
  //       granularity,
  //     },
  //   });
  //   additionalData.pop();

  //   const results = [];

  //   for (
  //     let i = smaPeriod.minValue;
  //     i <= smaPeriod.maxValue;
  //     i += smaPeriod.stepSize
  //   ) {
  //     const smaSeries = sma(
  //       [...additionalData.slice(-(i - 1)), ...candleData],
  //       i
  //     );
  //     const { trades, transactions } = strategy({
  //       candles: candleData,
  //       smaSeries: smaSeries,
  //       buyRange: 0.2,
  //       units: 1000,
  //     });
  //     results.push({ trades, transactions, controlParam: i });
  //   }

  //   // return results;
  //   store.setResults(results);
  // }

  // if (controlParam === "stopLoss") {
  //   const additionalData = await getCandles({
  //     instrument,
  //     params: {
  //       to: startTime,
  //       count: `${smaPeriod.value}`,
  //       granularity,
  //     },
  //   });
  //   additionalData.pop();

  //   const smaSeries = sma([...additionalData, ...candleData], smaPeriod.value);

  //   const results = [];

  //   for (
  //     let i = stopLoss.minValue;
  //     i <= stopLoss.maxValue;
  //     i += stopLoss.stepSize
  //   ) {
  //     const { trades, transactions } = strategy({
  //       candles: candleData,
  //       smaSeries: smaSeries,
  //       buyRange: 0.2,
  //       units: 1000,
  //       stopLoss: i,
  //     });
  //     results.push({ trades, transactions, controlParam: i });
  //   }

  //   // return results;
  //   store.setResults(results);
  // }
};

export const meanReversion_B: IStrategy = {
  setup,
  description: Description,
  func: strategy,
  runBatchTest,
};
