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
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import ChartPreview from "./ChartPreview";
import { fetchQueryResult } from "../../redux/slices/querySlice";
import { saveChart } from "../../redux/slices/chartSlice";
import type { RootState, AppDispatch } from "../../redux/store/store";

interface ChartConfig {
  xAxis: string;
  yAxis: string;
  type: "bar" | "line" | "pie";
  title: string;
}

const ChartBuilderPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const queryParams = new URLSearchParams(location.search);
  const queryId = queryParams.get("queryId");

  const { currentResult, status: queryStatus } = useSelector(
    (state: RootState) => state.query
  );
  const { status: chartStatus } = useSelector(
    (state: RootState) => state.chart
  );

  const [chartConfig, setChartConfig] = useState<ChartConfig>({
    xAxis: "",
    yAxis: "",
    type: "bar",
    title: "",
  });

  useEffect(() => {
    if (queryId && !currentResult) {
      dispatch(fetchQueryResult(queryId));
    } else if (!queryId && !currentResult) {
      toast.info("No query result found. Redirecting...");
      navigate("/queries/new");
    }
  }, [queryId, currentResult, dispatch, navigate]);

  const handleChange = (field: keyof ChartConfig, value: string) => {
    setChartConfig((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!chartConfig.title || !chartConfig.xAxis || !chartConfig.yAxis) {
      toast.warning("Please fill all required fields");
      return;
    }

    try {
      await dispatch(
        saveChart({
          title: chartConfig.title,
          type: chartConfig.type,
          queryId: queryId!,
          config: { xAxis: chartConfig.xAxis, yAxis: chartConfig.yAxis },
        })
      ).unwrap();
      toast.success("Chart saved successfully!");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err || "Failed to save chart");
    }
  };

  if (queryStatus === "loading") {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!currentResult?.length) return null;
  const columns = Object.keys(currentResult[0]);

  return (
    <Card sx={{ m: 2 }}>
      <CardHeader title={<Typography variant="h6">Chart Builder</Typography>} />
      <CardContent>
        <FormControl fullWidth margin="normal">
          <TextField
            label="Chart Title"
            value={chartConfig.title}
            onChange={(e) => handleChange("title", e.target.value)}
          />
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>X-Axis</InputLabel>
          <Select
            value={chartConfig.xAxis}
            label="X-Axis"
            onChange={(e) => handleChange("xAxis", e.target.value)}
          >
            {columns.map((col) => (
              <MenuItem key={col} value={col}>
                {col}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>Y-Axis</InputLabel>
          <Select
            value={chartConfig.yAxis}
            label="Y-Axis"
            onChange={(e) => handleChange("yAxis", e.target.value)}
          >
            {columns.map((col) => (
              <MenuItem key={col} value={col}>
                {col}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>Chart Type</InputLabel>
          <Select
            value={chartConfig.type}
            label="Chart Type"
            onChange={(e) =>
              handleChange("type", e.target.value as "bar" | "line" | "pie")
            }
          >
            <MenuItem value="bar">Bar</MenuItem>
            <MenuItem value="line">Line</MenuItem>
            <MenuItem value="pie">Pie</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={handleSave}
          disabled={chartStatus === "loading"}
        >
          {chartStatus === "loading" ? "Saving..." : "Save Chart"}
        </Button>

        <Box mt={3}>
          <ChartPreview data={currentResult} config={chartConfig} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default ChartBuilderPage;
