import styled from "styled-components";
import Chart from "react-apexcharts";
import { useState } from "react";
import { ApexOptions } from "apexcharts";
import { PerformanceSummary } from "./PerformanceSummary";

// TO-DO SET INITIAL SCALE OF CHART (AT THE MOMENT SMA CHART IS WRONG AND ONLY CORRECTS ITSELF AFTER USING BRUSH SELECTION)
//heyeeofejp
const baseChartOptions: ApexOptions = {
  chart: {
    id: "candles",
    zoom: {
      enabled: false,
      autoScaleYaxis: false,
    },
    toolbar: {
      autoSelected: "pan",
      show: false,
    },
    animations: {
      enabled: false,
    },
  },
  stroke: {
    curve: "straight",
  },
  xaxis: {
    type: "datetime",
  },
  tooltip: {
    enabled: false,
  },
};

const iconBUY =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTA5IiBoZWlnaHQ9IjkxIiB2aWV3Qm94PSIwIDAgMTA5IDkxIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNMTA1LjE3NSA0Mi4zNDQ3QzEwNi4wNDUgNDMuMDUxMyAxMDYuNTUgNDQuMTEyNSAxMDYuNTUgNDUuMjMzNVY4NC43NDA2QzEwNi41NSA4Ni43OTU2IDEwNC44ODUgODguNDYxNiAxMDIuODMgODguNDYxNkw1LjI3MTQxIDg4LjQ2MTZDMy4yMTY0IDg4LjQ2MTYgMS41NTA0OCA4Ni43OTU3IDEuNTUwNDggODQuNzQwNkwxLjU1MDQ4IDQ1LjIxMzdDMS41NTA0OCA0NC4xMDQxIDIuMDQ1NzQgNDMuMDUyMyAyLjkwMTEzIDQyLjM0NTRMNTEuMjM2IDIuNDAzMDJDNTIuNjAyMyAxLjI3MzkyIDU0LjU3NTQgMS4yNjUzNSA1NS45NTE1IDIuMzgyNTRMMTA1LjE3NSA0Mi4zNDQ3WiIgZmlsbD0iIzAwRDFGRiIgZmlsbC1vcGFjaXR5PSIwLjYzIi8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTAyLjgyOSA4Ni45MTEyQzEwNC4wMjggODYuOTExMiAxMDUgODUuOTM5NCAxMDUgODQuNzQwNkwxMDUgNDUuMjMzNUMxMDUgNDQuNTc5NiAxMDQuNzA1IDQzLjk2MDUgMTA0LjE5OCA0My41NDg0TDU0Ljk3NDIgMy41ODYyQzU0LjE3MTUgMi45MzQ1IDUzLjAyMDUgMi45Mzk1IDUyLjIyMzUgMy41OTgxNEwzLjg4ODY2IDQzLjU0MDZDMy4zODk2OCA0My45NTI5IDMuMTAwNzcgNDQuNTY2NCAzLjEwMDc3IDQ1LjIxMzdMMy4xMDA3NyA4NC43NDA2QzMuMTAwNzcgODUuOTM5NCA0LjA3MjU2IDg2LjkxMTIgNS4yNzEzMiA4Ni45MTEyTDEwMi44MjkgODYuOTExMlpNMTA4LjEwMSA4NC43NDA2QzEwOC4xMDEgODcuNjUxOSAxMDUuNzQxIDkwLjAxMTkgMTAyLjgyOSA5MC4wMTE5TDUuMjcxMzIgOTAuMDEyQzIuMzYwMDYgOTAuMDEyIDMuNzEwMDZlLTA2IDg3LjY1MTkgMy40NTU1NWUtMDYgODQuNzQwNkwwIDQ1LjIxMzdDLTEuMzc0MzFlLTA3IDQzLjY0MTcgMC43MDE2MjIgNDIuMTUxNyAxLjkxMzQzIDQxLjE1MDNMNTAuMjQ4MyAxLjIwNzg5QzUyLjE4MzkgLTAuMzkxNjY5IDU0Ljk3OTEgLTAuNDAzNzkyIDU2LjkyODYgMS4xNzg4OUwxMDYuMTUyIDQxLjE0MTFDMTA3LjM4NSA0Mi4xNDIgMTA4LjEwMSA0My42NDU0IDEwOC4xMDEgNDUuMjMzNVY4NC43NDA2WiIgZmlsbD0iIzAwRDFGRiIvPgo8cGF0aCBkPSJNOS4yNzcwNSA4MS41NTA0VjQ2LjY0MTNIMjEuNDgxNkMyMy45MTM0IDQ2LjY0MTMgMjUuOTE5MSA0Ny4wNjE4IDI3LjQ5ODYgNDcuOTAyN0MyOS4wNzgyIDQ4LjczMjMgMzAuMjU0MyA0OS44NTE2IDMxLjAyNyA1MS4yNjA3QzMxLjc5OTggNTIuNjU4NCAzMi4xODYxIDU0LjIwOTUgMzIuMTg2MSA1NS45MTQxQzMyLjE4NjEgNTcuNDE0MSAzMS45MTkxIDU4LjY1MjcgMzEuMzg1IDU5LjYzQzMwLjg2MjMgNjAuNjA3MyAzMC4xNjkxIDYxLjM4IDI5LjMwNTUgNjEuOTQ4MkMyOC40NTMyIDYyLjUxNjMgMjcuNTI3IDYyLjkzNjggMjYuNTI3IDYzLjIwOTVWNjMuNTUwNEMyNy41OTUyIDYzLjYxODYgMjguNjY5MSA2My45OTM2IDI5Ljc0ODYgNjQuNjc1NEMzMC44MjgyIDY1LjM1NzMgMzEuNzMxNiA2Ni4zMzQ1IDMyLjQ1ODkgNjcuNjA3M0MzMy4xODYxIDY4Ljg4IDMzLjU0OTggNzAuNDM2OCAzMy41NDk4IDcyLjI3NzdDMzMuNTQ5OCA3NC4wMjc3IDMzLjE1MiA3NS42MDE2IDMyLjM1NjYgNzYuOTk5M0MzMS41NjExIDc4LjM5NyAzMC4zMDU1IDc5LjUwNSAyOC41ODk1IDgwLjMyMzJDMjYuODczNiA4MS4xNDEzIDI0LjY0MDcgODEuNTUwNCAyMS44OTA3IDgxLjU1MDRIOS4yNzcwNVpNMTMuNTA0MyA3Ny44MDA0SDIxLjg5MDdDMjQuNjUyIDc3LjgwMDQgMjYuNjEyMyA3Ny4yNjYzIDI3Ljc3MTQgNzYuMTk4MkMyOC45NDE4IDc1LjExODYgMjkuNTI3IDczLjgxMTggMjkuNTI3IDcyLjI3NzdDMjkuNTI3IDcxLjA5NTkgMjkuMjI1OSA3MC4wMDUgMjguNjIzNiA2OS4wMDVDMjguMDIxNCA2Ny45OTM2IDI3LjE2MzQgNjcuMTg2OCAyNi4wNDk4IDY2LjU4NDVDMjQuOTM2MSA2NS45NzA5IDIzLjYxOCA2NS42NjQxIDIyLjA5NTIgNjUuNjY0MUgxMy41MDQzVjc3LjgwMDRaTTEzLjUwNDMgNjEuOTgyM0gyMS4zNDUyQzIyLjYxOCA2MS45ODIzIDIzLjc2NTcgNjEuNzMyMyAyNC43ODg0IDYxLjIzMjNDMjUuODIyNSA2MC43MzIzIDI2LjY0MDcgNjAuMDI3NyAyNy4yNDMgNTkuMTE4NkMyNy44NTY2IDU4LjIwOTUgMjguMTYzNCA1Ny4xNDEzIDI4LjE2MzQgNTUuOTE0MUMyOC4xNjM0IDU0LjM4IDI3LjYyOTMgNTMuMDc4OCAyNi41NjExIDUyLjAxMDdDMjUuNDkzIDUwLjkzMTEgMjMuNzk5OCA1MC4zOTEzIDIxLjQ4MTYgNTAuMzkxM0gxMy41MDQzVjYxLjk4MjNaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNjMuNDA0OSA0Ni42NDEzSDY3LjYzMjJWNjkuNzU1QzY3LjYzMjIgNzIuMTQxMyA2Ny4wNjk3IDc0LjI3MiA2NS45NDQ3IDc2LjE0N0M2NC44MzEgNzguMDEwNyA2My4yNTcyIDc5LjQ4MjMgNjEuMjIzMSA4MC41NjE4QzU5LjE4OSA4MS42MyA1Ni44MDI2IDgyLjE2NDEgNTQuMDY0IDgyLjE2NDFDNTEuMzI1MyA4Mi4xNjQxIDQ4LjkzOSA4MS42MyA0Ni45MDQ5IDgwLjU2MThDNDQuODcwOCA3OS40ODIzIDQzLjI5MTMgNzguMDEwNyA0Mi4xNjYzIDc2LjE0N0M0MS4wNTI2IDc0LjI3MiA0MC40OTU4IDcyLjE0MTMgNDAuNDk1OCA2OS43NTVWNDYuNjQxM0g0NC43MjMxVjY5LjQxNDFDNDQuNzIzMSA3MS4xMTg2IDQ1LjA5ODEgNzIuNjM1NyA0NS44NDgxIDczLjk2NTJDNDYuNTk4MSA3NS4yODM0IDQ3LjY2NjMgNzYuMzIzMiA0OS4wNTI2IDc3LjA4NDVDNTAuNDUwMyA3Ny44MzQ1IDUyLjEyMDggNzguMjA5NSA1NC4wNjQgNzguMjA5NUM1Ni4wMDcyIDc4LjIwOTUgNTcuNjc3NiA3Ny44MzQ1IDU5LjA3NTMgNzcuMDg0NUM2MC40NzMxIDc2LjMyMzIgNjEuNTQxMyA3NS4yODM0IDYyLjI3OTkgNzMuOTY1MkM2My4wMjk5IDcyLjYzNTcgNjMuNDA0OSA3MS4xMTg2IDYzLjQwNDkgNjkuNDE0MVY0Ni42NDEzWiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTczLjA3MzkgNDYuNjQxM0g3Ny45MTQ4TDg3LjU5NjYgNjIuOTM2OEg4OC4wMDU3TDk3LjY4NzYgNDYuNjQxM0gxMDIuNTI4TDg5LjkxNDggNjcuMTY0MVY4MS41NTA0SDg1LjY4NzZWNjcuMTY0MUw3My4wNzM5IDQ2LjY0MTNaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K";
const iconSELL =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTA5IiBoZWlnaHQ9IjkxIiB2aWV3Qm94PSIwIDAgMTA5IDkxIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNMi45MjYwNSA0Ny42NjcyQzIuMDU1NzcgNDYuOTYwNyAxLjU1MDM5IDQ1Ljg5OTQgMS41NTAzOSA0NC43Nzg0VjUuMjcxMzJDMS41NTAzOSAzLjIxNjMgMy4yMTYzIDEuNTUwMzkgNS4yNzEzMiAxLjU1MDM5SDEwMi44MjlDMTA0Ljg4NCAxLjU1MDM5IDEwNi41NSAzLjIxNjMgMTA2LjU1IDUuMjcxMzJWNDQuNzk4MkMxMDYuNTUgNDUuOTA3OSAxMDYuMDU1IDQ2Ljk1OTYgMTA1LjIgNDcuNjY2NUw1Ni44NjQ5IDg3LjYwODlDNTUuNDk4NSA4OC43MzggNTMuNTI1NCA4OC43NDY2IDUyLjE0OTMgODcuNjI5NEwyLjkyNjA1IDQ3LjY2NzJaIiBmaWxsPSIjRkY5OTAwIiBmaWxsLW9wYWNpdHk9IjAuNjMiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik01LjI3MTMyIDMuMTAwNzhDNC4wNzI1NiAzLjEwMDc4IDMuMTAwNzggNC4wNzI1NiAzLjEwMDc4IDUuMjcxMzJWNDQuNzc4NEMzLjEwMDc4IDQ1LjQzMjMgMy4zOTU1OCA0Ni4wNTE0IDMuOTAzMjUgNDYuNDYzNkw1My4xMjY1IDg2LjQyNThDNTMuOTI5MyA4Ny4wNzc0IDU1LjA4MDIgODcuMDcyNCA1NS44NzczIDg2LjQxMzhMMTA0LjIxMiA0Ni40NzE0QzEwNC43MTEgNDYuMDU5MSAxMDUgNDUuNDQ1NSAxMDUgNDQuNzk4MlY1LjI3MTMyQzEwNSA0LjA3MjU2IDEwNC4wMjggMy4xMDA3OCAxMDIuODI5IDMuMTAwNzhINS4yNzEzMlpNMCA1LjI3MTMyQzAgMi4zNjAwNSAyLjM2MDA1IDAgNS4yNzEzMiAwSDEwMi44MjlDMTA1Ljc0MSAwIDEwOC4xMDEgMi4zNjAwNSAxMDguMTAxIDUuMjcxMzJWNDQuNzk4MkMxMDguMTAxIDQ2LjM3MDIgMTA3LjM5OSA0Ny44NjAyIDEwNi4xODcgNDguODYxNkw1Ny44NTI1IDg4LjgwNDFDNTUuOTE2OSA5MC40MDM2IDUzLjEyMTYgOTAuNDE1NyA1MS4xNzIyIDg4LjgzMzFMMS45NDg4NiA0OC44NzA5QzAuNzE1OTUyIDQ3Ljg2OTkgMCA0Ni4zNjY1IDAgNDQuNzc4NFY1LjI3MTMyWiIgZmlsbD0iI0ZGOTkwMCIvPgo8cGF0aCBkPSJNMjUuMzQ2NiAxNi45MDkxQzI1LjE1MDYgMTUuMjUzOCAyNC4zNTU2IDEzLjk2ODggMjIuOTYxNiAxMy4wNTRDMjEuNTY3NyAxMi4xMzkyIDE5Ljg1OCAxMS42ODE4IDE3LjgzMjQgMTEuNjgxOEMxNi4zNTEzIDExLjY4MTggMTUuMDU1NCAxMS45MjE0IDEzLjk0NDYgMTIuNDAwNkMxMi44NDQ3IDEyLjg3OTcgMTEuOTg0NCAxMy41Mzg2IDExLjM2MzYgMTQuMzc3MUMxMC43NTM4IDE1LjIxNTcgMTAuNDQ4OSAxNi4xNjg2IDEwLjQ0ODkgMTcuMjM1OEMxMC40NDg5IDE4LjEyODggMTAuNjYxMiAxOC44OTY1IDExLjA4NTkgMTkuNTM5MUMxMS41MjE1IDIwLjE3MDcgMTIuMDc2OSAyMC42OTg5IDEyLjc1MjEgMjEuMTIzNkMxMy40MjczIDIxLjUzNzQgMTQuMTM1MiAyMS44ODA0IDE0Ljg3NTcgMjIuMTUyN0MxNS42MTYyIDIyLjQxNDEgMTYuMjk2OSAyMi42MjY0IDE2LjkxNzYgMjIuNzg5OEwyMC4zMTUzIDIzLjcwNDVDMjEuMTg2NiAyMy45MzMyIDIyLjE1NTggMjQuMjQ5MSAyMy4yMjMgMjQuNjUyQzI0LjMwMTEgMjUuMDU0OSAyNS4zMzAzIDI1LjYwNDkgMjYuMzEwNCAyNi4zMDE4QzI3LjMwMTQgMjYuOTg3OSAyOC4xMTgxIDI3Ljg3IDI4Ljc2MDcgMjguOTQ4MkMyOS40MDMyIDMwLjAyNjMgMjkuNzI0NCAzMS4zNDk0IDI5LjcyNDQgMzIuOTE3NkMyOS43MjQ0IDM0LjcyNTQgMjkuMjUwNyAzNi4zNTg5IDI4LjMwMzMgMzcuODE4MkMyNy4zNjY3IDM5LjI3NzUgMjUuOTk0NiA0MC40MzczIDI0LjE4NjggNDEuMjk3NkMyMi4zODk5IDQyLjE1NzkgMjAuMjA2NCA0Mi41ODgxIDE3LjYzNjQgNDIuNTg4MUMxNS4yNDA1IDQyLjU4ODEgMTMuMTY2IDQyLjIwMTUgMTEuNDEyNiA0MS40MjgzQzkuNjcwMjIgNDAuNjU1MSA4LjI5ODA2IDM5LjU3NjkgNy4yOTYxNiAzOC4xOTM5QzYuMzA1MTYgMzYuODEwOCA1Ljc0NDMyIDM1LjIwNDUgNS42MTM2NCAzMy4zNzVIOS43OTU0NUM5LjkwNDM2IDM0LjYzODMgMTAuMzI5MSAzNS42ODM3IDExLjA2OTYgMzYuNTExNEMxMS44MjEgMzcuMzI4MSAxMi43Njg1IDM3LjkzOCAxMy45MTE5IDM4LjM0MDlDMTUuMDY2MyAzOC43MzMgMTYuMzA3OCAzOC45MjkgMTcuNjM2NCAzOC45MjlDMTkuMTgyOCAzOC45MjkgMjAuNTcxMyAzOC42Nzg1IDIxLjgwMTggMzguMTc3NkMyMy4wMzI0IDM3LjY2NTcgMjQuMDA3MSAzNi45NTc5IDI0LjcyNTkgMzYuMDU0QzI1LjQ0NDYgMzUuMTM5MiAyNS44MDQgMzQuMDcyIDI1LjgwNCAzMi44NTIzQzI1LjgwNCAzMS43NDE1IDI1LjQ5MzYgMzAuODM3NiAyNC44NzI5IDMwLjE0MDZDMjQuMjUyMSAyOS40NDM3IDIzLjQzNTQgMjguODc3NCAyMi40MjI2IDI4LjQ0MThDMjEuNDA5OCAyOC4wMDYyIDIwLjMxNTMgMjcuNjI1IDE5LjEzOTIgMjcuMjk4M0wxNS4wMjI3IDI2LjEyMjJDMTIuNDA5MSAyNS4zNzA3IDEwLjM0IDI0LjI5ODEgOC44MTUzNCAyMi45MDQxQzcuMjkwNzIgMjEuNTEwMiA2LjUyODQxIDE5LjY4NjEgNi41Mjg0MSAxNy40MzE4QzYuNTI4NDEgMTUuNTU4NyA3LjAzNDggMTMuOTI1MiA4LjA0NzU5IDEyLjUzMTJDOS4wNzEyNiAxMS4xMjY0IDEwLjQ0MzQgMTAuMDM3NCAxMi4xNjQxIDkuMjY0MkMxMy44OTU2IDguNDgwMTEgMTUuODI4NiA4LjA4ODA3IDE3Ljk2MzEgOC4wODgwN0MyMC4xMTkzIDguMDg4MDcgMjIuMDM2IDguNDc0NjcgMjMuNzEzMSA5LjI0Nzg3QzI1LjM5MDIgMTAuMDEwMiAyNi43MTg3IDExLjA1NTYgMjcuNjk4OSAxMi4zODQyQzI4LjY4OTkgMTMuNzEyOCAyOS4yMTI2IDE1LjIyMTEgMjkuMjY3IDE2LjkwOTFIMjUuMzQ2NloiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0zNC4wODUxIDQyVjguNTQ1NDVINTQuMjc1NVYxMi4xMzkySDM4LjEzNjNWMjMuNDQzMkg1My4yM1YyNy4wMzY5SDM4LjEzNjNWMzguNDA2Mkg1NC41MzY4VjQySDM0LjA4NTFaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNTkuMjc3MyA0MlY4LjU0NTQ1SDYzLjMyODRWMzguNDA2Mkg3OC44Nzk2VjQySDU5LjI3NzNaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNODIuODUyMyA0MlY4LjU0NTQ1SDg2LjkwMzVWMzguNDA2MkgxMDIuNDU1VjQySDgyLjg1MjNaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K";

