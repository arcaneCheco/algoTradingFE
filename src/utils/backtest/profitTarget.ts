import { Signal } from "@src/types/types";

export const profitTarget = (
  entryPrice: number,
  closingPrice: number,
  profitDistancePct: number
): Signal | null => {
  const profitDistance = profitDistancePct / 100;
  if (closingPrice >= entryPrice * (1 + profitDistance)) {
    return "SELL";
  }
  if (closingPrice <= entryPrice * (1 - profitDistance)) {
    return "BUYTOCOVER";
  }
  return null;
};
