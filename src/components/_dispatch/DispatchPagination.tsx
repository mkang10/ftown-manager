"use client";

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
      backgroundColor: "#f9f9f9",
      py: 2,
      boxShadow: "0 -2px 10px rgba(0,0,0,0.05)",
      borderTop: "1px solid #e0e0e0",
      zIndex: 1300,
    }}
  >
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={(_, p) => onPageChange(p)}
        shape="rounded"
        size="medium"
        sx={{
          ".MuiPaginationItem-root": {
            fontWeight: 500,
            borderRadius: "12px",
            minWidth: 36,
            height: 36,
            "&.Mui-selected": {
              backgroundColor: "#000",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#111",
              },
            },
          },
        }}
      />
    </Box>
  </Box>
);

export default DispatchPagination;
