import { useState } from "react";
import { CandlestickChart } from "./CandlestickChart";
import { EquityAndDrawdownPlot } from "./EquityAndDrawdownPlot";
import { ControlParamGraph } from "./ControlParamGraph";

export const Graphs = ({ setShowGraph }: any) => {
  const [showCandlesticks, setShowCandlesticks] = useState(false);
  const [showEquityAndDrawdown, setShowEquityAndDrawdown] = useState(false);
  const [showControlParamGraph, setShowControlParamGraph] = useState(false);
  return (
    <>
      {showCandlesticks ? (
        <CandlestickChart hide={() => setShowCandlesticks(false)} />
      ) : (
        <Button
          clickhandler={() => setShowCandlesticks(true)}
          copy={"show candlesticks"}
        />
      )}
      {showEquityAndDrawdown ? (
        <EquityAndDrawdownPlot hide={() => setShowEquityAndDrawdown(false)} />
      ) : (
        <Button
          clickhandler={() => setShowEquityAndDrawdown(true)}
          copy={"show equity and drawdown"}
        />
      )}
      {showControlParamGraph ? (
        <ControlParamGraph hide={() => setShowControlParamGraph(false)} />
      ) : (
        <Button
          clickhandler={() => setShowControlParamGraph(true)}
          copy={"show control param plot"}
        />
      )}
    </>
  );
};

export const Button = ({
  clickhandler,
  copy,
}: {
  clickhandler: () => void;
  copy: string;
}) => {
  return <button onClick={clickhandler}>{copy}</button>;
};
