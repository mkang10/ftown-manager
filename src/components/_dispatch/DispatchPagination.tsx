"use client"

import React from "react";
import { Box, Pagination } from "@mui/material";

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const DispatchPagination: React.FC<Props> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => (
  <Box
    sx={{
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: "white",
      py: 2,
      boxShadow: 3,
      zIndex: 1300,
    }}
  >
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={(_, p) => onPageChange(p)}
        color="primary"
      />
    </Box>
  </Box>
);

export default DispatchPagination;
