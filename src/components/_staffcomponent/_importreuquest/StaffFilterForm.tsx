"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import { StaffImportFilterDto } from "@/type/importStaff";

export interface StaffFilterFormData extends StaffImportFilterDto {}

interface StaffFilterFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (filters: StaffFilterFormData) => void;
  initialFilters: StaffImportFilterDto;
}

const StaffFilterForm: React.FC<StaffFilterFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialFilters,
}) => {
  const [filters, setFilters] = useState<StaffFilterFormData>(initialFilters);

  const handleChange = (field: keyof StaffImportFilterDto, value: any) => {
    setFilters({ ...filters, [field]: value });
  };

  const handleSubmit = () => {
    onSubmit(filters);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Filter Staff Import Requests</DialogTitle>
      <DialogContent>
        <Box
          component="form"
          sx={{
            mt: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            minWidth: "300px",
          }}
        >
          <FormControl fullWidth>
            <InputLabel id="status-select-label">Status</InputLabel>
            <Select
              labelId="status-select-label"
              label="Status"
              value={filters.Status || ""}
              onChange={(e) => handleChange("Status", e.target.value)}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="Success">Success</MenuItem>
              <MenuItem value="Processing">Processing</MenuItem>
              <MenuItem value="Failed">Failed</MenuItem>
            </Select>
          </FormControl>
          
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          Apply
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StaffFilterForm;
