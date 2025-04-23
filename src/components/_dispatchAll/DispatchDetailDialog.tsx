"use client"

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
      <DialogTitle>
        Dispatch #{dispatch.referenceNumber}
      </DialogTitle>
      <DialogContent dividers>
        <Box mb={2}>
          <Typography>
            <strong>Created:</strong>{" "}
            {new Date(dispatch.createdDate).toLocaleString()} by{" "}
            {dispatch.createdByName}
          </Typography>
          <Typography>
            <strong>Completed:</strong>{" "}
            {dispatch.completedDate
              ? new Date(dispatch.completedDate).toLocaleString()
              : "—"}
          </Typography>
          <Typography>
            <strong>Status:</strong> {dispatch.status}
          </Typography>
          <Typography>
            <strong>Remarks:</strong> {dispatch.remarks || "—"}
          </Typography>
        </Box>
        <Divider />
        <Box mt={2}>
          <Typography variant="h6" gutterBottom>
            Details
          </Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Warehouse</TableCell>
                <TableCell>Allocated</TableCell>
                <TableCell>Actual</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Comments</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dispatch.dispatchDetails.map(
                (dd: DispatchDetail) =>
                  dd.exportDetails.map((ed: ExportDetail) => (
                    <TableRow key={ed.dispatchStoreDetailId}>
                      <TableCell>{dd.productName}</TableCell>
                      <TableCell>{dd.quantity}</TableCell>
                      <TableCell>
                        {ed.warehouseName || "—"}
                      </TableCell>
                      <TableCell>{ed.allocatedQuantity}</TableCell>
                      <TableCell>
                        {ed.actualQuantity ?? "—"}
                      </TableCell>
                      <TableCell>{ed.status}</TableCell>
                      <TableCell>{ed.comments}</TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DispatchDetailDialog;
