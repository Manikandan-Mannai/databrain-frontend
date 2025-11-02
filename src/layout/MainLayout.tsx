import { Dashboard as DashboardIcon, UploadFile } from "@mui/icons-material";
import ConstructionIcon from "@mui/icons-material/Construction";
import LogoutIcon from "@mui/icons-material/Logout";
import Person from "@mui/icons-material/Person";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
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
    icon: <ConstructionIcon fontSize="small" />,
    roles: ["admin", "editor"],
  },
  {
    name: "Profile",
    path: "/profile",
    icon: <Person fontSize="small" />,
    roles: ["admin", "editor", "viewer"],
  },
];

export default function MainLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useSelector((state: RootState) => state.auth);

  const handleDrawerToggle = () => setMobileOpen((prev) => !prev);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    localStorage.removeItem("token_expiry");
    navigate("/login");
  };

  const filteredItems = navItems.filter(
    (item) => currentUser && item.roles.includes(currentUser.role)
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

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mb: 2,
          gap: 1,
        }}
      >
        <Tooltip title="Logout" placement="right">
          <Box
            onClick={handleLogout}
            sx={{
              width: 42,
              height: 42,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "error.light",
              borderRadius: "50%",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: (theme) =>
                theme.palette.mode === "light"
                  ? "0 2px 4px rgba(0,0,0,0.1)"
                  : "0 2px 6px rgba(255,255,255,0.1)",
              "&:hover": {
                bgcolor: "error.main",
                transform: "scale(1.05)",
              },
            }}
          >
            <LogoutIcon
              sx={{
                fontSize: 20,
                color: "common.white",
              }}
            />
          </Box>
        </Tooltip>
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
