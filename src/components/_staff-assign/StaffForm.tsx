"use client";
import React, { useState, useMemo } from "react";
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
  [key: string]: any;
}

interface FilterDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (filters: FilterData) => void;
  initialFilters?: FilterData;
}

const FilterDialog: React.FC<FilterDialogProps> = ({
  open,
  onClose,
  onSubmit,
  initialFilters = {},
}) => {
  // Lấy giá trị mặc định của CreatedBy từ localStorage (key "account")
  const defaultCreatedBy = useMemo(() => {
    if (typeof window !== "undefined") {
      const storedAccount = localStorage.getItem("account");
      if (storedAccount) {
        try {
          const account = JSON.parse(storedAccount);
          return account.accountId.toString();
        } catch (error) {
          console.error("Error parsing account:", error);
          return "";
        }
      }
    }
    return "";
  }, []);

  // Trường Status sử dụng dropdown
  const [status, setStatus] = useState(initialFilters.Status || "");
  // Trường CreatedBy ẩn nhưng giá trị mặc định được lấy từ localStorage
  const [createdBy, setCreatedBy] = useState(initialFilters.CreatedBy || defaultCreatedBy);
  const [createdDateFrom, setCreatedDateFrom] = useState(initialFilters.CreatedDateFrom || "");
  const [createdDateTo, setCreatedDateTo] = useState(initialFilters.CreatedDateTo || "");
  const [referenceNumber, setReferenceNumber] = useState(initialFilters.ReferenceNumber || "");
  const [totalCostMin, setTotalCostMin] = useState(initialFilters.TotalCostMin || "");
  const [totalCostMax, setTotalCostMax] = useState(initialFilters.TotalCostMax || "");
  const [approvedDateFrom, setApprovedDateFrom] = useState(initialFilters.ApprovedDateFrom || "");
  const [approvedDateTo, setApprovedDateTo] = useState(initialFilters.ApprovedDateTo || "");
  const [completedDateFrom, setCompletedDateFrom] = useState(initialFilters.CompletedDateFrom || "");
  const [completedDateTo, setCompletedDateTo] = useState(initialFilters.CompletedDateTo || "");

  const handleApply = () => {
    const filters: FilterData = {
      Status: status,
      CreatedBy: createdBy, // luôn bao gồm giá trị này
      CreatedDateFrom: createdDateFrom,
      CreatedDateTo: createdDateTo,
      ReferenceNumber: referenceNumber,
      TotalCostMin: totalCostMin,
      TotalCostMax: totalCostMax,
      ApprovedDateFrom: approvedDateFrom,
      ApprovedDateTo: approvedDateTo,
      CompletedDateFrom: completedDateFrom,
      CompletedDateTo: completedDateTo,
    };

    // Loại bỏ các trường rỗng
    Object.keys(filters).forEach((key) => {
      if (!filters[key]) {
        delete filters[key];
      }
    });

    onSubmit(filters);
    onClose();
  };

  const handleClear = () => {
    setStatus("");
    // Reset createdBy về giá trị mặc định từ localStorage
    setCreatedBy(defaultCreatedBy);
    setCreatedDateFrom("");
    setCreatedDateTo("");
    setReferenceNumber("");
    setTotalCostMin("");
    setTotalCostMax("");
    setApprovedDateFrom("");
    setApprovedDateTo("");
    setCompletedDateFrom("");
    setCompletedDateTo("");
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Filter Inventory Imports</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {/* Dropdown cho Status */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              select
              label="Status"
              fullWidth
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
            </TextField>
          </Grid>
          {/* Trường Created By ẩn */}
          <Grid item xs={12} sm={6} md={4} sx={{ display: "none" }}>
            <TextField
              label="Created By"
              fullWidth
              type="number"
              value={createdBy}
              onChange={(e) => setCreatedBy(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Created Date From"
              fullWidth
              type="datetime-local"
              InputLabelProps={{ shrink: true }}
              value={createdDateFrom}
              onChange={(e) => setCreatedDateFrom(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Created Date To"
              fullWidth
              type="datetime-local"
              InputLabelProps={{ shrink: true }}
              value={createdDateTo}
              onChange={(e) => setCreatedDateTo(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Reference Number"
              fullWidth
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Total Cost Min"
              fullWidth
              type="number"
              value={totalCostMin}
              onChange={(e) => setTotalCostMin(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Total Cost Max"
              fullWidth
              type="number"
              value={totalCostMax}
              onChange={(e) => setTotalCostMax(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Approved Date From"
              fullWidth
              type="datetime-local"
              InputLabelProps={{ shrink: true }}
              value={approvedDateFrom}
              onChange={(e) => setApprovedDateFrom(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Approved Date To"
              fullWidth
              type="datetime-local"
              InputLabelProps={{ shrink: true }}
              value={approvedDateTo}
              onChange={(e) => setApprovedDateTo(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Completed Date From"
              fullWidth
              type="datetime-local"
              InputLabelProps={{ shrink: true }}
              value={completedDateFrom}
              onChange={(e) => setCompletedDateFrom(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Completed Date To"
              fullWidth
              type="datetime-local"
              InputLabelProps={{ shrink: true }}
              value={completedDateTo}
              onChange={(e) => setCompletedDateTo(e.target.value)}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClear}>Clear</Button>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleApply} variant="contained">
          Apply
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FilterDialog;
