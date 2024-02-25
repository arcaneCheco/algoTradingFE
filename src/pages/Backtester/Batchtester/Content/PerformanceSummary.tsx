import styled from "styled-components";
import { entriesFromObject, getPerformanceSummary } from "@src/utils";
import { useEffect, useState } from "react";
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

  const granularity = store.granularity;

  const controlParam = store.controlParam;

  const [headers, setHeaders] = useState<THeaders>(initialHeaders);

  useEffect(() => {
    setHeaders({
      ...initialHeaders,
      controlParam: { name: controlParam || "control param", order: 0 },
    });
  }, [controlParam]);

  const [results, setResults] = useState<Array<IPerformanceSummary>>([]);

  useEffect(() => {
    console.log("HELLO REUSLTS");
    const res = store.results.map((tr: any) => ({
      ...getPerformanceSummary(tr.trades, granularity),
      controlParam: tr.controlParam,
    }));
    setResults(res);
  }, [store.results]);

  console.log(results);

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

  return (
    <Wrapper>
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
                    sortedResults = results.sort(
                      (summaryA, summaryB) =>
                        (summaryA[sortBy] - summaryB[sortBy]) *
                        (sortOrder ? -1 : 1)
                    );
                    setSortOrder(!sortOrder);
                  } else {
                    sortedResults = results.sort(
                      (summaryA, summaryB) => summaryA[name] - summaryB[name]
                    );
                    setSortOrder(true);
                  }
                  setSortBy(name);
                  setResults(sortedResults);
                }}
              >
                {name}
              </TableHeader>
            ))}
          </TableRowHeader>
          {results.map((s, i) => {
            return (
              <TableRow key={i + ""}>
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

const Wrapper = styled.div`
  margin-top: 50px;
  padding: 0 50px;
  height: fit-content;
  display: flex;
  justify-content: center;
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

const TableRow = styled(TableRowHeader)`
  &:hover {
    background-color: #ffe100a2;
  }
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
