// import { Add, Delete } from "@mui/icons-material";
// import {
//   Box,
//   Button,
//   FormControl,
//   IconButton,
//   MenuItem,
//   Select,
//   Stack,
//   TextField,
//   Typography,
// } from "@mui/material";
// import React, { useEffect } from "react";
// import type { ChartConfig } from "../../redux/types";

// interface Props {
//   config: ChartConfig;
//   columns: string[];
//   yFieldOptions: string[];
//   onChange: (c: ChartConfig) => void;
//   addSeries: () => void;
//   removeSeries: (i: number) => void;
//   updateSeries: (i: number, field: any, val: any) => void;
//   handleTypeChange: (t: ChartConfig["type"]) => void;
//   onPreview: () => void;
//   onSave: () => void;
//   preview: boolean;
//   setPreview: (b: boolean) => void;
// }

// const ChartForm: React.FC<Props> = ({
//   config,
//   columns,
//   yFieldOptions,
//   onChange,
//   addSeries,
//   removeSeries,
//   updateSeries,
//   handleTypeChange,
//   onPreview,
//   onSave,
//   preview,
//   setPreview,
// }) => {
//   const handleYFieldChange = (i: number, val: string) => {
//     const current = config.series[i];
//     const oldYField = current.yField;
//     const oldName = current.name?.trim();

//     // Update both yField and name together if needed
//     if (!oldName || !oldYField || oldName === oldYField) {
//       const updatedSeries = [...config.series];
//       updatedSeries[i] = {
//         ...updatedSeries[i],
//         yField: val,
//         name: val,
//       };
//       onChange({ ...config, series: updatedSeries });
//     } else {
//       updateSeries(i, "yField", val);
//     }
//   };

//   useEffect(() => {
//     config.series.forEach((s, i) => {
//       if (s.yField && (!s.name || s.name.trim() === "")) {
//         updateSeries(i, "name", s.yField);
//       }
//     });
//   }, [config.series]);

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         flexDirection: "column",
//         gap: 2,
//         p: 2,
//         borderRadius: 2,
//         height: "100%",
//         boxSizing: "border-box",
//         overflowY: "auto",
//       }}
//     >
//       <Typography fontWeight={600} fontSize={16}>
//         Chart Settings
//       </Typography>

//       <TextField
//         placeholder="Chart title"
//         value={config.title}
//         onChange={(e) => onChange({ ...config, title: e.target.value })}
//         fullWidth
//         size="small"
//         sx={{ width: "100%" }}
//       />

//       <Stack direction="row" spacing={1} width="100%">
//         {["bar", "line", "pie"].map((type) => (
//           <Button
//             key={type}
//             fullWidth
//             variant={config.type === type ? "contained" : "outlined"}
//             onClick={() => handleTypeChange(type as any)}
//             sx={{
//               flex: 1,
//               textTransform: "none",
//               bgcolor: config.type === type ? "#000" : "#fff",
//               color: config.type === type ? "#fff" : "#000",
//               borderColor: "rgba(0,0,0,0.4)",
//               "&:hover": { bgcolor: config.type === type ? "#111" : "#f5f5f5" },
//               fontSize: 14,
//               py: 0.75,
//             }}
//           >
//             {type.charAt(0).toUpperCase() + type.slice(1)}
//           </Button>
//         ))}
//       </Stack>

//       {config.type === "pie" ? (
//         <>
//           <Typography fontSize={13} color="#666" sx={{ mt: -1 }}>
//             Configure pie chart categories and values
//           </Typography>

//           <FormControl fullWidth size="small" sx={{ width: "100%" }}>
//             <Select
//               value={config.xAxis || ""}
//               displayEmpty
//               onChange={(e) => onChange({ ...config, xAxis: e.target.value })}
//             >
//               <MenuItem value="">Category Field (Labels)</MenuItem>
//               {columns.map((c) => (
//                 <MenuItem key={c} value={c}>
//                   {c}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>

//           {config.pieSeries &&
//             config.pieSeries.map((s, i) => (
//               <Stack direction="row" spacing={1} key={i} alignItems="center">
//                 <FormControl fullWidth size="small" sx={{ width: "100%" }}>
//                   <Select
//                     value={s.valueField || ""}
//                     displayEmpty
//                     onChange={(e) => {
//                       const val = e.target.value;
//                       const currentName = s.name?.trim();

//                       if (!currentName || currentName === s.valueField) {
//                         const updatedSeries = [...config.pieSeries];
//                         updatedSeries[i] = {
//                           ...updatedSeries[i],
//                           valueField: val,
//                           name: val,
//                         };
//                         onChange({ ...config, pieSeries: updatedSeries });
//                       } else {
//                         updateSeries(i, "valueField", val);
//                       }
//                     }}
//                   >
//                     <MenuItem value="">Value Field</MenuItem>
//                     {yFieldOptions.map((c) => (
//                       <MenuItem key={c} value={c}>
//                         {c}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>

