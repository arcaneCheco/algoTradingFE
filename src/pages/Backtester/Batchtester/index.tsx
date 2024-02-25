import styled from "styled-components";
import { SidePanel } from "./SidePanel";
import { Content } from "./Content";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import useStore from "@src/store";
import * as STRATEGIES from "@src/strategies";

export const BatchTester = () => {
  const { strategy } = useParams();
  const store = useStore();
  useEffect(() => {
    store.clear();
    if (strategy) {
      // @ts-ignore
      store.setStrategy(STRATEGIES[strategy]);
    }
  }, [strategy]);

  return (
    <Wrapper>
      <SidePanel />
      <Content />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  position: relative;
  display: flex;
  overflow: hidden;
`;
