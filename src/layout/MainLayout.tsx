import {
  Brightness4,
  Brightness7,
  Dashboard as DashboardIcon,
  QueryStats,
  UploadFile
} from "@mui/icons-material";
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { toggleTheme } from "../redux/slices/themeSlice";
import type { RootState } from "../redux/store/store";

const drawerWidth = 70;

const navItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: <DashboardIcon fontSize="small" />,
    roles: ["admin", "editor", "viewer"],
  },
  {
    name: "Data Sources",
    path: "/data",
    icon: <UploadFile fontSize="small" />,
    roles: ["admin", "editor", "viewer"],
  },
  {
    name: "Query Builder",
    path: "/queries/new",
    icon: <QueryStats fontSize="small" />,
    roles: ["admin", "editor"],
  },
];

export default function MainLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);
  const { mode } = useSelector((state: RootState) => state.theme);
  const dispatch = useDispatch();

  const handleDrawerToggle = () => setMobileOpen((prev) => !prev);

  const filteredItems = navItems.filter(
    (item) => user && item.roles.includes(user.role)
  );

  const drawer = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        pt: 1,
        bgcolor: "background.paper",
      }}
    >
      <Toolbar sx={{ justifyContent: "center", minHeight: 56 }}>
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ fontSize: 14, letterSpacing: 0.5 }}
        >
          DB
        </Typography>
      </Toolbar>

      <List sx={{ flexGrow: 1 }}>
        {filteredItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem
              key={item.name}
              disablePadding
              sx={{ justifyContent: "center" }}
            >
              <Tooltip title={item.name} placement="right">
                <ListItemButton
                  onClick={() => {
                    navigate(item.path);
                    setMobileOpen(false);
                  }}
                  sx={{
                    justifyContent: "center",
                    m: 0.3,
                    height: 40,
                    bgcolor: isActive ? "action.selected" : "transparent",
                    color: isActive ? "text.primary" : "text.secondary",
                    "&:hover": {
                      bgcolor: isActive ? "action.selected" : "action.hover",
                    },
                    transition: "all 0.25s ease",
                    borderRadius: 0,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      justifyContent: "center",
                      color: "inherit",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                </ListItemButton>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
        <IconButton
          onClick={() => dispatch(toggleTheme())}
          sx={{
            width: 34,
            height: 34,
            color: "text.secondary",
            "&:hover": { color: "text.primary" },
          }}
        >
          {mode === "light" ? <Brightness4 /> : <Brightness7 />}
        </IconButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              borderRight: "1px solid",
              borderColor: "divider",
            },
          }}
        >
          {drawer}
        </Drawer>

        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              borderRight: "1px solid",
              borderColor: "divider",
              borderRadius: 0,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
}
