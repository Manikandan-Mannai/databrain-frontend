import React, { useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Alert,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store/store";
import { fetchDashboards } from "../../redux/slices/dashboardSlice";
import BarChart from "../../components/charts/BarChart";
import LineChart from "../../components/charts/LineChart";
import PieChart from "../../components/charts/PieChart";

const DashboardPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { list, status, error } = useSelector(
    (state: RootState) => state.dashboard
  );

  useEffect(() => {
    dispatch(fetchDashboards());
  }, [dispatch]);

  const renderChart = (chart: any) => {
    const { chartId } = chart;
    if (!chartId) return null;

    const data = chartId.data || [];
    const config = chartId.config || {};
    const series = chartId.series || [];
    const title = chartId.title || "";

    if (status === "loading" && !data.length) {
      return (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="200px"
        >
          <CircularProgress size={24} />
        </Box>
      );
    }

    switch (chartId.type) {
      case "bar":
        return (
          <BarChart config={config} data={data} title={title} series={series} />
        );
      case "line":
        return (
          <LineChart
            config={config}
            data={data}
            title={title}
            series={series}
          />
        );
      case "pie":
        return <PieChart config={config} data={data} />;
      default:
        return (
          <Typography color="text.secondary">
            Unsupported chart type: {chartId.type}
          </Typography>
        );
    }
  };

  if (status === "loading") {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="70vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (status === "failed") {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="70vh"
      >
        <Alert severity="error">{error || "Failed to load dashboards"}</Alert>
      </Box>
    );
  }

  if (!list?.length) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="70vh"
      >
        <Typography variant="h6" color="text.secondary">
          No dashboards found.
        </Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Your Dashboards
      </Typography>
      {list.map((dashboard) => (
        <Box key={dashboard._id} mb={5}>
          <Typography variant="h6" gutterBottom>
            {dashboard.name}
          </Typography>
          <Grid container spacing={2}>
            {dashboard.charts && dashboard.charts.length > 0 ? (
              dashboard.charts.map((chart) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={6}
                  lg={6}
                  key={chart.chartId?._id || Math.random()}
                >
                  <Card
                    variant="outlined"
                    sx={{
                      borderRadius: 2,
                      boxShadow: 2,
                      transition: "0.3s",
                      "&:hover": { boxShadow: 5 },
                    }}
                  >
                    <CardContent>{renderChart(chart)}</CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Typography color="text.secondary">
                No charts in this dashboard.
              </Typography>
            )}
          </Grid>
        </Box>
      ))}
    </Box>
  );
};

export default DashboardPage;
