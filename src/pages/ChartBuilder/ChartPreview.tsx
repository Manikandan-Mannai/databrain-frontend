import BarChart from "../../components/charts/BarChart";
import ReactApexChart from "react-apexcharts";

interface ChartPreviewProps {
  data: any[];
  config: {
    xAxis: string;
    yAxis: string;
    type: "bar" | "line" | "pie";
    title: string;
  };
}

const ChartPreview = ({ data, config }: ChartPreviewProps) => {
  if (!data?.length || !config.xAxis || !config.yAxis) return null;

  if (config.type === "bar") {
    return (
      <BarChart
        data={data}
        xField={config.xAxis}
        yField={config.yAxis}
        title={config.title}
      />
    );
  }

  const xData = data.map((d) => d[config.xAxis]);
  const yData = data.map((d) => Number(d[config.yAxis]));

  const options: ApexCharts.ApexOptions = {
    chart: { type: config.type },
    xaxis: { categories: xData, title: { text: config.xAxis } },
    yaxis: { title: { text: config.yAxis } },
    title: { text: config.title || "Chart Preview", align: "center" },
    legend: { position: "bottom" },
  };

  const series =
    config.type === "pie"
      ? [{ name: config.yAxis, data: yData }]
      : [{ name: config.yAxis, data: yData }];

  return (
    <ReactApexChart
      options={options}
      series={series}
      type={config.type}
      height={350}
    />
  );
};

export default ChartPreview;
