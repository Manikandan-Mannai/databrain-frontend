import {
  BarChart,
  Dashboard as DashboardIcon,
  QueryStats,
  UploadFile,
} from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import type { RootState } from "../redux/store/store";

const drawerWidth = 240;

const navItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: <DashboardIcon />,
    roles: ["admin", "editor", "viewer"],
  },
  {
    name: "Data Sources",
    path: "/data",
    icon: <UploadFile />,
    roles: ["admin", "editor", "viewer"],
  },
  {
    name: "Query Builder",
    path: "/queries/new",
    icon: <QueryStats />,
    roles: ["admin", "editor"],
  },
  {
    name: "New Chart",
    path: "/charts/new",
    icon: <BarChart />,
    roles: ["admin", "editor"],
  },
];

export default function MainLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleDrawerToggle = () => setMobileOpen((prev) => !prev);

  const filteredItems = navItems.filter(
    (item) => user && item.roles.includes(user.role)
  );

  const drawer = (
    <Box>
      <Toolbar />
      <Typography
        variant="h6"
        sx={{ my: 2, textAlign: "center", fontWeight: "bold" }}
      >
        DataBrain
      </Typography>
      <List>
        {filteredItems.map((item) => (
          <ListItem key={item.name} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => {
                navigate(item.path);
                setMobileOpen(false);
              }}
              sx={{
                "&.Mui-selected": {
                  backgroundColor: "action.selected",
                  "&:hover": { backgroundColor: "action.selected" },
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: "background.paper",
          color: "text.primary",
          boxShadow: 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" fontWeight="bold">
            DataBrain Analytics Platform
          </Typography>
        </Toolbar>
      </AppBar>

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
              boxSizing: "border-box",
              width: drawerWidth,
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
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
