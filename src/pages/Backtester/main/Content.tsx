import styled from "styled-components";
import Chart from "react-apexcharts";
import { useState } from "react";
import { ApexOptions } from "apexcharts";

const baseChartOptions: ApexOptions = {
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
};

export const Content = ({
  isSidePanel,
  setIsSidePanel,
  candleData,
  smaData,
}: any) => {
  const [chartOptions, setChartOptions] =
    useState<ApexOptions>(baseChartOptions);

  const stackedOptions: ApexOptions = {
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

  return (
    <Wrapper>
      <OpenSidePanel
        $isSidePanel={isSidePanel}
        onClick={() => setIsSidePanel(true)}
      >
        open
      </OpenSidePanel>
      <ChartOuterWrapper>
        <ChartInnerWrapper>
          <CandleChart
            type="candlestick"
            height={360}
            series={[
              { name: "candleChart", type: "candlestick", data: candleData },
            ]}
            options={chartOptions}
          />
          {!!smaData.length && (
            <SMAChart
              height={360}
              series={[{ data: smaData, name: "sma", type: "line" }]}
              type="candlestick"
              options={stackedOptions}
            />
          )}
        </ChartInnerWrapper>
        <Chart
          type="line"
          height={75}
          options={{
            chart: {
              id: "brush",
              brush: {
                enabled: true,
                target: "candles",
                autoScaleYaxis: false,
              },
              selection: {
                enabled: true,
              },
              animations: {
                enabled: false,
              },
              events: {
                selection: (chart, { xaxis }) => {
                  const data = chart.w.globals.initialSeries[0].data;
                  const smaSeries = chart.w.globals.initialSeries[1]?.data;
                  if (smaSeries) {
                    smaSeries.forEach(({ y }: any, index: number) => {
                      data[index].y = [...data[index].y, y];
                    });
                  }
                  const yInRange = data
                    .filter(({ x }: any) => {
                      const xVal = new Date(x).getTime();
                      if (xVal >= xaxis.min && xVal <= xaxis.max) {
                        return true;
                      }
                      return false;
                    })
                    .map(({ y }: any) => y)
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
            grid: {
              show: false,
            },
            legend: {
              show: false,
            },
          }}
          series={[
            {
              data: candleData.map(({ x, y }: any) => ({ x, y: [y[1], y[2]] })),
            },
            {
              data: smaData,
            },
          ]}
        />
      </ChartOuterWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  height: 100%;
  background-color: #bababa;
  flex-grow: 1;
  position: relative;
  display: flex;
  justify-content: center;
`;

const OpenSidePanel = styled.button<{ $isSidePanel: boolean }>`
  background: none;
  border: none;
  position: absolute;
  display: ${({ $isSidePanel }) => ($isSidePanel ? "none" : "")};
  cursor: pointer;
  left: 10px;
`;

const ChartOuterWrapper = styled.div`
  position: relative;
  width: 80%;
`;
const ChartInnerWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 360px;
`;

const CandleChart = styled(Chart)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const SMAChart = styled(CandleChart)`
  z-index: 1;
`;
