import { Candle, CandleWithSMA } from "./types/types";

export const sma = (
  candles: Array<Candle>,
  period: number
): Array<CandleWithSMA> => {
  return candles
    .map((candle, index, array) => {
      if (index < period - 1) {
        return null;
      }
      const periodSet = array.slice(index - (period - 1), index + 1);
      const sma = periodSet.reduce((acc, { c }) => acc + c, 0) / period;
      return { ...candle, sma };
    })
    .slice(period - 1) as Array<CandleWithSMA>;
};
