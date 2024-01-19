import { Trade } from "@src/types/types";

// TO-DO: INCLUDE OPEN POSITIONS

export const computeDrawdown = (
  startingCapital: number,
  trades: Array<Trade>
) => {
  const drawdown = [0];
  let workingCapital = startingCapital;
  let peakCapital = startingCapital;
  let workingDrawdown = 0;
  for (const trade of trades) {
    workingCapital *= trade.growth;
    if (workingCapital < peakCapital) {
      workingDrawdown = workingCapital - peakCapital;
    } else {
      peakCapital = workingCapital;
      workingDrawdown = 0; // Reset at the peak.
    }
    drawdown.push(workingDrawdown);
  }
  return drawdown;
};
