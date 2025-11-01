import React from "react";
import ApexCharts from "react-apexcharts";
import { Box, IconButton } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

interface ChartData {
  [key: string]: number | string;
  SUM_revenue: number;
  product: string;
}

interface LineChartProps {
  data: ChartData[];
}

const LineChart: React.FC<LineChartProps> = ({ data }) => {
  const categories = data?.map((d) => d.product) || [];
  const values = data?.map((d) => d.SUM_revenue) || [];

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "line",
      toolbar: { show: false },
      background: "transparent",
    },
    stroke: { curve: "smooth", width: 2, colors: ["#000"] },
    xaxis: { categories, labels: { style: { colors: "#000" } } },
    yaxis: { labels: { style: { colors: "#000" } } },
    grid: { borderColor: "#ddd" },
    theme: { mode: "light" },
  };

  const series = [{ name: "Value", data: values }];

  const handleExport = () => {
    const chart = document.querySelector("#line-chart") as HTMLElement | null;
    if (chart) {
      const svg = chart.querySelector("svg");
      if (!svg) return;
      const svgData = new XMLSerializer().serializeToString(svg);
      const blob = new Blob([svgData], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "linechart.svg";
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
      <div id="line-chart">
        <ApexCharts
          options={options}
          series={series}
          type="line"
          height={300}
        />
      </div>
    </Box>
  );
};

export default LineChart;
