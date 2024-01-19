import { Signal } from "types/types";

export const profitTarget = (
  entryPrice: number,
  closingPrice: number,
  profitDistancePct: number
) => {
  const profitDistance = profitDistancePct / 100;
  if (closingPrice >= entryPrice * (1 + profitDistance)) {
    return Signal.SELL;
  }
  if (closingPrice <= entryPrice * (1 - profitDistance)) {
    return Signal.BUYTOCOVER;
  }
  return null;
};
