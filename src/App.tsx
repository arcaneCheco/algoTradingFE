import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BotPerformance } from "./pages/BotPerformance";
import { Layout } from "./pages/Layout";
import { Backtester, ChooseStrategy } from "./pages/Backtester";
import BacktesterNav from "./pages/Backtester/Layout";
import { BatchTester } from "./pages/Backtester/Batchtester";
import { useContext } from "react";
// import { FreezerContext } from ".";

export const App = () => {
  // const store = useContext(FreezerContext);
  // console.log(store.get());
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="botPerformance" element={<BotPerformance />} />
          <Route path="backtester">
            {/* <Route path="" element={<BacktesterNav />}> */}
            <Route>
              <Route path="" element={<ChooseStrategy />} />
              <Route path=":strategy" element={<BatchTester />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
