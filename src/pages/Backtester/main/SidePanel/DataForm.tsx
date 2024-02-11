import { CandlestickGranularity } from "@lt_surge/algo-trading-shared-types";
import { Form, FormField, FormFields, Title } from "./sharedStyles";

export const DataForm = ({
  assetName,
  setAssetName,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  granularity,
  setGranularity,
  isSMA,
  setIsSMA,
  smaPeriod,
  setSMAPeriod,
}: any) => {
  return (
    <Form>
      <Title>Data</Title>
      <FormFields>
        <FormField>
          <label>Asset</label>
          <input
            placeholder="asset"
            value={assetName}
            onChange={(event) => setAssetName(event.currentTarget.value)}
            style={{ width: "100px", marginLeft: "20px" }}
          />
        </FormField>
        <FormField>
          <label>Start Date</label>
          <input
            type="datetime-local"
            id="start"
            name="start"
            value={startTime.split(".").slice(0, -1).join("")}
            onChange={(event) => {
              const val = event.currentTarget.value;
              setStartTime(new Date(val).toISOString());
            }}
            style={{ width: "210px", marginLeft: "20px" }}
          />
        </FormField>
        <FormField>
          <label>End Date</label>
          <input
            type="datetime-local"
            id="end"
            name="end"
            value={endTime.split(".").slice(0, -1).join("")}
            onChange={(event) => {
              const val = event.currentTarget.value;
              setEndTime(new Date(val).toISOString());
            }}
            style={{ width: "210px", marginLeft: "20px" }}
          />
        </FormField>
        <FormField>
          <label>Granularity</label>
          <select
            id="granularity"
            value={granularity}
            onChange={(event) => {
              setGranularity(
                event.currentTarget.value as CandlestickGranularity
              );
            }}
            style={{ width: "100px", marginLeft: "20px" }}
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
        </FormField>
        <FormField>
          <div>
            <input
              type="checkbox"
              checked={isSMA}
              onChange={(event) => {
                setIsSMA(!isSMA);
              }}
            />
            <label>SMA</label>
          </div>
          <input
            type="number"
            min={2}
            max={200}
            value={smaPeriod}
            onChange={(event) =>
              setSMAPeriod(Number(event.currentTarget.value))
            }
            disabled={!isSMA}
            style={{ width: "100px", marginLeft: "20px" }}
          />
        </FormField>
      </FormFields>
    </Form>
  );
};
