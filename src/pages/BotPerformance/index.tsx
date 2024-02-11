import { useEffect, useState } from "react";
import styled from "styled-components";
import { set1, set2 } from "@src/testdata";
import {
  CandlePlot,
  PerformanceSummaryTable,
  DrawdownPlot,
  EquityPlot,
  CandlestickPlotForm,
  Indicators,
} from "@src/components";

export const BotPerformance = () => {
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
