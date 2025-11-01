import React from "react";
import ApexCharts from "react-apexcharts";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import html2canvas from "html2canvas";

interface BarChartProps {
  data: any[];
  config: any;
  title?: string;
  series?: any[];
}

const BarChart: React.FC<BarChartProps> = ({
  data,
  config,
  title,
  series: seriesConfig,
}) => {
  if (!data || data.length === 0) {
    return <Box sx={{ p: 2, textAlign: "center" }}>No data available</Box>;
  }

  const categories = data.map((item: any) => item.label || "Unknown");

  const seriesList = seriesConfig || config.series || [];

  const series = seriesList.map((s: any) => {
    const seriesName = s.name;
    return {
      name: seriesName,
      data: data.map((item: any) => {
        const valueObj = item.values?.find((v: any) => v.key === seriesName);
        return valueObj ? valueObj.value : 0;
      }),
    };
  });

  const colors = seriesList.map((s: any) => s.color || "#000");

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false },
      background: "transparent",
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        borderRadius: 4,
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories,
      title: {
        text: config.xAxisLabel || "Category",
      },
    },
    yaxis: {
      title: {
        text: config.yAxisLabel || "Value",
      },
    },
    legend: {
      show: config.showLegend !== false,
      position: "top",
    },
    grid: {
      show: config.showGrid !== false,
    },
    colors: colors,
    tooltip: {
      y: {
        formatter: function (val: number) {
          return val.toFixed(2);
        },
      },
    },
  };

  const handleExport = async () => {
    const chartEl = document.querySelector(
      `#chart-${title || "bar"}`
    ) as HTMLElement;
    if (!chartEl) return;
    const canvas = await html2canvas(chartEl);
    const link = document.createElement("a");
    link.download = `${title || "chart"}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <Box
      sx={{
        position: "relative",
        background: "#fff",
        p: 2,
        borderRadius: 2,
        boxShadow: 1,
      }}
    >
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
      <div id={`chart-${title || "bar"}`}>
        <ApexCharts options={options} series={series} type="bar" height={280} />
      </div>
    </Box>
  );
};

export default BarChart;
