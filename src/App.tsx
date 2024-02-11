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
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BotPerformance } from "./pages/BotPerformance";
import { Layout } from "./pages/Layout";
import { Backtester } from "./pages/Backtester";
import BacktesterNav from "./pages/Backtester/Layout";

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="botPerformance" element={<BotPerformance />} />
          <Route path="backtester" element={<BacktesterNav />}>
            <Route path="" element={<Backtester />} />
            <Route path="batchTest" element={<div />} />
            <Route path="savedTests" element={<div />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
