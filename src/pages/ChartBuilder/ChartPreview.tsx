import React from "react";
import ReactApexChart from "react-apexcharts";
import { type ApexOptions } from "apexcharts";
import type { ChartConfig } from "../../redux/types/index";

interface Props {
  data: any[];
  config: ChartConfig;
  height?: number;
  width?: number;
}

const yAxisFormatter = (val: number) => {
  const s = val.toFixed(2).replace(/\.?0+$/, "");
  return s.includes(".") ? parseFloat(s).toFixed(1) : s;
};

const ChartPreview: React.FC<Props> = ({
  data,
  config,
  height = "100%",
  width = "100%",
}) => {
  if (!data?.length) {
    return (
      <div
        style={{
          height,
          width,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#666",
        }}
      >
        No data available
      </div>
    );
  }

  if (config.type === "pie") {
    if (!config.pieLabel || !config.pieValue) {
      return (
        <div
          style={{
            height,
            width,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#999",
          }}
        >
          Please select both Label and Value columns for pie chart
        </div>
      );
    }

    const pieLabel = config?.pieLabel;
    const pieValue = config?.pieValue;

    const labels = data
      .map((row) => row[pieLabel])
      .filter(
        (val) => val !== undefined && val !== null && String(val).trim() !== ""
      );

    const values = data
      .map((row) => Number(row[pieValue]) || 0)
      .filter((val) => !isNaN(val) && val > 0);

    if (labels.length === 0 || values.length === 0) {
      return (
        <div
          style={{
            height,
            width,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#999",
          }}
        >
          No valid data for selected columns
        </div>
      );
    }

    const options: ApexOptions = {
      chart: {
        type: "pie",
        background: "#fff",
        toolbar: { show: false },
      },
      labels: labels.map(String),
      colors: [
        "#000",
        "#2d2d2d",
        "#4a4a4a",
        "#676767",
        "#858585",
        "#a3a3a3",
        "#c0c0c0",
        "#dedede",
      ],
      legend: {
        position: "bottom",
        labels: { colors: "#000" },
        fontSize: "12px",
      },
      title: {
        text: config.title || "Pie Chart",
        align: "left",
        style: { fontSize: "14px", fontWeight: "bold", color: "#000" },
      },
      dataLabels: {
        enabled: true,
        formatter: (val: number) => `${val.toFixed(1)}%`,
        style: { fontSize: "11px", colors: ["#fff"] },
      },
      tooltip: {
        y: {
          formatter: (val: number) => yAxisFormatter(val),
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: { width: "100%" },
            legend: { position: "bottom" },
          },
        },
      ],
    };

    return (
      <div style={{ width, height }}>
        <ReactApexChart
          options={options}
          series={values}
          type="pie"
          width="100%"
          height="100%"
        />
      </div>
    );
  }

  if (!config.xAxis || !config.series?.length) {
    return (
      <div
        style={{
          height,
          width,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#999",
        }}
      >
        Configure X-axis and Y-series
      </div>
    );
  }

  const categories = Array.from(
    new Set(data.map((d) => d[config.xAxis]))
  ).sort();

  const series = config.series
    .filter((s) => s.yField)
    .map((s) => ({
      name: s.name || s.yField,
      type: config.type === "line" ? "line" : "column",
      data: categories.map((cat) => {
        const row = data.find((r) => r[config.xAxis] === cat);
        return row ? Number(row[s.yField]) || 0 : 0;
      }),
    }));

  const colors = series.map((_, idx) => {
    const baseColors = ["#000", "#333", "#555", "#777", "#999"];
    return baseColors[idx % baseColors.length];
  });

  const options: ApexOptions = {
    chart: {
      type: config.type === "line" ? "line" : "bar",
      stacked: config.stack ?? false,
      background: "#fff",
      toolbar: { show: false },
      width: "100%",
      height: "100%",
    },
    stroke: {
      width: config.type === "line" ? 3 : 0,
      curve: "smooth",
    },
    xaxis: {
      categories: categories.map(String),
      labels: { style: { colors: "#000" } },
      title: { text: config.xAxis, style: { fontSize: "12px", color: "#000" } },
    },
    yaxis: {
      labels: {
        style: { colors: "#000" },
        formatter: yAxisFormatter,
      },
      title: { text: "Values", style: { fontSize: "12px", color: "#000" } },
    },
    colors: colors,
    legend: {
      position: "top",
      labels: { colors: "#000" },
      show: series.length > 1,
    },
    grid: { borderColor: "#e0e0e0" },
    title: {
      text: config.title,
      align: "left",
      style: { fontSize: "14px", fontWeight: "bold" },
    },
    tooltip: {
      y: { formatter: (v) => yAxisFormatter(v as number) },
    },
    dataLabels: {
      enabled: config.type === "bar",
      formatter: yAxisFormatter,
      style: { colors: ["#fff"] },
      background: { enabled: true, foreColor: "#000" },
    },
    plotOptions: {
      bar: {
        columnWidth: "55%",
        dataLabels: { position: "top" },
      },
    },
    markers: {
      size: config.type === "line" ? 4 : 0,
      colors: colors,
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: {
        size: 6,
      },
    },
    responsive: [
      {
        breakpoint: 10000,
        options: { chart: { width: "100%", height: "100%" } },
      },
    ],
  };

  return (
    <div style={{ width, height }}>
      <ReactApexChart
        options={options}
        series={series}
        type={config.type === "line" ? "line" : "bar"}
        width="100%"
        height="100%"
      />
    </div>
  );
};

export default ChartPreview;
