import styled from "styled-components";
import { PerformanceSummary } from "./types/types";

export const PerformanceSummaryTable = ({
  performanceData,
}: {
  performanceData: PerformanceSummary;
}) => {
  return (
    <Wrapper>
      <Table>
        <TBody>
          <TableRow>
            <TableHeader>Property</TableHeader>
            <TableHeader>Value</TableHeader>
          </TableRow>
          {Object.entries(performanceData).map(([property, value]) => {
            return (
              <TableRow key={property}>
                <TableCell>{property}</TableCell>
                <TableCell>{value}</TableCell>
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
  width: 100%;
  height: fit-content;
  display: flex;
  justify-content: center;
`;

const Table = styled.table`
  width: fit-content;
  text-align: center;
  border-collapse: collapse;
`;

const TBody = styled.tbody`
  & :last-child {
    border-bottom: 1px solid black;
  }
`;

const TableRow = styled.tr`
  border-top: 1px solid black;
`;
const TableHeader = styled.th`
  min-width: 200px;
`;
const TableCell = styled.td``;
