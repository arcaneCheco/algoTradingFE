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
import { set1, set2 } from "@src/testdata";
import {
  CandlePlot,
  PerformanceSummaryTable,
  DrawdownPlot,
  EquityPlot,
  CandlestickPlotForm,
  Indicators,
} from "@src/components";
// import { useMyStore } from "./store";
// import { CandlestickGranularity } from "@lt_surge/algo-trading-shared-types";
// import { BacktestSetup } from "./components/BacktestSetup";
// import { getCandles } from "./api";

// pro-tip: lower spreads when entering trade trade 10 minutes before close or 90 minutes after new open

export const App = () => {
  return (
    <Wrapper>
      {/* <CandlestickPlotForm /> */}
      <CandlePlot />
      {/* <Indicators />
      <BacktestSetup /> */}
      {/* <PerformanceSummaryTable /> */}
      {/* <EquityPlot />
      <DrawdownPlot /> */}
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
