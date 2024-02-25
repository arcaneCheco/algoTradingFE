import styled from "styled-components";
import { PerformanceSummary } from "./PerformanceSummary";
import useStore from "@src/store";
import { Setup } from "./Setup";

export const Content = () => {
  const { isSidePanel, setIsSidePanel } = useStore();
  return (
    <OuterWrapper>
      <Wrapper>
        <OpenSidePanel
          $isSidePanel={isSidePanel}
          onClick={() => setIsSidePanel(true)}
        >
          open
        </OpenSidePanel>
        <Setup />
        <PerformanceSummary />
      </Wrapper>
    </OuterWrapper>
  );
};

const OuterWrapper = styled.div`
  height: 100%;
  background-color: #bababa;
  flex-grow: 1;
  position: relative;
  padding-bottom: 20px;
  overflow: auto;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  width: fit-content;
  flex-direction: column;
`;

const OpenSidePanel = styled.button<{ $isSidePanel: boolean }>`
  background: none;
  border: none;
  position: absolute;
  display: ${({ $isSidePanel }) => ($isSidePanel ? "none" : "")};
  cursor: pointer;
  left: 10px;
  top: 10px;
`;
