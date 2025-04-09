"use client";
import React, { useState } from "react";
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSubmit(filters);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Lọc Dispatch</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={6}>
            <TextField
              label="DispatchDetailId"
              name="DispatchDetailId"
              fullWidth
              value={filters.DispatchDetailId || ""}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="WarehouseId"
              name="WarehouseId"
              fullWidth
              value={filters.WarehouseId || ""}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="StaffDetailId"
              name="StaffDetailId"
              fullWidth
              value={filters.StaffDetailId || ""}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="HandleBy"
              name="HandleBy"
              fullWidth
              value={filters.HandleBy || ""}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Status"
              name="Status"
              select
              fullWidth
              value={filters.Status || ""}
              onChange={handleChange}
            >
              <MenuItem value="Approved">Approved</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Rejected">Rejected</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Comments"
              name="Comments"
              fullWidth
              value={filters.Comments || ""}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Áp dụng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FilterAssignDispatchDialog;
