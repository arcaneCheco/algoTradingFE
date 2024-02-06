import styled from "styled-components";
import { CandleWithSMA, Trade } from "@src/types/types";
import Chart from "react-apexcharts";
import { useMyStore } from "@src/store";
import { formatDate, sma } from "@src/utils";
import { getCandles, getTrades, getTransactionsSinceID } from "@src/api";
import { useEffect, useRef, useState } from "react";
import { ApexOptions } from "apexcharts";

export const CandlePlot = () => {
  // const candleData = useMyStore.use.candleData();
  // const setCandleData = useMyStore.use.setCandleData();
  // const smaData = useMyStore.use.smaData();
  // const trades = useMyStore.use.trades();

  const [chartOptions, setChartOptions] = useState<ApexOptions>({
    chart: {
      id: "candles",
      zoom: {
        enabled: false,
        autoScaleYaxis: false,
      },
      toolbar: {
        autoSelected: "pan",
        show: false,
      },
      animations: {
        enabled: false,
      },
    },
    stroke: {
      curve: "straight",
    },
    xaxis: {
      type: "datetime",
    },
    tooltip: {
      enabled: false,
    },
  });

  const stackedOptions = {
    ...chartOptions,
    grid: {
      ...chartOptions.grid,
      borderColor: "#00000000",
    },
    chart: { ...chartOptions.chart, id: "sma" },
    xaxis: {
      ...chartOptions.xaxis,
      labels: {
        ...chartOptions?.xaxis?.labels,
        style: {
          ...chartOptions?.xaxis?.labels?.style,
          cssClass: "hello",
        },
      },
    },
    yaxis: {
      ...chartOptions.yaxis,
      labels: {
        //@ts-ignore
        ...chartOptions.yaxis?.labels,
        style: {
          //@ts-ignore
          ...chartOptions?.yaxis?.labels?.style,
          cssClass: "hello",
        },
      },
    },
  };

  const [data, setData] = useState([]);
  const [smaData, setSMAdata] = useState<any>([]);
  const [tradesData, setTradesData] = useState<any>([]);

  useEffect(() => {
    const t = async () => {
      let c = await getCandles({
        instrument: "EUR_GBP",
        params: {
          from: "2024-01-31T15:00:00.000000000Z",
          granularity: "H1",
          count: "5000",
        },
      });
      console.log({ c });
      const d = c.map(({ o, h, l, c, time }: any) => ({
        x: time,
        y: [o, h, l, c],
      }));
      setData(d);

      // SMA
      const period = 40;
      const additionalData = await getCandles({
        instrument: "EUR_GBP",
        params: {
          to: "2024-01-31T15:00:00.000000000Z",
          count: `${period}`,
          granularity: "H1",
        },
      });
      additionalData.pop();
      console.log({ additionalData });
      const smaCalc = sma([...additionalData, ...c], period).map(
        (val, index) => ({ x: d[index].x, y: val })
      );
      setSMAdata(smaCalc);

      const trades = (
        await getTrades({
          id: "",
          params: { state: "ALL", instrument: "EUR_GBP", count: 500 },
        })
      ).trades.filter(
        ({ openTime }: any) =>
          new Date(openTime) > new Date("2024-01-31T14:10:03.753291573Z")
      );
      console.log({ trades });

      const segments = trades
        .sort(
          (a: any, b: any) =>
            new Date(a.openTime).getTime() - new Date(b.openTime).getTime()
        )
        .map(
          (
            {
              openTime,
              price,
              realizedPL,
              initialUnits,
              state,
              closeTime,
              averageClosePrice,
              unrealizedPL,
            }: any,
            index: number
          ) => {
            let segment = [];
            const opening = {
              x: openTime,
              state: "OPENING",
              y: Number(price),
              units: Number(initialUnits),
              unrealizedProfitLoss: unrealizedPL,
              action: Number(initialUnits) > 0 ? "BUY" : "SELL",
            };
            segment.push(opening);
            if (state === "CLOSED") {
              const closing = {
                x: closeTime,
                state: "CLOSING",
                y: Number(averageClosePrice),
                profitLoss: Number(realizedPL),
                units: Number(initialUnits),
                action: Number(initialUnits) > 0 ? "SELL" : "BUY",
              };
              segment.push(closing);
            }
            return {
              type: "line",
              data: segment,
              color: Number(realizedPL) > 0 ? "#00ff00" : "#ff0000",
            };
          }
        );

      setTradesData(segments);

      // const trRes = (
      //   await getTransactionsSinceID({
      //     id: "",
      //     params: { id: "142", type: "ORDER_FILL" },
      //   })
      // ).transactions.filter((tr: any) => tr.instrument === "EUR_GBP");
    };
    t();
  }, []);

  return (
    <ChartWrapper>
      <div style={{ position: "relative", height: "360px", width: "100%" }}>
        <Chart
          height={360}
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
          }}
          series={[{ data, name: "candleChart", type: "candlestick" }]}
          type="candlestick"
          options={chartOptions}
        />
        <Chart
          height={360}
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            zIndex: "1",
          }}
          series={[{ data: smaData, name: "sma", type: "line" }]}
          type="candlestick"
          options={stackedOptions}
        />
        <Chart
          height={360}
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            zIndex: "2",
            pointerEvents: "none",
          }}
          series={tradesData}
          type="candlestick"
          options={{
            ...stackedOptions,
            chart: { ...stackedOptions.chart, id: "transactions" },
            markers: {
              ...stackedOptions.markers,
              size: 3,
            },
            legend: { ...stackedOptions.legend, show: false },
            tooltip: {
              ...stackedOptions.tooltip,
              enabled: true,
              shared: true,
              inverseOrder: true,
              intersect: false,
              marker: {
                show: false,
              },
              custom: ({ seriesIndex, dataPointIndex, w }) => {
                let openTrade;
                let closeTrade;

                const series = w.globals.initialSeries;

                const myDats = series[seriesIndex].data[dataPointIndex];

                if (!myDats) {
                  return `
                  <div>
                  </div>
                `;
                }

                const time = myDats.x;

                if (dataPointIndex === 0) {
                  // find potential overlapping closing data
                  openTrade = myDats;
                  closeTrade = series.find(({ data }: any) => {
                    if (data[1].x === time) {
                      return true;
                    }
                    return false;
                  })?.data[1];
                }
                if (dataPointIndex === 1) {
                  // find potential overlapping closing data
                  closeTrade = myDats;
                  openTrade = series.find(({ data }: any) => {
                    if (data[0].x === time) {
                      return true;
                    }
                    return false;
                  })?.data[0];
                }

                let o = "";
                let c = "";

                if (openTrade) {
                  o = `
                  <p>OpenTrade</p>
                  <p>${openTrade.units}units</p>
                  <p>@${openTrade.y}</p>
                  `;
                }
                if (closeTrade) {
                  c = `
                  <p>closeTrade</p>
                  <p>${closeTrade.units}units</p>
                  <p>@${closeTrade.y}</p>
                  `;
                }

                let htmlString = `
                  <div>
                  ${o}
                  <p>----</p>
                  ${c}
                  </div>
                `;

                return htmlString;
              },
            },
            xaxis: {
              ...stackedOptions.xaxis,
              tooltip: {
                ...stackedOptions.xaxis.tooltip,
                enabled: false,
              },
            },
          }}
        />
      </div>
      <Chart
        type="line"
        height={50}
        options={{
          chart: {
            id: "brush",
            // group: "candlesGroup",
            brush: {
              enabled: true,
              target: "candles",
              autoScaleYaxis: false,
            },
            selection: {
              enabled: true,
            },
            events: {
              selection: (chart, { xaxis }) => {
                const yInRange = data
                  .filter(({ x }) => {
                    const xVal = new Date(x).getTime();
                    if (xVal >= xaxis.min && xVal <= xaxis.max) {
                      return true;
                    }
                    return false;
                  })
                  .map(({ y }) => y)
                  .flat();

                setChartOptions((prev) => {
                  return {
                    ...prev,
                    yaxis: {
                      ...prev.yaxis,
                      min: Math.min(...yInRange) * 0.9995,
                      max: Math.max(...yInRange) * 1.0005,
                    },
                    xaxis: {
                      ...prev.xaxis,
                      ...xaxis,
                    },
                  };
                });
              },
            },
          },
          dataLabels: {
            enabled: false,
          },
          markers: {
            size: 0,
          },
          xaxis: {
            type: "datetime",
            labels: {
              show: false,
            },
          },
          yaxis: {
            labels: {
              show: false,
            },
          },
        }}
        series={[
          {
            data: data.map((candle: any) => ({ x: candle.x, y: candle.y[3] })),
          },
        ]}
      />
    </ChartWrapper>
  );
};

const ChartWrapper = styled.div`
  border: 1px solid black;
  width: 80%;
  position: relative;
`;
