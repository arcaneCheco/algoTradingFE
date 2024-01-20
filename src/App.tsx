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
  getCandles,
} from "@src/utils";
import { myStrategy } from "./myStrategy";
import {
  CandlePlot,
  PerformanceSummaryTable,
  DrawdownPlot,
  EquityPlot,
  CandlestickPlotForm,
  Indicators,
} from "@src/components";
import { useMyStore } from "./store";
import { CandlestickGranularity } from "@lt_surge/algo-trading-shared-types";

// pro-tip: lower spreads when entering trade trade 10 minutes before close or 90 minutes after new open

// function formatDate(date, delimiter = "/") {
//   var d = new Date(date),
//     month = "" + (d.getMonth() + 1),
//     day = "" + d.getDate(),
//     year = d.getFullYear();

//   if (month.length < 2) month = "0" + month;
//   if (day.length < 2) day = "0" + day;

//   return [year, month, day].join(delimiter);
// }

export const App = () => {
  // const [candles, setCandles] = useState<Array<CandleWithSMA>>([]);
  const [trades, setTrades] = useState<Array<Trade>>([]);
  const [performanceSummaryData, setPerformanceSummaryData] =
    useState<PerformanceSummary>({} as PerformanceSummary);
  const [drawdownData, setDrawdownData] = useState<Array<number>>([]);
  const [equityData, setEquityData] = useState<Array<number>>([]);
  useEffect(() => {
    // let data = sma(set1.slice(1000), 50);
    // let data = sma(set1.slice(2289), 50);
    // let data = sma(set1.slice(2459), 30);
    // let data = sma(set2.slice(2459), 30);
    // setCandles(data);
    // console.log(data);
    // const res = backtest(myStrategy, data);
    // setTrades(res.trades);
    // console.log(res.trades);
    // const performance = getPerformanceSummary(10000, res.trades);
    // setPerformanceSummaryData(performance);
    // const drawdRes = computeDrawdown(10000, res.trades);
    // setDrawdownData(drawdRes);
    // console.log(drawdRes);
    // const equityRes = computeEquity(10000, res.trades);
    // setEquityData(equityRes);
    // console.log(equityRes);
  }, []);

  return (
    <Wrapper>
      <CandlestickPlotForm />
      <CandlePlot trades={[]} />
      <Indicators />
      {/* <PerformanceSummaryTable performanceData={performanceSummaryData} />
      <EquityPlot data={equityData} />
      <DrawdownPlot data={drawdownData} /> */}
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
