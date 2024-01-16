import { useEffect, useState } from "react";
import styled from "styled-components"
import { subDays, subHours, subMinutes, subWeeks, subMonths } from "date-fns";
import { PricingComponent, CandlestickGranularity } from "./types/types";
import {
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  ComposedChart,
  Legend,
  Line,
} from "recharts";

type CandlesQueryParams = {
  count?: number;
  price?: PricingComponent;
  from?: string;
  to?: string;
  granularity?: CandlestickGranularity;
  dailyAlignment?: number;
  alignmentTimezone?: string;
}

const assembleQueryString = (queryParams: {[key:string]: string | number | undefined}) => {
  let isFirst = true;
  return Object.entries(queryParams).reduce((acc, [key, value]) => {
    let delimiter = ''
    if (isFirst) {
        isFirst=false;
      } else {
      delimiter = '&';
    }
    return acc + delimiter + `${key}=${value}`
  }, '?')
}

const baseLink = 'http://localhost:3000';

const getCandles =  async (instrument: string, queryParams: CandlesQueryParams) => {
  const query = assembleQueryString(queryParams);
  const data = await fetch(
    `${baseLink}/instruments/${instrument}/candles${query}`
  );
  const res = await data.json();
  return res;
};

// getCandles('EUR_USD', {count: 100, price: 'M', from: '2017-01-01T00:00:00Z', granularity: 'M5' })

// function formatDate(date, delimiter = "/") {
//   var d = new Date(date),
//     month = "" + (d.getMonth() + 1),
//     day = "" + d.getDate(),
//     year = d.getFullYear();

//   if (month.length < 2) month = "0" + month;
//   if (day.length < 2) day = "0" + day;

//   return [year, month, day].join(delimiter);
// }

// const getMAData = (data, period, plotDataArgs) => {
//   // 5 day average
//   // if (data.length - period < 0) return;
//   // const end = plotDataArgs.start;
//   // console.log({ end, h: new Date(end), period });
//   // const start = subDays(end, period);
//   // console.log({ start, s: formatDate(start, "-") });

//   // getPlotData({ ...plotDataArgs, end: plotDataArgs.start, start }).then(
//   //   (res) => {
//   //     console.log({ res });
//   //   }
//   // );
//   // const prevData = await getPlotData({...plotDataArgs, end: plotDataArgs.start, start: })

//   const t = data.map((entry, i, array) => {
//     if (i < period - 1) {
//       return null;
//     }
//     const periodSet = array.slice(i - (period - 1), i + 1);
//     return {
//       val:
//         periodSet
//           .map((e) => e.ClosePrice)
//           .reduce((acc, current) => acc + current) / period,
//       // timestamp: entry.Timestamp,
//     };
//   });
//   return t;
// };

export const App = () => {
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    const t = async () => {
      const t = await getCandles('EUR_USD', {
        count: 100, 
        price: PricingComponent.M, 
        from: '2017-01-01T00:00:00Z', 
        granularity: CandlestickGranularity.D,
        dailyAlignment: 17,
        alignmentTimezone: 'America/New_York'
       });
      console.log(t);
    };
    t()
    // const data = t();
    // console.log({data})
  }, [])

  const [filters, setFilters] = useState({
    status: "",
    asset_class: "us_equity",
    exchange: "",
  });

  const [loading, setLoading] = useState(false);

  const [plotData, setPlotData] = useState([]);
  const [loadingPlotData, setLoadingPlotData] = useState(false);

  const [plotDataArgs, setPlotDataArgs] = useState({
    symbol: "GOOG",
    start: "2023-01-10",
    end: "2024-01-10",
    timeframe: 1,
    timeframeUnit: "DAY",
  });

  return <Wrapper></Wrapper>;
};

const Wrapper = styled.div`
  border: 1px solid black;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
`;
