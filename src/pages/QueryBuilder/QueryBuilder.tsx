import { BarChart, PlayArrow } from "@mui/icons-material";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { fetchDataSources } from "../../redux/slices/dataSlice";
import {
  clearQueryResult,
  fetchQueryResult,
  runQuery,
} from "../../redux/slices/querySlice";
import type { AppDispatch, RootState } from "../../redux/store/store";
import QueryForm from "./QueryForm";
import QueryResultTable from "./QueryResultTable";

export default function QueryBuilder() {
  const dispatch = useDispatch<AppDispatch>();

  const { sources } = useSelector((state: RootState) => state.data ?? {});
  const { currentResult, status, currentQueryId, error } = useSelector(
    (state: RootState) => state.query ?? {}
  );

  const [formConfig, setFormConfig] = useState<any>({
    dataSourceId: "",
    groupBy: "",
    metrics: [{ column: "", aggregation: "SUM", as: "" }],
    filters: [{ column: "", operator: "=", value: "" }],
  });

  useEffect(() => {
    dispatch(fetchDataSources());
    return () => {
      dispatch(clearQueryResult());
    };
  }, [dispatch]);

  const handleRunQuery = async () => {
    const { dataSourceId, groupBy, metrics, filters } = formConfig ?? {};
    if (!dataSourceId || !groupBy) {
      toast.info("Please select a data source and a group by field.");
      return;
    }

    try {
      const result = await dispatch(
        runQuery({
          dataSourceId,
          name: "Preview Query",
          config: { groupBy, metrics, filters },
        })
      ).unwrap();
      if (result?.queryId) {
        dispatch(fetchQueryResult(result.queryId));
      }
      toast.success("Query executed successfully!");
    } catch {
      toast.error("Failed to execute query.");
    }
  };

  const handleViewChart = () => {
    if (!currentQueryId) {
      toast.warning("Please run a query before viewing chart.");
      return;
    }
    window.location.href = `/charts/create?queryId=${currentQueryId}`;
  };

  return (
    <Box p={3} sx={{ bgcolor: "#fff", color: "#000", maxHeight: "100vh" }}>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h5" fontWeight="bold">
          Query Builder
        </Typography>

        <Box display="flex" gap={1.5}>
          <Button
            variant="outlined"
            startIcon={<PlayArrow />}
            onClick={handleRunQuery}
            disabled={status === "loading"}
            sx={{
              color: "#000",
              borderColor: "#000",
              px: 2,
              py: 0.5,
              textTransform: "none",
              fontSize: 13,
              "&:hover": { bgcolor: "#000", color: "#fff" },
            }}
          >
            {status === "loading" ? (
              <CircularProgress size={18} />
            ) : (
              "Run Query"
            )}
          </Button>

          <Button
            variant="contained"
            startIcon={<BarChart />}
            onClick={handleViewChart}
            disabled={!currentResult}
            sx={{
              bgcolor: "#000",
              color: "#fff",
              px: 2,
              py: 0.5,
              textTransform: "none",
              fontSize: 13,
              opacity: !currentResult ? 0.5 : 1,
              "&:hover": { bgcolor: "#222" },
            }}
          >
            View Chart
          </Button>
        </Box>
      </Box>

      <Box
        display="grid"
        gridTemplateColumns="1fr 1fr"
        gap={3}
        sx={{ height: "500px" }}
      >
        <QueryForm
          formConfig={formConfig}
          setFormConfig={setFormConfig}
          sources={sources ?? []}
        />

        <QueryResultTable
          status={status ?? "idle"}
          error={error ?? ""}
          data={currentResult ?? []}
        />
      </Box>
    </Box>
  );
}
