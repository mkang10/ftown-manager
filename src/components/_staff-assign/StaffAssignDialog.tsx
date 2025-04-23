"use client";
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
  Typography,
  Box,
} from "@mui/material";
import { GetStaffNamesResponse, StaffName } from "@/type/Staff";
import { assignStaffDetail, getStaffNames } from "@/ultis/AssignAPI";

interface StaffAssignDialogProps {
  open: boolean;
  importId: number;
  onClose: () => void;
  onAssigned: () => void;
}

const StaffAssignDialog: React.FC<StaffAssignDialogProps> = ({
  open,
  importId,
  onClose,
  onAssigned,
}) => {
  const [staffOptions, setStaffOptions] = useState<StaffName[]>([]);
  const [selectedStaffId, setSelectedStaffId] = useState<number | "">("");

  useEffect(() => {
    if (open) {
      getStaffNames()
        .then((res: GetStaffNamesResponse) => {
          if (res.status) {
            setStaffOptions(res.data);
          }
        })
        .catch((error) => {
          console.error("Lỗi khi lấy danh sách nhân viên:", error);
        });
    }
  }, [open]);

  const handleConfirm = async () => {
    if (selectedStaffId === "") {
      alert("Vui lòng chọn nhân viên để phân công!");
      return;
    }
    try {
      const result = await assignStaffDetail(importId, Number(selectedStaffId));
      if (result.status) {
        onAssigned();
      } else {
        alert("Phân công thất bại. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Lỗi khi phân công:", error);
    } finally {
      onClose();
      setSelectedStaffId("");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          backgroundColor: "#fff",
          border: "2px solid #000",
          borderRadius: "12px",
          p: 2,
        },
      }}
    >
      <DialogTitle>
        <Typography variant="h6" fontWeight="bold" color="black">
          Phân công nhân viên
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box mt={1}>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="staff-select-label">Chọn nhân viên</InputLabel>
            <Select
              labelId="staff-select-label"
              value={selectedStaffId}
              label="Chọn nhân viên"
              onChange={(e) => setSelectedStaffId(Number(e.target.value))}
              sx={{
                backgroundColor: "#fafafa",
                borderRadius: "8px",
              }}
            >
              {staffOptions.length > 0 ? (
                staffOptions.map((staff, index) => (
                  <MenuItem key={`${staff.id}-${index}`} value={staff.id}>
                    {staff.fullName}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled value="">
                  Không có dữ liệu nhân viên
                </MenuItem>
              )}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "space-between", px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderColor: "#000",
            color: "#000",
            fontWeight: "bold",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#f2f2f2",
              borderColor: "#000",
            },
          }}
        >
          Hủy
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          sx={{
            backgroundColor: "#000",
            color: "#fff",
            fontWeight: "bold",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#222",
            },
          }}
        >
          Xác nhận
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StaffAssignDialog;
