import { Add, Delete } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";

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
  const selectedSource = sources?.find?.(
    (s) => s?._id === formConfig?.dataSourceId
  );
  const columns = selectedSource?.columns ?? [];

  const handleAddMetric = () =>
    setFormConfig({
      ...formConfig,
      metrics: [
        ...(formConfig?.metrics ?? []),
        { column: "", aggregation: "SUM", as: "" },
      ],
    });

  const handleRemoveMetric = (index: number) => {
    const updated = (formConfig?.metrics ?? []).filter(
      (_: any, i: number) => i !== index
    );
    setFormConfig({ ...formConfig, metrics: updated });
  };

  const handleMetricChange = (index: number, field: string, value: any) => {
    const updated = [...(formConfig?.metrics ?? [])];
    if (updated[index]) updated[index][field] = value;
    setFormConfig({ ...formConfig, metrics: updated });
  };

  const handleAddFilter = () =>
    setFormConfig({
      ...formConfig,
      filters: [
        ...(formConfig?.filters ?? []),
        { column: "", operator: "=", value: "" },
      ],
    });

  const handleRemoveFilter = (index: number) => {
    const updated = (formConfig?.filters ?? []).filter(
      (_: any, i: number) => i !== index
    );
    setFormConfig({ ...formConfig, filters: updated });
  };

  const handleFilterChange = (index: number, field: string, value: any) => {
    const updated = [...(formConfig?.filters ?? [])];
    if (updated[index]) updated[index][field] = value;
    setFormConfig({ ...formConfig, filters: updated });
  };

  const fieldStyle = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      backgroundColor: "#fff",
      height: 40,
      fontSize: 14,
      "& input, & .MuiSelect-select": {
        padding: "6px 10px",
      },
      "& fieldset": { borderColor: "#e0e0e0" },
      "&:hover fieldset": { borderColor: "#bdbdbd" },
      "&.Mui-focused fieldset": { borderColor: "#1976d2" },
    },
    "& .MuiSelect-icon": {
      fontSize: 20,
      color: "#777",
      right: 6,
    },
    "& .MuiMenuItem-root": {
      fontSize: 14,
      minHeight: "32px !important",
      padding: "6px 10px",
    },
    "& .MuiInputBase-input::placeholder": {
      fontSize: 14,
      color: "#777",
    },
    "& .MuiPaper-root": {
      maxHeight: 180,
    },
  };

  return (
    <Card
      elevation={0}
      sx={{
        bgcolor: "#fff",
        borderRadius: 2,
        border: "1px solid #e3e3e3",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
      }}
    >
      <CardHeader
        title={
          <Typography
            variant="subtitle1"
            fontWeight={600}
            sx={{ color: "#111", fontSize: 15 }}
          >
            Query Configuration
          </Typography>
        }
        sx={{
          borderBottom: "1px solid #eee",
          px: 2,
          py: 1.25,
        }}
      />

      <CardContent
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 2.5,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <FormControl fullWidth sx={fieldStyle}>
          <Select
            value={formConfig?.dataSourceId ?? ""}
            displayEmpty
            onChange={(e) =>
              setFormConfig({ ...formConfig, dataSourceId: e.target.value })
            }
          >
            <MenuItem disabled value="">
              Select Data Source
            </MenuItem>
            {sources?.map?.((src) => (
              <MenuItem key={src?._id} value={src?._id}>
                {src?.name ?? "Unnamed Source"}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {selectedSource && (
          <>
            <FormControl fullWidth sx={fieldStyle}>
              <Select
                value={formConfig?.groupBy ?? ""}
                displayEmpty
                onChange={(e) =>
                  setFormConfig({ ...formConfig, groupBy: e.target.value })
                }
              >
                <MenuItem disabled value="">
                  Group By
                </MenuItem>
                {columns?.map?.((col: any) => (
                  <MenuItem key={col} value={col}>
                    {col}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box>
              <Typography
                variant="subtitle2"
                sx={{ mb: 1, color: "#222", fontWeight: 500 }}
              >
                Metrics
              </Typography>

              {formConfig?.metrics?.map?.((metric: any, index: number) => (
                <Box
                  key={index}
                  display="flex"
                  gap={1.25}
                  mb={1.25}
                  alignItems="center"
                >
                  <FormControl fullWidth sx={fieldStyle}>
                    <Select
                      value={metric?.column ?? ""}
                      displayEmpty
                      onChange={(e) =>
                        handleMetricChange(index, "column", e.target.value)
                      }
                    >
                      <MenuItem disabled value="">
                        Select Column
                      </MenuItem>
                      {columns?.map?.((col: any) => (
                        <MenuItem key={col} value={col}>
                          {col}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth sx={fieldStyle}>
                    <Select
                      value={metric?.aggregation ?? "SUM"}
                      displayEmpty
                      onChange={(e) =>
                        handleMetricChange(index, "aggregation", e.target.value)
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
                    placeholder="Alias"
                    value={metric?.as ?? ""}
                    onChange={(e) =>
                      handleMetricChange(index, "as", e.target.value)
                    }
                    fullWidth
                    sx={fieldStyle}
                  />

                  <IconButton
                    onClick={() => handleRemoveMetric(index)}
                    sx={{
                      color: "#000",
                      bgcolor: "#f7f7f7",
                      width: 34,
                      height: 34,
                      "&:hover": { bgcolor: "#ebebeb" },
                    }}
                  >
                    <Delete sx={{ fontSize: 18 }} />
                  </IconButton>
                </Box>
              ))}

              <Button
                startIcon={<Add sx={{ fontSize: 18 }} />}
                onClick={handleAddMetric}
                sx={{
                  color: "#fff",
                  textTransform: "none",
                  fontSize: 14,
                  borderRadius: 2,
                  bgcolor: "#000",
                  px: 1.5,
                  py: 0.75,
                  "&:hover": { bgcolor: "#222" },
                }}
              >
                Add Metric
              </Button>
            </Box>

            <Box>
              <Typography
                variant="subtitle2"
                sx={{ mb: 1, color: "#222", fontWeight: 500 }}
              >
                Filters
              </Typography>

              {formConfig?.filters?.map?.((filter: any, index: number) => (
                <Box
                  key={index}
                  display="flex"
                  gap={1.25}
                  mb={1.25}
                  alignItems="center"
                >
                  <FormControl fullWidth sx={fieldStyle}>
                    <Select
                      value={filter?.column ?? ""}
                      displayEmpty
                      onChange={(e) =>
                        handleFilterChange(index, "column", e.target.value)
                      }
                    >
                      <MenuItem disabled value="">
                        Select Column
                      </MenuItem>
                      {columns?.map?.((col: any) => (
                        <MenuItem key={col} value={col}>
                          {col}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth sx={fieldStyle}>
                    <Select
                      value={filter?.operator ?? "="}
                      displayEmpty
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
                    placeholder="Value"
                    value={filter?.value ?? ""}
                    onChange={(e) =>
                      handleFilterChange(index, "value", e.target.value)
                    }
                    fullWidth
                    sx={fieldStyle}
                  />

                  <IconButton
                    onClick={() => handleRemoveFilter(index)}
                    sx={{
                      color: "#000",
                      bgcolor: "#f7f7f7",
                      width: 34,
                      height: 34,
                      "&:hover": { bgcolor: "#ebebeb" },
                    }}
                  >
                    <Delete sx={{ fontSize: 18 }} />
                  </IconButton>
                </Box>
              ))}

              <Button
                startIcon={<Add sx={{ fontSize: 18 }} />}
                onClick={handleAddFilter}
                sx={{
                  color: "#fff",
                  textTransform: "none",
                  fontSize: 14,
                  borderRadius: 2,
                  bgcolor: "#000",
                  px: 1.5,
                  py: 0.75,
                  "&:hover": { bgcolor: "#222" },
                }}
              >
                Add Filter
              </Button>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default QueryForm;
