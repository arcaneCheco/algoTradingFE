import { ICandles } from "@lt_surge/algo-trading-shared-types";

const baseLink = "http://localhost:3000";

export const getCandles = async (args: ICandles) => {
  const data = await fetch(`${baseLink}/candles`, {
    method: "POST",
    body: JSON.stringify(args),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const res = await data.json();
  return res;
};
