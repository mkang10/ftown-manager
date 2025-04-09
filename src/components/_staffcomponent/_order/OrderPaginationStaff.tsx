"use client";

import React from "react";
import { Pagination, Box } from "@mui/material";

interface OrderPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const OrderPaginationStaff: React.FC<OrderPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    onPageChange(value);
  };

  return (
    <Box display="flex" justifyContent="center" my={3}>
      <Pagination count={totalPages} page={currentPage} onChange={handleChange} color="primary" />
    </Box>
  );
};

export default OrderPaginationStaff;
