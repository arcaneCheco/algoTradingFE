import { Signal, Strategy } from "./types/types";

// https://www.youtube.com/watch?v=jAI6s1WuEus&ab_channel=TheTransparentTrader

export const myStrategy: Strategy = (candle) => {
  const { c, sma, h, l } = candle;
  const range = h - l;
  // ENTRY
  if (c < sma && c - l < 0.2 * range) {
    return Signal.BUY;
  }
  if (c > sma && h - c < 0.2 * range) {
    return Signal.SELLSHORT;
  }
  // EXIT
  if (c > sma) {
    return Signal.SELL;
  }
  if (c < sma) {
    return Signal.BUYTOCOVER;
  }
  // HOLD
  return Signal.HOLD;
};
