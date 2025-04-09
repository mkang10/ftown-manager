"use client";
import React from "react";
import { TableHead, TableRow, TableCell, TableSortLabel } from "@mui/material";

interface HeaderProps {
  sortField: string;
  sortDirection: "asc" | "desc";
  onSortChange: (field: string) => void;
}

const StaffDispatchRequestTableHeader: React.FC<HeaderProps> = ({ sortField, sortDirection, onSortChange }) => {
  return (
    <TableHead>
      <TableRow>
        <TableCell>
          <TableSortLabel
            active={sortField === "dispatchStoreDetailId"}
            direction={sortField === "dispatchStoreDetailId" ? sortDirection : "asc"}
            onClick={() => onSortChange("dispatchStoreDetailId")}
          >
            Mã
          </TableSortLabel>
        </TableCell>
        <TableCell>Warehouse</TableCell>
        <TableCell>Staff</TableCell>
        <TableCell>Allocated Quantity</TableCell>
        <TableCell>Status</TableCell>
        <TableCell>Comments</TableCell>
        <TableCell>Action</TableCell>
      </TableRow>
    </TableHead>
  );
};

export default StaffDispatchRequestTableHeader;
