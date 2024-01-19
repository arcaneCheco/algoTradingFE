import {
  Candle,
  CandleWithSMA,
  CandleWithSpread,
  CandleWithSpreadAndSMA,
} from "./types/types";

export const sma = (
  candles: Array<CandleWithSpread>,
  period: number,
  places = 5
) => {
  return candles
    .map((candle, index, array) => {
      if (index < period - 1) {
        return null;
      }
      const periodSet = array.slice(index - (period - 1), index + 1);
      const sma = parseFloat(
        (periodSet.reduce((acc, { c }) => acc + c, 0) / period).toFixed(places)
      );
      return { ...candle, sma };
    })
    .slice(period - 1) as Array<CandleWithSpreadAndSMA>;
};
