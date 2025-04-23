"use client"

import React from "react";
import { Box, Paper, Typography, Button } from "@mui/material";

interface Props {
  onOpenFilter: () => void;
  onRefresh: () => void;
}

const DispatchHeader: React.FC<Props> = ({ onOpenFilter, onRefresh }) => (
  <Paper sx={{ p: 3, mb: 2 }}>
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        justifyContent: "space-between",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Typography variant="h5" fontWeight="bold">
        Dispatches
      </Typography>
      <Box sx={{ display: "flex", gap: 2 }}>
        <Button variant="outlined" onClick={onOpenFilter}>
          Filter
        </Button>
        <Button variant="contained" onClick={onRefresh}>
          Refresh
        </Button>
      </Box>
    </Box>
  </Paper>
);

export default DispatchHeader;
