"use client";

import React from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TableContainer,
  Button,
  Chip,
  Stack,
} from "@mui/material";
import { Order } from "@/type/order";
import { completeOrder } from "@/ultis/OrderAPI";
import { toast } from "react-toastify";

interface OrderTableProps {
  items: Order[];
  onRefresh: () => void;
}

// Hàm chuyển trạng thái trả về các lớp CSS theo yêu cầu của bạn
const getStatusClass = (status: string): string => {
  switch (status.toLowerCase()) {
    case "cancel":
      return "bg-red-100 text-red-500";
    case "shipped":
      return "bg-green-100 text-green-500";
    case "shipping":
      return "bg-blue-100 text-blue-500";
    case "pending confirmed":
      return "bg-yellow-100 text-yellow-500";
    case "confirmed":
      return "bg-gray-100 text-gray-500";
    case "completed":
      return "bg-purple-100 text-purple-500";
    default:
      return "bg-gray-100 text-gray-500";
  }
};

const OrderTableStaff: React.FC<OrderTableProps> = ({ items, onRefresh }) => {
  const handleComplete = async (orderId: number) => {
    try {
      const result = await completeOrder(orderId);
      if (result.status) {
        toast.success(result.message, { autoClose: 1000 });
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      console.error("Error in completing order:", error);
      toast.error("Lỗi khi hoàn thành đơn hàng");
    } finally {
      onRefresh();
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="center">Order ID</TableCell>
            <TableCell align="center">Người mua</TableCell>
            <TableCell align="center">Ngày tạo</TableCell>
            <TableCell align="center">Trạng thái</TableCell>
            <TableCell align="center">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((order) => (
            <TableRow key={order.orderId}>
              <TableCell align="center">{order.orderId}</TableCell>
              <TableCell align="center">{order.buyerName}</TableCell>
              <TableCell align="center">
                {new Date(order.createdDate).toLocaleString("vi-VN")}
              </TableCell>
              <TableCell align="center">
                <Chip
                  label={order.status}
                  className={getStatusClass(order.status)}
                  sx={{
                    fontWeight: 500,
                    fontSize: "0.875rem",
                    textTransform: "capitalize",
                  }}
                />
              </TableCell>
              <TableCell align="center">
                <Stack direction="row" spacing={1} justifyContent="center">
                  {order.status.toLowerCase() === "confirmed" ? (
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleComplete(order.orderId)}
                    >
                      Done
                    </Button>
                  ) : (
                    <span>No Action</span>
                  )}
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OrderTableStaff;
