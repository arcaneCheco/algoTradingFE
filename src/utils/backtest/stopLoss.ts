import { Signal } from "@src/types/types";

export const stopLoss = (
  entryPrice: number,
  closingPrice: number,
  stopDistancePct: number
) => {
  const stopDistance = stopDistancePct / 100;
  if (closingPrice <= entryPrice * (1 - stopDistance)) {
    return Signal.SELL;
  }
  if (closingPrice >= entryPrice * (1 + stopDistance)) {
    return Signal.BUYTOCOVER;
  }
  return null;
};
