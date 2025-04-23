"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  MenuItem,
} from "@mui/material";

export interface FilterData {
  DispatchDetailId?: string;
  WarehouseId?: string;
  StaffDetailId?: string;
  HandleBy?: string;
  Status?: string;
  Comments?: string;
  SortBy?: string;
  IsDescending?: boolean;
  Page?: string;
  PageSize?: string;
}

interface FilterDispatchDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (filters: FilterData) => void;
  initialFilters: FilterData;
}

const FilterAssignDispatchDialog: React.FC<FilterDispatchDialogProps> = ({
  open,
  onClose,
  onSubmit,
  initialFilters,
}) => {
  const [filters, setFilters] = useState<FilterData>(initialFilters);

  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSubmit(filters);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          fontWeight: 600,
          fontSize: "1.25rem",
          backgroundColor: "#fafafa",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        Bộ lọc Dispatch
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Mã chi tiết Dispatch"
              name="DispatchDetailId"
              fullWidth
              variant="outlined"
              size="small"
              value={filters.DispatchDetailId || ""}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Kho"
              name="WarehouseId"
              fullWidth
              variant="outlined"
              size="small"
              value={filters.WarehouseId || ""}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Mã nhân viên"
              name="StaffDetailId"
              fullWidth
              variant="outlined"
              size="small"
              value={filters.StaffDetailId || ""}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Người xử lý"
              name="HandleBy"
              fullWidth
              variant="outlined"
              size="small"
              value={filters.HandleBy || ""}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Trạng thái"
              name="Status"
              select
              fullWidth
              variant="outlined"
              size="small"
              value={filters.Status || ""}
              onChange={handleChange}
            >
              <MenuItem value="Pending">Chờ duyệt</MenuItem>
              <MenuItem value="Approved">Đã duyệt</MenuItem>
              <MenuItem value="Rejected">Từ chối</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Ghi chú"
              name="Comments"
              fullWidth
              variant="outlined"
              size="small"
              value={filters.Comments || ""}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions
        sx={{
          px: 3,
          py: 2,
          borderTop: "1px solid #e0e0e0",
          backgroundColor: "#fafafa",
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderRadius: 2,
            textTransform: "none",
            color: "#000",
            borderColor: "#000",
            backgroundColor: "#fff",
            "&:hover": {
              backgroundColor: "#f0f0f0",
              borderColor: "#000",
            },
          }}
        >
          Hủy
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            backgroundColor: "#000",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#222",
            },
          }}
        >
          Áp dụng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FilterAssignDispatchDialog;
