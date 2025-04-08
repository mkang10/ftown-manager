"use client";
import React from "react";
import { Box, Pagination } from "@mui/material";

interface StaffAssignPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const StaffAssignPagination: React.FC<StaffAssignPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const handleChange = (event: React.ChangeEvent<unknown>, page: number) => {
    onPageChange(page);
  };

  return (
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
        <Pagination count={totalPages} page={currentPage} onChange={handleChange} color="primary" />
      </Box>
    </Box>
  );
};

export default StaffAssignPagination;
