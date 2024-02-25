import { CandlestickGranularity } from "@lt_surge/algo-trading-shared-types";
import { Form, FormField, FormFields, Title } from "./sharedStyles";
import useStore from "@src/store";
import { DataFormField } from "./DataFormField";

export const DataForm = () => {
  const state = useStore();

  console.log(state.smaPeriod);

  return (
    <Form>
      <Title>Data</Title>
      <FormFields>
        <DataFormField name={"instrument"}>
          <input
            placeholder="instrument"
            value={state.instrument}
            onChange={(event) => state.setInstrument(event.currentTarget.value)}
            style={{ width: "100px", marginLeft: "20px" }}
          />
        </DataFormField>
        <DataFormField name={"startTime"}>
          <input
            type="datetime-local"
            value={state.startTime.split(".").slice(0, -1).join("")}
            onChange={(event) => {
              const val = event.currentTarget.value;
              state.setStartTime(new Date(val).toISOString());
            }}
            style={{ width: "210px", marginLeft: "20px" }}
          />
        </DataFormField>
        <DataFormField name={"endTime"}>
          <input
            type="datetime-local"
            id="end"
            name="end"
            value={state.endTime.split(".").slice(0, -1).join("")}
            onChange={(event) => {
              const val = event.currentTarget.value;
              state.setEndTime(new Date(val).toISOString());
            }}
            style={{ width: "210px", marginLeft: "20px" }}
          />
        </DataFormField>
        <DataFormField name={"granularity"}>
          <select
            id="granularity"
            value={state.granularity}
            onChange={(event) => {
              state.setGranularity(
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
        </DataFormField>
        <DataFormField
          name={"smaPeriod"}
          options={{
            ...state.smaPeriod,
            setter: state.setSMAPeriod,
            type: "number",
          }}
        />
        <DataFormField
          name={"stopLoss"}
          options={{
            ...state.stopLoss,
            setter: state.setStopLoss,
            type: "number",
          }}
        ></DataFormField>
      </FormFields>
    </Form>
  );
};
