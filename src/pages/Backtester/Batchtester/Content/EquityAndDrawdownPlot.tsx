// @ts-ignore
import CanvasJSReact from "@canvasjs/react-stockcharts";
import useStore from "@src/store";
import { Button } from "./Graphs";

var CanvasJSStockChart = CanvasJSReact.CanvasJSStockChart;

const ti = (dateString: string) => new Date(dateString).getTime();

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

export const EquityAndDrawdownPlot = ({ hide }: { hide: () => void }) => {
  const store = useStore();
  const { selectedResult, candles } = store;

  const { equitySeries, drawdownSeries } = computeEquityAndDrawdown({
    trades: selectedResult.trades,
    openTrades: selectedResult.openTrades,
    candles,
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
      {
        //   height: 300,
        data: [{ dataPoints: equitySeries, type: "area" }],
      },
      {
        // height: 300,
        data: [{ dataPoints: drawdownSeries, type: "area" }],
      },
    ],
    // navigator: getNavigatorChartOptions(candles),
  };

  return (
    <>
      <CanvasJSStockChart options={options} />
      <Button clickhandler={hide} copy={"hide equity and drawdown"} />
    </>
  );
};
