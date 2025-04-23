"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Box,
  Divider,
  DialogActions,
  Button,
} from "@mui/material";
import { Dispatch, DispatchDetail, ExportDetail } from "@/type/dispatch";

interface Props {
  open: boolean;
  dispatch: Dispatch;
  onClose: () => void;
}

const DispatchDetailDialog: React.FC<Props> = ({
  open,
  dispatch,
  onClose,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          fontWeight: 600,
          fontSize: "1.25rem",
          backgroundColor: "#fafafa",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        Phiếu điều phối #{dispatch.referenceNumber}
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Box mb={2}>
          <Typography variant="body2" gutterBottom>
            <strong>Ngày tạo:</strong>{" "}
            {new Date(dispatch.createdDate).toLocaleString()} bởi{" "}
            {dispatch.createdByName}
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Hoàn tất:</strong>{" "}
            {dispatch.completedDate
              ? new Date(dispatch.completedDate).toLocaleString()
              : "—"}
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Trạng thái:</strong> {dispatch.status}
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Ghi chú:</strong> {dispatch.remarks || "—"}
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Typography
          variant="subtitle1"
          fontWeight={600}
          gutterBottom
          color="text.primary"
        >
          Chi tiết sản phẩm
        </Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Sản phẩm</TableCell>
              <TableCell>Số lượng</TableCell>
              <TableCell>Kho</TableCell>
              <TableCell>Đã phân bổ</TableCell>
              <TableCell>Thực tế</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Ghi chú</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dispatch.dispatchDetails.map((dd: DispatchDetail) =>
              dd.exportDetails.map((ed: ExportDetail) => (
                <TableRow key={ed.dispatchStoreDetailId}>
                  <TableCell>{dd.productName}</TableCell>
                  <TableCell>{dd.quantity}</TableCell>
                  <TableCell>{ed.warehouseName || "—"}</TableCell>
                  <TableCell>{ed.allocatedQuantity}</TableCell>
                  <TableCell>{ed.actualQuantity ?? "—"}</TableCell>
                  <TableCell>{ed.status}</TableCell>
                  <TableCell>{ed.comments || "—"}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions
        sx={{
          px: 3,
          py: 2,
          borderTop: "1px solid #e0e0e0",
          backgroundColor: "#fafafa",
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{ borderRadius: 2, textTransform: "none" }}
        >
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DispatchDetailDialog;
