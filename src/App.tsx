import { useEffect, useState } from "react";
import styled from "styled-components";
import {
  subDays,
  subHours,
  subMinutes,
  subWeeks,
  subMonths,
  formatRFC3339,
  format,
} from "date-fns";
import {
  PricingComponent,
  CandlestickGranularity,
  CandleWithSMA,
  Trade,
  Signal,
  PerformanceSummary,
} from "@src/types/types";
import { set1, set2 } from "@src/testdata";
import {
  sma,
  backtest,
  computeDrawdown,
  computeEquity,
  getPerformanceSummary,
} from "@src/utils";
import { myStrategy } from "./myStrategy";
import {
  CandlePlot,
  PerformanceSummaryTable,
  DrawdownPlot,
  EquityPlot,
} from "@src/components";

// TO-DO: STOP-LOSS, PROFIT-TARGET, SPREAD-COST,
// TO-DO: AREA-GRAPHS, STAART AT 0, not 1

// pro-tip: lower spreads when entering trade trade 10 minutes before close or 90 minutes after new open

// type CandlesQueryParams = {
//   count?: number;
//   price?: PricingComponent;
//   from?: string;
//   to?: string;
//   granularity?: CandlestickGranularity;
//   dailyAlignment?: number;
//   alignmentTimezone?: string;
// }

// const assembleQueryString = (queryParams: {[key:string]: string | number | undefined}) => {
//   let isFirst = true;
//   return Object.entries(queryParams).reduce((acc, [key, value]) => {
//     let delimiter = ''
//     if (isFirst) {
//         isFirst=false;
//       } else {
//       delimiter = '&';
//     }
//     return acc + delimiter + `${key}=${value}`
//   }, '?')
// }

// const baseLink = 'http://localhost:3000';

// const getCandles =  async (instrument: string, queryParams: CandlesQueryParams) => {
//   const query = assembleQueryString(queryParams);
//   const data = await fetch(
//     `${baseLink}/instruments/${instrument}/candles${query}`
//   );
//   const res = await data.json();
//   return res;
// };

// getCandles('EUR_USD', {count: 100, price: 'M', from: '2017-01-01T00:00:00Z', granularity: 'M5' })

// function formatDate(date, delimiter = "/") {
//   var d = new Date(date),
//     month = "" + (d.getMonth() + 1),
//     day = "" + d.getDate(),
//     year = d.getFullYear();

//   if (month.length < 2) month = "0" + month;
//   if (day.length < 2) day = "0" + day;

//   return [year, month, day].join(delimiter);
// }

// const getMAData = (data, period, plotDataArgs) => {
//   // 5 day average
//   // if (data.length - period < 0) return;
//   // const end = plotDataArgs.start;
//   // console.log({ end, h: new Date(end), period });
//   // const start = subDays(end, period);
//   // console.log({ start, s: formatDate(start, "-") });

//   // getPlotData({ ...plotDataArgs, end: plotDataArgs.start, start }).then(
//   //   (res) => {
//   //     console.log({ res });
//   //   }
//   // );
//   // const prevData = await getPlotData({...plotDataArgs, end: plotDataArgs.start, start: })

//   const t = data.map((entry, i, array) => {
//     if (i < period - 1) {
//       return null;
//     }
//     const periodSet = array.slice(i - (period - 1), i + 1);
//     return {
//       val:
//         periodSet
//           .map((e) => e.ClosePrice)
//           .reduce((acc, current) => acc + current) / period,
//       // timestamp: entry.Timestamp,
//     };
//   });
//   return t;
// };

export const App = () => {
  // useEffect(() => {
  //   const t = async () => {
  //     const t = await getCandles('EUR_USD', {
  //       count: 100,
  //       price: PricingComponent.M,
  //       from: '2017-01-01T00:00:00Z',
  //       granularity: CandlestickGranularity.D,
  //       dailyAlignment: 17,
  //       alignmentTimezone: 'America/New_York'
  //      });
  //     console.log(t);
  //   };
  //   t()
  // }, [])

  const [candles, setCandles] = useState<Array<CandleWithSMA>>([]);
  const [trades, setTrades] = useState<Array<Trade>>([]);
  const [performanceSummaryData, setPerformanceSummaryData] =
    useState<PerformanceSummary>({} as PerformanceSummary);
  const [drawdownData, setDrawdownData] = useState<Array<number>>([]);
  const [equityData, setEquityData] = useState<Array<number>>([]);
  useEffect(() => {
    // let data = sma(set1.slice(1000), 50);
    // let data = sma(set1.slice(2289), 50);
    // let data = sma(set1.slice(2459), 30);
    let data = sma(set2.slice(2459), 30);
    setCandles(data);
    console.log(data);

    const res = backtest(myStrategy, data);
    setTrades(res.trades);
    console.log(res.trades);

    const performance = getPerformanceSummary(10000, res.trades);
    setPerformanceSummaryData(performance);

    const drawdRes = computeDrawdown(10000, res.trades);
    setDrawdownData(drawdRes);
    console.log(drawdRes);

    const equityRes = computeEquity(10000, res.trades);
    setEquityData(equityRes);
    console.log(equityRes);
  }, []);

  return (
    <Wrapper>
      <CandlePlot candles={candles} trades={trades} />
      <PerformanceSummaryTable performanceData={performanceSummaryData} />
      <EquityPlot data={equityData} />
      <DrawdownPlot data={drawdownData} />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  border: 1px solid black;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 15px;
`;
