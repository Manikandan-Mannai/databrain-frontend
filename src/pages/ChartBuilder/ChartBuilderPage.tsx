import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Box,
  CircularProgress,
  IconButton,
  Stack,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import ChartPreview from "./ChartPreview";
import { fetchQueryResult } from "../../redux/slices/querySlice";
import { saveChart } from "../../redux/slices/chartSlice";
import { saveDashboard } from "../../redux/slices/dashboardSlice";
import type { RootState, AppDispatch } from "../../redux/store/store";

interface Series {
  yField: string;
  name: string;
  type: "bar" | "line" | "area";
}

interface PieSeries {
  labelField: string;
  valueField: string;
  name: string;
}

interface ChartConfig {
  id?: string;
  title: string;
  type: "bar" | "line" | "pie" | "mixed";
  xAxis: string;
  series: Series[];
  stack: boolean;
  pieSeries: PieSeries[];
}

const GRAY_SHADES = ["#000", "#333", "#666", "#999", "#ccc"];
const MAX_CHARTS = 4;

const ChartBuilderPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const queryParams = new URLSearchParams(location.search);
  const queryId = queryParams.get("queryId");
  const { currentResult, status: queryStatus } = useSelector(
    (state: RootState) => state.query
  );
  const { user } = useSelector((state: RootState) => state.auth);
  const [config, setConfig] = useState<ChartConfig>({
    title: "",
    type: "bar",
    xAxis: "",
    series: [{ yField: "", name: "", type: "bar" }],
    stack: false,
    pieSeries: [],
  });
  const [preview, setPreview] = useState(false);
  const [group, setGroup] = useState<any[]>([]);
  const [dashboardName, setDashboardName] = useState("");

  useEffect(() => {
    if (queryId && !currentResult) {
      dispatch(fetchQueryResult(queryId));
    }
  }, [queryId, dispatch]);

  const columns = currentResult?.length ? Object.keys(currentResult[0]) : [];

  const addSeries = () => {
    if (config.type === "pie") {
      setConfig((prev) => ({
        ...prev,
        pieSeries: [
          ...prev.pieSeries,
          {
            labelField: "",
            valueField: "",
            name: `Pie ${prev.pieSeries.length + 1}`,
          },
        ],
      }));
    } else {
      setConfig((prev) => ({
        ...prev,
        series: [
          ...prev.series,
          { yField: "", name: `Series ${prev.series.length + 1}`, type: "bar" },
        ],
      }));
    }
  };
  const removeSeries = (index: number) => {
    if (config.type === "pie") {
      setConfig((prev) => ({
        ...prev,
        pieSeries: prev.pieSeries.filter((_, i) => i !== index),
      }));
    } else {
      setConfig((prev) => ({
        ...prev,
        series: prev.series.filter((_, i) => i !== index),
      }));
    }
  };

  const updateSeries = (
    index: number,
    field: keyof (Series | PieSeries),
    value: any
  ) => {
    if (config.type === "pie") {
      setConfig((prev) => {
        const updated = [...prev.pieSeries];
        updated[index] = { ...updated[index], [field]: value };
        return { ...prev, pieSeries: updated };
      });
    } else {
      setConfig((prev) => {
        const updated = [...prev.series];
        updated[index] = { ...updated[index], [field]: value };
        return { ...prev, series: updated };
      });
    }
  };

  const handleTypeChange = (type: ChartConfig["type"]) => {
    setConfig((prev) => {
      if (type === "pie") {
        return {
          ...prev,
          type: "pie",
          series: [],
          xAxis: "",
          pieSeries: [{ labelField: "", valueField: "", name: "" }],
          stack: false,
        };
      }
      return {
        ...prev,
        type,
        pieSeries: [],
        xAxis: "",
        series: [{ yField: "", name: "", type: "bar" }],
      };
    });
  };

  const validate = (): boolean => {
    if (!config.title.trim()) {
      toast.warning("Chart title is required");
      return false;
    }
    if (config.type !== "pie" && !config.xAxis) {
      toast.warning("X-axis is required");
      return false;
    }
    if (config.type !== "pie" && config.series.some((s) => !s.yField)) {
      toast.warning("All Y fields must be selected");
      return false;
    }
    if (
      config.type === "pie" &&
      config.pieSeries.some((s) => !s.labelField || !s.valueField)
    ) {
      toast.warning("All pie series must have label and value fields");
      return false;
    }
    return true;
  };

  const handlePreview = () => {
    if (validate()) setPreview(true);
  };

  const buildPayload = () => {
    const base = {
      title: config.title,
      type: config.type,
      queryId: queryId!,
      createdBy: user?._id,
    };

    if (config.type === "pie") {
      const labelField = config.pieSeries[0].labelField;
      const valueField = config.pieSeries[0].valueField;
      const data = currentResult.map((row: any) => ({
        label: row[labelField] ?? "Unknown",
        values: config.pieSeries.map((s) => ({
          key: s.valueField,
          value: Number(row[s.valueField]) || 0,
        })),
      }));
      const series = config.pieSeries.map((s, i) => ({
        name: s.name || s.valueField,
        type: "pie",
        color: GRAY_SHADES[i % GRAY_SHADES.length],
        yAxis: "default",
      }));
      return {
        ...base,
        config: {
          xAxisLabel: labelField,
          yAxisLabel: valueField,
          showLegend: true,
          showGrid: true,
        },
        series,
        data,
        layout: { x: 0, y: 0, w: 6, h: 4 },
      };
    }

    const data = currentResult.map((row: any) => ({
      label: row[config.xAxis] ?? "Unknown",
      values: config.series.map((s) => ({
        key: s.yField,
        value: Number(row[s.yField]) || 0,
      })),
    }));
    const series = config.series.map((s, i) => ({
      name: s.name || s.yField,
      type: s.type,
      color: GRAY_SHADES[i % GRAY_SHADES.length],
      yAxis: "default",
    }));
    return {
      ...base,
      config: {
        xAxisLabel: config.xAxis,
        yAxisLabel: "Value",
        multipleAxis: false,
        stack: config.stack,
        showLegend: true,
        showGrid: true,
      },
      series,
      data,
      layout: { x: 0, y: 0, w: 6, h: 4 },
    };
  };

  const handleSaveChart = async () => {
    if (!validate()) return;
    if (group.length >= MAX_CHARTS) {
      toast.warning(`Max ${MAX_CHARTS} charts allowed`);
      return;
    }
    try {
      const payload = buildPayload();
      const result = await dispatch(saveChart(payload)).unwrap();
      const serverId =
        result?.data?._id || result?.chartId || crypto.randomUUID();
      setGroup((prev) => [
        ...prev,
        { ...payload, id: serverId, chartId: serverId },
      ]);
      toast.success("Chart saved successfully");
      setConfig({
        title: "",
        type: "bar",
        xAxis: "",
        series: [{ yField: "", name: "", type: "bar" }],
        stack: false,
        pieSeries: [],
      });
      setPreview(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to save chart");
    }
  };

  const handleAddToDashboard = async () => {
    if (!dashboardName.trim()) {
      toast.warning("Dashboard name required");
      return;
    }
    if (group.length === 0) {
      toast.warning("No charts to add");
      return;
    }
    try {
      const chartsPayload = group.map((c) => ({
        chartId: c.chartId,
        layout: c.layout,
      }));
      await dispatch(
        saveDashboard({ name: dashboardName, charts: chartsPayload })
      ).unwrap();
      toast.success("Dashboard created successfully");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Failed to create dashboard");
    }
  };

  const removeFromGroup = (id: string) => {
    setGroup((prev) => prev.filter((c) => c.id !== id));
  };

  if (queryStatus === "loading")
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );

  if (!currentResult?.length) return <div>No data available</div>;

  const yFieldOptions = columns.filter((col) => col !== config.xAxis);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">
          My Charts ({group.length}/{MAX_CHARTS})
        </h2>
        {group.length > 0 && (
          <Box mb={2}>
            <TextField
              label="Dashboard Name"
              value={dashboardName}
              onChange={(e) => setDashboardName(e.target.value)}
              size="small"
              fullWidth
            />
          </Box>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {group.map((chart) => (
            <div key={chart.id} className="border rounded-lg p-4 bg-white">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold">{chart.title}</h3>
                <IconButton
                  onClick={() => removeFromGroup(chart.id)}
                  size="small"
                >
                  <Delete />
                </IconButton>
              </div>
              <ChartPreview data={currentResult} config={chart} height={200} />
            </div>
          ))}
        </div>
        {group.length > 0 && (
          <Box mt={3} textAlign="center">
            <Button
              variant="contained"
              color="success"
              onClick={handleAddToDashboard}
            >
              Add to Dashboard
            </Button>
          </Box>
        )}
      </div>
      <Card className="max-w-4xl">
        <CardHeader
          title={
            <Typography variant="h6" fontWeight="bold">
              Create Chart
            </Typography>
          }
        />
        <CardContent>
          <TextField
            fullWidth
            label="Chart Title *"
            value={config.title}
            onChange={(e) =>
              setConfig((prev) => ({ ...prev, title: e.target.value }))
            }
            margin="normal"
            size="small"
          />
          <div className="flex gap-2 flex-wrap mb-4">
            {["bar", "line", , "pie", "mixed"].map((type) => (
              <Button
                key={type}
                variant={config.type === type ? "contained" : "outlined"}
                size="small"
                onClick={() => handleTypeChange(type as any)}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Button>
            ))}
          </div>
          {config.type === "pie" ? (
            <>
              {config.pieSeries.map((s, i) => (
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="end"
                  key={i}
                  className="mb-2"
                >
                  <FormControl sx={{ flex: 2 }} size="small">
                    <InputLabel>Label Field {i + 1} *</InputLabel>
                    <Select
                      value={s.labelField}
                      onChange={(e) =>
                        updateSeries(i, "labelField", e.target.value)
                      }
                    >
                      {columns.map((col) => (
                        <MenuItem key={col} value={col}>
                          {col}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl sx={{ flex: 2 }} size="small">
                    <InputLabel>Value Field {i + 1} *</InputLabel>
                    <Select
                      value={s.valueField}
                      onChange={(e) =>
                        updateSeries(i, "valueField", e.target.value)
                      }
                    >
                      {columns.map((col) => (
                        <MenuItem key={col} value={col}>
                          {col}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField
                    label={`Name ${i + 1}`}
                    value={s.name}
                    onChange={(e) => updateSeries(i, "name", e.target.value)}
                    size="small"
                    sx={{ width: 140 }}
                  />
                  {i > 0 && (
                    <IconButton onClick={() => removeSeries(i)} size="small">
                      <Delete />
                    </IconButton>
                  )}
                </Stack>
              ))}
              <Button
                startIcon={<Add />}
                onClick={addSeries}
                variant="outlined"
                size="small"
              >
                Add Pie Series
              </Button>
            </>
          ) : (
            <>
              <FormControl fullWidth margin="normal" size="small">
                <InputLabel>X-Axis *</InputLabel>
                <Select
                  value={config.xAxis}
                  onChange={(e) =>
                    setConfig((prev) => ({ ...prev, xAxis: e.target.value }))
                  }
                >
                  {columns.map((col) => (
                    <MenuItem key={col} value={col}>
                      {col}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {config.series.map((s, i) => (
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="end"
                  key={i}
                  className="mb-2"
                >
                  <FormControl sx={{ flex: 2 }} size="small">
                    <InputLabel>Y Field {i + 1} *</InputLabel>
                    <Select
                      value={s.yField}
                      onChange={(e) =>
                        updateSeries(i, "yField", e.target.value)
                      }
                    >
                      {yFieldOptions.map((col) => (
                        <MenuItem key={col} value={col}>
                          {col}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField
                    label={`Name ${i + 1}`}
                    value={s.name}
                    onChange={(e) => updateSeries(i, "name", e.target.value)}
                    size="small"
                    sx={{ width: 120 }}
                  />
                  <FormControl sx={{ width: 100 }} size="small">
                    <InputLabel>Type</InputLabel>
                    <Select
                      value={s.type}
                      onChange={(e) => updateSeries(i, "type", e.target.value)}
                    >
                      <MenuItem value="bar">Bar</MenuItem>
                      <MenuItem value="line">Line</MenuItem>
                      <MenuItem value="area">Area</MenuItem>
                    </Select>
                  </FormControl>
                  {i > 0 && (
                    <IconButton onClick={() => removeSeries(i)} size="small">
                      <Delete />
                    </IconButton>
                  )}
                </Stack>
              ))}
              <Button
                startIcon={<Add />}
                onClick={addSeries}
                variant="outlined"
                size="small"
              >
                Add Series
              </Button>
              <FormControl margin="normal" size="small" sx={{ mt: 2 }}>
                <InputLabel>Stack Bars?</InputLabel>
                <Select
                  value={config.stack ? "yes" : "no"}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      stack: e.target.value === "yes",
                    }))
                  }
                >
                  <MenuItem value="no">No</MenuItem>
                  <MenuItem value="yes">Yes</MenuItem>
                </Select>
              </FormControl>
            </>
          )}
          <div className="flex gap-2 mt-4">
            <Button
              variant="contained"
              size="small"
              onClick={preview ? handleSaveChart : handlePreview}
            >
              {preview ? "Save Chart" : "Preview"}
            </Button>
            {preview && (
              <Button
                variant="outlined"
                size="small"
                onClick={() => setPreview(false)}
              >
                Edit
              </Button>
            )}
          </div>
          {preview && (
            <Box mt={3} p={2} border="1px solid #e0e0e0" borderRadius={1}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                {config.title}
              </Typography>
              <ChartPreview
                data={currentResult}
                config={{
                  ...config,
                  series: config.series.map((s, i) => ({
                    ...s,
                    color: GRAY_SHADES[i % GRAY_SHADES.length],
                  })),
                }}
              />
            </Box>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ChartBuilderPage;
