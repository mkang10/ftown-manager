import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Divider,
  Slide,
  Snackbar,
  Alert,
} from "@mui/material";
import { GetStaffNamesResponse, StaffName } from "@/type/Staff";
import { getStaffNames } from "@/ultis/AssignAPI";
import { assignOrderToStaff } from "@/ultis/OrderAPI";

interface OrderAssignDialogProps {
  open: boolean;
  orderId: number;
  onClose: () => void;
  onAssigned: () => void;
}

const OrderAssignDialog: React.FC<OrderAssignDialogProps> = ({ open, orderId, onClose, onAssigned }) => {
  const [staffOptions, setStaffOptions] = useState<StaffName[]>([]);
  const [selectedStaffId, setSelectedStaffId] = useState<number | "">("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    if (open) {
      getStaffNames()
        .then((res: GetStaffNamesResponse) => {
          if (res.status) setStaffOptions(res.data);
        })
        .catch(console.error);
    }
  }, [open]);

  const handleConfirm = async () => {
    if (!selectedStaffId) {
      alert("Vui lòng chọn nhân viên!");
      return;
    }
    const result = await assignOrderToStaff(orderId, selectedStaffId as number);
    if (result.status) {
      onAssigned();
      setSnackbarOpen(true);
    }
    onClose();
    setSelectedStaffId("");
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" TransitionComponent={Slide} transitionDuration={300}>
        <DialogTitle
          sx={{
            fontWeight: 700,
            fontSize: "20px",
            bgcolor: "#f5f5f5",
            px: 3,
            py: 2,
            borderBottom: "1px solid #e0e0e0",
            textAlign: "center",
          }}
        >
          Phân công đơn hàng #{orderId}
        </DialogTitle>

        <DialogContent sx={{ px: 3, py: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Chọn nhân viên xử lý đơn hàng
          </Typography>

          <FormControl fullWidth variant="outlined" size="medium" sx={{ mt: 2 }}>
            <InputLabel id="staff-select-label">Nhân viên</InputLabel>
            <Select
              labelId="staff-select-label"
              value={selectedStaffId}
              label="Nhân viên"
              onChange={(e) => setSelectedStaffId(Number(e.target.value))}
              MenuProps={{
                PaperProps: {
                  sx: {
                    "& .MuiMenuItem-root:hover": {
                      backgroundColor: "#f0f0f0",
                    },
                  },
                },
              }}
            >
              {staffOptions.map((staff) => (
                <MenuItem key={staff.id} value={staff.id}>
                  {staff.fullName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>

        <Divider />

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={onClose}
            color="inherit"
            sx={{
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "#f2f2f2",
              },
            }}
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleConfirm}
            disabled={!selectedStaffId}
            sx={{
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "#1d6ed8",
              },
            }}
          >
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for Success */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: "100%" }}>
          Đơn hàng đã được phân công thành công!
        </Alert>
      </Snackbar>
    </>
  );
};

export default OrderAssignDialog;
