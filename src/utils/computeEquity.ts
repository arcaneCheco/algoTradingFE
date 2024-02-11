import { Trade } from "@src/types/types";

export const computeEquity = (
  startingCapital: number,
  trades: Array<Trade>
) => {
  const equityCurve = [startingCapital];
  let workingCapital = startingCapital;
  for (const trade of trades) {
    workingCapital *= trade.growth;
    equityCurve.push(workingCapital);
  }
  return equityCurve;
};

// export const computeEquity2 = (trades)

// create actions log
// account id, time, action, reason etc..
