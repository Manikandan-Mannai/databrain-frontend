import React, { useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
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
    (state: RootState) => state?.dashboard
  );

  useEffect(() => {
    dispatch(fetchDashboards());
  }, [dispatch]);

  const renderChart = (chart: any) => {
    const chartId = chart?.chartId;
    if (!chartId) return null;

    const data = chartId?.data || [];
    const config = chartId?.config || {};
    const series = chartId?.series || [];
    const title = chartId?.title || "";

    if (status === "loading" && !data?.length) {
      return (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="200px"
        >
          <CircularProgress size={28} />
        </Box>
      );
    }

    switch (chartId?.type) {
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
        return <PieChart config={config} data={data} title={title} />;
      default:
        return (
          <Typography color="text.secondary">
            Unsupported chart type: {chartId?.type}
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
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      <Typography variant="h4" fontWeight={700} mb={4}>
        Your Dashboards
      </Typography>

      {list?.map((dashboard) => {
        const charts = dashboard?.charts || [];
        const chartCount = charts?.length;

        let gridTemplateColumns = "repeat(4, 1fr)";
        if (chartCount === 1) gridTemplateColumns = "1fr";
        else if (chartCount === 2) gridTemplateColumns = "repeat(2, 1fr)";
        else if (chartCount === 3) gridTemplateColumns = "repeat(3, 1fr)";

        return (
          <Box key={dashboard?._id} mb={8}>
            <Typography
              variant="h6"
              fontWeight={600}
              mb={3}
              color="text.primary"
            >
              {dashboard?.name}
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns,
                gap: 3,
                alignItems: "stretch",
              }}
            >
              {charts?.length > 0 ? (
                charts?.map((chart) => {
                  const chartType = chart?.chartId?.type || "";
                  const spanStyle =
                    chartType === "bar" || chartType === "line"
                      ? { gridColumn: "span 2" }
                      : { gridColumn: "span 1" };
                  const normalizeSpan =
                    chartCount <= 2 &&
                    (chartType === "bar" || chartType === "line")
                      ? { gridColumn: "span 1" }
                      : spanStyle;

                  return (
                    <Card
                      key={chart?.chartId?._id || Math.random()}
                      sx={{
                        ...normalizeSpan,
                        borderRadius: 3,
                        boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                        backgroundColor: "background.paper",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        transition: "all 0.3s ease",
                        p: 2,
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
                        },
                      }}
                    >
                      <CardContent
                        sx={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          p: 2,
                          "& > *": {
                            width: "100% !important",
                            height: "100% !important",
                          },
                        }}
                      >
                        {renderChart(chart)}
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <Typography color="text.secondary">
                  No charts in this dashboard.
                </Typography>
              )}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default DashboardPage;
