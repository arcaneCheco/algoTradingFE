import styled from "styled-components";
import { DataForm } from "./DataForm";
import { StrategyForm } from "./StrategyForm";
import { getCandles } from "@src/api";
import { sma } from "@src/utils";

export const SidePanel = ({
  isSidePanel,
  setIsSidePanel,
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
  setCandles,
  setSMAData,
  strategyType,
  setStrategyType,
  strategyName,
  setStrategyName,
  isStopLoss,
  setIsStopLoss,
  stopLoss,
  setStopLoss,
  isProfitTarget,
  setIsProfitTarget,
  profitTarget,
  setProfitTarget,
}: any) => {
  const getData = async () => {
    const candleData = await getCandles({
      instrument: assetName,
      params: {
        from: startTime,
        to: endTime,
        granularity,
        // count: "5000",
      },
    });
    const candles = candleData.map(({ o, h, l, c, time }: any) => ({
      x: time,
      y: [o, h, l, c],
    }));
    setCandles(candles);

    if (isSMA) {
      // setSMAData
      const additionalData = await getCandles({
        instrument: assetName,
        params: {
          to: startTime,
          count: `${smaPeriod}`,
          granularity,
        },
      });
      additionalData.pop();
      const smaData = sma([...additionalData, ...candleData], smaPeriod).map(
        (val, index) => ({ x: candles[index].x, y: val })
      );
      setSMAData(smaData);
    }
  };

  return (
    <OuterWrapper $isSidePanel={isSidePanel}>
      <InnerWrapper $isSidePanel={isSidePanel}>
        <CloseButton onClick={() => setIsSidePanel(false)}>X</CloseButton>
        <DataForm
          assetName={assetName}
          setAssetName={setAssetName}
          startTime={startTime}
          setStartTime={setStartTime}
          endTime={endTime}
          setEndTime={setEndTime}
          granularity={granularity}
          setGranularity={setGranularity}
          isSMA={isSMA}
          setIsSMA={setIsSMA}
          smaPeriod={smaPeriod}
          setSMAPeriod={setSMAPeriod}
        />
        <SubmitBottom onClick={async () => await getData()}>
          Get Data
        </SubmitBottom>
        <StrategyForm
          strategyType={strategyType}
          setStrategyType={setStrategyType}
          strategyName={strategyName}
          setStrategyName={setStrategyName}
          isStopLoss={isStopLoss}
          setIsStopLoss={setIsStopLoss}
          stopLoss={stopLoss}
          setStopLoss={setStopLoss}
          isProfitTarget={isProfitTarget}
          setIsProfitTarget={setIsProfitTarget}
          profitTarget={profitTarget}
          setProfitTarget={setProfitTarget}
        />
      </InnerWrapper>
    </OuterWrapper>
  );
};

const OuterWrapper = styled.div<{ $isSidePanel: boolean }>`
  --transitionTime: 0.3s;
  --width: 400px;
  height: 100%;
  background-color: green;
  position: relative;
  width: ${({ $isSidePanel }) => ($isSidePanel ? "var(--width)" : "0")};
  transition: width var(--transitionTime);
`;
const InnerWrapper = styled.div<{ $isSidePanel: boolean }>`
  height: 100%;
  background-color: beige;
  width: var(--width);
  position: relative;
  left: ${({ $isSidePanel }) => ($isSidePanel ? "0" : "calc(-1*var(--width))")};
  transition: left var(--transitionTime);
  display: flex;
  flex-direction: column;
  padding: 10px;
`;
const CloseButton = styled.button`
  background: none;
  border: none;
  width: fit-content;
  align-self: flex-end;
  cursor: pointer;
  position: absolute;
`;

const SubmitBottom = styled.button`
  background: #88888844;
  border: 1px solid #888888;
  border-radius: 4px;
  padding: 2px;
  align-self: flex-end;
  cursor: pointer;
`;
