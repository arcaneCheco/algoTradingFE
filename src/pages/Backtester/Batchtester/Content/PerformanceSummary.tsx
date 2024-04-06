import styled from "styled-components";
import { entriesFromObject, getPerformanceSummary } from "@src/utils";
import { useEffect, useRef, useState } from "react";
import { Trade, IPerformanceSummary, Nullable } from "@src/types/types";
import { CandlestickGranularity } from "@lt_surge/algo-trading-shared-types";
import useStore from "@src/store";

type RequiredKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? never : K;
}[keyof T];
// type OptionalKeys<T> = { [K in keyof T]-?: {} extends Pick<T, K> ? K : never }[keyof T];

// interface Hello {
//   name: string; order: number;
// }
// type THeaders = Record<
//   RequiredKeys<IPerformanceSummary> | OptionalKeys<IPerformanceSummary>,
//   { name: string; order: number }
// >;
// type THeaders = Record<
//   keyof IPerformanceSummary,
//   Nullable<{ name: string; order: number }>
// >;
type THeaders = Record<
  keyof IPerformanceSummary,
  { name: string; order: number }
>;
// type THeaders = Record<
//   RequiredKeys<IPerformanceSummary>,
//   { name: string; order: number }
// > & {controlParam: { name: string; order: number } | null};
// type THeaders = {
//   [key in keyof IPerformanceSummary]: { name: string | null; order: number };
// };
// Omit<THeaders, "controlParam">
const initialHeaders: THeaders = {
  controlParam: { name: "control Param", order: 0 },
  positionSize: { name: "position Size", order: 1 },
  monthlyProfit: { name: "monthly Profit", order: 2 },
  yearlyProfit: { name: "yearly Profit", order: 3 },
  netProfit: { name: "net Profit", order: 4 },
  barCount: { name: "bar Count", order: 5 },
  totalTrades: { name: "total Trades", order: 6 },
  numWinningTrades: { name: "num Winning Trades", order: 7 },
  numLosingTrades: { name: "num Losing Trades", order: 8 },
  winRate: { name: "win Rate", order: 9 },
  loseRate: { name: "lose Rate", order: 10 },
  averageWinningTrade: { name: "average Winning Trade", order: 11 },
  averageLosingTrade: { name: "average Losing Trade", order: 12 },
  averageProfitPerTrade: { name: "average Profit Per Trade", order: 13 },
  averageHoldingPeriodBars: {
    name: "average Holding Period (bars)",
    order: 14,
  },
  averageHoldingPeriodDays: {
    name: "average Holding Period (days)",
    order: 15,
  },
  maxDrawdown: { name: "max Drawdown", order: 16 },
};

