import { useEffect, useState } from "react";
import styled from "styled-components";
import { AssetItem } from "./AssetItem";
import { subDays, subHours, subMinutes, subWeeks, subMonths } from "date-fns";
import {
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  ComposedChart,
  Legend,
  Line,
} from "recharts";

const getAssetsList = async (filters) => {
  const data = await fetch("http://localhost:3000/assets", {
    method: "POST",
    body: JSON.stringify(filters),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const res = await data.json();
  return res;
};

const getPlotData = async (args) => {
  const data = await fetch("http://localhost:3000/historicalData", {
    method: "POST",
    body: JSON.stringify(args),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const res = await data.json();
  return res;
};

function formatDate(date, delimiter = "/") {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join(delimiter);
}

const getMAData = (data, period, plotDataArgs) => {
  // 5 day average
  // if (data.length - period < 0) return;
  // const end = plotDataArgs.start;
  // console.log({ end, h: new Date(end), period });
  // const start = subDays(end, period);
  // console.log({ start, s: formatDate(start, "-") });

  // getPlotData({ ...plotDataArgs, end: plotDataArgs.start, start }).then(
  //   (res) => {
  //     console.log({ res });
  //   }
  // );
  // const prevData = await getPlotData({...plotDataArgs, end: plotDataArgs.start, start: })

  const t = data.map((entry, i, array) => {
    if (i < period - 1) {
      return null;
    }
    const periodSet = array.slice(i - (period - 1), i + 1);
    return {
      val:
        periodSet
          .map((e) => e.ClosePrice)
          .reduce((acc, current) => acc + current) / period,
      // timestamp: entry.Timestamp,
    };
  });
  return t;
};

export const App = () => {
  const [assets, setAssets] = useState([]);

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

  return (
    <div>
      <AssetPageWrapper>
        <p>ASSETS</p>
        <FiltersWrapper>
          <select
            id="status"
            value={filters.status}
            onChange={(event) => {
              setFilters({ ...filters, status: event.currentTarget.value });
            }}
          >
            <option value="">All</option>
            <option value="active">active</option>
            <option value="inactive">inactive</option>
          </select>
          <select
            id="asset_class"
            value={filters.asset_class}
            onChange={(event) => {
              setFilters({
                ...filters,
                asset_class: event.currentTarget.value,
              });
            }}
          >
            <option value="us_equity">us_equity</option>
            <option value="crypto">crypto</option>
          </select>
          <select
            id="exchange"
            value={filters.exchange}
            onChange={(event) => {
              setFilters({ ...filters, exchange: event.currentTarget.value });
            }}
          >
            <option value="">all</option>
            <option value="AMEX">AMEX</option>
            <option value="ARCA">ARCA</option>
            <option value="BATS">BATS</option>
            <option value="NYSE">NYSE</option>
            <option value="NASDAQ">NASDAQ</option>
            <option value="NYSEARCA">NYSEARCA</option>
            <option value="OTC">OTC</option>
          </select>
        </FiltersWrapper>
        <button
          disabled={loading}
          onClick={async () => {
            setLoading(true);
            const data = await getAssetsList(filters);
            setAssets(data);
            setLoading(false);
          }}
        >
          Get assets
        </button>
        <AssetsList>
          {assets.map((asset) => {
            return <AssetItem key={asset.symbol} data={asset} />;
          })}
        </AssetsList>
      </AssetPageWrapper>
      <PlotsWrapper>
        <PlotForm
          onSubmit={async (event) => {
            event.preventDefault();
            if (loadingPlotData) return;
            setLoadingPlotData(true);
            const data = await getPlotData(plotDataArgs);
            setLoadingPlotData(false);
            setPlotData(data);
          }}
        >
          <input
            placeholder="asset"
            value={plotDataArgs.symbol}
            onChange={(event) =>
              setPlotDataArgs({
                ...plotDataArgs,
                symbol: event.currentTarget.value,
              })
            }
          />
          <input
            type="date"
            id="start"
            name="start"
            value={plotDataArgs.start}
            onChange={(event) => {
              setPlotDataArgs({
                ...plotDataArgs,
                start: event.currentTarget.value,
              });
            }}
            // min="2018-01-01"
            // max="2018-12-31"
          />
          <input
            type="date"
            id="end"
            name="end"
            value={plotDataArgs.end}
            onChange={(event) => {
              setPlotDataArgs({
                ...plotDataArgs,
                end: event.currentTarget.value,
              });
            }}
            // min="2018-01-01"
            // max="2018-12-31"
          />
          <input
            id="timeframe"
            value={plotDataArgs.timeframe}
            onChange={(event) => {
              setPlotDataArgs({
                ...plotDataArgs,
                timeframe: Number(event.currentTarget.value),
              });
            }}
          />
          <select
            id="timeframeUnit"
            value={plotDataArgs.timeframeUnit}
            onChange={(event) => {
              setPlotDataArgs({
                ...plotDataArgs,
                timeframeUnit: event.currentTarget.value,
              });
            }}
          >
            <option value="MIN">minute</option>
            <option value="HOUR">hour</option>
            <option value="DAY">day</option>
            <option value="WEEK">week</option>
            <option value="MONTH">month</option>
          </select>
          <button type="submit" disabled={loadingPlotData}>
            Plot
          </button>
        </PlotForm>
        <ChartWrapper>
          <ComposedChart
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            width={plotData.length * 40}
            height={250}
            data={getMAData(plotData, 20, plotDataArgs)}
          >
            <XAxis xAxisId={1} dataKey="timestamp" stroke="#000000" />
            <XAxis xAxisId={2} hide={true} stroke="#000000" />
            <YAxis
              stroke="#000000"
              domain={["dataMin + 200", "dataMax + dataMax * 2"]}
            />
            <Tooltip />
            <Legend />
            <Bar
              xAxisId={1}
              dataKey="price"
              fill="#00ff00"
              data={plotData.map((entry) => {
                return {
                  timestamp: formatDate(entry.Timestamp),
                  price: [entry.LowPrice, entry.HighPrice],
                };
              })}
            />
            <Line xAxisId={2} dataKey="val" stroke="#000000" />
          </ComposedChart>
        </ChartWrapper>
      </PlotsWrapper>
    </div>
  );
};

const PlotForm = styled.form``;

const PlotsWrapper = styled.div`
  width: 100%;
  height: 100%;
  /* height: 500px; */
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const ChartWrapper = styled.div`
  width: 800px;
  overflow-x: auto;
  height: fit-content;
  border: 1px solid grey;
`;

const AssetPageWrapper = styled.div`
  border: 1px solid black;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
`;

const FiltersWrapper = styled.div`
  border: 1px solid black;
  display: flex;
`;

const AssetsList = styled.div`
  border: 1px solid black;
  overflow: auto;
  max-height: 500px;
  width: 400px;
`;
