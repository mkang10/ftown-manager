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
      <DialogTitle sx={{ fontWeight: 600, color: "#000", textAlign: "center" }}>
        {actionType === "FullStock"
          ? "Cập nhật đầy đủ hàng"
          : "Cập nhật thiếu hàng"}
      </DialogTitle>
      <DialogContent dividers sx={{ backgroundColor: "#fff", padding: 3 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="body1" sx={{ color: "#333" }}>
            Vui lòng nhập ghi chú của bạn:
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Nhập ghi chú của bạn..."
            variant="outlined"
            sx={{
              borderColor: "#000",
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#000", // Viền cho TextField
                },
                "&:hover fieldset": {
                  borderColor: "#333", // Viền đổi màu khi hover
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#111", // Viền đổi màu khi focus
                },
              },
            }}
          />
          {actionType === "Shortage" && (
            <>
              <Typography variant="body1" sx={{ color: "#333" }}>
                Số lượng nhận thực tế:
              </Typography>
              <TextField
                fullWidth
                type="number"
                value={actualReceivedQuantity}
                onChange={(e) =>
                  setActualReceivedQuantity(Number(e.target.value))
                }
                placeholder="Nhập số lượng..."
                variant="outlined"
                sx={{
                  borderColor: "#000",
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#000", // Viền cho TextField
                    },
                    "&:hover fieldset": {
                      borderColor: "#333", // Viền đổi màu khi hover
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#111", // Viền đổi màu khi focus
                    },
                  },
                }}
              />
            </>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2, backgroundColor: "#f9f9f9" }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          color="inherit"
          sx={{
            borderColor: "#111",
            color: "#111",
            "&:hover": {
              backgroundColor: "#f0f0f0",
              borderColor: "#333",
            },
          }}
        >
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          sx={{
            backgroundColor: "#000",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#333",
            },
          }}
        >
          Gửi
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CommentDialog;
