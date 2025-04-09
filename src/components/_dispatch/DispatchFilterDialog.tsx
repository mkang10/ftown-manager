"use client"
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
} from "@mui/material";

export interface DispatchFilterData {
  referenceNumber: string;
  createdByName: string;
  fromDate: string;        // yyyy-MM-dd
  toDate: string;
  completedFrom: string;
  completedTo: string;
}

interface Props {
  open: boolean;
  initialFilters: DispatchFilterData;
  onClose: () => void;
  onSubmit: (filters: DispatchFilterData) => void;
}

const DispatchFilterDialog: React.FC<Props> = ({
  open,
  initialFilters,
  onClose,
  onSubmit,
}) => {
  const [filters, setFilters] = useState<DispatchFilterData>(
    initialFilters
  );

  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const handleChange =
    (key: keyof DispatchFilterData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFilters({ ...filters, [key]: e.target.value });
    };

  const handleSubmit = () => {
    onSubmit(filters);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Filter Dispatches</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Reference Number"
              fullWidth
              value={filters.referenceNumber}
              onChange={handleChange("referenceNumber")}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Created By"
              fullWidth
              value={filters.createdByName}
              onChange={handleChange("createdByName")}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Created From"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={filters.fromDate}
              onChange={handleChange("fromDate")}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Created To"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={filters.toDate}
              onChange={handleChange("toDate")}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Completed From"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={filters.completedFrom}
              onChange={handleChange("completedFrom")}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Completed To"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={filters.completedTo}
              onChange={handleChange("completedTo")}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Apply
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DispatchFilterDialog;