export const PerformanceSummary = () => {
  const store = useStore();

  const controlParam = store.controlParam;

  const setPerformanceSummaries = store.setPerformanceSummaries;

  const performanceSummaries = store.performanceSummaries;

  const [headers, setHeaders] = useState<THeaders>(initialHeaders);

  useEffect(() => {
    setHeaders({
      ...initialHeaders,
      controlParam: { name: controlParam || "control param", order: 0 },
    });
  }, [controlParam]);

  const [sortBy, setSortBy] =
    useState<keyof IPerformanceSummary>("controlParam");

  const [sortOrder, setSortOrder] = useState(true);

  const sortedHeaders = () => {
    let t = entriesFromObject(headers).sort(
      (entryA, entryB) => entryA[1].order - entryB[1].order
    );
    if (!controlParam) {
      t = t.filter((entry) => entry[0] !== "controlParam");
    }
    return t;
  };

  const sortedTableRow = (row: IPerformanceSummary) => {
    let t = entriesFromObject(row).sort(
      (entryA, entryB) => headers[entryA[0]].order - headers[entryB[0]].order
    );
    if (!controlParam) {
      t = t.filter((entry) => entry[0] !== "controlParam");
    }
    return t;
  };

  const [displayResultIndex, setDisplayResultIndex] = useState(-1);

  const $wrapper = useRef<HTMLDivElement>(null);

  const [scrollIndicatorShadow, setScrollIndicatorShadow] = useState("");

  const scrollHandler = () => {
    // linear-gradient(#ffffff, #00000000 20%) center top,
    // linear-gradient(#00000000 80%, #ffffff) center bottom;
    let s = "";
    if ($wrapper && $wrapper.current) {
      const {
        offsetHeight,
        scrollHeight,
        scrollTop,
        scrollWidth,
        offsetWidth,
        scrollLeft,
      } = $wrapper.current;
      // console.log({ offsetHeight, scrollHeight, scrollTop });
      if (scrollTop > 0) {
        s += ",linear-gradient(#ffffff, #00000000 20%) center top";
      }
      if (scrollHeight - offsetHeight > scrollTop) {
        s += ",linear-gradient(#00000000 80%, #ffffff) center bottom";
      }
      if (scrollWidth - offsetWidth > scrollLeft) {
        s += ",linear-gradient(to left, #ffffff, #00000000 10%) center left";
      }
      if (scrollLeft > 0) {
        s += ",linear-gradient(to left, #00000000 90%, #ffffff) center right";
      }

      setScrollIndicatorShadow(s.substring(1));
    }
  };

  useEffect(() => {
    $wrapper?.current?.addEventListener("scroll", scrollHandler);

    return () =>
      $wrapper?.current?.removeEventListener("scroll", scrollHandler);
  }, []);

  if (!performanceSummaries.length) {
    return null;
  }

  return (
    <Wrapper ref={$wrapper} $scrollIndicatorShadow={scrollIndicatorShadow}>
      <Table>
        <TBody>
          <TableRowHeader>
            {sortedHeaders().map(([prop, { name }]) => (
              <TableHeader
                key={prop}
                data-name={prop}
                $selected={sortBy === prop}
                onClick={(event) => {
                  const name = event.currentTarget.dataset
                    .name as keyof IPerformanceSummary;

                  let sortedResults;
                  if (name === sortBy) {
                    sortedResults = performanceSummaries.sort(
                      (summaryA, summaryB) =>
                        (summaryA[sortBy] - summaryB[sortBy]) *
                        (sortOrder ? -1 : 1)
                    );
                    setSortOrder(!sortOrder);
                  } else {
                    sortedResults = performanceSummaries.sort(
                      (summaryA, summaryB) => summaryA[name] - summaryB[name]
                    );
                    setSortOrder(true);
                  }
                  setSortBy(name);
                  setPerformanceSummaries(sortedResults);
                }}
              >
                {name}
              </TableHeader>
            ))}
          </TableRowHeader>
          {performanceSummaries.map((s, i) => {
            return (
              <TableRow
                key={i + ""}
                $displayResult={i === displayResultIndex}
                onClick={(event) => {
                  const selectedResult = store.results.find(
                    (r) => r.controlParam === s.controlParam
                  );
                  console.log(selectedResult);
                  if (selectedResult) {
                    store.setSelectedResult(selectedResult);
                    setDisplayResultIndex(i);
                  } else {
                    setDisplayResultIndex(-1);
                    console.error("DATA NOT FOUND");
                  }
                }}
              >
                {sortedTableRow(s).map(([prop, value]) => (
                  <TableCell key={prop} $selected={sortBy === prop}>
                    {value}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TBody>
      </Table>
    </Wrapper>
  );
};

const Wrapper = styled.div<{ $scrollIndicatorShadow: string }>`
  display: flex;
  overflow: auto;
  background: ${(props) => props.$scrollIndicatorShadow};
  min-height: 94px;
  max-height: 300px;
`;

const Table = styled.table`
  width: fit-content;
  text-align: center;
  border-collapse: collapse;
  user-select: none;
`;

const TBody = styled.tbody`
  & :last-child {
    border-bottom: 1px solid black;
  }
`;

const TableRowHeader = styled.tr`
  border-top: 1px solid black;
  font-size: 15px;
`;

const TableRow = styled(TableRowHeader)<{ $displayResult: boolean }>`
  &:hover {
    background-color: #ffe100a2;
  }
  background-color: ${({ $displayResult }) =>
    $displayResult ? "#40ff00a1" : ""};
  cursor: pointer;
`;

const TableHeader = styled.th<{ $selected: boolean }>`
  min-width: 60px;
  max-width: 60px;
  text-align: center;
  word-wrap: break-word;
  font-size: 13px;
  cursor: pointer;
  &:hover {
    background-color: #ffe100a2;
  }
  background-color: ${({ $selected }) => ($selected ? "#ffe100a2" : "")};
`;
const TableCell = styled.td<{ $selected: boolean }>`
  position: relative;
  height: 30px;
  background-color: ${({ $selected }) => ($selected ? "#ffe100a2" : "")};
`;
