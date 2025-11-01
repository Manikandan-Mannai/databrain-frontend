import React from "react";
import Chart from "react-apexcharts";
import { Card, CardContent, CardHeader, IconButton } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

interface ChartRendererProps {
  chart: any;
}

const ChartRenderer: React.FC<ChartRendererProps> = ({ chart }) => {
  const chartData = chart?.chartId;
  if (!chartData) return null;

  const categories = chartData.data.map((d: any) => d.label);

  const series = chartData.series.map((s: any) => ({
    name: s.name,
    type: s.type,
    color: s.color,
    data: chartData.data.map((d: any) => {
      const match = d.values.find((v: any) => v.key === s.name);
      return match ? match.value : 0;
    }),
  }));

  const options: any = {
    chart: {
      toolbar: { show: false },
      background: "transparent",
    },
    xaxis: {
      categories,
      title: { text: chartData.config.xAxisLabel || "" },
      labels: { style: { fontSize: "12px" } },
    },
    yaxis: {
      title: { text: chartData.config.yAxisLabel || "" },
      labels: { style: { fontSize: "12px" } },
    },
    legend: { show: chartData.config.showLegend },
    grid: { show: chartData.config.showGrid },
    colors: chartData.series.map((s: any) => s.color),
    stroke: { curve: "smooth", width: 2 },
  };

  return (
    <Card sx={{ width: "400px", boxShadow: 3 }}>
      <CardHeader
        title={chartData.title}
        action={
          <IconButton size="small">
            <DownloadIcon fontSize="small" />
          </IconButton>
        }
      />
      <CardContent>
        <Chart
          type={chartData.type}
          options={options}
          series={series}
          height={300}
        />
      </CardContent>
    </Card>
  );
};

export default ChartRenderer;
