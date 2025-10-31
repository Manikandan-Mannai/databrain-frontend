import { Box, CircularProgress } from "@mui/material";
import { useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import LoginForm from "../components/auth/LoginForm";
import MainLayout from "../layout/MainLayout";
import Dashboard from "../pages/dashboard/Dashboard";
import DataSourcePage from "../pages/DataSource/DataSourcePage";
// import QueryBuilderPage from "../pages/query/QueryBuilderPage";
// import ChartBuilderPage from "../pages/chart/ChartBuilderPage";
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
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/login"
        element={
          authenticated ? <Navigate to="/dashboard" replace /> : <LoginForm />
        }
      />

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
          path="/data"
          element={
            <PrivateRoute allowedRoles={["admin", "editor", "viewer"]}>
              <DataSourcePage />
            </PrivateRoute>
          }
        />
        {/* <Route
          path="/queries/new"
          element={
            <PrivateRoute allowedRoles={["admin", "editor"]}>
              <QueryBuilderPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/charts/new"
          element={
            <PrivateRoute allowedRoles={["admin", "editor"]}>
              <ChartBuilderPage />
            </PrivateRoute>
          }
        /> */}
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
