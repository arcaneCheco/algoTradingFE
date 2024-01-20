import styled from "styled-components";
import { getCandles } from "@src/utils";
import { useMyStore } from "@src/store";
import { CandlestickGranularity } from "@lt_surge/algo-trading-shared-types";

export const CandlestickPlotForm = () => {
  const assetName = useMyStore.use.assetName();
  const updateAssetName = useMyStore.use.updateAssetName();
  const startTime = useMyStore.use.startTime();
  const setStartTime = useMyStore.use.setStartTime();
  const endTime = useMyStore.use.endTime();
  const setEndTime = useMyStore.use.setEndTime();
  const granularity = useMyStore.use.granularity();
  const setGranularity = useMyStore.use.setGranularity();
  const setCandleData = useMyStore.use.setCandleData();

  return (
    <Wrapper
      onSubmit={async (event) => {
        event.preventDefault();
        console.log("hello");
        const candles = await getCandles({
          instrument: assetName,
          params: {
            from: startTime,
            to: endTime,
            granularity,
          },
        });
        setCandleData(candles);
      }}
    >
      <input
        placeholder="asset"
        value={assetName}
        onChange={(event) => updateAssetName(event.currentTarget.value)}
      />
      <input
        type="datetime-local"
        id="start"
        name="start"
        value={startTime}
        onChange={(event) => {
          const val = event.currentTarget.value;
          setStartTime(val);
        }}
      />
      <input
        type="datetime-local"
        name="endTime"
        value={endTime}
        onChange={(event) => {
          const val = event.currentTarget.value;
          setEndTime(val);
        }}
      />
      <select
        id="granularity"
        value={granularity}
        onChange={(event) => {
          setGranularity(event.currentTarget.value as CandlestickGranularity);
        }}
      >
        <option value="S5">S5</option>
        <option value="S10">S10</option>
        <option value="S15">S15</option>
        <option value="S30">S30</option>
        <option value="M1">M1</option>
        <option value="M2">M2</option>
        <option value="M3">M3</option>
        <option value="M4">M4</option>
        <option value="M5">M5</option>
        <option value="M10">M10</option>
        <option value="M15">M15</option>
        <option value="M30">M30</option>
        <option value="H1">H1</option>
        <option value="H2">H2</option>
        <option value="H3">H3</option>
        <option value="H4">H4</option>
        <option value="H8">H8</option>
        <option value="H12">H12</option>
        <option value="D">D</option>
        <option value="W">W</option>
        <option value="M">M</option>
      </select>
      <button type="submit" disabled={false}>
        Fetch data
      </button>
    </Wrapper>
  );
};

const Wrapper = styled.form`
  border: 1px solid black;
  margin-bottom: 30px;
  width: 100%;
  display: flex;
  justify-content: center;
`;
