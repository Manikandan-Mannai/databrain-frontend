import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPreviewData } from "../../redux/slices/dataSlice";
import type { AppDispatch, RootState } from "../../redux/store/store";

interface CSVPreviewModalProps {
  open: boolean;
  onClose: () => void;
  dataSourceId: string | null;
  name: string | null;
}

const CSVPreviewModal: React.FC<CSVPreviewModalProps> = ({
  open,
  onClose,
  dataSourceId,
  name,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { preview, status } = useSelector((state: RootState) => state.data);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(15);

  useEffect(() => {
    if (open && dataSourceId) {
      dispatch(fetchPreviewData({ id: dataSourceId, page: 1, limit }));
    }
  }, [open, dataSourceId, limit, dispatch]);

  const handleChangePage = (_: any, newPage: number) => {
    setPage(newPage);
    if (dataSourceId) {
      dispatch(
        fetchPreviewData({ id: dataSourceId, page: newPage + 1, limit })
      );
    }
  };

  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLimit = parseInt(e.target.value, 10);
    setLimit(newLimit);
    setPage(0);
    if (dataSourceId) {
      dispatch(
        fetchPreviewData({ id: dataSourceId, page: 1, limit: newLimit })
      );
    }
  };

  const loading = status === "loading";
  const columns = preview?.columns || [];
  const rows = preview?.rows || [];
  const totalRows = preview?.totalRows || 0;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
      PaperProps={{
        sx: {
          borderRadius: 2,
          bgcolor: "#fff",
          display: "flex",
          flexDirection: "column",
          height: "80vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          bgcolor: "#fff",
          borderBottom: "1px solid #eee",
          px: 3,
          py: 1.5,
          flexShrink: 0,
        }}
      >
        <Typography variant="h6">CSV Preview ({name || ""})</Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          flex: 1,
          p: 0,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          bgcolor: "#fff",
        }}
      >
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            flex={1}
          >
            <CircularProgress />
          </Box>
        ) : columns.length === 0 ? (
          <Typography color="text.secondary" textAlign="center" mt={3}>
            No columns found.
          </Typography>
        ) : (
          <>
            <TableContainer
              sx={{
                flex: 1,
                overflowY: "auto",
                borderRadius: 0,
                borderTop: "1px solid #eee",
                borderBottom: "1px solid #eee",
              }}
            >
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    {columns.map((col) => (
                      <TableCell
                        key={col}
                        sx={{ fontWeight: 600, bgcolor: "#fafafa" }}
                      >
                        {col}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, idx) => (
                    <TableRow key={idx}>
                      {columns.map((col) => (
                        <TableCell key={col}>
                          {row[col] !== undefined ? row[col].toString() : "-"}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box
              sx={{
                flexShrink: 0,
                borderTop: "1px solid #eee",
                bgcolor: "#fff",
              }}
            >
              <TablePagination
                component="div"
                count={totalRows}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={limit}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[10, 15, 25, 50]}
              />
            </Box>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CSVPreviewModal;
