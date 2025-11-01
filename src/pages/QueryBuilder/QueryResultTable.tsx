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
  status: string;
  error: string | null;
  data: any[] | null;
}

const QueryResultTable: React.FC<QueryResultTableProps> = ({
  status,
  error,
  data,
}) => {
  return (
    <Card sx={{ bgcolor: "#fafafa", color: "#000", border: "1px solid #ddd" }}>
      <CardHeader
        title="Query Result"
        titleTypographyProps={{ fontWeight: "bold", fontSize: 16 }}
      />
      <CardContent>
        {status === "loading" && (
          <Box display="flex" justifyContent="center" p={2}>
            <CircularProgress size={24} />
          </Box>
        )}
        {error && <Alert severity="error">{error}</Alert>}
        {data && data.length > 0 ? (
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: "#eee" }}>
                {Object.keys(data[0]).map((key) => (
                  <TableCell
                    key={key}
                    sx={{ fontWeight: "bold", color: "#000", borderColor: "#ddd" }}
                  >
                    {key}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, i) => (
                <TableRow key={i} hover>
                  {Object.values(row).map((val, j) => (
                    <TableCell key={j} sx={{ borderColor: "#eee" }}>
                      {String(val)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          status !== "loading" && (
            <Typography color="textSecondary">No data to display.</Typography>
          )
        )}
      </CardContent>
    </Card>
  );
};

export default QueryResultTable;