//                 <TextField
//                   placeholder="Slice Name"
//                   value={s.name || ""}
//                   onChange={(e) => updateSeries(i, "name", e.target.value)}
//                   size="small"
//                   sx={{ width: "100%" }}
//                 />

//                 {config.pieSeries.length > 1 && (
//                   <IconButton onClick={() => removeSeries(i)} size="small">
//                     <Delete fontSize="small" />
//                   </IconButton>
//                 )}
//               </Stack>
//             ))}

//           <Button
//             variant="outlined"
//             onClick={addSeries}
//             startIcon={<Add />}
//             sx={{
//               textTransform: "none",
//               borderColor: "rgba(0,0,0,0.4)",
//               color: "#000",
//               alignSelf: "start",
//               fontSize: 14,
//             }}
//           >
//             Add Slice
//           </Button>
//         </>
//       ) : (
//         <>
//           <FormControl fullWidth size="small" sx={{ width: "100%" }}>
//             <Select
//               value={config.xAxis || ""}
//               displayEmpty
//               onChange={(e) => onChange({ ...config, xAxis: e.target.value })}
//             >
//               <MenuItem value="">X-axis</MenuItem>
//               {columns.map((c) => (
//                 <MenuItem key={c} value={c}>
//                   {c}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>

//           {config.series.map((s, i) => (
//             <Stack direction="row" spacing={1} key={i} alignItems="center">
//               <FormControl fullWidth size="small" sx={{ width: "100%" }}>
//                 <Select
//                   value={s.yField || ""}
//                   displayEmpty
//                   onChange={(e) => handleYFieldChange(i, e.target.value)}
//                 >
//                   <MenuItem value="">Y Field</MenuItem>
//                   {yFieldOptions.map((c) => (
//                     <MenuItem key={c} value={c}>
//                       {c}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>

//               <TextField
//                 placeholder="Series Name"
//                 value={s.name || ""}
//                 onChange={(e) => updateSeries(i, "name", e.target.value)}
//                 size="small"
//                 sx={{ width: "100%" }}
//               />

//               {config.series.length > 1 && (
//                 <IconButton onClick={() => removeSeries(i)} size="small">
//                   <Delete fontSize="small" />
//                 </IconButton>
//               )}
//             </Stack>
//           ))}

//           <Button
//             variant="outlined"
//             onClick={addSeries}
//             startIcon={<Add />}
//             sx={{
//               textTransform: "none",
//               borderColor: "rgba(0,0,0,0.4)",
//               color: "#000",
//               alignSelf: "start",
//               fontSize: 14,
//             }}
//           >
//             Add Series
//           </Button>
//         </>
//       )}

//       <Stack direction="row" spacing={1} mt="auto">
//         <Button
//           variant="contained"
//           onClick={preview ? onSave : onPreview}
//           sx={{
//             bgcolor: "#000",
//             color: "#fff",
//             textTransform: "none",
//             fontSize: 14,
//             "&:hover": { bgcolor: "#111" },
//           }}
//         >
//           {preview ? "Save" : "Preview"}
//         </Button>
//         {preview && (
//           <Button
//             variant="outlined"
//             onClick={() => setPreview(false)}
//             sx={{
//               textTransform: "none",
//               borderColor: "rgba(0,0,0,0.4)",
//               color: "#000",
//               fontSize: 14,
//             }}
//           >
//             Edit
//           </Button>
//         )}
//       </Stack>
//     </Box>
//   );
// };

// export default ChartForm;

import { Add, Delete } from "@mui/icons-material";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import type { ChartConfig } from "../../redux/types";

interface Props {
  config: ChartConfig;
  columns: string[];
  yFieldOptions: string[];
  onChange: (c: ChartConfig) => void;
  addSeries: () => void;
  removeSeries: (i: number) => void;
  updateSeries: (i: number, field: any, val: any) => void;
  handleTypeChange: (t: ChartConfig["type"]) => void;
  onPreview: () => void;
  onSave: () => void;
  preview: boolean;
  setPreview: (b: boolean) => void;
}

