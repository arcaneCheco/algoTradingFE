import styled from "styled-components";
import { CandleWithSMA, Trade } from "@src/types/types";
import Chart from "react-apexcharts";
import { useMyStore } from "@src/store";
import { formatDate } from "@src/utils";

export const CandlePlot = ({ trades }: { trades: Array<Trade> }) => {
  const candleData = useMyStore.use.candleData();
  const setCandleData = useMyStore.use.setCandleData();
  const smaData = useMyStore.use.smaData();

  const xAxis = candleData.map(({ time }) => new Date(time).getTime());
  const series = [
    {
      name: "candle",
      type: "candlestick",
      data: candleData.map(({ time, o, h, l, c }, i) => {
        return { x: xAxis[i], y: [o, h, l, c] };
        // return { x: Date.parse(time), y: [o, h, l, c] };
      }),
    },
    {
      name: "sma",
      type: "line",
      data: smaData.map((val, i) => ({
        x: xAxis[i],
        y: val,
      })),
    },
  ];

  return (
    <ChartWrapper>
      <Chart
        height={365}
        series={series}
        type="candlestick"
        options={{
          annotations: {
            xaxis: trades.map(({ entryTime, exitTime, profitLoss }) => {
              return {
                x: new Date(entryTime).getTime(),
                x2: new Date(exitTime).getTime(),
                fillColor: profitLoss > 0 ? "#00ff0060" : "#ff000060",
                borderColor: profitLoss > 0 ? "#00ff00" : "#ff0000",
                strokeDashArray: 0,
              };
            }),
          },
          plotOptions: {
            bar: {
              columnWidth: "150%",
            },
          },
          title: {
            text: "EUR/GBP 2023",
            align: "left",
          },
          stroke: {
            curve: "straight",
          },
          chart: {
            width: "100%",
            events: {
              beforeZoom: function (ctx: any) {
                // we need to clear the range as we only need it on the iniital load.
                ctx.w.config.xaxis.range = undefined;
              },
              mouseMove: function (ev: any, ctx: any) {
                // we need to clear the range as we only need it on the iniital load.
                ctx.w.config.xaxis.range = undefined;
              },
            },
          },
          xaxis: {
            type: "category",
            range:
              candleData.length &&
              new Date(
                candleData[
                  candleData.length > 50 ? 50 : candleData.length - 1
                ].time
              ).getTime() - new Date(candleData[0].time).getTime(), // for inital zoom
            tickPlacement: "on",
            tickAmount: 19,
            labels: {
              formatter: (value) => formatDate(value),
            },
          },
        }}
      />
    </ChartWrapper>
  );
};

const ChartWrapper = styled.div`
  border: 1px solid black;
  width: 80%;
  height: fit-content;
  /* overflow-x: au; */
  position: relative;
`;
