import React from "react";
import ApexCharts from "react-apexcharts";
import { Box, IconButton } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

interface BarChartProps {
  data: any[];
  xField: string;
  yField: string;
  title?: string;
}

const BarChart: React.FC<BarChartProps> = ({ data, xField, yField, title }) => {
  const categories = data?.map((d) => d[xField]) || [];
  const values = data?.map((d) => Number(d[yField])) || [];

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false },
      background: "transparent",
    },
    xaxis: {
      categories,
      title: { text: xField },
      labels: { style: { colors: "#000" } },
    },
    yaxis: {
      title: { text: yField },
      labels: { style: { colors: "#000" } },
    },
    title: { text: title, align: "center" },
    grid: { borderColor: "#ddd" },
    colors: ["#1976d2"],
    theme: { mode: "light" },
  };

  const series = [{ name: yField, data: values }];

  const handleExport = () => {
    const chart = document.querySelector("#bar-chart") as HTMLElement | null;
    if (chart) {
      const svg = chart.querySelector("svg");
      if (!svg) return;
      const svgData = new XMLSerializer().serializeToString(svg);
      const blob = new Blob([svgData], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title || "chart"}.svg`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <Box
      sx={{ position: "relative", background: "#fff", p: 2, borderRadius: 2 }}
    >
      <IconButton
        onClick={handleExport}
        sx={{ position: "absolute", top: 5, right: 5 }}
        size="small"
      >
        <DownloadIcon fontSize="small" />
      </IconButton>
      <div id="bar-chart">
        <ApexCharts options={options} series={series} type="bar" height={300} />
      </div>
    </Box>
  );
};

export default BarChart;
