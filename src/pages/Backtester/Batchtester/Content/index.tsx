import styled from "styled-components";
import { PerformanceSummary } from "./PerformanceSummary";
import useStore from "@src/store";
import { Setup } from "./Setup";
import { Graphs } from "./Graphs";
import { ControlParamGraph } from "./ControlParamGraph";

export const Content = () => {
  const { isSidePanel, setIsSidePanel, results } = useStore();
  return (
    <OuterWrapper>
      <Wrapper>
        <OpenSidePanel
          $isSidePanel={isSidePanel}
          onClick={() => setIsSidePanel(true)}
        >
          {">>"}
        </OpenSidePanel>
        <Setup />
        <PerformanceSummary />
        {results.length ? <Graphs /> : null}
        <ControlParamGraph />
      </Wrapper>
    </OuterWrapper>
  );
};

const OuterWrapper = styled.div`
  height: 100%;
  background-color: #bababa;
  overflow: auto;
  /* padding-bottom: 20px; */
  padding: 30px;
  width: 100%;
  display: flex;
  justify-content: center;
`;

const Wrapper = styled.div`
  gap: 20px;
  display: flex;
  flex-direction: column;
  /* width: fit-content; */
  width: 100%;
  max-width: 800px;
  height: fit-content;
`;

const OpenSidePanel = styled.button<{ $isSidePanel: boolean }>`
  background: none;
  border: none;
  position: absolute;
  display: ${({ $isSidePanel }) => ($isSidePanel ? "none" : "")};
  cursor: pointer;
  left: 10px;
  top: 10px;
  font-size: 30px;
  color: white;
`;
