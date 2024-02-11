import { Form, FormField, FormFields, Title } from "./sharedStyles";

export const StrategyForm = ({
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
  return (
    <Form>
      <Title>Strategy</Title>
      <FormFields>
        <FormField>
          <label>Strategy type</label>
          <div style={{ marginLeft: "20px" }}>
            <div>
              <input
                type="checkbox"
                checked={strategyType === "SIMPLE"}
                onClick={() => setStrategyType("SIMPLE")}
                readOnly
              />
              <label>Simple</label>
            </div>
            <div>
              <div>
                <input
                  type="checkbox"
                  checked={strategyType === "COMPOUND"}
                  onClick={() => setStrategyType("COMPOUND")}
                  readOnly
                />
                <label>Compound</label>
              </div>
              <input
                placeholder="position size"
                disabled={strategyType === "SIMPLE"}
              />
            </div>
          </div>
        </FormField>
        <FormField>
          <label>Strategy</label>
          <div style={{ marginLeft: "20px" }}>
            <div>
              <input
                type="checkbox"
                checked={strategyName === "meanReversion_A"}
                onClick={() => setStrategyName("meanReversion_A")}
                readOnly
              />
              <label>meanReversion_A</label>
            </div>
            <div style={{ marginLeft: "20px" }}>
              <div>
                <label>SMA period</label>
                <input
                  type="number"
                  disabled={strategyName !== "meanReversion_A"}
                />
              </div>
              <div>
                <label>Entry Range</label>
                <input
                  type="number"
                  disabled={strategyName !== "meanReversion_A"}
                />
              </div>
            </div>
          </div>
          <div style={{ marginLeft: "20px" }}>
            <div>
              <input
                type="checkbox"
                checked={strategyName === "meanReversion_B"}
                onClick={() => setStrategyName("meanReversion_B")}
                readOnly
              />
              <label>meanReversion_B</label>
            </div>
            <div style={{ marginLeft: "20px" }}>
              <div>
                <label>SMA period</label>
                <input
                  type="number"
                  disabled={strategyName !== "meanReversion_B"}
                />
              </div>
            </div>
          </div>
        </FormField>
        <FormField>
          <div>
            <input
              type="checkbox"
              checked={isStopLoss}
              onChange={(event) => {
                setIsStopLoss(!isStopLoss);
              }}
            />
            <label>Percentage stop-loss distance</label>
          </div>
          <input
            type="number"
            min={0.0001}
            max={99}
            value={stopLoss}
            onChange={(event) => setStopLoss(Number(event.currentTarget.value))}
            disabled={!isStopLoss}
            style={{ width: "100px", marginLeft: "20px" }}
          />
        </FormField>
        <FormField>
          <div>
            <input
              type="checkbox"
              checked={isProfitTarget}
              onChange={(event) => {
                setIsProfitTarget(!isProfitTarget);
              }}
            />
            <label>Percentage profit-target distance</label>
          </div>
          <input
            type="number"
            min={0.0001}
            max={99}
            value={profitTarget}
            onChange={(event) =>
              setProfitTarget(Number(event.currentTarget.value))
            }
            disabled={!isProfitTarget}
            style={{ width: "100px", marginLeft: "20px" }}
          />
        </FormField>
      </FormFields>
    </Form>
  );
};
