// src/components/_dispatch/DispatchStoreDetailRow.tsx
"use client";

import React from "react";
import { TableRow, TableCell, Button, Chip, Typography, Box } from "@mui/material";
import { DispatchStoreDetail } from "@/type/dispatchStoreDetail";

const getStatusColor = (status: string) => {
  const normalized = status.trim();
  switch (normalized) {
    case "Approved":
      return "success";
    case "Pending":
      return "warning";
    case "Rejected":
      return "error";
    default:
      return "default";
  }
};

interface DispatchStoreDetailRowProps {
  detail: DispatchStoreDetail;
  onAssign: (dispatchStoreDetailId: number) => void;
  onFullStock: (dispatchStoreDetailId: number) => void;
}

const DispatchStoreDetailRow: React.FC<DispatchStoreDetailRowProps> = ({
  detail,
  onAssign,
  onFullStock,
}) => {
  const isProcessing = detail.status.trim() === "Processing";

  return (
    <TableRow hover>
      <TableCell align="center">{detail.dispatchStoreDetailId}</TableCell>
      <TableCell align="center">
        {detail.warehouseName || detail.warehouseId}
      </TableCell>
      <TableCell align="center">{detail.staffName || "-"}</TableCell>
      <TableCell align="center">{detail.allocatedQuantity}</TableCell>
      <TableCell align="center">
        <Chip
          label={detail.status.trim()}
          color={getStatusColor(detail.status)}
          variant="outlined"
        />
      </TableCell>
      <TableCell align="center">{detail.comments}</TableCell>
      <TableCell align="center">
        {isProcessing ? (
          <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
          
            <Button
              variant="outlined"
              size="small"
              onClick={() => onFullStock(detail.dispatchStoreDetailId)}
            >
              Full Stock
            </Button>
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No Action
          </Typography>
        )}
      </TableCell>
    </TableRow>
  );
};

export default DispatchStoreDetailRow;
