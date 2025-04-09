"use client";
import React from "react";
import { TableRow, TableCell, Button, Chip, Box, Typography } from "@mui/material";
import { Dispatch } from "@/type/dispatch";

const getStatusColor = (status: string): "default" | "success" | "warning" | "error" => {
  const norm = status.trim();
  switch (norm) {
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

interface DispatchRowProps {
  dispatch: Dispatch;
  onAssign: (dispatchId: number) => void;
}

const DispatchRow: React.FC<DispatchRowProps> = ({ dispatch, onAssign }) => {
  const products = dispatch.dispatchDetails?.map(detail => ({
    name: detail.productName,
    quantity: detail.quantity,
  })) || [];

  return (
    <TableRow hover>
      <TableCell align="center">{dispatch.referenceNumber}</TableCell>
      <TableCell align="center">{dispatch.status}</TableCell>
      <TableCell align="center">{new Date(dispatch.createdDate).toLocaleString()}</TableCell>
      <TableCell align="center">{dispatch.createdByName}</TableCell>
      <TableCell align="center">
        <Box>
          {products.map((p, idx) => (
            <Typography key={idx} variant="body2">
              {p.name}
            </Typography>
          ))}
        </Box>
      </TableCell>
      <TableCell align="center">
        <Box>
          {products.map((p, idx) => (
            <Typography key={idx} variant="body2">
              {p.quantity}
            </Typography>
          ))}
        </Box>
      </TableCell>
      <TableCell align="center">{dispatch.remarks}</TableCell>
      <TableCell align="center">
        {dispatch.status.trim() === "Pending" ? (
          <Button variant="contained" size="small" onClick={() => onAssign(dispatch.dispatchId)}>
            Assign
          </Button>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No Action
          </Typography>
        )}
      </TableCell>
    </TableRow>
  );
};

export default DispatchRow;
