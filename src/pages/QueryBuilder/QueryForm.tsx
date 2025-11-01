import React from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  IconButton,
  Button,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";

interface QueryFormProps {
  formConfig: any;
  setFormConfig: (value: any) => void;
  sources: any[];
}

const QueryForm: React.FC<QueryFormProps> = ({
  formConfig,
  setFormConfig,
  sources,
}) => {
  const selectedSource = sources.find((s) => s._id === formConfig.dataSourceId);
  const columns = selectedSource?.columns || [];

  const handleAddMetric = () =>
    setFormConfig({
      ...formConfig,
      metrics: [
        ...formConfig.metrics,
        { column: "", aggregation: "SUM", as: "" },
      ],
    });

  const handleRemoveMetric = (index: number) => {
    const updated = formConfig.metrics.filter(
      (_: any, i: number) => i !== index
    );
    setFormConfig({ ...formConfig, metrics: updated });
  };

  const handleMetricChange = (index: number, field: string, value: any) => {
    const updated = [...formConfig.metrics];
    updated[index][field] = value;
    setFormConfig({ ...formConfig, metrics: updated });
  };

  const handleAddFilter = () =>
    setFormConfig({
      ...formConfig,
      filters: [
        ...formConfig.filters,
        { column: "", operator: "=", value: "" },
      ],
    });

  const handleRemoveFilter = (index: number) => {
    const updated = formConfig.filters.filter(
      (_: any, i: number) => i !== index
    );
    setFormConfig({ ...formConfig, filters: updated });
  };

  const handleFilterChange = (index: number, field: string, value: any) => {
    const updated = [...formConfig.filters];
    updated[index][field] = value;
    setFormConfig({ ...formConfig, filters: updated });
  };

  return (
    <Card>
      <CardHeader
        title={<Typography variant="h6">Query Configuration</Typography>}
      />
      <CardContent>
        <Box display="flex" flexDirection="column" gap={3}>
          {/* Data Source */}
          <FormControl fullWidth>
            <InputLabel>Data Source</InputLabel>
            <Select
              value={formConfig.dataSourceId}
              label="Data Source"
              onChange={(e) =>
                setFormConfig({ ...formConfig, dataSourceId: e.target.value })
              }
            >
              {sources.map((src) => (
                <MenuItem key={src._id} value={src._id}>
                  {src.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Group By */}
          {selectedSource && (
            <>
              <FormControl fullWidth>
                <InputLabel>Group By</InputLabel>
                <Select
                  value={formConfig.groupBy}
                  label="Group By"
                  onChange={(e) =>
                    setFormConfig({ ...formConfig, groupBy: e.target.value })
                  }
                >
                  {columns.map((col: any) => (
                    <MenuItem key={col} value={col}>
                      {col}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Metrics Section */}
              <Box>
                <Typography variant="subtitle1" mb={1}>
                  Metrics
                </Typography>
                {formConfig.metrics.map((metric: any, index: number) => (
                  <Box display="flex" gap={2} mb={2} key={index}>
                    <FormControl fullWidth>
                      <InputLabel>Column</InputLabel>
                      <Select
                        value={metric.column}
                        label="Column"
                        onChange={(e) =>
                          handleMetricChange(index, "column", e.target.value)
                        }
                      >
                        {columns.map((col: any) => (
                          <MenuItem key={col} value={col}>
                            {col}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl fullWidth>
                      <InputLabel>Aggregation</InputLabel>
                      <Select
                        value={metric.aggregation}
                        label="Aggregation"
                        onChange={(e) =>
                          handleMetricChange(
                            index,
                            "aggregation",
                            e.target.value
                          )
                        }
                      >
                        <MenuItem value="SUM">SUM</MenuItem>
                        <MenuItem value="AVG">AVG</MenuItem>
                        <MenuItem value="COUNT">COUNT</MenuItem>
                        <MenuItem value="MIN">MIN</MenuItem>
                        <MenuItem value="MAX">MAX</MenuItem>
                      </Select>
                    </FormControl>

                    <TextField
                      label="Alias"
                      value={metric.as}
                      onChange={(e) =>
                        handleMetricChange(index, "as", e.target.value)
                      }
                    />

                    <IconButton onClick={() => handleRemoveMetric(index)}>
                      <Delete />
                    </IconButton>
                  </Box>
                ))}
                <Button startIcon={<Add />} onClick={handleAddMetric}>
                  Add Metric
                </Button>
              </Box>

              {/* Filters Section */}
              <Box>
                <Typography variant="subtitle1" mb={1}>
                  Filters
                </Typography>
                {formConfig.filters.map((filter: any, index: number) => (
                  <Box display="flex" gap={2} mb={2} key={index}>
                    <FormControl fullWidth>
                      <InputLabel>Column</InputLabel>
                      <Select
                        value={filter.column}
                        label="Column"
                        onChange={(e) =>
                          handleFilterChange(index, "column", e.target.value)
                        }
                      >
                        {columns.map((col: any) => (
                          <MenuItem key={col} value={col}>
                            {col}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl fullWidth>
                      <InputLabel>Operator</InputLabel>
                      <Select
                        value={filter.operator}
                        label="Operator"
                        onChange={(e) =>
                          handleFilterChange(index, "operator", e.target.value)
                        }
                      >
                        <MenuItem value="=">=</MenuItem>
                        <MenuItem value="!=">!=</MenuItem>
                        <MenuItem value=">">{">"}</MenuItem>
                        <MenuItem value="<">{"<"}</MenuItem>
                        <MenuItem value=">=">{">="}</MenuItem>
                        <MenuItem value="<=">{"<="}</MenuItem>
                        <MenuItem value="contains">contains</MenuItem>
                      </Select>
                    </FormControl>

                    <TextField
                      label="Value"
                      value={filter.value}
                      onChange={(e) =>
                        handleFilterChange(index, "value", e.target.value)
                      }
                    />

                    <IconButton onClick={() => handleRemoveFilter(index)}>
                      <Delete />
                    </IconButton>
                  </Box>
                ))}
                <Button startIcon={<Add />} onClick={handleAddFilter}>
                  Add Filter
                </Button>
              </Box>
            </>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default QueryForm;
