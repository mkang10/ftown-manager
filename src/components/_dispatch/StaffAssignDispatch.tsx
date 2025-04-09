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
} from "@mui/material";
import { GetStaffNamesResponse, StaffName } from "@/type/Staff";
import { assignDispatchStaffDetail, assignStaffDetail, getStaffNames } from "@/ultis/AssignAPI";

interface StaffAssignDialogProps {
  open: boolean;
  dispatchId: number; // Dùng cho hàm assignStaffDetail như cũ
  onClose: () => void;
  onAssigned: () => void;
}

const StaffAssignDispatch: React.FC<StaffAssignDialogProps> = ({ open, dispatchId, onClose, onAssigned }) => {
  const [staffOptions, setStaffOptions] = useState<StaffName[]>([]);
  const [selectedStaffId, setSelectedStaffId] = useState<number | "">("");

  useEffect(() => {
    if (open) {
      getStaffNames()
        .then((res: GetStaffNamesResponse) => {
          console.log("API response:", res);
          if (res.status) {
            setStaffOptions(res.data);
            console.log("Staff options set:", res.data);
          }
        })
        .catch((error) => {
          console.error("Error fetching staff names:", error);
        });
    }
  }, [open]);

  const handleConfirm = async () => {
    if (selectedStaffId === "") {
      alert("Vui lòng chọn nhân viên!");
      return;
    }
    try {
      // Gọi hàm assignStaffDetail theo logic cũ: truyền importId và staffDetailId
      const result = await assignDispatchStaffDetail(dispatchId, Number(selectedStaffId));
      if (result.status) {
        onAssigned();
      } else {
        console.error("Assign staff failed:", result.message);
      }
    } catch (error) {
      console.error("Error assigning staff:", error);
    } finally {
      onClose();
      setSelectedStaffId("");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Chọn nhân viên</DialogTitle>
      <DialogContent>
        <FormControl fullWidth>
          <InputLabel id="staff-select-label">Nhân viên</InputLabel>
          <Select
            labelId="staff-select-label"
            value={selectedStaffId}
            label="Nhân viên"
            onChange={(e) => setSelectedStaffId(Number(e.target.value))}
          >
            {staffOptions.length > 0 ? (
              staffOptions.map((staff, index) => (
                <MenuItem key={`${staff.id}-${index}`} value={staff.id}>
                  {staff.fullName}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled value="">
                Không có dữ liệu
              </MenuItem>
            )}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleConfirm} variant="contained" color="primary">
          Xác nhận
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StaffAssignDispatch;
