// @ts-ignore
import CanvasJSReact from "@canvasjs/react-stockcharts";
import useStore from "@src/store";
import { useEffect, useRef } from "react";

var CanvasJSStockChart = CanvasJSReact.CanvasJSStockChart;

export const ControlParamGraph = () => {
  const { controlParam, performanceSummaries } = useStore();
  console.log({ controlParam, performanceSummaries });

  const dataPoints = performanceSummaries.map((ps) => ({
    x: ps.controlParam,
    y: ps.netProfit,
  }));
  console.log({ dataPoints });

  const ref = useRef<any>(null);

  useEffect(() => {
    if (!dataPoints.length) return;
    const t = ref?.current?.stockChart;
    if (t) {
      const axis = t.charts[0].axisX[0];
      axis.set("viewportMinimum", null, false);
      axis.set("viewportMaximum", null);
    }
  }, [dataPoints]);

  if (!dataPoints.length) return null;

  const options = {
    rangeSelector: {
      inputFields: {
        enabled: false,
      },
      buttons: {
        enabled: false,
      },
    },
    navigator: {
      enabled: false,
    },
    // axisX: xRange,
    charts: [
      {
        interactivityEnabled: false,
        data: [
          {
            type: "line",
            dataPoints,
          },
        ],
        height: 400,
      },
    ],
  };
  //   return null;

  return (
    <>
      <CanvasJSStockChart
        options={options}
        containerProps={{
          // width: `${800}px`,
          height: "450px",
          position: "relative",
        }}
        ref={ref}
      />
    </>
  );
};