export const Content = ({
  isSidePanel,
  setIsSidePanel,
  candleData,
  smaData,
  trades,
  transactions,
  granularity,
}: any) => {
  const [chartOptions, setChartOptions] =
    useState<ApexOptions>(baseChartOptions);

  const stackedOptions: ApexOptions = {
    ...chartOptions,
    grid: {
      ...chartOptions.grid,
      borderColor: "#00000000",
    },
    xaxis: {
      ...chartOptions.xaxis,
      labels: {
        ...chartOptions?.xaxis?.labels,
        style: {
          ...chartOptions?.xaxis?.labels?.style,
          cssClass: "hello",
        },
      },
    },
    yaxis: {
      ...chartOptions.yaxis,
      labels: {
        //@ts-ignore
        ...chartOptions.yaxis?.labels,
        style: {
          //@ts-ignore
          ...chartOptions?.yaxis?.labels?.style,
          cssClass: "hello",
        },
      },
    },
  };

  const tradesChartOptions: ApexOptions = {
    ...stackedOptions,
    chart: { ...stackedOptions.chart, id: "trades" },
    stroke: {
      ...stackedOptions.stroke,
      width: 0,
    },
    markers: {
      ...stackedOptions.markers,
      size: 2,
      colors: "#ffffff",
      strokeWidth: 0,
    },
    tooltip: {
      ...stackedOptions.tooltip,
      enabled: true,
      shared: false,
      intersect: true,
      theme: "",
      custom: ({ seriesIndex, dataPointIndex, w }) => {
        const data = w.globals.initialSeries[0].data[dataPointIndex].data;

        const action = data.units > 0 ? "BOUGHT" : "SOLD";
        return `
          <div style='display: flex; align-items: center; flex-direction: column; background: #ffffff44; border: 1px solid white; padding: 5px;'>
            <p>${action} ${Math.abs(data.units)} units</p>
            <p>@${data.price}</p>
            <p>Current position: ${data.positionSize} units</p>
          </div>
        `;
      },
    },
    xaxis: {
      ...stackedOptions.xaxis,
      tooltip: {
        ...stackedOptions?.xaxis?.tooltip,
        enabled: false,
      },
    },
    annotations: {
      ...stackedOptions.annotations,
      points: transactions.map((transaction: any): PointAnnotations => {
        const isLong = transaction.units > 0;
        const path = isLong ? iconBUY : iconSELL;
        const offsetY = isLong ? 20 : -20;
        return {
          x: new Date(transaction.time).getTime(),
          y: transaction.price,
          image: {
            path,
            offsetY,
            width: 20,
            height: 20,
          },
          marker: {
            size: 0,
          },
        };
      }),
    },
  };

  return (
    <OuterWrapper>
      <OuterInnerWrapper>
        <Wrapper>
          <OpenSidePanel
            $isSidePanel={isSidePanel}
            onClick={() => setIsSidePanel(true)}
          >
            open
          </OpenSidePanel>
          <ChartOuterWrapper>
            <ChartInnerWrapper>
              <CandleChart
                type="candlestick"
                height={360}
                series={[
                  {
                    name: "candleChart",
                    type: "candlestick",
                    data: candleData,
                  },
                ]}
                options={chartOptions}
              />
              {!!smaData.length && (
                <SMAChart
                  height={360}
                  series={[{ data: smaData, name: "sma", type: "line" }]}
                  type="candlestick"
                  options={stackedOptions}
                />
              )}
              {!!trades.length && (
                <TradesChart
                  height={360}
                  series={[
                    // { data: [] },
                    {
                      data: transactions.map((transaction: any) => {
                        return {
                          x: transaction.time,
                          y: transaction.price,
                          data: { ...transaction },
                        };
                      }),
                      name: "trades",
                      type: "line",
                    },
                  ]}
                  type="candlestick"
                  options={tradesChartOptions}
                />
              )}
            </ChartInnerWrapper>
            <Chart
              type="line"
              height={75}
              options={{
                chart: {
                  id: "brush",
                  brush: {
                    enabled: true,
                    target: "candles",
                    autoScaleYaxis: false,
                  },
                  selection: {
                    enabled: true,
                  },
                  animations: {
                    enabled: false,
                  },
                  events: {
                    selection: (chart, { xaxis }) => {
                      const data = chart.w.globals.initialSeries[0].data;
                      const smaSeries = chart.w.globals.initialSeries[1]?.data;
                      if (smaSeries) {
                        smaSeries.forEach(({ y }: any, index: number) => {
                          data[index].y = [...data[index].y, y];
                        });
                      }
                      const yInRange = data
                        .filter(({ x }: any) => {
                          const xVal = new Date(x).getTime();
                          if (xVal >= xaxis.min && xVal <= xaxis.max) {
                            return true;
                          }
                          return false;
                        })
                        .map(({ y }: any) => y)
                        .flat();

                      setChartOptions((prev) => {
                        return {
                          ...prev,
                          yaxis: {
                            ...prev.yaxis,
                            min: Math.min(...yInRange) * 0.9995,
                            max: Math.max(...yInRange) * 1.0005,
                          },
                          xaxis: {
                            ...prev.xaxis,
                            ...xaxis,
                          },
                        };
                      });
                    },
                  },
                },
                dataLabels: {
                  enabled: false,
                },
                markers: {
                  size: 0,
                },
                xaxis: {
                  type: "datetime",
                  labels: {
                    show: false,
                  },
                },
                yaxis: {
                  labels: {
                    show: false,
                  },
                },
                grid: {
                  show: false,
                },
                legend: {
                  show: false,
                },
              }}
              series={[
                {
                  data: candleData.map(({ x, y }: any) => ({
                    x,
                    y: [y[1], y[2]],
                  })),
                },
                {
                  data: smaData,
                },
              ]}
            />
          </ChartOuterWrapper>
        </Wrapper>
        <PerformanceSummary trades={trades} granularity={granularity} />
      </OuterInnerWrapper>
    </OuterWrapper>
  );
};

const OuterWrapper = styled.div`
  height: 100%;
  background-color: #bababa;
  flex-grow: 1;
  position: relative;
  padding-bottom: 20px;
  overflow: auto;
`;

const OuterInnerWrapper = styled.div``;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const OpenSidePanel = styled.button<{ $isSidePanel: boolean }>`
  background: none;
  border: none;
  position: absolute;
  display: ${({ $isSidePanel }) => ($isSidePanel ? "none" : "")};
  cursor: pointer;
  left: 10px;
`;

const ChartOuterWrapper = styled.div`
  position: relative;
  width: 80%;
`;
const ChartInnerWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 360px;
`;

const CandleChart = styled(Chart)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const SMAChart = styled(CandleChart)`
  z-index: 1;
`;
const TradesChart = styled(CandleChart)`
  z-index: 2;
`;
