import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Button,
  Chip,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Delete, UploadFile } from "@mui/icons-material";
import { useDropzone } from "react-dropzone";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDataSources,
  uploadCSV,
  deleteDataSource,
} from "../../redux/slices/dataSlice";
import type { RootState, AppDispatch } from "../../redux/store/store";
import type { DataSource } from "../../redux/types/index";

export default function DataSourcePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { sources, status } = useSelector((state: RootState) => state.data);
  const { user } = useSelector((state: RootState) => state.auth);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const isEditor = user?.role === "admin" || user?.role === "editor";

  useEffect(() => {
    if (status === "idle") dispatch(fetchDataSources());
  }, [dispatch, status]);

  const onDrop = async (acceptedFiles: File[]) => {
    if (!isEditor) return;
    const file = acceptedFiles[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", file.name);

    try {
      await dispatch(uploadCSV(formData)).unwrap();
      dispatch(fetchDataSources());
    } catch (err: any) {
      setUploadError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "text/csv": [".csv"] },
    multiple: false,
    disabled: !isEditor,
  });

  const handleDelete = async (id: string) => {
    await dispatch(deleteDataSource(id)).unwrap();
    dispatch(fetchDataSources());
  };

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Data Sources
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Upload and manage your data sources
      </Typography>

      {isEditor && (
        <Paper
          {...getRootProps()}
          sx={{
            border: "2px dashed",
            borderColor: isDragActive ? "primary.main" : "grey.400",
            borderRadius: 2,
            p: 4,
            textAlign: "center",
            cursor: isEditor ? "pointer" : "not-allowed",
            backgroundColor: isDragActive ? "action.hover" : "transparent",
            mt: 3,
            mb: 4,
          }}
        >
          <input {...getInputProps()} />
          <UploadFile sx={{ fontSize: 48, color: "grey.500", mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Upload a CSV file
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Drag and drop your file here, or click to browse
          </Typography>
          <Button
            variant="contained"
            disabled={uploading || !isEditor}
            sx={{ mt: 2 }}
          >
            {uploading ? <CircularProgress size={20} /> : "Choose File"}
          </Button>
        </Paper>
      )}

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

      {status === "succeeded" && sources.length === 0 && (
        <Paper sx={{ p: 3, textAlign: "center", color: "text.secondary" }}>
          <Typography>No data sources uploaded yet</Typography>
        </Paper>
      )}

      <List>
        {sources.map((source: DataSource) => (
          <ListItem
            key={source._id}
            secondaryAction={
              isEditor && (
                <IconButton
                  edge="end"
                  color="error"
                  onClick={() => handleDelete(source._id)}
                >
                  <Delete />
                </IconButton>
              )
            }
            sx={{
              border: 1,
              borderColor: "grey.300",
              borderRadius: 1,
              mb: 1,
              bgcolor: "background.paper",
            }}
          >
            <ListItemText
              primary={
                <Typography variant="subtitle1" fontWeight="medium">
                  {source.name}
                </Typography>
              }
              secondary={
                <>
                  <Typography
                    component="span"
                    variant="body2"
                    color="text.primary"
                    display="inline"
                  >
                    {source.rowCount} rows • {source.columns.length} columns
                  </Typography>
                  {" • "}
                  <Typography
                    component="span"
                    variant="body2"
                    color="text.secondary"
                    display="inline"
                  >
                    Uploaded {new Date(source.createdAt).toLocaleString()}
                  </Typography>
                  <Box mt={1} component="div">
                    {source.columns.map((col) => (
                      <Chip
                        key={col}
                        label={col}
                        size="small"
                        sx={{ mr: 0.5, mb: 0.5 }}
                      />
                    ))}
                  </Box>
                </>
              }
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
