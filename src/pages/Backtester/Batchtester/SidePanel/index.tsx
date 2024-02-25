import styled from "styled-components";
import { DataForm } from "./DataForm";
import { StrategyForm } from "./StrategyForm";
import { getCandles, getCandlesBigData } from "@src/api";
import { backtest, sma } from "@src/utils";
// import * as STRATEGIES from "@src/strategies";
// import { meanReversion_A, Description } from "@src/strategies/MeanReversion_A";
import { CopyBlock } from "react-code-blocks";
import useStore from "@src/store";

export const SidePanel = () => {
  const store = useStore();

  // const runBatchTest = async () => {
  //   const {
  //     instrument,
  //     startTime,
  //     endTime,
  //     granularity,
  //     smaPeriod,
  //     controlParam,
  //     activeParams,
  //     stopLoss,
  //   } = store;
  //   if (!smaPeriod) return;
  //   console.log({ instrument, startTime, endTime, granularity });
  //   const candleData = await getCandlesBigData({
  //     instrument,
  //     params: {
  //       from: startTime,
  //       to: endTime,
  //       granularity,
  //     },
  //   });

  //   if (!controlParam) {
  //     const additionalData = await getCandles({
  //       instrument,
  //       params: {
  //         to: startTime,
  //         count: `${smaPeriod.value}`,
  //         granularity,
  //       },
  //     });
  //     additionalData.pop();

  //     console.log({ is: activeParams.stopLoss, stopLoss: stopLoss.value });

  //     // const res = meanReversion_A({
  //     //   candles: candleData,
  //     //   smaSeries: sma([...additionalData, ...candleData], smaPeriod.value),
  //     //   buyRange: 0.2,
  //     //   units: 1000,
  //     //   stopLoss: activeParams.stopLoss ? stopLoss.value : undefined,
  //     // });

  //     // store.setResults([{ ...res, controlParam: 0 }]);
  //     return;
  //   }

  //   if (controlParam === "smaPeriod") {
  //     const additionalData = await getCandles({
  //       instrument,
  //       params: {
  //         to: startTime,
  //         count: `${smaPeriod.maxValue}`,
  //         granularity,
  //       },
  //     });
  //     additionalData.pop();

  //     const results = [];

  //     for (
  //       let i = smaPeriod.minValue;
  //       i <= smaPeriod.maxValue;
  //       i += smaPeriod.stepSize
  //     ) {
  //       const smaSeries = sma(
  //         [...additionalData.slice(-(i - 1)), ...candleData],
  //         i
  //       );
  //       // const { trades, transactions } = meanReversion_A({
  //       //   candles: candleData,
  //       //   smaSeries: smaSeries,
  //       //   buyRange: 0.2,
  //       //   units: 1000,
  //       // });
  //       // results.push({ trades, transactions, controlParam: i });
  //     }

  //     // store.setResults(results);
  //   }

  //   if (controlParam === "stopLoss") {
  //     const additionalData = await getCandles({
  //       instrument,
  //       params: {
  //         to: startTime,
  //         count: `${smaPeriod.value}`,
  //         granularity,
  //       },
  //     });
  //     additionalData.pop();

  //     const smaSeries = sma(
  //       [...additionalData, ...candleData],
  //       smaPeriod.value
  //     );

  //     // const results = [];

  //     for (
  //       let i = stopLoss.minValue;
  //       i <= stopLoss.maxValue;
  //       i += stopLoss.stepSize
  //     ) {
  //       // const { trades, transactions } = meanReversion_A({
  //       //   candles: candleData,
  //       //   smaSeries: smaSeries,
  //       //   buyRange: 0.2,
  //       //   units: 1000,
  //       //   stopLoss: i,
  //       // });
  //       // results.push({ trades, transactions, controlParam: i });
  //     }

  //     // store.setResults(results);
  //   }
  // };

  return (
    <OuterWrapper $isSidePanel={store.isSidePanel}>
      <InnerWrapper $isSidePanel={store.isSidePanel}>
        <CloseButton onClick={() => store.setIsSidePanel(false)}>X</CloseButton>
        <DataForm />
        <SubmitBottom onClick={async () => await store.strategy.runBatchTest()}>
          Run
        </SubmitBottom>
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
