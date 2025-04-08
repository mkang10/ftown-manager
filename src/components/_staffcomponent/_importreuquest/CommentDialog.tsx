"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
} from "@mui/material";

interface CommentDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (comment: string, actualReceivedQuantity: number) => void;
  actionType: "FullStock" | "Shortage";
}

const CommentDialog: React.FC<CommentDialogProps> = ({
  open,
  onClose,
  onSubmit,
  actionType,
}) => {
  const [comment, setComment] = useState("");
  const [actualReceivedQuantity, setActualReceivedQuantity] = useState<number>(0);

  const handleSubmit = () => {
    // Nếu action là FullStock, không cần nhập số lượng
    const qty = actionType === "FullStock" ? 0 : actualReceivedQuantity;
    onSubmit(comment, qty);
    setComment("");
    setActualReceivedQuantity(0);
  };

  const handleClose = () => {
    setComment("");
    setActualReceivedQuantity(0);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 600 }}>
        {actionType === "FullStock"
          ? "Full Stock Update"
          : "Shortage Update"}
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <Typography variant="subtitle1">
            Please enter your comment:
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Enter your comment..."
            variant="outlined"
          />
          {actionType === "Shortage" && (
            <>
              <Typography variant="subtitle1">
                Actual Received Quantity:
              </Typography>
              <TextField
                fullWidth
                type="number"
                value={actualReceivedQuantity}
                onChange={(e) =>
                  setActualReceivedQuantity(Number(e.target.value))
                }
                placeholder="Enter quantity..."
                variant="outlined"
              />
            </>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleClose} variant="outlined" color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CommentDialog;
