import { useMyStore } from "@src/store";
import { BacktestData, backtest, sma } from "@src/utils";
import styled from "styled-components";
import { myStrategy } from "@src/myStrategy";
import { set1 } from "@src/testdata";

export const BacktestSetup = () => {
  const isStopLoss = useMyStore.use.isStopLoss();
  const setIsStopLoss = useMyStore.use.setIsStopLoss();
  const isProfitTarget = useMyStore.use.isProfitTarget();
  const setIsProfitTarget = useMyStore.use.setIsProfitTarget();
  const stopDistancePct = useMyStore.use.stopDistancePct();
  const setStopDistancePct = useMyStore.use.setStopDistancePct();
  const profitDistancePct = useMyStore.use.profitDistancePct();
  const setProfitDistancePct = useMyStore.use.setProfitDistancePct();
  const includeSpreads = useMyStore.use.includeSpreads();
  const setIncludeSpreads = useMyStore.use.setIncludeSpreads();
  const candleData = useMyStore.use.candleData();
  const smaData = useMyStore.use.smaData();
  const smaPeriod = useMyStore.use.smaPeriod();
  const setTrades = useMyStore.use.setTrades();
  return (
    <RunBacktestWrapper>
      <StopLossWrapper>
        <div>
          <label>Use stop-loss</label>
          <input
            type="checkbox"
            checked={isStopLoss}
            onChange={(event) => setIsStopLoss(!isStopLoss)}
          />
        </div>
        {isStopLoss && (
          <input
            type="number"
            value={stopDistancePct}
            onChange={(event) =>
              setStopDistancePct(Number(event.currentTarget.value))
            }
          />
        )}
      </StopLossWrapper>
      <StopLossWrapper>
        <div>
          <label>Use profit-target</label>
          <input
            type="checkbox"
            checked={isProfitTarget}
            onChange={() => setIsProfitTarget(!isProfitTarget)}
          />
        </div>
        {isProfitTarget && (
          <input
            type="number"
            value={profitDistancePct}
            onChange={(event) =>
              setProfitDistancePct(Number(event.currentTarget.value))
            }
          />
        )}
      </StopLossWrapper>
      <StopLossWrapper>
        <div>
          <label>Include spreads</label>
          <input
            type="checkbox"
            checked={includeSpreads}
            onChange={() => setIncludeSpreads(!includeSpreads)}
          />
        </div>
      </StopLossWrapper>
      <button
        onClick={() => {
          const backTestData = candleData
            .map((candle, index) => {
              return { ...candle, sma: smaData[index] };
            })
            .slice(smaPeriod - 1) as unknown as Array<BacktestData>;
          const { trades } = backtest(myStrategy, backTestData, {
            isStopLoss,
            isProfitTarget,
            stopDistancePct,
            profitDistancePct,
            includeSpreads,
          });
          setTrades(trades);
        }}
      >
        run backtest
      </button>
    </RunBacktestWrapper>
  );
};

const RunBacktestWrapper = styled.div`
  border: 1px solid black;
  margin-top: 30px;
  width: 100%;
  display: flex;
  justify-content: center;
`;

const StopLossWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
