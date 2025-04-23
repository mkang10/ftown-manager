"use client";
import React from "react";
import {
  TableRow,
  TableCell,
  Button,
  Chip,
  Box,
  Typography,
} from "@mui/material";
import { Dispatch } from "@/type/dispatch";

const getStatusColor = (
  status: string
): "default" | "success" | "warning" | "error" => {
  const norm = status.trim().toLowerCase();
  switch (norm) {
    case "approved":
      return "success";
    case "pending":
      return "warning";
    case "rejected":
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
  const products =
    dispatch.dispatchDetails?.map((detail) => ({
      name: detail.productName,
      quantity: detail.quantity,
    })) || [];

  return (
    <TableRow
      hover
      sx={{
        "&:hover": {
          backgroundColor: "#f9f9f9",
        },
        transition: "background-color 0.2s",
      }}
    >
      <TableCell align="left">
        <Typography variant="body2" fontWeight={500}>
          {dispatch.referenceNumber}
        </Typography>
      </TableCell>

      <TableCell align="left">
        <Chip
          label={dispatch.status}
          color={getStatusColor(dispatch.status)}
          size="small"
          sx={{
            fontWeight: 500,
            textTransform: "capitalize",
            borderRadius: "12px",
            px: 1.5,
          }}
        />
      </TableCell>

      <TableCell align="left">
        <Typography variant="body2">
          {new Date(dispatch.createdDate).toLocaleString()}
        </Typography>
      </TableCell>

      <TableCell align="left">
        <Typography variant="body2" noWrap>
          {dispatch.createdByName}
        </Typography>
      </TableCell>

      <TableCell align="left">
        <Box>
          {products.map((p, idx) => (
            <Typography key={idx} variant="body2" noWrap>
              {p.name}
            </Typography>
          ))}
        </Box>
      </TableCell>

      <TableCell align="left">
        <Box>
          {products.map((p, idx) => (
            <Typography key={idx} variant="body2" noWrap>
              {p.quantity}
            </Typography>
          ))}
        </Box>
      </TableCell>

      <TableCell align="left">
        <Typography
          variant="body2"
          noWrap
          sx={{ maxWidth: 150 }}
          color="text.secondary"
        >
          {dispatch.remarks || "-"}
        </Typography>
      </TableCell>

      <TableCell align="center">
        {dispatch.status.trim().toLowerCase() === "pending" ? (
          <Button
            variant="contained"
            size="small"
            sx={{
              borderRadius: "999px",
              backgroundColor: "#000",
              color: "#fff",
              textTransform: "none",
              px: 2,
              fontWeight: 500,
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              "&:hover": {
                backgroundColor: "#222",
              },
            }}
            onClick={() => onAssign(dispatch.dispatchId)}
          >
            Giao việc
          </Button>
        ) : (
          <Typography variant="body2" color="text.secondary">
            -
          </Typography>
        )}
      </TableCell>
    </TableRow>
  );
};

export default DispatchRow;
