import React from "react";
import {
  Box,
  Typography,
  IconButton,
  Button,
  TextField,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  MenuItem,
  Select,
  Checkbox,
  ListItemText,
} from "@mui/material";
import { Delete } from "@mui/icons-material";

interface Props {
  group: Array<any & { id: string }>;
  remove: (id: string) => void;
  onAddDashboard: () => void;
  dashboardName: string;
  setDashboardName: (n: string) => void;
  accessLevel: "public" | "private" | "shared" | "";
  setAccessLevel: (v: "public" | "private" | "shared" | "") => void;
  sharedWith: string[];
  setSharedWith: (v: string[]) => void;
  allUsers: { _id: string; name: string; email: string }[];
}

const ChartList: React.FC<Props> = ({
  group,
  remove,
  onAddDashboard,
  dashboardName,
  setDashboardName,
  accessLevel,
  setAccessLevel,
  sharedWith,
  setSharedWith,
  allUsers,
}) => {
  const isDisabled =
    group.length === 0 || dashboardName.trim() === "" || accessLevel === "";

  return (
    <Box sx={{ mt: 3, p: 2 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
        flexWrap="wrap"
        gap={2}
      >
        <Typography variant="h6" fontWeight={600}>
          My Charts ({group.length})
        </Typography>

        {group.length > 0 && (
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
            flexWrap="wrap"
          >
            <TextField
              size="small"
              placeholder="Dashboard name"
              value={dashboardName}
              onChange={(e) => setDashboardName(e.target.value)}
              sx={{
                width: 200,
                "& .MuiOutlinedInput-root": { borderRadius: 2 },
              }}
            />
            <Select
              size="small"
              value={accessLevel}
              onChange={(e) =>
                setAccessLevel(
                  e.target.value as "public" | "private" | "shared"
                )
              }
              displayEmpty
              sx={{ width: 150, borderRadius: 2 }}
            >
              <MenuItem value="">Access</MenuItem>
              <MenuItem value="private">Private</MenuItem>
              <MenuItem value="shared">Shared</MenuItem>
              <MenuItem value="public">Public</MenuItem>
            </Select>

            {accessLevel === "shared" && (
              <Select
                multiple
                size="small"
                value={sharedWith}
                onChange={(e) => setSharedWith(e.target.value as string[])}
                renderValue={(selected) =>
                  selected
                    .map((id) => {
                      const user = allUsers.find((u) => u._id === id);
                      return user ? user.name : id;
                    })
                    .join(", ")
                }
                sx={{ minWidth: 200, borderRadius: 2 }}
              >
                {allUsers.map((user) => (
                  <MenuItem key={user._id} value={user._id}>
                    <Checkbox checked={sharedWith.includes(user._id)} />
                    <ListItemText primary={`${user.name} (${user.email})`} />
                  </MenuItem>
                ))}
              </Select>
            )}

            <Button
              variant="contained"
              disabled={isDisabled}
              onClick={onAddDashboard}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                borderRadius: 2,
                px: 2.5,
                bgcolor: "#000",
              }}
            >
              Save Dashboard
            </Button>
          </Stack>
        )}
      </Stack>

      {group.length > 0 ? (
        <TableContainer
          component={Paper}
          sx={{ borderRadius: 3, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}
        >
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, width: "90%", fontSize: 14 }}>
                  Chart Name
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ fontWeight: 600, fontSize: 14 }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {group.map((chart) => (
                <TableRow
                  key={chart.id}
                  hover
                  sx={{ "&:hover": { backgroundColor: "rgba(0,0,0,0.02)" } }}
                >
                  <TableCell sx={{ fontSize: 14 }}>
                    {chart.title || "Untitled Chart"}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={() => remove(chart.id)}
                      sx={{ color: "text.secondary" }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Box
          sx={{
            textAlign: "center",
            py: 4,
            border: "1px dashed",
            borderColor: "divider",
            borderRadius: 3,
            color: "text.secondary",
          }}
        >
          No charts created yet — configure and preview to add charts
        </Box>
      )}
    </Box>
  );
};

export default ChartList;
