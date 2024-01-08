import { useState } from "react";
import styled from "styled-components";
import { AssetItem } from "./AssetItem";

export const App = () => {
  const [assets, setAssets] = useState([
    {
      id: "da14efff-c929-4779-a9ad-04dbf116e5df",
      class: "us_equity",
      exchange: "OTC",
      symbol: "MTMV1",
      name: "MOTOMOVA INC.  Common Stock",
      status: "inactive",
      tradable: false,
      marginable: false,
      maintenance_margin_requirement: 100,
      shortable: false,
      easy_to_borrow: false,
      fractionable: false,
      attributes: [],
    },
    {
      id: "da14efff-c929-4779-a9ad-04dbf116e5df",
      class: "us_equity",
      exchange: "OTC",
      symbol: "MTMV2",
      name: "MOTOMOVA INC.  Common Stock",
      status: "inactive",
      tradable: false,
      marginable: false,
      maintenance_margin_requirement: 100,
      shortable: false,
      easy_to_borrow: false,
      fractionable: false,
      attributes: [],
    },
    {
      id: "da14efff-c929-4779-a9ad-04dbf116e5df",
      class: "us_equity",
      exchange: "OTC",
      symbol: "MTMV3",
      name: "MOTOMOVA INC.  Common Stock",
      status: "inactive",
      tradable: false,
      marginable: false,
      maintenance_margin_requirement: 100,
      shortable: false,
      easy_to_borrow: false,
      fractionable: false,
      attributes: [],
    },
  ]);

  const [filters, setFilters] = useState({
    status: "",
    asset_class: "usEquity",
    exchange: "",
  });

  const [loading, setLoading] = useState(false);

  return (
    <div>
      <AssetPageWrapper>
        <FiltersWrapper>
          <select
            id="status"
            value={filters.status}
            onChange={(event) => {
              setFilters({ ...filters, status: event.currentTarget.value });
            }}
          >
            <option value="">All</option>
            <option value="active">active</option>
            <option value="inactive">inactive</option>
          </select>
          <select
            id="asset_class"
            value={filters.asset_class}
            onChange={(event) => {
              setFilters({
                ...filters,
                asset_class: event.currentTarget.value,
              });
            }}
          >
            <option value="us_equity">us_equity</option>
            <option value="crypto">crypto</option>
          </select>
          <select
            id="exchange"
            value={filters.exchange}
            onChange={(event) => {
              setFilters({ ...filters, exchange: event.currentTarget.value });
            }}
          >
            <option value="">all</option>
            <option value="AMEX">AMEX</option>
            <option value="ARCA">ARCA</option>
            <option value="BATS">BATS</option>
            <option value="NYSE">NYSE</option>
            <option value="NASDAQ">NASDAQ</option>
            <option value="NYSEARCA">NYSEARCA</option>
            <option value="OTC">OTC</option>
          </select>
        </FiltersWrapper>
        <button
          disabled={loading}
          onClick={async () => {
            setLoading(true);
            const data = await fetch("http://localhost:3000/assets", {
              method: "POST",
              body: JSON.stringify(filters),
              headers: {
                "Content-Type": "application/json",
              },
            });
            const res = await data.json();
            setAssets(res);
            console.log({ res });
            setLoading(false);
          }}
        >
          Get assets
        </button>
        <AssetsList>
          {assets.map((asset) => {
            return <AssetItem key={asset.symbol} data={asset} />;
          })}
        </AssetsList>
      </AssetPageWrapper>
    </div>
  );
};

const AssetPageWrapper = styled.div`
  border: 1px solid black;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
`;

const FiltersWrapper = styled.div`
  border: 1px solid black;
  display: flex;
`;

const AssetsList = styled.div`
  border: 1px solid black;
  overflow: auto;
  max-height: 500px;
  width: 400px;
`;
