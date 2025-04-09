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

interface OrderTableProps {
  items: Order[];
  onRefresh: () => void;
  onAssign?: (order: Order) => void;
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending confirmed":
      return "warning";
    case "completed":
      return "success";
    case "cancelled":
      return "error";
    default:
      return "default";
  }
};

const OrderTable: React.FC<OrderTableProps> = ({ items, onRefresh, onAssign }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="center">Order ID</TableCell>
            <TableCell align="center">Người Mua</TableCell>
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
                <Chip label={order.status} color={getStatusColor(order.status)} />
              </TableCell>
              <TableCell align="center">
                <Stack direction="row" spacing={1} justifyContent="center">
                  {order.status.toLowerCase() === "pending confirmed" ? (
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => onAssign?.(order)}
                    >
                      Assign
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

export default OrderTable;
