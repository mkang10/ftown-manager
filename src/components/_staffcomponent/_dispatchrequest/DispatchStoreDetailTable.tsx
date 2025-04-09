// src/components/_dispatch/DispatchStoreDetailTable.tsx
"use client";

import React from "react";
import { Paper, Table, TableBody, TableContainer } from "@mui/material";
import { DispatchStoreDetail } from "@/type/dispatchStoreDetail";
import DispatchStoreDetailRow from "./StaffDispatchRequestRow";
import StaffDispatchRequestTableHeader from "./StaffDispatchRequestTableHeader";

interface DispatchStoreDetailTableProps {
  data: DispatchStoreDetail[];
  sortField: string;
  sortDirection: "asc" | "desc";
  onSortChange: (field: string) => void;
  onAssign: (dispatchStoreDetailId: number) => void;
  onFullStock: (dispatchStoreDetailId: number) => void;
}

const DispatchStoreDetailTable: React.FC<DispatchStoreDetailTableProps> = ({
  data,
  sortField,
  sortDirection,
  onSortChange,
  onAssign,
  onFullStock,
}) => {
  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table>
        <StaffDispatchRequestTableHeader
          sortField={sortField}
          sortDirection={sortDirection}
          onSortChange={onSortChange}
        />
        <TableBody>
          {data.map((detail) => (
            <DispatchStoreDetailRow
              key={detail.dispatchStoreDetailId}
              detail={detail}
              onAssign={onAssign}
              onFullStock={onFullStock}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DispatchStoreDetailTable;