const ChartForm: React.FC<Props> = ({
  config,
  columns,
  yFieldOptions,
  onChange,
  addSeries,
  removeSeries,
  updateSeries,
  handleTypeChange,
  onPreview,
  onSave,
  preview,
  setPreview,
}) => {
  const handleYFieldChange = (i: number, val: string) => {
    const current = config.series[i];
    const oldYField = current.yField;
    const oldName = current.name?.trim();

    if (!oldName || !oldYField || oldName === oldYField) {
      const updatedSeries = [...config.series];
      updatedSeries[i] = {
        ...updatedSeries[i],
        yField: val,
        name: val,
      };
      onChange({ ...config, series: updatedSeries });
    } else {
      updateSeries(i, "yField", val);
    }
  };

  useEffect(() => {
    config.series.forEach((s, i) => {
      if (s.yField && (!s.name || s.name.trim() === "")) {
        updateSeries(i, "name", s.yField);
      }
    });
  }, [config.series]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        p: 2,
        borderRadius: 2,
        height: "100%",
        boxSizing: "border-box",
        overflowY: "auto",
      }}
    >
      <Typography fontWeight={600} fontSize={16}>
        Chart Settings
      </Typography>

      <TextField
        placeholder="Chart title"
        value={config.title}
        onChange={(e) => onChange({ ...config, title: e.target.value })}
        fullWidth
        size="small"
        sx={{ width: "100%" }}
      />

      <Stack direction="row" spacing={1} width="100%">
        {["bar", "line", "pie"].map((type) => (
          <Button
            key={type}
            fullWidth
            variant={config.type === type ? "contained" : "outlined"}
            onClick={() => handleTypeChange(type as any)}
            sx={{
              flex: 1,
              textTransform: "none",
              bgcolor: config.type === type ? "#000" : "#fff",
              color: config.type === type ? "#fff" : "#000",
              borderColor: "rgba(0,0,0,0.4)",
              "&:hover": { bgcolor: config.type === type ? "#111" : "#f5f5f5" },
              fontSize: 14,
              py: 0.75,
            }}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Button>
        ))}
      </Stack>

      {config.type === "pie" ? (
        <>
          <Typography fontSize={12} color="#666" sx={{ mt: -1 }}>
            Select columns for pie chart labels and values
          </Typography>

          <FormControl fullWidth size="small">
            <Select
              value={config.pieLabel || ""}
              displayEmpty
              onChange={(e) =>
                onChange({ ...config, pieLabel: e.target.value })
              }
            >
              <MenuItem value="">
                <em>Label Column (e.g., Product, Category, Name)</em>
              </MenuItem>
              {columns.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <Select
              value={config.pieValue || ""}
              displayEmpty
              onChange={(e) =>
                onChange({ ...config, pieValue: e.target.value })
              }
            >
              <MenuItem value="">
                <em>Value Column (e.g., Sales, Amount, Count)</em>
              </MenuItem>
              {yFieldOptions.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {config.pieLabel && config.pieValue && (
            <Box
              sx={{
                p: 1.5,
                bgcolor: "#f5f5f5",
                borderRadius: 1,
                fontSize: 12,
                color: "#555",
              }}
            >
              <strong>Preview:</strong> Chart will show{" "}
              <strong>{config.pieLabel}</strong> as labels with{" "}
              <strong>{config.pieValue}</strong> as slice sizes
            </Box>
          )}
        </>
      ) : (
        <>
          <FormControl fullWidth size="small" sx={{ width: "100%" }}>
            <Select
              value={config.xAxis || ""}
              displayEmpty
              onChange={(e) => onChange({ ...config, xAxis: e.target.value })}
            >
              <MenuItem value="">X-axis</MenuItem>
              {columns.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {config.series.map((s, i) => (
            <Stack direction="row" spacing={1} key={i} alignItems="center">
              <FormControl fullWidth size="small" sx={{ width: "100%" }}>
                <Select
                  value={s.yField || ""}
                  displayEmpty
                  onChange={(e) => handleYFieldChange(i, e.target.value)}
                >
                  <MenuItem value="">Y Field</MenuItem>
                  {yFieldOptions.map((c) => (
                    <MenuItem key={c} value={c}>
                      {c}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                placeholder="Series Name"
                value={s.name || ""}
                onChange={(e) => updateSeries(i, "name", e.target.value)}
                size="small"
                sx={{ width: "100%" }}
              />

              {config.series.length > 1 && (
                <IconButton onClick={() => removeSeries(i)} size="small">
                  <Delete fontSize="small" />
                </IconButton>
              )}
            </Stack>
          ))}

          <Button
            variant="outlined"
            onClick={addSeries}
            startIcon={<Add />}
            sx={{
              textTransform: "none",
              borderColor: "rgba(0,0,0,0.4)",
              color: "#000",
              alignSelf: "start",
              fontSize: 14,
            }}
          >
            Add Series
          </Button>
        </>
      )}

      <Stack direction="row" spacing={1} mt="auto">
        <Button
          variant="contained"
          onClick={preview ? onSave : onPreview}
          sx={{
            bgcolor: "#000",
            color: "#fff",
            textTransform: "none",
            fontSize: 14,
            "&:hover": { bgcolor: "#111" },
          }}
        >
          {preview ? "Save" : "Preview"}
        </Button>
        {preview && (
          <Button
            variant="outlined"
            onClick={() => setPreview(false)}
            sx={{
              textTransform: "none",
              borderColor: "rgba(0,0,0,0.4)",
              color: "#000",
              fontSize: 14,
            }}
          >
            Edit
          </Button>
        )}
      </Stack>
    </Box>
  );
};

export default ChartForm;
