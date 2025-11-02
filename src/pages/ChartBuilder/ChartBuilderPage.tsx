import { Box, CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { saveChart } from "../../redux/slices/chartSlice";
import { saveDashboard } from "../../redux/slices/dashboardSlice";
import { fetchQueryResult } from "../../redux/slices/querySlice";
import type { AppDispatch, RootState } from "../../redux/store/store";
import ChartForm from "./ChartForm";
import ChartList from "./ChartList";
import ChartPreview from "./ChartPreview";
import { GRAY_SHADES, MAX_CHARTS, useChartBuilder } from "./useChartBuilder";

interface ChartGroupItem {
  chartId: string;
  layout: { x: number; y: number; w: number; h: number };
  preview: any;
}

const ChartBuilderPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const queryParams = new URLSearchParams(location.search);
  const queryId = queryParams.get("queryId");
  const { currentResult, status } = useSelector((s: RootState) => s.query);
  const { user } = useSelector((s: RootState) => s.auth);

  const [group, setGroup] = useState<ChartGroupItem[]>([]);
  const [dashboardName, setDashboardName] = useState("");

  const {
    config,
    setConfig,
    preview,
    setPreview,
    validate,
    addSeries,
    removeSeries,
    updateSeries,
    handleTypeChange,
  } = useChartBuilder({
    title: "",
    type: "bar",
    xAxis: "",
    series: [{ yField: "", name: "", type: "bar" }],
    stack: false,
    pieSeries: [],
    pieLabel: "",
    pieValue: "",
  });

  useEffect(() => {
    if (queryId && !currentResult) dispatch(fetchQueryResult(queryId));
  }, [queryId, currentResult, dispatch]);

  if (status === "loading") return <CircularProgress />;
  if (!currentResult?.length) return <div>No data available</div>;

  const columns = Object.keys(currentResult[0]);
  const yFieldOptions = columns.filter((c) => c !== config.xAxis);

  const handlePreview = () => validate() && setPreview(true);

  const handleSaveChart = async () => {
    if (!validate()) return;
    if (group.length >= MAX_CHARTS) return toast.warning("Max charts reached");

    let payload: any;

    if (config.type === "pie") {
      const labels = currentResult
        .map((row) => row[config.pieLabel])
        .filter(
          (v) => v !== undefined && v !== null && String(v).trim() !== ""
        );

      const values = currentResult
        .map((row) => Number(row[config.pieValue]) || 0)
        .filter((v) => !isNaN(v));

      payload = {
        title: config.title,
        type: "pie",
        queryId,
        createdBy: user?._id,
        config: {
          pieLabel: config.pieLabel,
          pieValue: config.pieValue,
          showLegend: true,
        },
        series: [],
        data: labels.map((l, i) => ({ label: l, value: values[i] || 0 })),
        layout: { x: 0, y: 0, w: 6, h: 4 },
      };
    } else {
      const chartConfig = {
        xAxisLabel: config.xAxis,
        yAxisLabel: "Values",
        stack: config.stack,
        showLegend: true,
        showGrid: true,
      };

      const transformedData = currentResult.map((row) => ({
        label: row[config.xAxis],
        values: config.series.map((s) => ({
          key: s.yField,
          value: Number(row[s.yField]) || 0,
        })),
      }));

      payload = {
        title: config.title,
        type: config.type,
        queryId,
        createdBy: user?._id,
        config: chartConfig,
        series: config.series.map((s, i) => ({
          name: s.name || s.yField,
          type: s.type || "bar",
          color: GRAY_SHADES[i % GRAY_SHADES.length],
        })),
        data: transformedData,
        layout: { x: 0, y: 0, w: 6, h: 4 },
      };
    }

    try {
      const result = await dispatch(saveChart(payload)).unwrap();
      const chartId = result.data.chartId;

      setGroup((prev) => [
        ...prev,
        {
          chartId,
          layout: { x: 0, y: 0, w: 6, h: 4 },
          preview: { ...payload, id: chartId },
        },
      ]);

      toast.success("Chart saved successfully!");
      setPreview(false);
      setConfig({
        title: "",
        type: "bar",
        xAxis: "",
        series: [{ yField: "", name: "", type: "bar" }],
        stack: false,
        pieLabel: "",
        pieValue: "",
      });
    } catch (err: any) {
      toast.error(err || "Failed to save chart");
    }
  };

  const handleAddDashboard = async () => {
    if (!dashboardName.trim()) return toast.warning("Dashboard name required");

    const payload = {
      name: dashboardName,
      charts: group.map((g) => ({
        chartId: g.chartId,
        layout: g.layout,
      })),
    };

    try {
      await dispatch(saveDashboard(payload)).unwrap();
      toast.success("Dashboard saved!");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err || "Failed to save dashboard");
    }
  };

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        gridTemplateRows: "repeat(5, 1fr)",
        gridColumnGap: 15,
        gridRowGap: 0,
        height: "100vh",
        bgcolor: "#fafafa",
        boxSizing: "border-box",
      }}
    >
      <Box
        sx={{
          gridArea: "1 / 1 / 4 / 3",
          border: "1px solid #000",
          bgcolor: "#fff",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          overflowY: "auto",
        }}
      >
        <ChartForm
          config={config}
          columns={columns}
          yFieldOptions={yFieldOptions}
          onChange={setConfig}
          addSeries={addSeries}
          removeSeries={removeSeries}
          updateSeries={updateSeries}
          handleTypeChange={handleTypeChange}
          onPreview={handlePreview}
          onSave={handleSaveChart}
          preview={preview}
          setPreview={setPreview}
        />
      </Box>

      <Box
        sx={{
          gridArea: "1 / 3 / 4 / 6",
          border: "1px solid #000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#fff",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        {preview ? (
          <ChartPreview
            data={currentResult}
            config={{
              ...config,
              series: config.series.map((s, i) => ({
                ...s,
                color: GRAY_SHADES[i % GRAY_SHADES.length],
              })),
            }}
            height={400}
          />
        ) : (
          <Box sx={{ fontSize: 14, opacity: 0.6 }}>
            Preview area — click Preview to visualize chart
          </Box>
        )}
      </Box>

      <Box
        sx={{
          gridArea: "4 / 1 / 6 / 6",
          border: "1px solid #000",
          mt: 2,
          bgcolor: "#fff",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          overflowY: "auto",
        }}
      >
        <ChartList
          group={group.map((g) => ({ ...g.preview, id: g.chartId }))}
          remove={(id) =>
            setGroup((prev) => prev.filter((g) => g.chartId !== id))
          }
          onAddDashboard={handleAddDashboard}
          dashboardName={dashboardName}
          setDashboardName={setDashboardName}
        />
      </Box>
    </Box>
  );
};

export default ChartBuilderPage;
