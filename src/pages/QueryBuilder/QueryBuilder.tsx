import { PlayArrow, BarChart } from "@mui/icons-material";
import { Box, Button, Typography, CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchDataSources } from "../../redux/slices/dataSlice";
import {
  runQuery,
  fetchQueryResult,
  clearQueryResult,
} from "../../redux/slices/querySlice";
import type { AppDispatch, RootState } from "../../redux/store/store";
import QueryForm from "./QueryForm";
import QueryResultTable from "./QueryResultTable";

export default function QueryBuilder() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { sources } = useSelector((state: RootState) => state.data);
  const { currentResult, status, currentQueryId, error } = useSelector(
    (state: RootState) => state.query
  );

  const [formConfig, setFormConfig] = useState<any>({
    dataSourceId: "",
    groupBy: "",
    metrics: [],
    filters: [],
  });

  useEffect(() => {
    dispatch(fetchDataSources());
    return () => {
      dispatch(clearQueryResult());
    };
  }, [dispatch]);

  //   const handleRunQuery = async () => {
  //     const { dataSourceId, groupBy, metrics, filters } = formConfig;
  //     if (!dataSourceId || !groupBy) {
  //       toast.info("Please select a data source and a group by field.");
  //       return;
  //     }

  //     const res = await dispatch(
  //       runQuery({
  //         dataSourceId,
  //         name: "Preview Query",
  //         config: { groupBy, metrics, filters },
  //       })
  //     );

  //     if (res.meta.requestStatus === "fulfilled" && currentQueryId) {
  //       dispatch(fetchQueryResult(currentQueryId));
  //       toast.success("Query executed successfully!");
  //     } else {
  //       toast.error("Failed to execute query.");
  //     }
  //   };

  const handleRunQuery = async () => {
    const { dataSourceId, groupBy, metrics, filters } = formConfig;
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
    } catch (error) {
      console.error(error);
      toast.error("Failed to execute query.");
    }
  };

  const handleViewChart = () => {
    if (!currentQueryId) {
      toast.warning("Please run a query before viewing chart.");
      return;
    }
    navigate(`/charts/create?queryId=${currentQueryId}`);
  };

  return (
    <Box p={3} sx={{ bgcolor: "#fff", color: "#000", minHeight: "100vh" }}>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h5" fontWeight="bold">
          Query Builder
        </Typography>

        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<PlayArrow />}
            onClick={handleRunQuery}
            disabled={status === "loading"}
            sx={{
              color: "#000",
              borderColor: "#000",
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
              "&:hover": { bgcolor: "#222" },
            }}
          >
            View as Chart
          </Button>
        </Box>
      </Box>

      <Box display="grid" gridTemplateColumns="350px 1fr" gap={3}>
        <QueryForm
          formConfig={formConfig}
          setFormConfig={setFormConfig}
          sources={sources}
        />
        <QueryResultTable status={status} error={error} data={currentResult} />
      </Box>
    </Box>
  );
}
