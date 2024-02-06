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
