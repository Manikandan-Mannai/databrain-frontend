// frontend/components/ChartPreview.tsx
import React from "react";
import ReactApexChart from "react-apexcharts";
import { type ApexOptions } from "apexcharts";

interface SeriesConfig {
  yField: string;
  name: string;
  type: "bar" | "line" | "area";
  color?: string;
}

interface ChartConfig {
  title: string;
  type: "bar" | "line" | "pie" | "mixed";
  xAxis?: string;
  series: SeriesConfig[];
  stack?: boolean;
  pie?: { labelField: string; valueField: string };
}

interface Props {
  data: any[];
  config: ChartConfig;
}

const ChartPreview: React.FC<Props> = ({ data, config }) => {
  if (!data?.length) {
    return (
      <div style={{ padding: 16, textAlign: "center", color: "#666" }}>
        No data
      </div>
    );
  }

  // PIE CHART
  if (config.type === "pie" && config.pie) {
    const labels = data
      .map((d) => d[config.pie.labelField])
      .filter((v): v is string => typeof v === "string" && v.trim() !== "");
    const values = data.map((d) => Number(d[config.pie.valueField]) || 0);

    const options: ApexOptions = {
      chart: { type: "pie" },
      labels,
      colors: ["#000000", "#333333", "#666666", "#999999", "#cccccc"],
      legend: { position: "bottom", labels: { colors: "#000" } },
      title: {
        text: config.title,
        align: "left",
        style: { fontSize: "14px", fontWeight: "bold" },
      },
    };

    return (
      <ReactApexChart
        options={options}
        series={values}
        type="pie"
        height={320}
      />
    );
  }

  // BAR / LINE / MIXED
  if (!config.xAxis || config.series.length === 0) {
    return (
      <div style={{ padding: 16, color: "#999" }}>
        Configure X-axis and Y-series
      </div>
    );
  }

  const categories = Array.from(
    new Set(data.map((d) => d[config.xAxis!]))
  ).sort();
  const series = config.series.map((s) => {
    const values = categories.map((cat) => {
      const row = data.find((r) => r[config.xAxis!] === cat);
      return row ? Number(row[s.yField]) || 0 : 0;
    });
    return {
      name: s.name || s.yField,
      type: s.type,
      data: values,
    };
  });

  const options: ApexOptions = {
    chart: {
      type: config.type === "mixed" ? "line" : config.type,
      stacked: config.stack || false,
      toolbar: { show: false },
      background: "transparent",
    },
    stroke: { width: config.type === "line" ? 2 : 0, curve: "smooth" },
    xaxis: {
      categories,
      labels: { style: { colors: "#000" } },
      title: { text: config.xAxis, style: { fontSize: "12px" } },
    },
    yaxis: {
      labels: { style: { colors: "#000" } },
      title: { text: "Values", style: { fontSize: "12px" } },
    },
    title: {
      text: config.title,
      align: "left",
      style: { fontSize: "14px", fontWeight: "bold" },
    },
    colors: config.series.map((s) => s.color || "#666666"),
    legend: { position: "top", labels: { colors: "#000" } },
    grid: { borderColor: "#e0e0e0" },
  };

  return (
    <ReactApexChart
      options={options}
      series={series}
      type={config.type === "mixed" ? "line" : config.type}
      height={320}
    />
  );
};

export default ChartPreview;
