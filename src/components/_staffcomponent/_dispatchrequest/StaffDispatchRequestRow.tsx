"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  TableRow,
  TableCell,
  Button,
  Chip,
  Typography,
  Box,
} from "@mui/material";
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
  const router = useRouter();
  const isProcessing = detail.status.trim() === "Processing";

  const handleRowClick = () => {
    router.push(`/staff-dispatch-request/${detail.dispatchStoreDetailId}`);
  };

  const baseFont = {
    fontFamily: "Arial, Helvetica, sans-serif",
    fontWeight: 700,
    color: "#000",
  };
  const getStatusStyle = (status: string) => {
    const normalized = status.trim();

    switch (normalized) {
      case "Approved":
        return {
          borderColor: "#2e7d32", // xanh lá
          color: "#2e7d32",
          backgroundColor: "#e8f5e9",
        };
      case "Pending":
        return {
          borderColor: "#ed6c02", // cam
          color: "#ed6c02",
          backgroundColor: "#fff3e0",
        };
      case "Rejected":
        return {
          borderColor: "#d32f2f", // đỏ
          color: "#d32f2f",
          backgroundColor: "#ffebee",
        };
      case "Processing":
        return {
          borderColor: "#0288d1", // xanh dương
          color: "#0288d1",
          backgroundColor: "#e1f5fe",
        };
      default:
        return {
          borderColor: "#9e9e9e", // xám
          color: "#616161",
          backgroundColor: "#f5f5f5",
        };
    }
  };


  return (
    <TableRow
      hover
      onClick={handleRowClick}
      sx={{
        cursor: "pointer",
        transition: "background-color 0.2s ease",
        "&:hover": { backgroundColor: "#f0f0f0" },
      }}
    >
      <TableCell align="center">
        <Typography sx={baseFont}>{detail.dispatchStoreDetailId}</Typography>
      </TableCell>

      <TableCell align="center">
        <Typography sx={baseFont}>{detail.staffName || "-"}</Typography>
      </TableCell>

      <TableCell align="center">
        <Typography sx={baseFont}>{detail.allocatedQuantity}</Typography>
      </TableCell>

      <TableCell align="center">
        <Chip
          label={detail.status.trim()}
          variant="outlined"
          sx={{
            ...getStatusStyle(detail.status),
            fontFamily: "Arial, Helvetica, sans-serif",
            fontWeight: 700,
            fontSize: "0.85rem",
            borderRadius: "8px",
            textTransform: "none",
          }}
        />

      </TableCell>

      <TableCell align="center">
        <Typography
          sx={{
            fontFamily: "Arial, Helvetica, sans-serif",
            fontWeight: 400,
            fontStyle: "italic",
            color: "text.secondary",
          }}
        >
          {detail.comments || "-"}
        </Typography>
      </TableCell>

      <TableCell align="center">
        {isProcessing ? (
          <Button
            variant="contained"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onFullStock(detail.dispatchStoreDetailId);
            }}
            sx={{
              borderRadius: "16px",
              textTransform: "none",
              fontFamily: "Arial, Helvetica, sans-serif",
              fontWeight: 700,
            }}
          >
            Đã đủ hàng
          </Button>
        ) : (
          <Typography
            sx={{
              fontFamily: "Arial, Helvetica, sans-serif",
              fontWeight: 400,
              color: "text.disabled",
            }}
          >
            --
          </Typography>
        )}
      </TableCell>
    </TableRow>
  );
};

export default DispatchStoreDetailRow;
