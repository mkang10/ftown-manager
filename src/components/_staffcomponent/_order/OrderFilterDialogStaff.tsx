"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Box
} from "@mui/material";
import { OrderFilterData } from "@/type/order";

interface OrderFilterDialogProps {
  open: boolean;
  initialFilters: OrderFilterData;
  onClose: () => void;
  onSubmit: (filters: OrderFilterData) => void;
}

const OrderFilterDialogStaff: React.FC<OrderFilterDialogProps> = ({
  open,
  initialFilters,
  onClose,
  onSubmit,
}) => {
  const [filters, setFilters] = useState<OrderFilterData>(initialFilters);

  const handleChange = (field: keyof OrderFilterData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFilters((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = () => {
    onSubmit(filters);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Lọc đơn hàng</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <TextField
            label="Trạng thái đơn hàng"
            value={filters.orderStatus}
            onChange={handleChange("orderStatus")}
          />
          <TextField
            label="Ngày bắt đầu đơn hàng"
            type="datetime-local"
            InputLabelProps={{ shrink: true }}
            value={filters.orderStartDate}
            onChange={handleChange("orderStartDate")}
          />
          <TextField
            label="Ngày kết thúc đơn hàng"
            type="datetime-local"
            InputLabelProps={{ shrink: true }}
            value={filters.orderEndDate}
            onChange={handleChange("orderEndDate")}
          />
       
          <TextField
            label="Ngày bắt đầu gán nhân viên"
            type="datetime-local"
            InputLabelProps={{ shrink: true }}
            value={filters.assignmentStartDate}
            onChange={handleChange("assignmentStartDate")}
          />

          <TextField
            label="Ngày kết thúc gán nhân viên"
            type="datetime-local"
            InputLabelProps={{ shrink: true }}
            value={filters.assignmentEndDate}
            onChange={handleChange("assignmentEndDate")}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Hủy
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          Áp dụng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderFilterDialogStaff;
