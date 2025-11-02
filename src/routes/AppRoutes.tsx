import { Box, CircularProgress } from "@mui/material";
import { useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ChartBuilderPage from "../pages/ChartBuilder/ChartBuilderPage";
import Dashboard from "../pages/dashboard/Dashboard";
import DataSourcePage from "../pages/DataSource/DataSourcePage";
import ProfilePage from "../pages/Profile/ProfilePage";
import QueryBuilderPage from "../pages/QueryBuilder/QueryBuilder";
import Unauthorized from "../pages/Unauthorized";
import type { RootState } from "../redux/store/store";
import PrivateRoute from "./PrivateRoute";

const AppRoutes = () => {
  const { authenticated, status } = useSelector(
    (state: RootState) => state.auth
  );

  if (status === "loading") {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          authenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/auth/login" replace />
          )
        }
      />

      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/register" element={<Register />} />

      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route element={<MainLayout />}>
        <Route
          path="/dashboard"
          element={
            <PrivateRoute allowedRoles={["admin", "editor", "viewer"]}>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute allowedRoles={["admin", "editor", "viewer"]}>
              <ProfilePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/data"
          element={
            <PrivateRoute allowedRoles={["admin", "editor", "viewer"]}>
              <DataSourcePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/queries/new"
          element={
            <PrivateRoute allowedRoles={["admin", "editor"]}>
              <QueryBuilderPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/charts/create"
          element={
            <PrivateRoute allowedRoles={["admin", "editor"]}>
              <ChartBuilderPage />
            </PrivateRoute>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/auth/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
