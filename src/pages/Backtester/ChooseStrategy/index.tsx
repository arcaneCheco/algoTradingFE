import styled from "styled-components";
import { Link } from "react-router-dom";

export const ChooseStrategy = () => {
  return (
    <Wrapper>
      <Rows>
        <Row>
          <StrategyBox>
            <BoxLink to="meanReversion_A" />
            <p>MEAN_REVERSION_A</p>
            <InfoIconWrapper onClick={() => {}}>
              <InfoIcon />
            </InfoIconWrapper>
          </StrategyBox>
          <StrategyBox>
            <BoxLink to="meanReversion_B" />
            <p>MEAN_REVERSION_B</p>
            <InfoIconWrapper onClick={() => {}}>
              <InfoIcon />
            </InfoIconWrapper>
          </StrategyBox>
        </Row>
      </Rows>
    </Wrapper>
  );
};

const InfoIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9 18H15M15 17C15 14 19 12 19 8C19 4 16 1 12 1C8 1 5 4 5 8C5 12 9 14 9 17V20C9 22 10 23 12 23C14 23 15 22 15 20V17Z"
      stroke="black"
      strokeWidth="2"
    />
  </svg>
);

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  padding: 20px;
  background: beige;
`;

const InfoIconWrapper = styled.div`
  position: absolute;
  right: 10px;
  top: 10px;
  height: 30px;
  cursor: help;
  & svg {
    height: 100%;
    width: fit-content;
  }
`;

const BoxLink = styled(Link)`
  width: 100%;
  height: 100%;
  position: absolute;
`;

const Rows = styled.div`
  display: flex;
  flex-direction: column;
`;
const Row = styled.div`
  display: flex;
  gap: 15px;
`;
const StrategyBox = styled.div`
  width: 200px;
  height: 200px;
  background-color: #3ca4ff;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;
