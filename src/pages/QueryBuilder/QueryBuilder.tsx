import { Add, Delete, PlayArrow } from "@mui/icons-material";
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDataSources } from "../../redux/slices/dataSlice";
import {
    clearError,
    clearResult,
    runQuery,
} from "../../redux/slices/querySlice";
import type { AppDispatch, RootState } from "../../redux/store/store";
import type {
    QueryFilter,
    QueryMetric
} from "../../redux/types/index";

export default function QueryBuilder() {
  const dispatch = useDispatch<AppDispatch>();
  const { sources } = useSelector((state: RootState) => state.data);
  const { currentResult, status, error } = useSelector(
    (state: RootState) => state.query
  );
  const { user } = useSelector((state: RootState) => state.auth);

  const [dataSourceId, setDataSourceId] = useState("");
  const [name, setName] = useState("");
  const [groupBy, setGroupBy] = useState("");
  const [filters, setFilters] = useState<QueryFilter[]>([]);
  const [metrics, setMetrics] = useState<QueryMetric[]>([]);

  const selectedSource = sources.find((s) => s._id === dataSourceId);
  const columns = selectedSource?.columns || [];

  useEffect(() => {
    dispatch(fetchDataSources());
  }, [dispatch]);

  const addFilter = () => {
    setFilters([...filters, { column: "", operator: "=", value: "" }]);
  };

  const updateFilter = <K extends keyof QueryFilter>(
    index: number,
    field: K,
    value: QueryFilter[K]
  ) => {
    const updated = [...filters];
    updated[index][field] = value;
    setFilters(updated);
  };

  const removeFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  const addMetric = () => {
    setMetrics([...metrics, { column: "", aggregation: "SUM", as: "" }]);
  };

  const updateMetric = (
    index: number,
    field: keyof QueryMetric,
    value: string
  ) => {
    const updated = [...metrics];
    updated[index][field] = value as any;
    setMetrics(updated);
  };

  const removeMetric = (index: number) => {
    setMetrics(metrics.filter((_, i) => i !== index));
  };

  const handleRun = async () => {
    if (!dataSourceId || !name.trim()) return;

    dispatch(clearResult());
    dispatch(clearError());

    await dispatch(
      runQuery({
        dataSourceId,
        name: name.trim(),
        config: {
          filters,
          groupBy: groupBy || undefined,
          metrics,
        },
      })
    );
  };

  const isEditor = user?.role === "admin" || user?.role === "editor";

  if (!isEditor) {
    return (
      <Box p={3}>
        <Alert severity="error">
          You don't have permission to access Query Builder
        </Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Query Builder
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Data Source</InputLabel>
          <Select
            value={dataSourceId}
            label="Data Source"
            onChange={(e) => {
              setDataSourceId(e.target.value);
              setGroupBy("");
              setFilters([]);
              setMetrics([]);
            }}
          >
            {sources.map((s) => (
              <MenuItem key={s._id} value={s._id}>
                {s.name} ({s.rowCount} rows)
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Query Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ mb: 2 }}
        />

        {columns.length > 0 && (
          <>
            <Typography variant="subtitle2" gutterBottom>
              Group By
            </Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <Select
                value={groupBy}
                onChange={(e) => setGroupBy(e.target.value)}
                displayEmpty
              >
                <MenuItem value="">None</MenuItem>
                {columns.map((col) => (
                  <MenuItem key={col} value={col}>
                    {col}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Typography variant="subtitle2" gutterBottom>
              Filters
            </Typography>
            {filters.map((f, i) => (
              <Box key={i} display="flex" gap={1} alignItems="center" mb={1}>
                <Select
                  value={f.column}
                  onChange={(e) => updateFilter(i, "column", e.target.value)}
                  displayEmpty
                  size="small"
                  sx={{ width: 150 }}
                >
                  <MenuItem value="">Column</MenuItem>
                  {columns.map((col) => (
                    <MenuItem key={col} value={col}>
                      {col}
                    </MenuItem>
                  ))}
                </Select>
                <Select
                  value={f.operator}
                  onChange={(e) => updateFilter(i, "operator", e.target.value)}
                  size="small"
                  sx={{ width: 100 }}
                >
                  <MenuItem value="=">=</MenuItem>
                  <MenuItem value=">">&gt;</MenuItem>
                  <MenuItem value="<">&lt;</MenuItem>
                  <MenuItem value=">=">≥</MenuItem>
                  <MenuItem value="<=">≤</MenuItem>
                  <MenuItem value="!=">≠</MenuItem>
                  <MenuItem value="contains">contains</MenuItem>
                </Select>
                <TextField
                  size="small"
                  value={f.value}
                  onChange={(e) => updateFilter(i, "value", e.target.value)}
                  placeholder="Value"
                  sx={{ flex: 1 }}
                />
                <IconButton color="error" onClick={() => removeFilter(i)}>
                  <Delete />
                </IconButton>
              </Box>
            ))}
            <Button startIcon={<Add />} onClick={addFilter} size="small">
              Add Filter
            </Button>

            <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
              Metrics
            </Typography>
            {metrics.map((m, i) => (
              <Box key={i} display="flex" gap={1} alignItems="center" mb={1}>
                <Select
                  value={m.column}
                  onChange={(e) => updateMetric(i, "column", e.target.value)}
                  displayEmpty
                  size="small"
                  sx={{ width: 150 }}
                >
                  <MenuItem value="">Column</MenuItem>
                  {columns.map((col) => (
                    <MenuItem key={col} value={col}>
                      {col}
                    </MenuItem>
                  ))}
                </Select>
                <Select
                  value={m.aggregation}
                  onChange={(e) =>
                    updateMetric(i, "aggregation", e.target.value)
                  }
                  size="small"
                  sx={{ width: 100 }}
                >
                  <MenuItem value="SUM">SUM</MenuItem>
                  <MenuItem value="AVG">AVG</MenuItem>
                  <MenuItem value="COUNT">COUNT</MenuItem>
                  <MenuItem value="MIN">MIN</MenuItem>
                  <MenuItem value="MAX">MAX</MenuItem>
                </Select>
                <TextField
                  size="small"
                  label="As"
                  value={m.as}
                  onChange={(e) => updateMetric(i, "as", e.target.value)}
                  sx={{ width: 120 }}
                />
                <IconButton color="error" onClick={() => removeMetric(i)}>
                  <Delete />
                </IconButton>
              </Box>
            ))}
            <Button startIcon={<Add />} onClick={addMetric} size="small">
              Add Metric
            </Button>
          </>
        )}
      </Paper>

      <Button
        variant="contained"
        startIcon={<PlayArrow />}
        onClick={handleRun}
        disabled={status === "loading" || !dataSourceId || !name.trim()}
        sx={{ mb: 3 }}
      >
        {status === "loading" ? <CircularProgress size={20} /> : "Run Query"}
      </Button>

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          onClose={() => dispatch(clearError())}
        >
          {error}
        </Alert>
      )}

      {currentResult && currentResult.length > 0 && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Query Result ({currentResult.length} rows)
          </Typography>
          <Box sx={{ maxHeight: 400, overflow: "auto" }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  {Object.keys(currentResult[0]).map((key) => (
                    <TableCell key={key}>
                      <strong>{key}</strong>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {currentResult.slice(0, 100).map((row, i) => (
                  <TableRow key={i}>
                    {Object.values(row).map((val, j) => (
                      <TableCell key={j}>{String(val)}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
          {currentResult.length > 100 && (
            <Typography variant="caption" color="text.secondary">
              Showing first 100 rows
            </Typography>
          )}
        </Paper>
      )}
    </Box>
  );
}
