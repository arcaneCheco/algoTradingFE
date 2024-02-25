import useStore from "@src/store";
import { FormField } from "./sharedStyles";
import MultiRangeSlider from "multi-range-slider-react";
import styled from "styled-components";
import { useEffect } from "react";
import { SetupParam } from "@src/types/types";

export const DataFormField = ({
  children,
  name,
  options,
}: {
  name: SetupParam;
  children?: JSX.Element | JSX.Element[];
  options?: any;
}) => {
  const state = useStore();
  const setup = state.strategy.setup[name];
  if (!setup) return null;

  const isControlParam = state.controlParam === name;
  const isActive = !!state.activeParams[name];

  return (
    <FormField>
      <InputNButton>
        {setup.optional && (
          <input
            type="checkbox"
            checked={isActive}
            onChange={() => state.updateActiveParam(name)}
          />
        )}
        <p>{name}</p>
        {setup.control && isActive && (
          <>
            <button
              onClick={() =>
                state.setControlParam(isControlParam ? null : name)
              }
            >
              {isControlParam ? "setValue" : "setRange"}
            </button>
          </>
        )}
      </InputNButton>
      {options?.type === "number" &&
        isActive &&
        (!isControlParam ? (
          <input
            type="number"
            min={options.min}
            max={options.max}
            value={options.value}
            step={options.minStep}
            onChange={(event) =>
              !isNaN(Number(event.currentTarget.value)) &&
              Number(event.currentTarget.value) >= options.min &&
              options.setter({ value: Number(event.currentTarget.value) })
            }
            style={{ width: "100px", marginLeft: "20px" }}
          />
        ) : (
          <RangeWrapper>
            <Inputs>
              <InputWrapper>
                <p>step</p>
                <input
                  type="number"
                  value={options.stepSize}
                  onChange={(event) =>
                    options.setter({
                      stepSize: Number(event.currentTarget.value),
                    })
                  }
                  step={options.minStep}
                  style={{ width: "100%" }}
                />
              </InputWrapper>
              <InputWrapper>
                <p>min</p>
                <input
                  type="number"
                  value={options.minValue}
                  onChange={(event) =>
                    options.setter({
                      minValue: Number(event.currentTarget.value),
                    })
                  }
                  step={options.minStep}
                  style={{ width: "100%" }}
                />
              </InputWrapper>
              <InputWrapper>
                <p>max</p>
                <input
                  type="number"
                  value={options.maxValue}
                  onChange={(event) =>
                    options.setter({
                      maxValue: Number(event.currentTarget.value),
                    })
                  }
                  step={options.minStep}
                  style={{ width: "100%" }}
                />
              </InputWrapper>
            </Inputs>
            <Silder
              min={options.min}
              max={options.max}
              step={options.stepSize}
              minValue={options.minValue}
              maxValue={options.maxValue}
              stepOnly={true}
              ruler={false}
              label={false}
              onInput={(e) => {
                if (
                  e.maxValue === options.maxValue &&
                  e.minValue === options.minValue
                )
                  return;
                console.log("INPUTTING??");
                options.setter({
                  maxValue: e.maxValue,
                  minValue: e.minValue,
                });
              }}
            />
          </RangeWrapper>
        ))}
      {isActive && children}
    </FormField>
  );
};

const Silder = styled(MultiRangeSlider)`
  border: none;
  box-shadow: none;
  width: 50%;
`;

const InputNButton = styled.div`
  display: flex;
  gap: 10px;
`;
const RangeWrapper = styled.div`
  display: flex;
  margin-left: 20px;
  width: 100%;
  margin-top: 10px;
  /* align-items: center; */
  flex-direction: column;
  position: relative;
`;

const Inputs = styled.div`
  display: flex;
  gap: 10px;
`;
const InputWrapper = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  width: 16%;
  height: 100%;
  align-items: center;
`;
