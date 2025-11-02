// src/pages/ProfilePage.tsx
import { Delete } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteUser,
  fetchAllUsers,
  updateUserRole,
} from "../../redux/slices/authSlice";
import type { AppDispatch, RootState } from "../../redux/store/store";

const ProfilePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentUser, allUsers, authenticated, status } = useSelector(
    (state: RootState) => state.auth
  );
  const isAdmin = currentUser?.role === "admin";

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmData, setConfirmData] = useState<{
    type: "delete" | "edit";
    userId: string;
    newRole?: string;
  } | null>(null);

  useEffect(() => {
    if (authenticated && isAdmin) dispatch(fetchAllUsers());
  }, [authenticated, isAdmin, dispatch]);

  const openConfirm = (
    type: "delete" | "edit",
    userId: string,
    newRole?: string
  ) => {
    setConfirmData({ type, userId, newRole });
    setConfirmOpen(true);
  };

  const handleConfirm = () => {
    if (confirmData?.type === "delete")
      dispatch(deleteUser(confirmData.userId));
    if (confirmData?.type === "edit" && confirmData.newRole)
      dispatch(
        updateUserRole({
          userId: confirmData.userId,
          role: confirmData.newRole as any,
        })
      );
    setConfirmOpen(false);
  };

  if (!authenticated) {
    return (
      <Box display="flex" justifyContent="center" mt={8}>
        <Alert severity="warning">Please log in to view your profile.</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", color: "#000" }}>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h5" fontWeight={700} mb={3}>
          Your Profile
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 3,
            borderTop: "1px solid #000",
            borderBottom: "1px solid #000",
            py: 2,
          }}
        >
          <Box>
            <Typography fontWeight="medium" color="#555">
              Name
            </Typography>
            <Typography variant="body1">{currentUser?.name}</Typography>
          </Box>
          <Box>
            <Typography fontWeight="medium" color="#555">
              Email
            </Typography>
            <Typography variant="body1">{currentUser?.email}</Typography>
          </Box>
          <Box>
            <Typography fontWeight="medium" color="#555">
              Role
            </Typography>
            <Chip
              label={currentUser?.role}
              size="small"
              sx={{
                mt: 0.5,
                background: "#000",
                color: "#fff",
                borderRadius: "4px",
                height: 22,
              }}
            />
          </Box>
        </Box>
      </Box>

      {isAdmin && (
        <Box>
          <Typography variant="h5" fontWeight={700} mb={3}>
            All Users
          </Typography>

          {status === "loading" ? (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress size={20} />
            </Box>
          ) : (
            <Box sx={{ overflowX: "auto", borderTop: "1px solid #000" }}>
              <Table>
                <TableHead>
                  <TableRow
                    sx={{
                      background: "#f7f7f7",
                      borderBottom: "1px solid #000",
                    }}
                  >
                    <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600 }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {allUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        <Typography color="#555">No users found.</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    allUsers.map((user) => (
                      <TableRow
                        key={user._id}
                        sx={{
                          borderBottom: "1px solid #ddd",
                          "&:hover": { background: "#fafafa" },
                        }}
                      >
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Select
                            value={user.role}
                            size="small"
                            onChange={(e) =>
                              openConfirm(
                                "edit",
                                user._id,
                                e.target.value as any
                              )
                            }
                            sx={{
                              minWidth: 90,
                              height: 28,
                              fontSize: 14,
                              border: "1px solid #000",
                              background: "transparent",
                              "& .MuiSelect-icon": { color: "#000" },
                            }}
                          >
                            <MenuItem value="viewer">viewer</MenuItem>
                            <MenuItem value="editor">editor</MenuItem>
                            <MenuItem value="admin">admin</MenuItem>
                          </Select>
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            onClick={() => openConfirm("delete", user._id)}
                            disabled={user._id === currentUser?._id}
                            sx={{
                              color: "#000",
                              border: "1px solid #000",
                              borderRadius: "4px",
                              p: "3px",
                              "&:hover": { background: "#000", color: "#fff" },
                            }}
                          >
                            <Delete sx={{ fontSize: 18 }} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Box>
          )}
        </Box>
      )}

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle
          sx={{
            fontWeight: 600,
            borderBottom: "1px solid #000",
            background: "#fff",
          }}
        >
          Confirm {confirmData?.type === "delete" ? "Deletion" : "Role Change"}
        </DialogTitle>
        <DialogContent sx={{ background: "#fff" }}>
          <Typography>
            {confirmData?.type === "delete"
              ? "Are you sure you want to delete this user?"
              : `Are you sure you want to change this user's role to "${confirmData?.newRole}"?`}
          </Typography>
        </DialogContent>
        <DialogActions
          sx={{
            borderTop: "1px solid #000",
            background: "#fff",
            justifyContent: "flex-end",
          }}
        >
          <Button
            onClick={() => setConfirmOpen(false)}
            sx={{
              color: "#000",
              border: "1px solid #000",
              textTransform: "none",
              fontSize: 13,
              px: 2,
              py: 0.5,
              borderRadius: 1,
              "&:hover": { background: "#000", color: "#fff" },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            sx={{
              color: "#fff",
              background: "#000",
              textTransform: "none",
              fontSize: 13,
              px: 2,
              py: 0.5,
              borderRadius: 1,
              "&:hover": { background: "#222" },
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProfilePage;
