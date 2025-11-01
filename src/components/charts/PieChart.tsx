import React from "react";
import ApexCharts from "react-apexcharts";
import { Box, IconButton } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

interface ChartData {
  [key: string]: number | string;
  SUM_revenue: number;
  product: string;
}

interface PieChartProps {
  data: ChartData[];
}

const PieChart: React.FC<PieChartProps> = ({ data }) => {
  const labels = data?.map((d) => d.product) || [];
  const values = data?.map((d) => d.SUM_revenue) || [];

  const options: ApexCharts.ApexOptions = {
    chart: { type: "pie", toolbar: { show: false }, background: "transparent" },
    labels,
    colors: ["#000", "#555", "#aaa"],
    legend: { show: false },
    theme: { mode: "light" },
  };

  const handleExport = () => {
    const chart = document.querySelector("#pie-chart") as HTMLElement | null;
    if (chart) {
      const svg = chart.querySelector("svg");
      if (!svg) return;
      const svgData = new XMLSerializer().serializeToString(svg);
      const blob = new Blob([svgData], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "piechart.svg";
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
      <div id="pie-chart">
        <ApexCharts options={options} series={values} type="pie" height={300} />
      </div>
    </Box>
  );
};

export default PieChart;
