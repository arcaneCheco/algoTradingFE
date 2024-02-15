import { Signal } from "@src/types/types";

export const stopLoss = (
  entryPrice: number,
  closingPrice: number,
  stopDistancePct: number
): Signal | null => {
  const stopDistance = stopDistancePct / 100;
  if (closingPrice <= entryPrice * (1 - stopDistance)) {
    return "SELL";
  }
  if (closingPrice >= entryPrice * (1 + stopDistance)) {
    return "BUYTOCOVER";
  }
  return null;
};
