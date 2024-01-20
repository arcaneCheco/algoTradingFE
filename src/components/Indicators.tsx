import { useMyStore } from "@src/store";
import { sma } from "@src/utils";
import styled from "styled-components";

export const Indicators = () => {
  const candleData = useMyStore.use.candleData();
  const setCandleData = useMyStore.use.setCandleData();
  const smaPeriod = useMyStore.use.smaPeriod();
  const setSMAPeriod = useMyStore.use.setSMAPeriod();
  //   const smaData = useMyStore.use.smaData();
  const setSMAData = useMyStore.use.setSMAData();
  return (
    <Wrapper>
      <SMAWrapper>
        <p>SMA: </p>
        <input
          placeholder="periods"
          type="number"
          min={10}
          max={200}
          value={smaPeriod}
          onChange={(event) => setSMAPeriod(Number(event.currentTarget.value))}
        />
        <button
          onClick={() => {
            const smaData = sma(candleData, smaPeriod);
            setSMAData(smaData);
          }}
        >
          compute
        </button>
      </SMAWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  border: 1px solid black;
  margin-top: 30px;
  width: 100%;
  display: flex;
  justify-content: center;
`;

const SMAWrapper = styled.div`
  display: flex;
  align-items: center;
`;
