import Chart from "react-apexcharts";
import styled from "styled-components";

export const EquityPlot = ({ data }: { data: Array<number> }) => {
  if (!data.length) return null;
  return (
    <ChartWrapper>
      <Chart
        height={365}
        series={[
          {
            name: "equity",
            data,
          },
        ]}
        type="area"
        options={{
          fill: {
            opacity: 0.5,
          },
          stroke: {
            curve: "straight",
          },
          title: {
            text: "Equity",
            align: "left",
            style: {
              fontSize: "12px",
            },
          },
          dataLabels: {
            enabled: false,
          },
          xaxis: {
            title: {
              text: "trades",
            },
          },
          yaxis: {
            labels: {
              formatter: (val) => val.toFixed(2),
            },
          },
          tooltip: {
            x: {
              show: false,
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
  margin-top: 30px;
  height: fit-content;
  /* overflow-x: au; */
  position: relative;
`;
