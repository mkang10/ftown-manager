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
import { assignStaffDetail, getStaffNames } from "@/ultis/AssignAPI";

interface StaffAssignDialogProps {
  open: boolean;
  importId: number;
  onClose: () => void;
  onAssigned: () => void;
}

const StaffAssignDialog: React.FC<StaffAssignDialogProps> = ({ open, importId, onClose, onAssigned }) => {
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
      const result = await assignStaffDetail(importId, Number(selectedStaffId));
      if (result.status) {
        onAssigned();
      } else {
      }
    } catch (error) {
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

export default StaffAssignDialog;
