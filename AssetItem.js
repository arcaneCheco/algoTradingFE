import { useState } from "react";
import styled from "styled-components";

export const AssetItem = ({ data }) => {
  console.log({ data });
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <Wrapper>
      <AssetsItemButton onClick={() => setIsExpanded(!isExpanded)}>
        {data.symbol}
      </AssetsItemButton>
      <AssetsItemInfo $expand={isExpanded}>
        {JSON.stringify(data, null, 2)}
      </AssetsItemInfo>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  font-size: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const AssetsItemButton = styled.button`
  height: 30px;
  width: 100%;
  font-size: 15px;
`;

const AssetsItemInfo = styled.pre`
  width: fit-content;
  font-size: 12px;
  display: ${({ $expand }) => ($expand ? "" : "none")};
  padding: ${({ $expand }) => ($expand ? "5px 0" : "")};
  height: ${({ $expand }) => ($expand ? "" : "0")};
`;
