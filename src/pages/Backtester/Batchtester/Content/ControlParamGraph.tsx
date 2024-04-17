// @ts-ignore
import CanvasJSReact from "@canvasjs/react-stockcharts";
import useStore from "@src/store";
import { useEffect, useRef } from "react";
import { Button } from "./Graphs";

var CanvasJSStockChart = CanvasJSReact.CanvasJSStockChart;

export const ControlParamGraph = ({ hide }: { hide: () => void }) => {
  const { controlParam, performanceSummaries } = useStore();
  console.log({ controlParam, performanceSummaries });

  const dataPoints = performanceSummaries
    .map((ps) => ({
      x: ps.controlParam,
      y: ps.netProfit,
    }))
    .sort((p1, p2) => p1.x - p2.x);
  console.log(dataPoints);
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
    charts: [
      {
        interactivityEnabled: false,
        data: [
          {
            type: "line",
            dataPoints,
          },
        ],
      },
    ],
  };

  return (
    <>
      <CanvasJSStockChart options={options} ref={ref} />
      <Button clickhandler={hide} copy={"hide control param plot"} />
    </>
  );
};
