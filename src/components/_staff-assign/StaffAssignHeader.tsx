"use client";
import React from "react";
import { Box, Paper, Typography, Button } from "@mui/material";

interface StaffAssignHeaderProps {
  onOpenFilter: () => void;
}

const StaffAssignHeader: React.FC<StaffAssignHeaderProps> = ({ onOpenFilter }) => {
  return (
    <Paper sx={{ p: 3, mb: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h5" fontWeight="bold">
          Staff Assign - Inventory Imports
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button variant="outlined" onClick={onOpenFilter}>
            Filter
          </Button>
          {/* Nếu cần, có thể thêm nút Create */}
          {/* <Button variant="contained">Create Inventory Import</Button> */}
        </Box>
      </Box>
    </Paper>
  );
};

export default StaffAssignHeader;
