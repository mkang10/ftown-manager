"use client";
import React from "react";
import { TableHead, TableRow, TableCell, TableSortLabel } from "@mui/material";
import { styled } from "@mui/material/styles";

interface HeaderProps {
  sortField: string;
  sortDirection: "asc" | "desc";
  onSortChange: (field: string) => void;
}

const HeaderCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: "#000",
  color: "#fff",
  textTransform: "uppercase",
  fontSize: "0.85rem",
  fontFamily: "Arial, Helvetica, sans-serif",
  fontWeight: 700,
  textAlign: "center",
}));

const StaffDispatchRequestTableHeader: React.FC<HeaderProps> = ({
  sortField,
  sortDirection,
  onSortChange,
}) => {
  return (
    <TableHead>
      <TableRow>
        <HeaderCell>
         Mã
        </HeaderCell>
        <HeaderCell>Nhân sự</HeaderCell>
        <HeaderCell>Số lượng</HeaderCell>
        <HeaderCell>Trạng thái</HeaderCell>
        <HeaderCell>Ghi chú</HeaderCell>
        <HeaderCell>Hành động</HeaderCell>
      </TableRow>
    </TableHead>
  );
};

export default StaffDispatchRequestTableHeader;
