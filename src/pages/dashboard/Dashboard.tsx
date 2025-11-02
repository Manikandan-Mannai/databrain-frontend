import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Alert,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Chip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store/store";
import {
  fetchDashboards,
  updateDashboard,
  deleteDashboard,
} from "../../redux/slices/dashboardSlice";
import { fetchCharts } from "../../redux/slices/chartSlice";
import BarChart from "../../components/charts/BarChart";
import LineChart from "../../components/charts/LineChart";
import PieChart from "../../components/charts/PieChart";

const DashboardPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { list, status, error } = useSelector(
    (state: RootState) => state.dashboard
  );
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const { charts } = useSelector((state: RootState) => state.chart);

  const [editOpen, setEditOpen] = useState(false);
  const [editDash, setEditDash] = useState<any>(null);
  const [name, setName] = useState("");
  const [accessLevel, setAccessLevel] = useState<
    "public" | "private" | "shared"
  >("private");
  const [sharedWith, setSharedWith] = useState<string[]>([]);
  const [selectedCharts, setSelectedCharts] = useState<
    Array<{ chartId: string; layout?: any }>
  >([]);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [chartToRemove, setChartToRemove] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchDashboards());
    dispatch(fetchCharts());
  }, [dispatch]);

  const openEdit = (dashboard: any) => {
    setEditDash(dashboard);
    setName(dashboard.name);
    setAccessLevel(dashboard.accessLevel);
    setSharedWith(dashboard.sharedWith?.map((u: any) => u._id) || []);
    setSelectedCharts(
      dashboard.charts.map((c: any) => ({
        chartId: c.chartId._id,
        layout: c.layout,
      }))
    );
    setEditOpen(true);
  };

  const closeEdit = () => {
    setEditOpen(false);
    setEditDash(null);
    setConfirmDelete(false);
    setChartToRemove(null);
  };

  const handleRemoveChart = (chartId: string) => {
    setChartToRemove(chartId);
  };

  const confirmRemoveChart = () => {
    if (chartToRemove) {
      setSelectedCharts((prev) =>
        prev.filter((c) => c.chartId !== chartToRemove)
      );
      setChartToRemove(null);
    }
  };

  const saveEdit = async () => {
    await dispatch(
      updateDashboard({
        id: editDash._id,
        name,
        charts: selectedCharts,
        accessLevel,
        sharedWith,
      })
    );
    closeEdit();
    dispatch(fetchDashboards());
  };

  const handleDeleteDashboard = () => {
    setConfirmDelete(true);
  };

  const confirmDeleteDashboard = () => {
    dispatch(deleteDashboard(editDash._id));
    closeEdit();
  };

  const renderChart = (chart: any) => {
    const chartId = chart?.chartId;
    if (!chartId) return null;
    const data = chartId?.data || [];
    const config = chartId?.config || {};
    const series = chartId?.series || [];
    const title = chartId?.title || "";
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
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", p: 3 }}>
      {currentUser?.name && (
        <Box
          display="flex"
          alignItems="center"
          gap={1.5}
          mb={3}
          sx={{ flexWrap: "wrap" }}
        >
          <Typography variant="h4" fontWeight={600}>
            Welcome, {currentUser.name}!
          </Typography>
          <Box
            sx={{
              px: 1.5,
              py: 0.5,
              borderRadius: "8px",
              bgcolor:
                currentUser.role === "admin"
                  ? "rgba(0,0,0,0.1)"
                  : currentUser.role === "editor"
                  ? "rgba(100,149,237,0.15)"
                  : "rgba(128,128,128,0.1)",
              color:
                currentUser.role === "admin"
                  ? "#000"
                  : currentUser.role === "editor"
                  ? "#4169E1"
                  : "#555",
            }}
          >
            {currentUser.role}
          </Box>
        </Box>
      )}

      {list?.map((dashboard) => {
        const charts = dashboard?.charts || [];
        const chartCount = charts?.length;
        const isOwner = currentUser?._id === dashboard.createdBy._id;

        let gridTemplateColumns = "repeat(4, 1fr)";
        if (chartCount === 1) gridTemplateColumns = "1fr";
        else if (chartCount === 2) gridTemplateColumns = "repeat(2, 1fr)";
        else if (chartCount === 3) gridTemplateColumns = "repeat(3, 1fr)";

        return (
          <Box
            key={dashboard?._id}
            sx={{
              border: "1px solid #e0e0e0",
              borderRadius: 3,
              p: 3,
              mb: 6,
              bgcolor: "background.paper",
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="h6" fontWeight={600} color="text.primary">
                {dashboard?.name}
              </Typography>
              {isOwner && (
                <Tooltip title="Edit Dashboard">
                  <IconButton size="small" onClick={() => openEdit(dashboard)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns,
                gap: 3,
                alignItems: "stretch",
              }}
            >
              {charts?.length > 0 ? (
                charts?.map((chart: any) => {
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
                      key={chart?.chartId?._id}
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

      {/* Edit Modal - Notion Style B&W */}
      <Dialog open={editOpen} onClose={closeEdit} fullWidth maxWidth="sm">
        <DialogTitle sx={{ color: "#000", fontWeight: 600 }}>
          Edit Dashboard
        </DialogTitle>
        <DialogContent dividers sx={{ bgcolor: "#fff" }}>
          <TextField
            placeholder="Dashboard Name"
            fullWidth
            size="small"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ mb: 2, "& .MuiOutlinedInput-root": { bgcolor: "#fff" } }}
          />
          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <Select
              value={accessLevel}
              onChange={(e) => setAccessLevel(e.target.value as any)}
              displayEmpty
              sx={{ bgcolor: "#fff" }}
            >
              <MenuItem value="private">Private</MenuItem>
              <MenuItem value="shared">Shared</MenuItem>
              <MenuItem value="public">Public</MenuItem>
            </Select>
          </FormControl>
          {accessLevel === "shared" && (
            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <Select
                multiple
                value={sharedWith}
                onChange={(e) => setSharedWith(e.target.value as string[])}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {(selected as string[]).map((v) => (
                      <Chip key={v} label={v} size="small" />
                    ))}
                  </Box>
                )}
                sx={{ bgcolor: "#fff" }}
              >
                <MenuItem value="user1">user1</MenuItem>
                <MenuItem value="user2">user2</MenuItem>
              </Select>
            </FormControl>
          )}
          <Typography variant="subtitle1" gutterBottom sx={{ color: "#000" }}>
            Charts
          </Typography>
          <Box sx={{ mb: 2 }}>
            {selectedCharts.map((c) => {
              const chart = charts.find((ch) => ch._id === c.chartId);
              const label = chart ? `${chart.title} (${c.chartId})` : c.chartId;
              return (
                <Chip
                  key={c.chartId}
                  label={label}
                  onDelete={() => handleRemoveChart(c.chartId)}
                  size="small"
                  sx={{ mr: 1, mb: 1, bgcolor: "#f5f5f5" }}
                />
              );
            })}
          </Box>
        </DialogContent>
        <DialogActions sx={{ bgcolor: "#fff", p: 2 }}>
          <Button onClick={closeEdit} sx={{ color: "#000" }}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteDashboard}
            sx={{
              color: "#000",
              border: "1px solid #000",
              "&:hover": { bgcolor: "#f0f0f0" },
            }}
          >
            Delete Dashboard
          </Button>
          <Button
            variant="contained"
            onClick={saveEdit}
            sx={{ bgcolor: "#000", color: "#fff" }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Remove Chart */}
      <Dialog
        open={!!chartToRemove}
        onClose={() => setChartToRemove(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ color: "#000" }}>Remove Chart?</DialogTitle>
        <DialogContent sx={{ color: "#000" }}>
          <Typography>Are you sure you want to remove this chart?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setChartToRemove(null)} sx={{ color: "#000" }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={confirmRemoveChart}
            sx={{ bgcolor: "#000", color: "#fff" }}
          >
            Remove
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Delete Dashboard */}
      <Dialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ color: "#000" }}>Delete Dashboard?</DialogTitle>
        <DialogContent sx={{ color: "#000" }}>
          <Typography>This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConfirmDelete(false)}
            sx={{ color: "#000" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={confirmDeleteDashboard}
            sx={{ bgcolor: "#000", color: "#fff" }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DashboardPage;
