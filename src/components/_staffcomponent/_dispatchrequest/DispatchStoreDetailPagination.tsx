"use client";
import React from "react";
import { Box, Pagination } from "@mui/material";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (event: React.ChangeEvent<unknown>, page: number) => void;
}

const DispatchStoreDetailPagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={onPageChange}
        color="primary"
        size="small"
      />
    </Box>
  );
};

export default DispatchStoreDetailPagination;
