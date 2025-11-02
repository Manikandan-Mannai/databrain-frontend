// import React from "react";
// import {
//   Box,
//   Typography,
//   IconButton,
//   Button,
//   TextField,
//   Stack,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
// } from "@mui/material";
// import { Delete } from "@mui/icons-material";

// interface Props {
//   group: any[];
//   remove: (id: string) => void;
//   onAddDashboard: () => void;
//   dashboardName: string;
//   setDashboardName: (n: string) => void;
// }

// const ChartList: React.FC<Props> = ({
//   group,
//   remove,
//   onAddDashboard,
//   dashboardName,
//   setDashboardName,
// }) => {
//   const isDisabled = group.length === 0 || dashboardName.trim() === "";

//   return (
//     <Box sx={{ mt: 3, p: 2 }}>
//       <Stack
//         direction="row"
//         justifyContent="space-between"
//         alignItems="center"
//         mb={2}
//         flexWrap="wrap"
//         gap={2}
//       >
//         <Typography variant="h6" fontWeight={600}>
//           My Charts ({group.length})
//         </Typography>

//         {group.length > 0 && (
//           <Stack direction="row" spacing={1.5} alignItems="center">
//             <TextField
//               size="small"
//               placeholder="Dashboard name"
//               value={dashboardName}
//               onChange={(e) => setDashboardName(e.target.value)}
//               sx={{
//                 width: 220,
//                 "& .MuiOutlinedInput-root": {
//                   borderRadius: 2,
//                 },
//               }}
//             />
//             <Button
//               variant="contained"
//               disabled={isDisabled}
//               onClick={onAddDashboard}
//               sx={{
//                 textTransform: "none",
//                 fontWeight: 600,
//                 borderRadius: 2,
//                 px: 2.5,
//                 bgcolor: "#000",
//               }}
//             >
//               Add to Dashboard
//             </Button>
//           </Stack>
//         )}
//       </Stack>

//       {group.length > 0 ? (
//         <TableContainer
//           component={Paper}
//           sx={{
//             borderRadius: 3,
//             boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
//           }}
//         >
//           <Table size="small">
//             <TableHead>
//               <TableRow>
//                 <TableCell sx={{ fontWeight: 600, width: "90%", fontSize: 14 }}>
//                   Chart Name
//                 </TableCell>
//                 <TableCell
//                   align="center"
//                   sx={{ fontWeight: 600, fontSize: 14 }}
//                 >
//                   Actions
//                 </TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {group.map((chart) => (
//                 <TableRow
//                   key={chart.id}
//                   hover
//                   sx={{
//                     "&:hover": {
//                       backgroundColor: "rgba(0,0,0,0.02)",
//                     },
//                   }}
//                 >
//                   <TableCell sx={{ fontSize: 14 }}>
//                     {chart.title || "Untitled Chart"}
//                   </TableCell>
//                   <TableCell align="center">
//                     <IconButton
//                       size="small"
//                       onClick={() => remove(chart.id)}
//                       sx={{ color: "text.secondary" }}
//                     >
//                       <Delete fontSize="small" />
//                     </IconButton>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       ) : (
//         <Box
//           sx={{
//             textAlign: "center",
//             py: 4,
//             border: "1px dashed",
//             borderColor: "divider",
//             borderRadius: 3,
//             color: "text.secondary",
//           }}
//         >
//           No charts created yet — configure and preview to add charts
//         </Box>
//       )}
//     </Box>
//   );
// };

// export default ChartList;

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
} from "@mui/material";
import { Delete } from "@mui/icons-material";

interface Props {
  group: Array<any & { id: string }>;
  remove: (id: string) => void;
  onAddDashboard: () => void;
  dashboardName: string;
  setDashboardName: (n: string) => void;
}

const ChartList: React.FC<Props> = ({
  group,
  remove,
  onAddDashboard,
  dashboardName,
  setDashboardName,
}) => {
  const isDisabled = group.length === 0 || dashboardName.trim() === "";

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
          <Stack direction="row" spacing={1.5} alignItems="center">
            <TextField
              size="small"
              placeholder="Dashboard name"
              value={dashboardName}
              onChange={(e) => setDashboardName(e.target.value)}
              sx={{
                width: 220,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />
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
              Add to Dashboard
            </Button>
          </Stack>
        )}
      </Stack>

      {group.length > 0 ? (
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 3,
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          }}
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
                  sx={{
                    "&:hover": {
                      backgroundColor: "rgba(0,0,0,0.02)",
                    },
                  }}
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