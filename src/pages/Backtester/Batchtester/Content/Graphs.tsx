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
import styled from "styled-components";

var CanvasJSStockChart = CanvasJSReact.CanvasJSStockChart;

// const smaSeries = sma([...additionalData, ...candles], 60);

const ti = (dateString: string) => new Date(dateString).getTime();

interface ComputeEquityAndDrawdownArgs {
  trades: Array<Trade>;
  candles: Array<Candle>;
  openTrades: Array<any>;
}
const computeEquityAndDrawdown = ({ trades, candles, openTrades }: any) => {
  let tradesToCheck = [
    ...trades,
    ...openTrades.map((trade: any) => ({
      entryPrice: trade.price,
      entryTime: trade.time,
      units: trade.units,
      entrySignal: trade.signal,
    })),
  ]; // future and open trades;

  let currentOpenTrades = [];
  const equitySeries: any = [];
  let realizedPL = 0;

  let peakEquity = 0;
  const drawdownSeries: any = [];
  let drawdown = 0;

  candles.forEach((candle: any) => {
    const candleTime = ti(candle.time);

    tradesToCheck = tradesToCheck.filter(({ exitTime, profitLoss }) => {
      if (exitTime === candle.time) {
        realizedPL += profitLoss;
        return false;
      }
      return true;
    });
    currentOpenTrades = tradesToCheck.filter(({ entryTime, exitTime }) => {
      if (
        (candleTime >= ti(entryTime) && candleTime < ti(exitTime)) ||
        (candleTime >= ti(entryTime) && !exitTime)
      ) {
        return true;
      }
      return false;
    });

    const unrealizedPL = currentOpenTrades.reduce(
      (acc, { entryPrice, units, entrySignal }) => {
        const multiplier = entrySignal === "BUY" ? 1 : -1;
        return acc + units * (candle.c - entryPrice) * multiplier;
      },
      0
    );

    const equity = unrealizedPL + realizedPL;

    equitySeries.push({
      x: new Date(candle.time),
      y: equity,
    });

    if (equity > peakEquity) {
      peakEquity = equity;
    }

    drawdown = equity - peakEquity;

    drawdownSeries.push({
      x: new Date(candle.time),
      y: drawdown,
    });
  });

  return { equitySeries, drawdownSeries };
};

const getGBP = () => {};

// period = 60

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

const ioptions = {
  rangeSelector: {
    inputFields: {
      enabled: false,
    },
    verticalAlign: "top",
  },
  navigator: {
    height: 100,
    data: [
      {
        dataPoints: [],
        type: "line",
      },
    ],
  },
};

const getCandleChartOptions = (
  candles: Array<Candle>,
  selectedResult: BacktestResultWithControlParam
) => {
  const tradeSegments = getTradeLineSegments(selectedResult.trades);
  return {
    height: 300,
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

export const Graphs = () => {
  const [showGraph, setShowGraph] = useState(false);

  const store = useStore();
  const { selectedResult, candles } = store;
  console.log(selectedResult);

  const { equitySeries, drawdownSeries } = computeEquityAndDrawdown({
    trades: selectedResult.trades,
    openTrades: selectedResult.openTrades,
    candles,
  });

  const [chartHeight, setChartHeight] = useState(0);
  const [showEquity, setShowEquity] = useState(false);
  const [showDrawdown, setShowDrawdown] = useState(false);

  useEffect(() => {
    let height = 20 + 300 + 100;
    height += 40; //buttons
    if (showEquity) {
      height += 320;
    }
    if (showDrawdown) {
      height += 320;
    }
    console.log({ height });
    setChartHeight(height);
  });

  const options = {
    rangeSelector: {
      inputFields: {
        enabled: false,
      },
      height: 20,
      verticalAlign: "top",
    },
    charts: [
      getCandleChartOptions(candles, selectedResult),
      {
        height: showEquity ? 300 : 0,
        data: [{ dataPoints: showEquity ? equitySeries : [], type: "area" }],
      },
      {
        height: showDrawdown ? 300 : 0,
        data: [
          { dataPoints: showDrawdown ? drawdownSeries : [], type: "area" },
        ],
      },
    ],
    navigator: getNavigatorChartOptions(candles),
  };

  if (!showGraph) {
    return <button onClick={() => setShowGraph(true)}>Show graph</button>;
  }

  return (
    <Wrapper height={chartHeight}>
      <button onClick={() => setShowEquity(!showEquity)}>EQUITY</button>
      <button onClick={() => setShowDrawdown(!showDrawdown)}>DRAWDOWN</button>
      <CanvasJSStockChart
        options={options}
        containerProps={{
          // width: `${800}px`,
          height: "calc(100% - 40px)",
          position: "relative",
        }}
      />
      <button onClick={() => setShowGraph(false)} style={{ width: "100%" }}>
        Hide graph
      </button>
    </Wrapper>
  );
};

const Wrapper = styled.div<{ height: number }>`
  height: ${({ height }) => height + "px"};
  overflow-x: visible;
  align-self: center;
  width: 100%;
`;
