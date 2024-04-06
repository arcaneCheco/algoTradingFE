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

  return (
    <OuterWrapper $isSidePanel={store.isSidePanel}>
      <InnerWrapper $isSidePanel={store.isSidePanel}>
        <CloseButton onClick={() => store.setIsSidePanel(false)}>X</CloseButton>
        <DataForm />
        <SubmitBottom
          onClick={async () => {
            await store.getCandles();
            await store.strategy.runBatchTest();
          }}
        >
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
  /* background-color: green; */
  position: relative;
  pointer-events: none;
  /* width: ${({ $isSidePanel }) => ($isSidePanel ? "var(--width)" : "0")}; */
  /* transition: width var(--transitionTime); */
  position: absolute;
  z-index: 1;
`;
const InnerWrapper = styled.div<{ $isSidePanel: boolean }>`
  height: 100%;
  background-color: beige;
  pointer-events: all;
  /* width: var(--width); */
  position: relative;
  /* left: ${({ $isSidePanel }) =>
    $isSidePanel ? "0" : "calc(-1*var(--width))"}; */
  transition: left var(--transitionTime);
  left: ${({ $isSidePanel }) => ($isSidePanel ? "0" : "-100%")};
  display: flex;
  flex-direction: column;
  padding: 10px;
  backdrop-filter: blur(2px);
  background-color: #00000014;
  width: fit-content;
  padding-right: 20px;
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
