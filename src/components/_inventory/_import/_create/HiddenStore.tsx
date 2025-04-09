// components/_inventory/_import/HiddenStoreAllocations.tsx
"use client";

import React from "react";
import { Box, Grid, TextField, Typography } from "@mui/material";

interface StoreAllocation {
  storeId: number;
  allocatedQuantity: number;
  status: string;
  comments: string;
  staffDetailId: number;
}

interface HiddenStoreAllocationsProps {
  allocations: StoreAllocation[];
  onAllocationChange: (index: number, value: number) => void;
}

const HiddenStoreAllocations: React.FC<HiddenStoreAllocationsProps> = ({
  allocations,
  onAllocationChange,
}) => {
  return (
    <Box sx={{ display: "none" }}>
      <Typography variant="subtitle1">Store Allocations</Typography>
      {allocations.map((allocation, index) => (
        <Grid container spacing={2} key={index} sx={{ mt: 1 }}>
          {/* Ẩn trường Store ID bằng input hidden */}
          <input type="hidden" name="storeId" value={allocation.storeId} />
          <Grid item xs={12} md={6}>
            <TextField
              label="Allocated Quantity"
              type="number"
              value={allocation.allocatedQuantity}
              onChange={(e) => onAllocationChange(index, Number(e.target.value))}
              fullWidth
            />
          </Grid>
        </Grid>
      ))}
    </Box>
  );
};

export default HiddenStoreAllocations;
