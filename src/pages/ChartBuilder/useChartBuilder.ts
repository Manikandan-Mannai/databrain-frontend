import { useState } from "react";
import { toast } from "react-toastify";
import type { ChartConfig, Series, PieSeries } from "../../redux/types";

export const GRAY_SHADES = ["#000", "#333", "#666", "#999", "#ccc"];
export const MAX_CHARTS = 4;

export const useChartBuilder = (initialConfig: ChartConfig) => {
  const [config, setConfig] = useState(initialConfig);
  const [preview, setPreview] = useState(false);
  const [group, setGroup] = useState<any[]>([]);
  const [dashboardName, setDashboardName] = useState("");

  const validate = (): boolean => {
    if (!config.title.trim())
      return toast.warning("Chart title is required"), false;

    if (config.type === "pie") {
      if (!config.pieLabel)
        return toast.warning("Pie label column is required"), false;
      if (!config.pieValue)
        return toast.warning("Pie value column is required"), false;
    } else {
      if (!config.xAxis) return toast.warning("X-axis is required"), false;
      if (config.series.some((s) => !s.yField))
        return toast.warning("All Y fields required"), false;
    }

    return true;
  };

  const addSeries = () => {
    if (config.type === "pie") {
      setConfig((p) => ({
        ...p,
        pieSeries: [
          ...p.pieSeries,
          {
            labelField: "",
            valueField: "",
            name: `Pie ${p.pieSeries.length + 1}`,
          },
        ],
      }));
    } else {
      setConfig((p) => ({
        ...p,
        series: [
          ...p.series,
          { yField: "", name: `Series ${p.series.length + 1}`, type: "bar" },
        ],
      }));
    }
  };

  const removeSeries = (i: number) => {
    if (config.type === "pie")
      setConfig((p) => ({
        ...p,
        pieSeries: p.pieSeries.filter((_, idx) => idx !== i),
      }));
    else
      setConfig((p) => ({
        ...p,
        series: p.series.filter((_, idx) => idx !== i),
      }));
  };

  const updateSeries = (
    i: number,
    field: keyof (Series | PieSeries),
    val: any
  ) => {
    if (config.type === "pie") {
      const u = [...config.pieSeries];
      u[i] = { ...u[i], [field]: val };
      setConfig((p) => ({ ...p, pieSeries: u }));
    } else {
      const u = [...config.series];
      u[i] = { ...u[i], [field]: val };
      setConfig((p) => ({ ...p, series: u }));
    }
  };

  const handleTypeChange = (type: ChartConfig["type"]) => {
    setConfig((p) => {
      if (type === "pie")
        return {
          ...p,
          type,
          pieLabel: "",
          pieValue: "",
          pieSeries: [],
          series: [],
          xAxis: "",
          stack: false,
        };
      return {
        ...p,
        type,
        pieLabel: "",
        pieValue: "",
        pieSeries: [],
        xAxis: "",
        series: [{ yField: "", name: "", type: "bar" }],
      };
    });
  };

  return {
    config,
    setConfig,
    preview,
    setPreview,
    group,
    setGroup,
    dashboardName,
    setDashboardName,
    validate,
    addSeries,
    removeSeries,
    updateSeries,
    handleTypeChange,
  };
};
