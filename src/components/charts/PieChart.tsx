import React from "react";
import ApexCharts from "react-apexcharts";
import { Box, IconButton, Typography, Stack } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import html2canvas from "html2canvas";

interface PieChartProps {
  data: Array<{ label: string; value: number }>;
  config: {
    pieLabel?: string;
    pieValue?: string;
    showLegend?: boolean;
  };
  title?: string;
}

const PieChart: React.FC<PieChartProps> = ({ data, config, title }) => {
  if (!data || data.length === 0) {
    return <Box sx={{ p: 2, textAlign: "center" }}>No data available</Box>;
  }

  const labels = data.map((d) => d.label);
  const values = data.map((d) => d.value);

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "pie",
      toolbar: { show: false },
      background: "transparent",
    },
    labels,
    legend: {
      show: config.showLegend !== false,
      position: "bottom",
    },
    colors: ["#000", "#333", "#666", "#999", "#ccc"],
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val.toFixed(1)}%`,
    },
    tooltip: {
      theme: "light",
      style: {
        fontSize: "13px",
      },
      fillSeriesColor: false,
      custom: ({ series, seriesIndex, w }) => {
        const label = w.globals.labels[seriesIndex];
        const value = series[seriesIndex];
        return `
          <div style="
            background: #ffffff;
            color: #000000;
            padding: 8px 20px;
            border-radius: 6px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.15);
            border: 1px solid #e0e0e0;
            width: 100px;
            display: flex;
            align-item: center;
            justify-content: space-between;
          ">
            <div style="font-weight: 600;">${label}</div> -
            <div style="font-size: 13px;">${value.toFixed(2)}</div>
          </div>
        `;
      },
    },
    theme: { mode: "light" },
  };

  const handleExport = async () => {
    const chartEl = document.querySelector(
      `#pie-chart-${title || "pie"}`
    ) as HTMLElement;
    if (!chartEl) return;
    const canvas = await html2canvas(chartEl);
    const link = document.createElement("a");
    link.download = `${title || "pie-chart"}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <Box>
      {title && (
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
      )}
      <Stack direction="row" justifyContent="flex-end">
        <IconButton size="small" onClick={handleExport}>
          <DownloadIcon fontSize="small" />
        </IconButton>
      </Stack>
      <div id={`pie-chart-${title || "pie"}`}>
        <ApexCharts options={options} series={values} type="pie" height={280} />
      </div>
    </Box>
  );
};

export default PieChart;
