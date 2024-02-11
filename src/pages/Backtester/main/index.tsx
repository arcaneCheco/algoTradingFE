import styled from "styled-components";
import { SidePanel } from "./SidePanel";
import { Content } from "./Content";
import { useState } from "react";

export const Backtester = () => {
  const [isSidePanel, setIsSidePanel] = useState(false);
  const [assetName, setAssetName] = useState("EUR_USD");
  const [startTime, setStartTime] = useState(
    new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 31).toISOString()
  );
  const [endTime, setEndTime] = useState(
    new Date(new Date().getTime() - 1000 * 60 * 60 * 24).toISOString()
  );
  const [granularity, setGranularity] = useState("D");
  const [isSMA, setIsSMA] = useState(false);
  const [smaPeriod, setSMAPeriod] = useState(40);
  const [candles, setCandles] = useState<any>([]);
  const [sma, setSMA] = useState<any>([]);
  const [strategyType, setStrategyType] = useState("SIMPLE");
  const [strategyName, setStrategyName] = useState("meanReversion_A");
  const [isStopLoss, setIsStopLoss] = useState(false);
  const [stopLoss, setStopLoss] = useState(3);
  const [isProfitTarget, setIsProfitTarget] = useState(false);
  const [profitTarget, setProfitTarget] = useState(1.25);

  return (
    <Wrapper>
      <SidePanel
        isSidePanel={isSidePanel}
        setIsSidePanel={setIsSidePanel}
        assetName={assetName}
        setAssetName={setAssetName}
        startTime={startTime}
        setStartTime={setStartTime}
        endTime={endTime}
        setEndTime={setEndTime}
        granularity={granularity}
        setGranularity={setGranularity}
        isSMA={isSMA}
        setIsSMA={setIsSMA}
        smaPeriod={smaPeriod}
        setSMAPeriod={setSMAPeriod}
        setCandles={setCandles}
        setSMAData={setSMA}
        strategyType={strategyType}
        setStrategyType={setStrategyType}
        strategyName={strategyName}
        setStrategyName={setStrategyName}
        isStopLoss={isStopLoss}
        setIsStopLoss={setIsStopLoss}
        stopLoss={stopLoss}
        setStopLoss={setStopLoss}
        isProfitTarget={isProfitTarget}
        setIsProfitTarget={setIsProfitTarget}
        profitTarget={profitTarget}
        setProfitTarget={setProfitTarget}
      />
      <Content
        isSidePanel={isSidePanel}
        setIsSidePanel={setIsSidePanel}
        candleData={candles}
        smaData={sma}
      />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  position: relative;
  display: flex;
`;
