"use client";
import React from "react";
import { DialogActions, Button, Box } from "@mui/material";

export interface CreateInventoryImportModalActionsProps {
  loading: boolean;
  onCancel: () => void;
}

const CreateInventoryImportModalActions: React.FC<CreateInventoryImportModalActionsProps> = ({
  loading,
  onCancel,
}) => {
  return (
    <DialogActions sx={{ px: 0, justifyContent: "flex-end" }}>
      <Box sx={{ display: "flex", gap: 2 }}>
        <Button
          onClick={onCancel}
          variant="outlined"
          sx={{
            color: "#333",
            borderColor: "#333",
            borderRadius: "50px",
            textTransform: "none",
            padding: "8px 20px",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: "#f5f5f5",
              borderColor: "#666",
            },
          }}
        >
          Hủy
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          sx={{
            backgroundColor: "#000",
            color: "#fff",
            borderRadius: "50px",
            textTransform: "none",
            padding: "8px 20px",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.15)",
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: "#222",
            },
          }}
        >
          {loading ? "Đang xử lý..." : "Tạo phiếu nhập"}
        </Button>
      </Box>
    </DialogActions>
  );
};

export default CreateInventoryImportModalActions;
