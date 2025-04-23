"use client";

import React from "react";
import { Box, Paper, Typography, Button } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import FilterListIcon from "@mui/icons-material/FilterList";

interface Props {
  onOpenFilter: () => void;
  onRefresh: () => void;
}

const DispatchHeader: React.FC<Props> = ({ onOpenFilter, onRefresh }) => (
  <Paper
    sx={{
      p: 3,
      mb: 2,
      backgroundColor: "#fff",
      borderRadius: 2,
      boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
    }}
  >
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        justifyContent: "space-between",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Typography variant="h6" fontWeight="bold">
        Danh sách phiếu điều phối xuất hàng
      </Typography>

      <Box sx={{ display: "flex", gap: 2 }}>
        <Button
          variant="contained"
          startIcon={<FilterListIcon />}
          onClick={onOpenFilter}
          sx={{
            backgroundColor: "#000",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#222",
            },
          }}
        >
          Bộ lọc
        </Button>

       
      </Box>
    </Box>
  </Paper>
);

export default DispatchHeader;
