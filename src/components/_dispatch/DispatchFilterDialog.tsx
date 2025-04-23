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
  const [filters, setFilters] = useState<DispatchFilterData>(initialFilters);

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
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          fontWeight: 600,
          fontSize: "1.25rem",
          backgroundColor: "#fafafa",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        Lọc phiếu giao hàng
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Mã phiếu"
              fullWidth
              value={filters.referenceNumber}
              onChange={handleChange("referenceNumber")}
              variant="outlined"
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Người tạo"
              fullWidth
              value={filters.createdByName}
              onChange={handleChange("createdByName")}
              variant="outlined"
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Từ ngày tạo"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={filters.fromDate}
              onChange={handleChange("fromDate")}
              variant="outlined"
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Đến ngày tạo"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={filters.toDate}
              onChange={handleChange("toDate")}
              variant="outlined"
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Hoàn tất từ"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={filters.completedFrom}
              onChange={handleChange("completedFrom")}
              variant="outlined"
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Hoàn tất đến"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={filters.completedTo}
              onChange={handleChange("completedTo")}
              variant="outlined"
              size="small"
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
          Huỷ
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
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

export default DispatchFilterDialog;
