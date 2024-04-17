// @ts-ignore
import CanvasJSReact from "@canvasjs/react-stockcharts";
import useStore from "@src/store";
import {
  BacktestResultWithControlParam,
  Candle,
  OpenTrade,
  Trade,
} from "@src/types/types";
import { sma } from "@src/utils";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Button } from "./Graphs";
import styled from "styled-components";

var CanvasJSStockChart = CanvasJSReact.CanvasJSStockChart;

const getTradeLineSegments = (
  trades: Array<Trade>
): Array<{
  dataPoints: Array<{ x: Date; y: number }>;
  profitLoss: number;
  lineColor: string;
  lineDashType: string;
  markerType: string;
  type: string;
}> => {
  return trades.reduce((acc, current) => {
    const dataPoints = [
      {
        x: new Date(current.entryTime),
        y: current.entryPrice,
      },
      {
        x: new Date(current.exitTime),
        y: current.exitPrice,
      },
    ];
    const segment = {
      dataPoints,
      profitLoss: current.profitLoss,
      lineColor: current.profitLoss > 0 ? "green" : "red",
      lineThickness: 0.5,
      lineDashType: "dash",
      markerType: "none",
      type: "line",
    };
    return [...acc, segment];
  }, [] as any);
};

const getCandleChartOptions = (
  candles: Array<Candle>,
  selectedResult: BacktestResultWithControlParam
) => {
  const tradeSegments = getTradeLineSegments(selectedResult.trades);
  return {
    // height: 300,
    axisX: {
      crosshair: {
        enabled: true,
        snapToDataPoint: false,
      },
    },
    axisY: {
      crosshair: {
        enabled: true,
        snapToDataPoint: false,
      },
    },
    toolTip: {
      shared: true,
    },
    data: [
      {
        type: "candlestick",
        dataPoints: candles.map(({ time, o, h, l, c }) => ({
          x: new Date(time),
          y: [o, h, l, c],
        })),
        risingColor: "green",
        color: "red",
        name: "candles",
      },
      {
        type: "line",
        dataPoints: selectedResult.additionalData.smaSeries.map(
          (val: number, index: number) => ({
            x: new Date(candles[index].time),
            y: val,
          })
        ),
        name: "SMA",
        markerType: "none",
      },
      {
        type: "scatter",
        dataPoints: selectedResult.transactions.map((tr) => ({
          x: new Date(tr.time),
          y: tr.price,
          indexLabel: tr.units > 0 ? "BUY" : "SELL",
          indexLabelFontColor: tr.units > 0 ? "#6B8E23" : "tomato",
          units: tr.units,
          positionsSize: tr.positionSize,
          indexLabelFontSize: 12,
          indexLabelFontweight: 800,
        })),
        // markerSize: 12,
        indexLabelFontSize: 12,
        indexLabelFontweight: 800,
        lineThickness: 0,
        markerColor: "#000000",
        toolTipContent: `
                <hr/>
                Units: {units}
                <br>
                PositionSize: {positionsSize}`,
      },
      ...tradeSegments,
    ],
  };
};

const getNavigatorChartOptions = (candles: Array<Candle>) => {
  return {
    height: 100,
    data: [
      {
        dataPoints: candles.map(({ time }) => ({
          x: new Date(time),
          y: 1,
        })),
        type: "line",
      },
    ],
    //   verticalAlign: "top",
    slider: {
      minimum: new Date(candles[Math.floor(candles.length * 0.3)]?.time) || 0,
      maximum: new Date(candles[Math.floor(candles.length * 0.6)]?.time) || 0,
    },
  };
};

export const CandlestickChart = ({ hide }: { hide: () => void }) => {
  const store = useStore();
  const { selectedResult, candles } = store;
  console.log(selectedResult);

  const options = {
    rangeSelector: {
      inputFields: {
        enabled: false,
      },
      height: 20,
      verticalAlign: "top",
    },
    charts: [getCandleChartOptions(candles, selectedResult)],
    navigator: getNavigatorChartOptions(candles),
  };

  return (
    <>
      <CanvasJSStockChart options={options} />
      <Button clickhandler={hide} copy={"hide candlessticks"} />
    </>
  );
};

const Wrapper = styled.div`
  overflow-x: visible;
  align-self: center;
  width: 100%;
`;
