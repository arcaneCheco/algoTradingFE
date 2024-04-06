import useStore, { DataParamSMA } from "@src/store";
import { keysFromObject } from "@src/utils";
import styled from "styled-components";

const isDataParamSMA = (value: any): value is DataParamSMA => {
  if (value.value) return true;
  else return false;
};

export const Setup = () => {
  const store = useStore();

  const controlParam = store.controlParam;
  const setup = store.strategy.setup;
  const activeParams = store.activeParams;

  const setupConstants = keysFromObject(activeParams).filter(
    (val) => activeParams[val] && val !== controlParam && !!setup[val]
  );

  return (
    <SetupWrapper>
      {setupConstants.map((param) => {
        let val = store[param];
        return (
          <SetupItem key={param}>
            <p>{param}</p>
            <p>
              {
                // @ts-ignore
                val.value ? val.value : val
              }
            </p>
          </SetupItem>
        );
      })}
    </SetupWrapper>
  );
};

const SetupWrapper = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;
const SetupItem = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  background-color: #75d9ff;
  border-radius: 10px;
`;
