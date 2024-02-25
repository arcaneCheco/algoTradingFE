import {
  ICandles,
  IGetTrades,
  IGetTransactionsSinceID,
} from "@lt_surge/algo-trading-shared-types";
import { assembleQueryString } from "@src/utils";
import dotenv from "dotenv";
// import got from "got";

dotenv.config();

const baseUrl = process.env.BASE_URL_REST;
const apiKey = process.env.OANDA_API_KEY;
const testID = process.env.TEST_ACCOUNT_ID!;

const defaultOptions = {
  headers: {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  },
};

const granularityToSeconds: Record<any, number> = {
  H1: 60 * 60,
  H2: 2 * 60 * 60,
  H4: 4 * 60 * 60,
  H8: 8 * 60 * 60,
  H12: 12 * 60 * 60,
  D: 24 * 60 * 60,
};

export const getCandlesBigData = async (
  { instrument, params }: ICandles,
  currentData: Array<any> = [],
  first: boolean = true
): Promise<any> => {
  let finalTo = new Date(params.to!).getTime();
  let currentTo =
    new Date(params.from!).getTime() +
    5000 * 1000 * granularityToSeconds[params.granularity!];
  let final = false;
  if (currentTo > finalTo) {
    currentTo = finalTo;
    final = true;
  }

  const candleSegment = await getCandles({
    instrument,
    params: {
      ...params,
      to: new Date(currentTo).toISOString(),
      includeFirst: first,
    },
  });

  const candles = [...currentData, ...candleSegment];

  if (final) {
    return candles;
  } else {
    return await getCandlesBigData(
      {
        instrument,
        params: { ...params, from: new Date(currentTo).toISOString() },
      },
      candles,
      false
    );
  }
};

export const getCandles = async ({ instrument, params }: ICandles) => {
  try {
    const queryString = assembleQueryString(params);
    const url = `${baseUrl}/v3/instruments/${instrument}/candles${queryString}`;
    // const response = await got(url, defaultOptions);
    const response = await fetch(url, {
      method: "GET",
      headers: defaultOptions.headers,
    });
    const data = await response.json();

    if (data.errorMessage) {
      throw new Error(data.errorMessage);
    }

    console.log({ data });
    // return data;
    const candles = data.candles.map(({ time, mid }: any) => ({
      o: Number(mid.o),
      h: Number(mid.h),
      l: Number(mid.l),
      c: Number(mid.c),
      time,
    }));

    return candles;
  } catch (error) {
    console.log({ error });
    return [];
  }
};

export const getTrades = async ({ id, params }: IGetTrades) => {
  id = testID;
  const queryString = assembleQueryString(params);
  const url = `${baseUrl}/v3/accounts/${id}/trades${queryString}`;
  const response = await fetch(url, {
    method: "GET",
    headers: defaultOptions.headers,
  });

  const data = await response.json();

  return data;
};

export const getTransactionsSinceID = async ({
  id,
  params,
}: IGetTransactionsSinceID) => {
  id = testID;
  const queryString = assembleQueryString(params);
  const url = `${baseUrl}/v3/accounts/${id}/transactions/sinceid${queryString}`;
  const response = await fetch(url, {
    method: "GET",
    headers: defaultOptions.headers,
  });

  const data = await response.json();

  return data;
};
