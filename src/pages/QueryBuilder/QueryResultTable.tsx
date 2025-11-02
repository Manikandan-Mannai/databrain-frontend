import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  CircularProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Alert,
  Box,
} from "@mui/material";

interface QueryResultTableProps {
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  data: any[] | null;
}

const QueryResultTable: React.FC<QueryResultTableProps> = ({
  status,
  error,
  data,
}) => {
  const isLoading = status === "loading";
  const isError = status === "failed";
  const isSuccess = status === "succeeded";
  const isIdle = status === "idle";

  const formatValue = (val: any): string => {
    if (typeof val === "number" && !Number.isNaN(val) && Number.isFinite(val)) {
      return val.toFixed(2);
    }
    return String(val);
  };

  return (
    <Card
      sx={{
        bgcolor: "#fff",
        color: "#000",
        border: "1px solid #e0e0e0",
        borderRadius: 2,
        height: 500,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardHeader
        title="Query Result"
        titleTypographyProps={{ fontWeight: "bold", fontSize: 16 }}
        sx={{ borderBottom: "1px solid #eee", py: 1.5, px: 2 }}
      />
      <CardContent
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 0,
        }}
      >
        {isLoading && (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
            minHeight={200}
          >
            <CircularProgress size={28} thickness={4} />
          </Box>
        )}

        {isIdle && !isLoading && (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            <Typography color="textSecondary" fontSize={14}>
              Run a query to see the results here.
            </Typography>
          </Box>
        )}

        {isError && error && (
          <Alert
            severity="error"
            sx={{ m: 2, borderRadius: 2, bgcolor: "#fff4f4" }}
          >
            {error}
          </Alert>
        )}

        {isSuccess && data && data.length > 0 && (
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                {Object.keys(data[0]).map((key) => (
                  <TableCell
                    key={key}
                    sx={{
                      fontWeight: 600,
                      fontSize: 13.5,
                      color: "#111",
                      borderColor: "#eee",
                      textTransform: "capitalize",
                    }}
                  >
                    {key}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, i) => (
                <TableRow
                  key={i}
                  hover
                  sx={{
                    bgcolor: i % 2 === 0 ? "#fff" : "#fafafa",
                    "&:hover": { bgcolor: "#f0f0f0" },
                  }}
                >
                  {Object.values(row).map((val, j) => (
                    <TableCell
                      key={j}
                      sx={{
                        fontSize: 13,
                        borderColor: "#f2f2f2",
                        color: "#222",
                      }}
                    >
                      {formatValue(val)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {isSuccess && (!data || data.length === 0) && (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            <Typography color="textSecondary" fontSize={14}>
              No data to display.
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default QueryResultTable;
