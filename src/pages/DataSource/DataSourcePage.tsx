import { Delete, UploadFile, Visibility } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  deleteDataSource,
  fetchDataSources,
  uploadCSV,
} from "../../redux/slices/dataSlice";
import type { AppDispatch, RootState } from "../../redux/store/store";
import type { DataSource } from "../../redux/types";
import CSVPreviewModal from "./CSVPreviewModal";

export default function DataSourcePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { sources, status } = useSelector(
    (state: RootState) => state?.data ?? {}
  );

  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);
  const [selectedName, setSelectedName] = useState<string | null>(null);

  useEffect(() => {
    if (status === "idle") dispatch(fetchDataSources());
  }, [dispatch, status]);

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", file.name);

    try {
      await dispatch(uploadCSV(formData)).unwrap();
      dispatch(fetchDataSources());
      toast.success("File uploaded successfully");
    } catch (err: any) {
      const message = err?.message || "Upload failed";
      setUploadError(message);
      toast.error(message);
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "text/csv": [".csv"] },
    multiple: false,
  });

  const handleDelete = async (id?: string) => {
    if (!id) return;
    try {
      await dispatch(deleteDataSource(id)).unwrap();
      dispatch(fetchDataSources());
      toast.success("Data source deleted successfully");
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete data source");
    }
  };

  const handlePreview = (source: DataSource) => {
    setSelectedSourceId(source?._id ?? null);
    setSelectedName(source?.name ?? null);
    setPreviewOpen(true);
  };

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Data Sources
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Upload and manage your data sources
      </Typography>

      <Paper
        {...getRootProps?.()}
        sx={{
          border: "2px dashed",
          borderColor: isDragActive ? "text.primary" : "grey.400",
          borderRadius: 2,
          p: 4,
          textAlign: "center",
          cursor: "pointer",
          backgroundColor: isDragActive ? "action.hover" : "transparent",
          mt: 3,
          mb: 4,
        }}
      >
        <input {...getInputProps?.()} />
        <UploadFile sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          Upload a CSV file
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Drag and drop your file here, or click to browse
        </Typography>
        <Button
          variant="outlined"
          disabled={uploading}
          sx={{
            mt: 2,
            px: 2,
            py: 0.5,
            fontSize: 13,
            borderRadius: 1.5,
            textTransform: "none",
            borderColor: "text.primary",
            color: "white",
            bgcolor: "black",
            transition: "opacity 0.2s ease, background-color 0.2s ease",
            "&:hover": { opacity: 0.7, bgcolor: "black" },
          }}
        >
          {uploading ? (
            <CircularProgress size={16} sx={{ color: "white" }} />
          ) : (
            "Choose File"
          )}
        </Button>
      </Paper>

      {uploadError && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          onClose={() => setUploadError(null)}
        >
          {uploadError}
        </Alert>
      )}

      <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
        Uploaded Data Sources
      </Typography>

      {status === "loading" && (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      )}

      {status === "succeeded" && (sources?.length ?? 0) === 0 && (
        <Paper sx={{ p: 3, textAlign: "center", color: "text.secondary" }}>
          <Typography>No data sources uploaded yet</Typography>
        </Paper>
      )}

      <List>
        {sources?.map?.((source: DataSource) => (
          <ListItem
            key={source?._id ?? Math.random()}
            secondaryAction={
              <Box display="flex" alignItems="center" gap={1}>
                <IconButton
                  edge="end"
                  onClick={() => handlePreview(source)}
                  sx={{
                    color: "text.primary",
                    bgcolor: "transparent",
                    "&:hover": { bgcolor: "action.hover" },
                  }}
                >
                  <Visibility />
                </IconButton>
                <IconButton
                  edge="end"
                  onClick={() => handleDelete(source?._id)}
                  sx={{
                    color: "text.primary",
                    bgcolor: "transparent",
                    "&:hover": { bgcolor: "action.hover" },
                  }}
                >
                  <Delete />
                </IconButton>
              </Box>
            }
            sx={{
              border: 1,
              borderColor: "divider",
              borderRadius: 2,
              mb: 1.5,
              p: 1.5,
              bgcolor: "background.paper",
            }}
          >
            <ListItemText
              primary={
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  color="text.primary"
                  sx={{ fontSize: 16 }}
                >
                  {source?.name ?? "Unnamed Source"}
                </Typography>
              }
              secondary={
                <Box component="span">
                  <Typography
                    component="span"
                    variant="body2"
                    color="text.secondary"
                    sx={{ display: "block", mt: 0.5, fontSize: 13 }}
                  >
                    {source?.rowCount ?? 0} rows •{" "}
                    {source?.columns?.length ?? 0} columns • Uploaded{" "}
                    {source?.createdAt
                      ? new Date(source.createdAt).toLocaleString()
                      : "N/A"}
                  </Typography>
                  <Box mt={1} display="flex" flexWrap="wrap" gap={0.6}>
                    {source?.columns?.map?.((col) => (
                      <Box
                        key={col ?? Math.random()}
                        sx={{
                          px: 1.2,
                          py: 0.3,
                          borderRadius: 1,
                          bgcolor: "action.hover",
                          fontSize: 12,
                          fontWeight: 500,
                          color: "text.secondary",
                        }}
                      >
                        {col ?? "Unnamed Column"}
                      </Box>
                    ))}
                  </Box>
                </Box>
              }
            />
          </ListItem>
        ))}
      </List>

      <CSVPreviewModal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        dataSourceId={selectedSourceId}
        name={selectedName}
      />
    </Box>
  );
}
